# Design: Local Models Support

## Context

The classify library currently supports premium cloud-based LLM providers (DeepSeek, Claude, OpenAI, etc.). Users have requested local model support for privacy, cost, and offline use cases. This design outlines the architecture for adding local embedding and instruction models while maintaining compatibility with existing code.

## Goals

- Add support for 6 local models (3 embedding, 3 instruction)
- Provide seamless integration with existing classification pipeline
- Enable model management via CLI (download, list, remove)
- Maintain same file/directory processing interface
- Benchmark quality against premium models
- Zero breaking changes for existing users

## Non-Goals

- Fine-tuning support (future work)
- Custom model training
- Model quantization/optimization (use pre-quantized models)
- Multi-GPU support (single device only)
- Cloud-hosted local models (truly local only)

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    ClassificationPipeline                    │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      ProviderFactory                         │
│  ┌────────────────┐  ┌──────────────────────────────────┐  │
│  │  Cloud Models  │  │      Local Models                │  │
│  │  - deepseek    │  │  - gte-multilingual              │  │
│  │  - claude      │  │  - multilingual-e5-small         │  │
│  │  - openai      │  │  - bge-m3                        │  │
│  │  - gemini      │  │  - mdeberta-v3-base-mnli-xnli    │  │
│  └────────────────┘  │  - qwen2.5-1.5b-instruct         │  │
│                      │  - llama-3.2-1b-instruct         │  │
│                      └──────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   LocalModelProvider                         │
│  ┌──────────────────────┐  ┌───────────────────────────┐   │
│  │  EmbeddingProvider   │  │  InstructionProvider      │   │
│  │  - Generate vectors  │  │  - Run inference          │   │
│  │  - Similarity score  │  │  - Parse responses        │   │
│  │  - Classification    │  │  - Token counting         │   │
│  └──────────────────────┘  └───────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      ModelManager                            │
│  - Download models from HuggingFace                          │
│  - Cache in /models directory                                │
│  - Track metadata (size, version, checksum)                  │
│  - Load/unload models                                        │
└─────────────────────────────────────────────────────────────┘
```

## Key Decisions

### 1. Model Selection Strategy

**Decision**: Support both embedding and instruction models

**Rationale**:
- **Embedding models**: Fast, efficient, good for semantic similarity
  - Best for: Simple classification, speed-critical use cases
  - Trade-off: Less nuanced understanding
- **Instruction models**: Better reasoning, more accurate
  - Best for: Complex classification, high accuracy needs
  - Trade-off: Slower, more memory

**Alternatives considered**:
- Only embedding models: Too limiting for complex cases
- Only instruction models: Too slow for all use cases
- Mix is optimal: User chooses based on needs

### 2. Model Loading Strategy

**Decision**: Lazy loading with caching

**Implementation**:
```typescript
class ModelManager {
  private cache: Map<string, LoadedModel> = new Map();
  
  async load(modelName: string): Promise<LoadedModel> {
    if (this.cache.has(modelName)) {
      return this.cache.get(modelName)!;
    }
    
    const model = await this.downloadAndLoad(modelName);
    this.cache.set(modelName, model);
    return model;
  }
}
```

**Rationale**:
- Models are large (500MB-6GB)
- Loading takes time (5-30 seconds)
- Most users will use 1-2 models per session
- Cache prevents repeated loads

### 3. Classification Approach per Model Type

#### Embedding Models (GTE, E5, BGE)

```typescript
async classify(text: string, categories: string[]): Promise<Classification> {
  // 1. Generate text embedding
  const textEmbed = await this.model.embed(text);
  
  // 2. Generate category embeddings
  const categoryEmbeds = await Promise.all(
    categories.map(cat => this.model.embed(cat))
  );
  
  // 3. Calculate similarity scores
  const scores = categoryEmbeds.map(catEmbed => 
    cosineSimilarity(textEmbed, catEmbed)
  );
  
  // 4. Return highest scoring category
  const maxIndex = scores.indexOf(Math.max(...scores));
  return {
    category: categories[maxIndex],
    confidence: scores[maxIndex],
  };
}
```

#### NLI Models (mDeBERTa)

```typescript
async classify(text: string, categories: string[]): Promise<Classification> {
  // Zero-shot classification via Natural Language Inference
  const hypotheses = categories.map(cat => 
    `This text is about ${cat}.`
  );
  
  const scores = await Promise.all(
    hypotheses.map(hypothesis => 
      this.model.predict({
        premise: text,
        hypothesis,
      })
    )
  );
  
  // Use entailment scores
  const entailmentScores = scores.map(s => s.entailment);
  const maxIndex = entailmentScores.indexOf(Math.max(...entailmentScores));
  
  return {
    category: categories[maxIndex],
    confidence: entailmentScores[maxIndex],
  };
}
```

#### Instruction Models (Qwen, Llama)

```typescript
async classify(text: string, categories: string[]): Promise<Classification> {
  const prompt = `Classify the following text into one of these categories: ${categories.join(', ')}.

Text:
${text}

Respond with JSON: {"category": "...", "reasoning": "..."}`;

  const response = await this.model.generate(prompt, {
    maxTokens: 256,
    temperature: 0.1, // Low temperature for consistent classification
  });
  
  const parsed = JSON.parse(extractJSON(response));
  return {
    category: parsed.category,
    reasoning: parsed.reasoning,
    confidence: 0.9, // Instruction models don't provide calibrated scores
  };
}
```

### 4. Model Download & Storage

**Decision**: Download on-demand with progress tracking

**Directory structure**:
```
models/
├── gte-multilingual/
│   ├── config.json
│   ├── tokenizer.json
│   ├── model.safetensors
│   └── metadata.json
├── qwen2.5-1.5b-instruct/
│   ├── config.json
│   ├── tokenizer.json
│   ├── model-00001-of-00003.safetensors
│   ├── model-00002-of-00003.safetensors
│   ├── model-00003-of-00003.safetensors
│   └── metadata.json
└── cache.json (global model registry)
```

**Implementation**:
```typescript
class ModelDownloader {
  async download(modelName: string, onProgress?: (progress: number) => void) {
    const modelInfo = MODEL_REGISTRY[modelName];
    const outputDir = path.join(MODELS_DIR, modelName);
    
    // Check if already downloaded
    if (await this.isDownloaded(modelName)) {
      return outputDir;
    }
    
    // Download from HuggingFace
    await downloadModel(modelInfo.huggingfaceId, outputDir, {
      onProgress,
    });
    
    // Save metadata
    await this.saveMetadata(modelName, {
      downloadedAt: new Date().toISOString(),
      version: modelInfo.version,
      size: await this.getDirSize(outputDir),
    });
    
    return outputDir;
  }
}
```

### 5. CLI Interface

**Decision**: Add `--model` flag and `model` command group

**Examples**:
```bash
# Use local model for classification
classify -i src/ -o results.json --model=qwen2.5-1.5b-instruct

# Auto-download if not cached
classify -i file.ts --model=gte-multilingual  # Downloads first time

# Model management
classify model list                           # Show all available models
classify model download bge-m3                # Pre-download model
classify model info qwen2.5-1.5b-instruct     # Show model details
classify model remove llama-3.2-1b-instruct   # Delete cached model

# Interactive mode
classify -i src/                              # Prompts for model selection
```

### 6. Quality Benchmarking Methodology

**Benchmark dataset composition**:
- 100 files from diverse projects
- Categories: code, documentation, configuration, data, test, build, other
- Ground truth labels verified manually

**Metrics**:
```typescript
interface BenchmarkResults {
  model: string;
  accuracy: number;           // Overall correct classifications
  precision: Record<string, number>;  // Per-category precision
  recall: Record<string, number>;     // Per-category recall
  f1Score: Record<string, number>;    // Per-category F1
  performance: {
    avgTimeMs: number;        // Average classification time
    tokensPerSec: number;     // Inference speed
    memoryMB: number;         // Peak memory usage
  };
  cost: {
    perClassification: number; // $0 for local
    per1000: number;          // $0 for local
  };
}
```

**Comparison table format**:
```markdown
| Model | Accuracy | Avg Time | Memory | Cost/1000 | Use Case |
|-------|----------|----------|--------|-----------|----------|
| Claude 3.5 Sonnet | 96.5% | 1200ms | N/A | $1.50 | Highest quality |
| DeepSeek Chat | 94.2% | 800ms | N/A | $0.14 | Balanced |
| Qwen 2.5 1.5B | 89.1% | 340ms | 3.2GB | $0.00 | Local, fast |
| Llama 3.2 1B | 87.3% | 280ms | 2.8GB | $0.00 | Local, small |
| mDeBERTa MNLI | 85.7% | 150ms | 1.1GB | $0.00 | Zero-shot NLI |
| BGE-M3 | 82.4% | 90ms | 800MB | $0.00 | Fast embeddings |
| E5 Small | 80.1% | 60ms | 400MB | $0.00 | Fastest |
| GTE Multilingual | 81.8% | 75ms | 500MB | $0.00 | Multilingual |
```

## Technical Stack

### Core Dependencies

```json
{
  "@xenova/transformers": "^2.17.0",  // Transformers.js for Node
  "@huggingface/hub": "^0.15.0",      // Model downloads
  "node-downloader-helper": "^2.1.0", // Progress tracking
  "onnxruntime-node": "^1.17.0"       // ONNX runtime (optional optimization)
}
```

### Model Registry

```typescript
const MODEL_REGISTRY = {
  'gte-multilingual': {
    type: 'embedding',
    huggingfaceId: 'Alibaba-NLP/gte-multilingual-base',
    size: '1.2GB',
    dimensions: 768,
    languages: ['en', 'zh', 'es', 'fr', 'de', 'pt', 'it', 'ru', 'ja', 'ko'],
  },
  'multilingual-e5-small': {
    type: 'embedding',
    huggingfaceId: 'intfloat/multilingual-e5-small',
    size: '470MB',
    dimensions: 384,
    languages: ['100+ languages'],
  },
  'bge-m3': {
    type: 'embedding',
    huggingfaceId: 'BAAI/bge-m3',
    size: '2.2GB',
    dimensions: 1024,
    features: ['multi-granularity', 'multi-lingual', 'multi-functionality'],
  },
  'mdeberta-v3-base-mnli-xnli': {
    type: 'nli',
    huggingfaceId: 'microsoft/mdeberta-v3-base-mnli-xnli',
    size: '860MB',
    languages: ['en', 'fr', 'es', 'de', 'zh', 'ar', 'ru', 'hi', 'vi', 'sw', 'ur', 'th', 'tr', 'el'],
  },
  'qwen2.5-1.5b-instruct': {
    type: 'instruction',
    huggingfaceId: 'Qwen/Qwen2.5-1.5B-Instruct',
    size: '3.1GB',
    contextLength: 32768,
    languages: ['en', 'zh'],
  },
  'llama-3.2-1b-instruct': {
    type: 'instruction',
    huggingfaceId: 'meta-llama/Llama-3.2-1B-Instruct',
    size: '2.5GB',
    contextLength: 8192,
    languages: ['en'],
  },
};
```

## Provider Interface

```typescript
interface LocalModelProvider extends LLMProvider {
  readonly modelType: 'embedding' | 'nli' | 'instruction';
  readonly modelPath: string;
  
  // Inherited from LLMProvider
  complete(prompt: string, options?: CompletionOptions): Promise<LLMCompletionResponse>;
  
  // Local-specific methods
  isLoaded(): boolean;
  load(): Promise<void>;
  unload(): void;
  getModelInfo(): ModelInfo;
}

interface ModelInfo {
  name: string;
  type: 'embedding' | 'nli' | 'instruction';
  size: string;
  path: string;
  loaded: boolean;
  metadata: {
    downloadedAt?: string;
    version: string;
    checksum: string;
  };
}
```

## Error Handling

### Common Scenarios

1. **Model not downloaded**:
   ```typescript
   throw new Error(
     `Model '${modelName}' not found. Download it first:\n` +
     `  classify model download ${modelName}`
   );
   ```

2. **Insufficient memory**:
   ```typescript
   throw new Error(
     `Insufficient memory to load ${modelName}.\n` +
     `Required: ${modelInfo.memoryMB}MB, Available: ${availableMB}MB\n` +
     `Try a smaller model or close other applications.`
   );
   ```

3. **Download interrupted**:
   ```typescript
   // Automatic retry with exponential backoff
   await retryWithBackoff(
     () => downloadModel(modelId),
     { maxRetries: 3, initialDelay: 1000 }
   );
   ```

4. **Corrupted model**:
   ```typescript
   // Verify checksum after download
   if (!(await verifyChecksum(modelPath, expectedChecksum))) {
     await fs.rm(modelPath, { recursive: true });
     throw new Error(
       `Downloaded model corrupted. Please try again:\n` +
       `  classify model download ${modelName}`
     );
   }
   ```

## Performance Considerations

### Memory Management

```typescript
class ModelCache {
  private maxCacheSize = 2; // Max 2 models in memory
  private lruCache: LRUCache<string, LoadedModel>;
  
  async get(modelName: string): Promise<LoadedModel> {
    if (this.lruCache.has(modelName)) {
      return this.lruCache.get(modelName)!;
    }
    
    // Evict least recently used if cache full
    if (this.lruCache.size >= this.maxCacheSize) {
      const lruKey = this.lruCache.keys().next().value;
      const lruModel = this.lruCache.get(lruKey)!;
      await lruModel.unload();
      this.lruCache.delete(lruKey);
    }
    
    const model = await this.loadModel(modelName);
    this.lruCache.set(modelName, model);
    return model;
  }
}
```

### Quantization Support (Future)

```typescript
interface QuantizationOptions {
  precision: 'fp32' | 'fp16' | 'int8' | 'int4';
  device: 'cpu' | 'cuda' | 'metal';
}

// Example: 4-bit quantization reduces 3GB model to ~750MB
await loadModel('qwen2.5-1.5b-instruct', {
  quantization: { precision: 'int4', device: 'cpu' }
});
```

## Migration Path

### Existing Users

No changes required. All existing code continues to work:

```typescript
// Existing code (still works)
const client = new ClassifyClient({
  provider: 'deepseek',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

// New capability (opt-in)
const localClient = new ClassifyClient({
  provider: 'qwen2.5-1.5b-instruct', // Auto-detected as local
  modelsDir: './models', // Optional, defaults to ./models
});
```

### CLI Migration

```bash
# Before (still works)
classify -i src/ -o results.json --provider deepseek

# After (new option)
classify -i src/ -o results.json --model qwen2.5-1.5b-instruct
```

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Lower accuracy than expected | High | Medium | Benchmark early, document trade-offs clearly |
| Large downloads fail | Medium | Medium | Implement resume capability, retry logic |
| Memory issues on small machines | High | Low | Document requirements, provide memory checks |
| Model licensing issues | High | Low | Only use permissively licensed models (MIT/Apache 2.0) |
| Slow inference on CPU | Medium | High | Document performance expectations, suggest appropriate models |
| Breaking changes in @xenova/transformers | Medium | Low | Pin versions, test updates in CI |

## Testing Strategy

### Unit Tests
- Model download/caching logic
- Provider implementations
- Classification algorithms
- Error handling

### Integration Tests
- End-to-end classification with each model
- CLI commands
- Pipeline integration

### Performance Tests
- Benchmark inference speed
- Memory usage profiling
- Concurrent classification handling

### Compatibility Tests
- Different Node.js versions (18, 20, 22)
- Different operating systems (Windows, macOS, Linux)
- Different hardware (CPU-only, GPU available)

## Open Questions

1. ~~Should we support GPU acceleration in v0.8.0?~~
   - **Decision**: No, CPU-only for v0.8.0. GPU support in v0.9.0.
   
2. ~~What's the default model if none specified?~~
   - **Decision**: Continue using DeepSeek by default. Local models are opt-in.
   
3. ~~Should we support custom models (user-provided)?~~
   - **Decision**: No for v0.8.0. Standard models only. Custom models in v0.9.0.
   
4. ~~How to handle model updates (new versions)?~~
   - **Decision**: Manual updates only for v0.8.0. Auto-update checks in future.

## Future Work (Beyond v0.8.0)

- GPU acceleration (CUDA, Metal, ROCm)
- Model quantization options (4-bit, 8-bit)
- Custom model support (user-provided weights)
- Fine-tuning capabilities
- Model ensembling (combine multiple models)
- Automatic model selection based on document type
- Cloud-hosted local models (private deployment)
- Model versioning and auto-updates

