# Classify CLI - Configuration Guide

**Version:** 1.0  
**Last Updated:** 2025-01-26

## Overview

Classify can be configured through configuration files, environment variables, and CLI flags. This guide covers all configuration options and best practices.

## Configuration Hierarchy

Configuration is loaded in the following order (later overrides earlier):

1. Default values (hardcoded)
2. Global config file (`~/.classify/config.json`)
3. Project config file (`./classify.config.json`)
4. Environment variables
5. CLI flags

## Configuration File Format

### Complete Configuration Example

**File**: `classify.config.json`

```json
{
  "$schema": "https://hivellm.org/schemas/classify-config-v1.json",
  "version": "1.0",
  
  "providers": {
    "default": "deepseek",
    "fallback": ["groq", "openai", "gemini"],
    "api_keys": {
      "deepseek": "${DEEPSEEK_API_KEY}",
      "openai": "${OPENAI_API_KEY}",
      "anthropic": "${ANTHROPIC_API_KEY}",
      "gemini": "${GEMINI_API_KEY}",
      "xai": "${XAI_API_KEY}",
      "groq": "${GROQ_API_KEY}"
    }
  },
  
  "models": {
    "default": "deepseek-chat",
    "per_provider": {
      "deepseek": "deepseek-chat",
      "openai": "gpt-4o-mini",
      "anthropic": "claude-3-5-haiku-latest",
      "gemini": "gemini-2.0-flash",
      "xai": "grok-3-mini-latest",
      "groq": "llama-3.1-8b-instant"
    },
    "temperature": 0.1,
    "max_tokens": 2000
  },
  
  "templates": {
    "directory": "./templates",
    "auto_select": true,
    "cache_selections": true,
    "selection_confidence_threshold": 0.6,
    "fallback_template": "base.json",
    "custom_templates": []
  },
  
  "template_selection": {
    "enabled": true,
    "max_alternatives": 3,
    "include_reasoning": true,
    "cache_ttl": 86400,
    "similarity_threshold": 0.8
  },
  
  "outputs": {
    "default_format": "combined",
    "graph": {
      "enabled": true,
      "format": "cypher",
      "include_metadata": true,
      "validate": true
    },
    "fulltext": {
      "enabled": true,
      "extract_keywords": true,
      "max_keywords": 20,
      "generate_summary": true,
      "summary_max_length": 500
    }
  },
  
  "cache": {
    "enabled": true,
    "directory": "./.classify-cache",
    "ttl": 2592000,
    "max_size_mb": 1000,
    "compression": true,
    "cleanup": {
      "enabled": true,
      "older_than_days": 90,
      "max_entries": 10000,
      "schedule": "daily"
    }
  },
  
  "cache_strategy": {
    "include_in_key": ["file_sha256", "provider", "model", "template"],
    "cache_failures": false,
    "cache_low_confidence": false,
    "min_confidence_to_cache": 0.7
  },
  
  "document_conversion": {
    "enabled": true,
    "transmutation": {
      "binary_path": "transmutation",
      "timeout_ms": 30000,
      "mode": "fast",
      "output_format": "markdown"
    },
    "supported_formats": [
      "pdf", "docx", "xlsx", "pptx", "html", "xml", 
      "txt", "csv", "rtf", "odt", "md"
    ]
  },
  
  "compression": {
    "enabled": true,
    "compression_prompt": {
      "binary_path": "compression-prompt",
      "compression_ratio": 0.5,
      "preserve_entities": true,
      "preserve_keywords": true,
      "min_word_length": 3
    },
    "quality_threshold": 0.85
  },
  
  "performance": {
    "max_concurrent": 5,
    "timeout": 30000,
    "retry_attempts": 3,
    "retry_backoff_ms": 1000
  },
  
  "logging": {
    "level": "info",
    "format": "json",
    "destination": "stdout",
    "file": "./classify.log",
    "rotate": true,
    "max_file_size_mb": 10,
    "max_files": 5
  },
  
  "monitoring": {
    "enabled": true,
    "metrics": {
      "export_format": "prometheus",
      "export_path": "./metrics.txt",
      "export_interval_ms": 60000
    },
    "tracing": {
      "enabled": false,
      "endpoint": "http://localhost:4318/v1/traces"
    }
  }
}
```

## Configuration Sections

### Providers

**Purpose**: Configure LLM providers and API keys.

```json
{
  "providers": {
    "default": "deepseek",
    "fallback": ["groq", "openai", "gemini"],
    "api_keys": {
      "deepseek": "${DEEPSEEK_API_KEY}",
      "openai": "${OPENAI_API_KEY}"
    },
    "timeout_ms": 30000,
    "retry_attempts": 3
  }
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `default` | string | `"deepseek"` | Default provider to use |
| `fallback` | string[] | `[]` | Fallback providers in order |
| `api_keys` | object | `{}` | API keys per provider (use env vars) |
| `timeout_ms` | number | `30000` | Request timeout in milliseconds |
| `retry_attempts` | number | `3` | Number of retry attempts |

### Models

**Purpose**: Configure model selection and LLM parameters.

```json
{
  "models": {
    "default": "deepseek-chat",
    "per_provider": {
      "deepseek": "deepseek-chat",
      "openai": "gpt-4o-mini"
    },
    "temperature": 0.1,
    "max_tokens": 2000,
    "top_p": 1.0
  }
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `default` | string | `"deepseek-chat"` | Default model |
| `per_provider` | object | See above | Model per provider |
| `temperature` | number | `0.1` | LLM temperature (0.0-1.0) |
| `max_tokens` | number | `2000` | Max output tokens |
| `top_p` | number | `1.0` | Top-p sampling |

### Templates

**Purpose**: Configure template system.

```json
{
  "templates": {
    "directory": "./templates",
    "auto_select": true,
    "cache_selections": true,
    "selection_confidence_threshold": 0.6,
    "fallback_template": "base.json"
  }
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `directory` | string | `"./templates"` | Templates directory |
| `auto_select` | boolean | `true` | Enable auto-selection |
| `cache_selections` | boolean | `true` | Cache template selections |
| `selection_confidence_threshold` | number | `0.6` | Min confidence for selection |
| `fallback_template` | string | `"base.json"` | Fallback template |

### Cache

**Purpose**: Configure caching system.

```json
{
  "cache": {
    "enabled": true,
    "directory": "./.classify-cache",
    "ttl": 2592000,
    "max_size_mb": 1000,
    "compression": true,
    "cleanup": {
      "enabled": true,
      "older_than_days": 90,
      "max_entries": 10000
    }
  }
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable caching |
| `directory` | string | `"./.classify-cache"` | Cache directory |
| `ttl` | number | `2592000` | Time-to-live (seconds) |
| `max_size_mb` | number | `1000` | Max cache size (MB) |
| `compression` | boolean | `true` | Compress cache entries |
| `cleanup.enabled` | boolean | `true` | Auto-cleanup |
| `cleanup.older_than_days` | number | `90` | Delete entries older than |
| `cleanup.max_entries` | number | `10000` | Max cache entries |

### Document Conversion

**Purpose**: Configure Transmutation integration.

```json
{
  "document_conversion": {
    "enabled": true,
    "transmutation": {
      "binary_path": "transmutation",
      "timeout_ms": 30000,
      "mode": "fast",
      "output_format": "markdown"
    }
  }
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable conversion |
| `transmutation.binary_path` | string | `"transmutation"` | Path to binary |
| `transmutation.timeout_ms` | number | `30000` | Conversion timeout |
| `transmutation.mode` | string | `"fast"` | Mode (fast/precision) |
| `transmutation.output_format` | string | `"markdown"` | Output format |

### Compression

**Purpose**: Configure compression-prompt integration.

```json
{
  "compression": {
    "enabled": true,
    "compression_prompt": {
      "binary_path": "compression-prompt",
      "compression_ratio": 0.5,
      "preserve_entities": true,
      "preserve_keywords": true,
      "min_word_length": 3
    },
    "quality_threshold": 0.85
  }
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable compression |
| `compression_ratio` | number | `0.5` | Compression ratio (0.0-1.0) |
| `preserve_entities` | boolean | `true` | Preserve entities |
| `preserve_keywords` | boolean | `true` | Preserve keywords |
| `min_word_length` | number | `3` | Min word length to keep |
| `quality_threshold` | number | `0.85` | Min quality score |

### Outputs

**Purpose**: Configure output formats.

```json
{
  "outputs": {
    "default_format": "combined",
    "graph": {
      "enabled": true,
      "format": "cypher",
      "validate": true
    },
    "fulltext": {
      "enabled": true,
      "extract_keywords": true,
      "max_keywords": 20,
      "generate_summary": true
    }
  }
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `default_format` | string | `"combined"` | Default output format |
| `graph.enabled` | boolean | `true` | Enable graph output |
| `graph.format` | string | `"cypher"` | Graph format |
| `graph.validate` | boolean | `true` | Validate Cypher |
| `fulltext.enabled` | boolean | `true` | Enable fulltext output |
| `fulltext.extract_keywords` | boolean | `true` | Extract keywords |
| `fulltext.max_keywords` | number | `20` | Max keywords |
| `fulltext.generate_summary` | boolean | `true` | Generate summary |

## Environment Variables

### LLM Provider API Keys

```bash
# Required: At least one provider API key
export DEEPSEEK_API_KEY=sk-...
export OPENAI_API_KEY=sk-...
export ANTHROPIC_API_KEY=sk-ant-...
export GEMINI_API_KEY=AI...
export XAI_API_KEY=xai-...
export GROQ_API_KEY=gsk_...
```

### Core Configuration

```bash
# Provider and Model
export CLASSIFY_DEFAULT_PROVIDER=deepseek
export CLASSIFY_DEFAULT_MODEL=deepseek-chat

# Cache
export CLASSIFY_CACHE_ENABLED=true
export CLASSIFY_CACHE_DIR=./.classify-cache
export CLASSIFY_CACHE_TTL=2592000
export CLASSIFY_CACHE_MAX_SIZE_MB=1000

# Compression
export CLASSIFY_COMPRESSION_ENABLED=true
export CLASSIFY_COMPRESSION_RATIO=0.5

# Templates
export CLASSIFY_TEMPLATE_DIR=./templates
export CLASSIFY_AUTO_SELECT_TEMPLATE=true
export CLASSIFY_DEFAULT_TEMPLATE=base.json

# Output
export CLASSIFY_DEFAULT_OUTPUT=combined

# Performance
export CLASSIFY_MAX_CONCURRENT=5
export CLASSIFY_TIMEOUT=30000

# Logging
export CLASSIFY_LOG_LEVEL=info
export CLASSIFY_LOG_FILE=./classify.log
```

### Integration Paths

```bash
# Transmutation
export TRANSMUTATION_BINARY=/usr/local/bin/transmutation

# compression-prompt
export COMPRESSION_PROMPT_BINARY=/usr/local/bin/compression-prompt

# Nexus
export NEXUS_API_URL=http://localhost:15474

# Elasticsearch
export ELASTICSEARCH_URL=http://localhost:9200
export ELASTICSEARCH_USERNAME=elastic
export ELASTICSEARCH_PASSWORD=changeme
```

## CLI Flags

CLI flags override all other configuration:

```bash
npx @hivellm/classify document file.pdf \
  --provider openai \
  --model gpt-4o-mini \
  --template templates/legal.json \
  --output combined \
  --cache \
  --cache-dir /tmp/cache \
  --compress \
  --compression-ratio 0.5 \
  --confidence 0.7 \
  --timeout 60000 \
  --verbose
```

## Configuration Profiles

### Development Profile

**File**: `classify.dev.json`

```json
{
  "providers": {
    "default": "deepseek"
  },
  "cache": {
    "enabled": true,
    "directory": "./.cache-dev"
  },
  "logging": {
    "level": "debug",
    "destination": "stdout"
  },
  "compression": {
    "enabled": false
  }
}
```

**Usage**:
```bash
npx @hivellm/classify document file.pdf --config classify.dev.json
```

### Production Profile

**File**: `classify.prod.json`

```json
{
  "providers": {
    "default": "deepseek",
    "fallback": ["groq", "openai", "gemini"]
  },
  "cache": {
    "enabled": true,
    "directory": "/var/cache/classify",
    "cleanup": {
      "enabled": true,
      "older_than_days": 30
    }
  },
  "logging": {
    "level": "info",
    "format": "json",
    "file": "/var/log/classify/app.log",
    "rotate": true
  },
  "compression": {
    "enabled": true,
    "compression_ratio": 0.5
  },
  "monitoring": {
    "enabled": true
  }
}
```

### Cost-Optimized Profile

**File**: `classify.cost-optimized.json`

```json
{
  "providers": {
    "default": "deepseek"
  },
  "models": {
    "default": "deepseek-chat"
  },
  "cache": {
    "enabled": true,
    "ttl": 7776000,
    "max_size_mb": 5000
  },
  "compression": {
    "enabled": true,
    "compression_ratio": 0.3
  },
  "cache_strategy": {
    "cache_low_confidence": true,
    "min_confidence_to_cache": 0.5
  }
}
```

**Estimated Savings**: Up to 85% cost reduction vs. no cache/compression.

### Speed-Optimized Profile

**File**: `classify.speed.json`

```json
{
  "providers": {
    "default": "groq"
  },
  "models": {
    "default": "llama-3.1-8b-instant"
  },
  "cache": {
    "enabled": true
  },
  "compression": {
    "enabled": true,
    "compression_ratio": 0.4
  },
  "performance": {
    "max_concurrent": 20
  }
}
```

**Estimated Speed**: 3-5x faster than default configuration.

## Configuration Validation

### Validate Configuration File

```bash
npx @hivellm/classify validate-config classify.config.json

# Output:
✓ Configuration is valid
  - Providers: 6 configured
  - Cache: enabled
  - Compression: enabled
  - Templates: 5 found
  - API Keys: 4/6 configured
  ⚠ Warning: ANTHROPIC_API_KEY not set
  ⚠ Warning: XAI_API_KEY not set
```

### Check Current Configuration

```bash
npx @hivellm/classify config show

# Output:
Current Configuration:
======================

Providers:
  - Default: deepseek
  - Fallback: groq, openai, gemini
  - API Keys: ✓ deepseek, ✓ openai, ✓ groq, ✓ gemini

Models:
  - Default: deepseek-chat
  - Temperature: 0.1

Cache:
  - Enabled: true
  - Directory: ./.classify-cache
  - Size: 45.2 MB / 1000 MB (4.5%)
  - Entries: 1,234
  - Hit Rate: 76.3%

Compression:
  - Enabled: true
  - Ratio: 0.5 (50% reduction)

Templates:
  - Directory: ./templates
  - Auto-select: true
  - Available: 5 templates
```

## Best Practices

### 1. Use Environment Variables for Secrets

**Good**:
```json
{
  "providers": {
    "api_keys": {
      "openai": "${OPENAI_API_KEY}"
    }
  }
}
```

**Bad**:
```json
{
  "providers": {
    "api_keys": {
      "openai": "sk-1234567890abcdef"
    }
  }
}
```

### 2. Separate Configs by Environment

```bash
# Development
npx @hivellm/classify --config classify.dev.json

# Staging
npx @hivellm/classify --config classify.staging.json

# Production
npx @hivellm/classify --config classify.prod.json
```

### 3. Enable Caching in Production

Always enable cache in production for cost and speed:

```json
{
  "cache": {
    "enabled": true,
    "ttl": 2592000,
    "cleanup": {
      "enabled": true
    }
  }
}
```

### 4. Monitor Cache Performance

```bash
# Check cache stats regularly
npx @hivellm/classify cache-stats

# Clean old entries
npx @hivellm/classify clear-cache --older-than 90
```

### 5. Use Compression

Keep compression enabled unless quality is critical:

```json
{
  "compression": {
    "enabled": true,
    "compression_ratio": 0.5
  }
}
```

### 6. Configure Fallback Providers

Always configure fallback providers for resilience:

```json
{
  "providers": {
    "default": "deepseek",
    "fallback": ["groq", "openai", "gemini"]
  }
}
```

### 7. Adjust Concurrency Based on Rate Limits

```json
{
  "performance": {
    "max_concurrent": 5,  // Conservative default
    "timeout": 30000
  }
}
```

## Troubleshooting

### Issue: API Key Not Found

```bash
# Check environment variables
echo $DEEPSEEK_API_KEY

# Set if missing
export DEEPSEEK_API_KEY=sk-...

# Verify configuration
npx @hivellm/classify config show
```

### Issue: Cache Not Working

```bash
# Check cache directory exists and is writable
ls -la .classify-cache/

# Clear and recreate
npx @hivellm/classify clear-cache --all

# Check permissions
chmod -R 755 .classify-cache/
```

### Issue: Slow Performance

```bash
# Enable compression
export CLASSIFY_COMPRESSION_ENABLED=true

# Increase concurrency
export CLASSIFY_MAX_CONCURRENT=10

# Use faster model
export CLASSIFY_DEFAULT_PROVIDER=groq
export CLASSIFY_DEFAULT_MODEL=llama-3.1-8b-instant
```

---

**Next**: See [CACHE.md](./CACHE.md) for detailed caching documentation.

