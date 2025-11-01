# Proposal: Add Local Models Support for Classification

## Why

Currently, classify relies exclusively on premium cloud-based LLM providers (DeepSeek, Claude, OpenAI, etc.) for document classification. While these models offer high quality, they have limitations:
- **Privacy concerns**: Documents must be sent to external APIs
- **Cost accumulation**: Every classification incurs API costs
- **Offline limitations**: Requires internet connectivity
- **Vendor lock-in**: Dependency on third-party services

Adding support for local embedding and instruction models provides users with:
- **Full privacy**: Models run locally, documents never leave the machine
- **Zero marginal cost**: After initial download, classifications are free
- **Offline capability**: Works without internet connection
- **Flexibility**: Choice between quality (premium) and privacy/cost (local)

## What Changes

- **ADDED** Local model provider infrastructure supporting both embedding and instruction models
- **ADDED** Model download functionality with progress tracking
- **ADDED** Model caching in `/models` directory
- **ADDED** CLI parameter `--model=<model-name>` for model selection
- **ADDED** Support for 6 initial models:
  - **Embedding models** (for semantic classification):
    - `gte-multilingual` - General Text Embeddings Multilingual
    - `multilingual-e5-small` - Efficient multilingual embeddings
    - `bge-m3` - BAAI General Embedding M3
  - **Classification models** (zero-shot/few-shot):
    - `mdeberta-v3-base-mnli-xnli` - Multilingual NLI for classification
    - `qwen2.5-1.5b-instruct` - Lightweight instruction model
    - `llama-3.2-1b-instruct` - Meta's small instruction model
- **ADDED** File and directory support (same interface as premium models)
- **ADDED** Quality comparison benchmarks vs DeepSeek and Claude
- **ADDED** Model management commands: download, list, remove
- **MODIFIED** CLI to support local model selection
- **MODIFIED** Provider factory to auto-detect local vs cloud models

## Impact

- **Affected specs**: New capability - local-model-provider
- **Affected code**: 
  - `src/llm/providers/local-model.ts` (new)
  - `src/llm/factory.ts` (modified)
  - `src/cli/commands/model.ts` (new)
  - `src/cli/index.ts` (modified)
  - `src/client.ts` (modified)
- **Breaking change**: None (additive feature)
- **New dependencies**: 
  - `@xenova/transformers` - For running transformers in Node.js
  - `@huggingface/hub` - For model downloads
  - `node-downloader-helper` - Download with progress tracking
- **Storage requirements**: 
  - Small models: ~500MB-1GB each
  - Large models: ~3GB-6GB each
  - Default location: `./models/` (configurable)

## Benefits

1. **Privacy**: Documents processed entirely locally
2. **Cost**: Zero API costs after initial download
3. **Speed**: No network latency for inference
4. **Offline**: Works without internet (after download)
5. **Compliance**: Suitable for sensitive documents
6. **Benchmarking**: Direct quality comparison with premium models

## Trade-offs

1. **Quality**: Local models may have lower accuracy than GPT-4/Claude
2. **Disk space**: Models require significant storage
3. **First run**: Model download takes time
4. **Compute**: Requires sufficient RAM/CPU for inference
5. **Maintenance**: User responsible for model updates

## Success Criteria

- [ ] All 6 models successfully download and load
- [ ] Classification accuracy within 10-15% of premium models on benchmark dataset
- [ ] CLI `--model` flag works for all supported models
- [ ] File and directory classification works identically to premium models
- [ ] Comprehensive documentation with model comparison table
- [ ] Performance benchmarks published

