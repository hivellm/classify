# Classify CLI - LLM Providers

**Version:** 1.0  
**Last Updated:** 2025-01-26

## Overview

Classify supports 6 LLM providers with 30+ models optimized for document classification. This guide covers provider-specific configuration, model selection strategies, pricing, and integration details.

## Provider Interface

All providers implement the same interface:

```typescript
interface LLMProvider {
  name: string;
  
  // Template selection (Stage 1)
  selectTemplate(
    documentText: string,
    templateCatalog: TemplateCatalog
  ): Promise<TemplateSelection>;
  
  // Classification (Stage 2)
  classify(
    documentText: string,
    template: Template,
    config: LLMConfig
  ): Promise<ClassificationResult>;
  
  // Utility methods
  validateApiKey(): Promise<boolean>;
  getCost(tokens: number): {input: number; output: number};
  getModelInfo(): ModelInfo;
  healthCheck(): Promise<boolean>;
}
```

## Supported Providers

### 1. DeepSeek (RECOMMENDED - Default)

**Best for**: Cost-effective general classification

**Configuration**:
```yaml
Provider: DeepSeek
Default Model: deepseek-chat
API Endpoint: https://api.deepseek.com/v1/chat/completions
Authentication: Bearer token
API Key Env: DEEPSEEK_API_KEY
```

**Available Models**:

| Model | Pricing (per 1M tokens) | Speed | Best For |
|-------|------------------------|-------|----------|
| `deepseek-chat` | $0.14 / $0.28 | Medium | General classification (RECOMMENDED) |
| `deepseek-r1` | $0.14 / $0.28 | Medium | Reasoning tasks |
| `deepseek-reasoner` | $0.14 / $0.28 | Slow | Complex analysis |
| `deepseek-v3` | $0.14 / $0.28 | Medium | Latest features |

**Example Usage**:
```typescript
const client = new ClassifyClient({
  provider: 'deepseek',
  model: 'deepseek-chat',
  apiKey: process.env.DEEPSEEK_API_KEY
});
```

**CLI**:
```bash
npx @hivellm/classify document file.pdf --provider deepseek --model deepseek-chat
```

**Rate Limits**:
- Requests: 60/minute
- Tokens: 1M/minute
- Concurrent: 10 requests

**Error Handling**:
- 429: Rate limit exceeded → retry with exponential backoff
- 500: Service error → fallback to alternative model
- 401: Invalid API key → check DEEPSEEK_API_KEY

---

### 2. OpenAI

**Best for**: High-accuracy requirements

**Configuration**:
```yaml
Provider: OpenAI
Default Model: gpt-4o-mini
API Endpoint: https://api.openai.com/v1/chat/completions
Authentication: Bearer token
API Key Env: OPENAI_API_KEY
```

**Available Models**:

| Model | Pricing (per 1M tokens) | Speed | Best For |
|-------|------------------------|-------|----------|
| `gpt-4o-mini` | $0.15 / $0.60 | Fast | Cost-effective accuracy (RECOMMENDED) |
| `chatgpt-4o-latest` | $5.00 / $15.00 | Medium | Latest ChatGPT |
| `gpt-4o` | $5.00 / $15.00 | Medium | Standard GPT-4 Optimized |
| `gpt-5-mini` | $0.50 / $1.50 | Fast | Latest mini model |
| `gpt-4.1-mini` | $0.30 / $1.20 | Fast | Version 4.1 mini |
| `o1-mini` | $3.00 / $12.00 | Slow | Reasoning model |
| `gpt-4-turbo` | $10.00 / $30.00 | Fast | Legacy turbo |
| `gpt-4o-search-preview` | $5.00 / $15.00 | Medium | With search capability |

**Example Usage**:
```typescript
const client = new ClassifyClient({
  provider: 'openai',
  model: 'gpt-4o-mini',
  apiKey: process.env.OPENAI_API_KEY
});
```

**CLI**:
```bash
npx @hivellm/classify document file.pdf --provider openai --model gpt-4o-mini
```

**Rate Limits** (Tier 3):
- Requests: 5,000/minute
- Tokens: 2M/minute
- Concurrent: 500 requests

---

### 3. Anthropic

**Best for**: Fast, quality classification

**Configuration**:
```yaml
Provider: Anthropic
Default Model: claude-3-5-haiku-latest
API Endpoint: https://api.anthropic.com/v1/messages
Authentication: x-api-key header
API Key Env: ANTHROPIC_API_KEY
```

**Available Models**:

| Model | Pricing (per 1M tokens) | Speed | Best For |
|-------|------------------------|-------|----------|
| `claude-3-5-haiku-latest` | $0.25 / $1.25 | Fast | Fast & cheap (RECOMMENDED) |
| `claude-3-7-sonnet-latest` | $3.00 / $15.00 | Medium | Sonnet 3.7 |
| `claude-4-sonnet-20250514` | $3.00 / $15.00 | Medium | Claude 4 latest |
| `claude-sonnet-4-20250514` | $3.00 / $15.00 | Medium | Sonnet 4 variant |
| `claude-3-5-sonnet-latest` | $3.00 / $15.00 | Medium | Sonnet 3.5 |
| `claude-3-5-sonnet-20241022` | $3.00 / $15.00 | Medium | Dated version |
| `claude-3-opus-latest` | $15.00 / $75.00 | Slow | Highest quality (expensive) |

**Example Usage**:
```typescript
const client = new ClassifyClient({
  provider: 'anthropic',
  model: 'claude-3-5-haiku-latest',
  apiKey: process.env.ANTHROPIC_API_KEY
});
```

**CLI**:
```bash
npx @hivellm/classify document file.pdf --provider anthropic --model claude-3-5-haiku-latest
```

**Rate Limits**:
- Requests: 4,000/minute
- Tokens: 400K/minute
- Concurrent: 50 requests

---

### 4. Google Gemini

**Best for**: Fast Google ecosystem model

**Configuration**:
```yaml
Provider: Gemini
Default Model: gemini-2.0-flash
API Endpoint: https://generativelanguage.googleapis.com/v1/models
Authentication: API key parameter
API Key Env: GEMINI_API_KEY
```

**Available Models**:

| Model | Pricing (per 1M tokens) | Speed | Best For |
|-------|------------------------|-------|----------|
| `gemini-2.0-flash` | $0.50 / $1.50 | Fast | Fast version 2.0 (RECOMMENDED) |
| `gemini-2.5-flash` | $0.50 / $1.50 | Fast | Latest flash |
| `gemini-2.5-pro` | $1.25 / $5.00 | Medium | Pro version |
| `gemini-1.5-pro-latest` | $3.50 / $10.50 | Medium | Legacy pro |
| `gemini-1.5-flash-latest` | $0.35 / $1.05 | Fast | Legacy flash |

**Example Usage**:
```typescript
const client = new ClassifyClient({
  provider: 'gemini',
  model: 'gemini-2.0-flash',
  apiKey: process.env.GEMINI_API_KEY
});
```

**CLI**:
```bash
npx @hivellm/classify document file.pdf --provider gemini --model gemini-2.0-flash
```

**Rate Limits**:
- Requests: 1,500/minute (free tier)
- Tokens: 1.5M/minute
- Concurrent: 15 requests

---

### 5. xAI (Grok)

**Best for**: Alternative provider

**Configuration**:
```yaml
Provider: xAI
Default Model: grok-3-mini-latest
API Endpoint: https://api.x.ai/v1/chat/completions
Authentication: Bearer token
API Key Env: XAI_API_KEY
```

**Available Models**:

| Model | Pricing | Speed | Best For |
|-------|---------|-------|----------|
| `grok-3-mini-latest` | Variable | Fast | Cost-effective (RECOMMENDED) |
| `grok-3-fast-latest` | Variable | Very Fast | Speed priority |
| `grok-code-fast-1` | Variable | Fast | Code-optimized |
| `grok-3-latest` | Variable | Medium | Standard |
| `grok-4-latest` | Variable | Medium | Latest (premium) |

**Example Usage**:
```typescript
const client = new ClassifyClient({
  provider: 'xai',
  model: 'grok-3-mini-latest',
  apiKey: process.env.XAI_API_KEY
});
```

**CLI**:
```bash
npx @hivellm/classify document file.pdf --provider xai --model grok-3-mini-latest
```

**Note**: Pricing varies; check x.ai for current rates.

---

### 6. Groq (Ultra-Fast)

**Best for**: Ultra-fast batch processing

**Configuration**:
```yaml
Provider: Groq
Default Model: llama-3.1-8b-instant
API Endpoint: https://api.groq.com/openai/v1/chat/completions
Authentication: Bearer token
API Key Env: GROQ_API_KEY
```

**Available Models**:

| Model | Pricing | Speed | Best For |
|-------|---------|-------|----------|
| `llama-3.1-8b-instant` | Very Low | Ultra-Fast | Speed priority (RECOMMENDED) |
| `llama-3.1-70b-versatile` | Low | Fast | Balanced |
| `llama-3.3-70b-versatile` | Low | Fast | Latest 70B |

**Example Usage**:
```typescript
const client = new ClassifyClient({
  provider: 'groq',
  model: 'llama-3.1-8b-instant',
  apiKey: process.env.GROQ_API_KEY
});
```

**CLI**:
```bash
npx @hivellm/classify document file.pdf --provider groq --model llama-3.1-8b-instant
```

**Rate Limits** (Free Tier):
- Requests: 30/minute
- Tokens: 20K/minute
- Concurrent: 10 requests

**Performance**: Up to 500 tokens/second (fastest in the market)

---

## Provider Selection Strategy

### By Use Case

| Use Case | Recommended Provider | Model | Reason |
|----------|---------------------|-------|--------|
| **Default** | DeepSeek | deepseek-chat | Best value, good quality |
| **Speed** | Groq | llama-3.1-8b-instant | Ultra-fast inference |
| **Accuracy** | OpenAI | gpt-4o-mini | High accuracy, reasonable cost |
| **Quality + Speed** | Anthropic | claude-3-5-haiku-latest | Fast Anthropic |
| **Google Ecosystem** | Gemini | gemini-2.0-flash | Google integration |
| **Cost Optimization** | DeepSeek | deepseek-chat | Lowest cost per token |
| **Reasoning** | OpenAI | o1-mini | Complex logical tasks |

### Fallback Chain

Default fallback order (configured in `classify.config.json`):

```typescript
const fallbackChain = [
  { provider: 'deepseek', model: 'deepseek-chat' },        // Primary
  { provider: 'groq', model: 'llama-3.1-8b-instant' },    // Fallback 1: Speed
  { provider: 'openai', model: 'gpt-4o-mini' },           // Fallback 2: Accuracy
  { provider: 'gemini', model: 'gemini-2.0-flash' }       // Fallback 3: Alternative
];
```

## Two-Stage LLM Interaction

### Stage 1: Template Selection

**Purpose**: Select the best template for the document.

**Prompt Structure**:
```typescript
const selectionPrompt = {
  system: "You are an expert document classifier that selects appropriate templates.",
  user: `
Available Templates:
${templateCatalog.toMarkdown()}

Document to classify (compressed):
${compressedDocument}

Select the most appropriate template and explain why.
Return JSON: {"selected": "legal.json", "confidence": 0.95, "reasoning": "..."}
  `
};
```

**Token Usage**: ~500-1000 tokens (lightweight)
**Time**: 500-1000ms

### Stage 2: Classification

**Purpose**: Extract entities, relationships, and metadata using selected template.

**Prompt Structure**:
```typescript
const classificationPrompt = {
  system: template.llm_config.system_prompt,
  user: `
Template: ${template.name}
Document Types: ${template.document_types}
Entities: ${template.entity_definitions}
Graph Schema: ${template.graph_schema}
Full-text Schema: ${template.fulltext_schema}

Document (compressed):
${compressedDocument}

Extract:
1. Entities and relationships for graph structure
2. Metadata fields for full-text indexing
3. Keywords and categories

Return structured JSON.
  `
};
```

**Token Usage**: ~1500-2500 tokens (detailed)
**Time**: 1000-2000ms

## Cost Analysis

### Per-Document Cost (20-page PDF, ~15,000 tokens → 7,500 after compression)

| Provider | Model | Stage 1 | Stage 2 | Total | Notes |
|----------|-------|---------|---------|-------|-------|
| DeepSeek | deepseek-chat | $0.0011 | $0.0013 | **$0.0024** | **Best value** |
| Groq | llama-3.1-8b-instant | $0.0005 | $0.0005 | **$0.0010** | Fastest |
| OpenAI | gpt-4o-mini | $0.0012 | $0.0030 | **$0.0042** | High accuracy |
| Anthropic | claude-3-5-haiku | $0.0020 | $0.0063 | **$0.0083** | Quality |
| Gemini | gemini-2.0-flash | $0.0040 | $0.0075 | **$0.0115** | Google |

### Cost Savings

**With Compression (50% reduction)**:
- DeepSeek: $0.0024 (saved $0.0021 from $0.0045)
- GPT-4o-mini: $0.0042 (saved $0.0048 from $0.0090)

**With Cache Hit**:
- Cost: $0.00 (100% savings)
- Time: 2-5ms (vs 2000ms)

### Batch Processing Cost (1000 documents)

| Provider | Cold Start | 70% Cache Hit | Notes |
|----------|-----------|---------------|-------|
| DeepSeek | $2.40 | **$0.72** | Best value |
| Groq | $1.00 | **$0.30** | Fastest |
| GPT-4o-mini | $4.20 | **$1.26** | Accuracy |

## Rate Limit Management

### Exponential Backoff

```typescript
async function callWithRetry(fn: () => Promise<any>, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
}
```

### Concurrent Request Management

```typescript
import PQueue from 'p-queue';

const queue = new PQueue({
  concurrency: provider === 'groq' ? 5 : 10,
  interval: 60000, // 1 minute
  intervalCap: provider === 'groq' ? 30 : 100
});

const result = await queue.add(() => provider.classify(document));
```

## Provider-Specific Features

### DeepSeek
- **Reasoning Models**: deepseek-r1, deepseek-reasoner
- **Best For**: Cost-sensitive applications
- **Special**: Built-in Chinese language support

### OpenAI
- **Search Integration**: gpt-4o-search-preview
- **Reasoning**: o1-mini for complex logic
- **Best For**: Production applications requiring reliability

### Anthropic
- **Context Window**: Up to 200K tokens (Claude 3)
- **Safety**: Built-in safety filtering
- **Best For**: Complex document analysis

### Gemini
- **Multimodal**: Supports images with gemini-pro-vision
- **Free Tier**: 1,500 requests/minute
- **Best For**: Google Cloud integration

### Groq
- **Speed**: Up to 500 tokens/second
- **Open Source**: Llama models
- **Best For**: Real-time applications

### xAI
- **Code Optimized**: grok-code-fast-1
- **Latest Models**: Grok-4
- **Best For**: Alternative to mainstream providers

## Environment Configuration

```bash
# ~/.bashrc or .env
export DEEPSEEK_API_KEY=sk-...
export OPENAI_API_KEY=sk-...
export ANTHROPIC_API_KEY=sk-ant-...
export GEMINI_API_KEY=AI...
export XAI_API_KEY=xai-...
export GROQ_API_KEY=gsk_...

# Default provider
export CLASSIFY_DEFAULT_PROVIDER=deepseek
export CLASSIFY_DEFAULT_MODEL=deepseek-chat
```

## Monitoring and Observability

### Metrics to Track

```typescript
interface ProviderMetrics {
  provider: string;
  model: string;
  
  // Performance
  avgLatency: number;
  p95Latency: number;
  requestsPerMinute: number;
  
  // Reliability
  successRate: number;
  errorRate: number;
  rateLimitHits: number;
  
  // Cost
  tokensUsed: number;
  costIncurred: number;
  
  // Quality
  avgConfidence: number;
  lowConfidenceCount: number;
}
```

### Health Checks

```bash
# Check provider health
npx @hivellm/classify health-check --provider deepseek

# Output:
✓ DeepSeek API: Healthy
  - Latency: 234ms
  - Rate Limit: 45/60 rpm available
  - Model: deepseek-chat
```

---

**Next**: See [INTEGRATION.md](./INTEGRATION.md) for integration examples.

