# Classify CLI - Caching System

**Version:** 1.0  
**Last Updated:** 2025-01-26

## Overview

Classify uses a SHA256-based content-addressable caching system to avoid reprocessing identical documents. This enables efficient multi-system usage, significant cost savings, and near-instant results for cached documents.

## Architecture

### Content-Addressable Storage

```
Cache Key = SHA256(file_content) + provider + model + template_name

Example:
  File: contract.pdf
  Content SHA256: a1b2c3d4e5f6...
  Provider: deepseek
  Model: deepseek-chat
  Template: legal
  
  Cache Key: a1b2c3d4e5f6..._deepseek_deepseek-chat_legal.json
```

### Cache Directory Structure

```
.classify-cache/
├── index.json                          # Cache metadata and index
├── results/                            # Cached classification results
│   ├── a1b2c3...def_deepseek-chat_legal.json
│   ├── a1b2c3...def_gpt-4o-mini_auto.json
│   ├── b2c3d4...ef0_llama-3.1-8b-instant_financial.json
│   └── ...
├── stats/
│   └── cache-stats.json                # Hit rates, savings, metrics
└── locks/
    └── a1b2c3...def.lock              # Concurrent access locks
```

### Index Format

**File**: `.classify-cache/index.json`

```json
{
  "version": "1.0",
  "created_at": "2025-01-26T00:00:00Z",
  "last_updated": "2025-01-26T12:30:45Z",
  "total_entries": 1234,
  "total_size_bytes": 47456789,
  
  "entries": {
    "a1b2c3d4e5f6..._deepseek_deepseek-chat_legal": {
      "file_sha256": "a1b2c3d4e5f6...",
      "provider": "deepseek",
      "model": "deepseek-chat",
      "template": "legal",
      "created_at": "2025-01-25T10:30:00Z",
      "last_accessed": "2025-01-26T12:30:45Z",
      "hit_count": 5,
      "size_bytes": 38456,
      "compressed": true,
      "ttl": 2592000,
      "expires_at": "2025-02-24T10:30:00Z"
    }
  },
  
  "stats": {
    "total_hits": 942,
    "total_misses": 292,
    "hit_rate": 0.763,
    "time_saved_seconds": 8280,
    "cost_saved_usd": 23.45
  }
}
```

## Cache Operations

### 1. Cache Lookup

**Flow**:
```typescript
async function lookupCache(filePath: string, provider: string, model: string): Promise<CacheResult | null> {
  // 1. Read file content
  const content = await fs.readFile(filePath);
  
  // 2. Calculate SHA256 hash
  const sha256 = crypto.createHash('sha256').update(content).digest('hex');
  
  // 3. Determine template (from previous selection or auto-detect)
  const template = await getTemplateFromCache(sha256) || 'auto';
  
  // 4. Build cache key
  const cacheKey = `${sha256}_${provider}_${model}_${template}`;
  
  // 5. Check if cached
  const cachePath = path.join(CACHE_DIR, 'results', `${cacheKey}.json`);
  if (!fs.existsSync(cachePath)) {
    return null; // Cache miss
  }
  
  // 6. Load cached result
  const cached = JSON.parse(await fs.readFile(cachePath, 'utf8'));
  
  // 7. Check TTL
  if (Date.now() > new Date(cached.expires_at).getTime()) {
    // Expired, delete and return miss
    await fs.unlink(cachePath);
    return null;
  }
  
  // 8. Update access stats
  await updateCacheStats(cacheKey, 'hit');
  
  // 9. Return cached result
  return {
    cached: true,
    result: cached.result,
    cachedAt: cached.created_at,
    age: Date.now() - new Date(cached.created_at).getTime(),
    hitCount: cached.hit_count
  };
}
```

**Performance**:
- Disk I/O: ~1-2ms
- Hash calculation: ~0.5ms
- JSON parse: ~0.5ms
- **Total**: ~2-5ms

### 2. Cache Storage

**Flow**:
```typescript
async function storeInCache(
  filePath: string,
  provider: string,
  model: string,
  template: string,
  result: ClassificationResult
): Promise<void> {
  // 1. Calculate SHA256
  const content = await fs.readFile(filePath);
  const sha256 = crypto.createHash('sha256').update(content).digest('hex');
  
  // 2. Build cache key
  const cacheKey = `${sha256}_${provider}_${model}_${template}`;
  
  // 3. Prepare cache entry
  const cacheEntry = {
    version: '1.0',
    cache_key: cacheKey,
    file_sha256: sha256,
    provider,
    model,
    template,
    created_at: new Date().toISOString(),
    last_accessed: new Date().toISOString(),
    hit_count: 0,
    expires_at: new Date(Date.now() + config.cache.ttl * 1000).toISOString(),
    result: result,
    compressed: config.cache.compression
  };
  
  // 4. Compress if enabled
  if (config.cache.compression) {
    cacheEntry.result = await compressResult(cacheEntry.result);
  }
  
  // 5. Write to cache
  const cachePath = path.join(CACHE_DIR, 'results', `${cacheKey}.json`);
  await fs.writeFile(cachePath, JSON.stringify(cacheEntry, null, 2));
  
  // 6. Update index
  await updateCacheIndex(cacheKey, cacheEntry);
  
  // 7. Update stats
  await updateCacheStats(cacheKey, 'store');
}
```

**Performance**:
- Disk write: ~5-10ms
- Compression (optional): ~2-5ms
- **Total**: ~10-15ms

### 3. Cache Invalidation

**By File (all models)**:
```typescript
async function invalidateByFile(filePath: string): Promise<number> {
  const content = await fs.readFile(filePath);
  const sha256 = crypto.createHash('sha256').update(content).digest('hex');
  
  // Find all cache entries for this file
  const index = await loadCacheIndex();
  const toDelete = Object.keys(index.entries).filter(key => 
    key.startsWith(sha256)
  );
  
  // Delete each entry
  for (const key of toDelete) {
    const cachePath = path.join(CACHE_DIR, 'results', `${key}.json`);
    await fs.unlink(cachePath);
    delete index.entries[key];
  }
  
  await saveCacheIndex(index);
  return toDelete.length;
}
```

**By Model**:
```typescript
async function invalidateByModel(model: string): Promise<number> {
  const index = await loadCacheIndex();
  const toDelete = Object.keys(index.entries).filter(key => 
    index.entries[key].model === model
  );
  
  for (const key of toDelete) {
    await fs.unlink(path.join(CACHE_DIR, 'results', `${key}.json`));
    delete index.entries[key];
  }
  
  await saveCacheIndex(index);
  return toDelete.length;
}
```

**By Age**:
```typescript
async function invalidateOlderThan(days: number): Promise<number> {
  const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
  const index = await loadCacheIndex();
  
  const toDelete = Object.keys(index.entries).filter(key => {
    const entry = index.entries[key];
    return new Date(entry.last_accessed).getTime() < cutoff;
  });
  
  for (const key of toDelete) {
    await fs.unlink(path.join(CACHE_DIR, 'results', `${key}.json`));
    delete index.entries[key];
  }
  
  await saveCacheIndex(index);
  return toDelete.length;
}
```

## Cache Storage Format

### Cached Result Entry

```json
{
  "version": "1.0",
  "cache_key": "a1b2c3d4e5f6..._deepseek_deepseek-chat_legal",
  "file_sha256": "a1b2c3d4e5f6...",
  "provider": "deepseek",
  "model": "deepseek-chat",
  "template": "legal",
  "created_at": "2025-01-26T10:30:00Z",
  "last_accessed": "2025-01-26T12:30:45Z",
  "hit_count": 5,
  "size_bytes": 38456,
  "compressed": true,
  "expires_at": "2025-02-25T10:30:00Z",
  
  "result": {
    "templateSelection": { /* ... */ },
    "classification": { /* ... */ },
    "graphStructure": { /* ... */ },
    "fulltextMetadata": { /* ... */ },
    "performance": { /* ... */ }
  }
}
```

## Cache Statistics

### Statistics Tracking

**File**: `.classify-cache/stats/cache-stats.json`

```json
{
  "version": "1.0",
  "last_updated": "2025-01-26T12:30:45Z",
  
  "overall": {
    "total_hits": 942,
    "total_misses": 292,
    "hit_rate": 0.763,
    "total_entries": 1234,
    "total_size_bytes": 47456789,
    "time_saved_seconds": 8280,
    "cost_saved_usd": 23.45
  },
  
  "by_provider": {
    "deepseek": {
      "entries": 856,
      "hits": 723,
      "misses": 133,
      "hit_rate": 0.844,
      "cost_saved_usd": 15.67
    },
    "openai": {
      "entries": 234,
      "hits": 145,
      "misses": 89,
      "hit_rate": 0.620,
      "cost_saved_usd": 5.23
    }
  },
  
  "by_template": {
    "legal": {
      "entries": 456,
      "hits": 382,
      "misses": 74,
      "hit_rate": 0.838
    },
    "financial": {
      "entries": 334,
      "hits": 256,
      "misses": 78,
      "hit_rate": 0.767
    }
  },
  
  "timeline": {
    "daily": [
      {
        "date": "2025-01-26",
        "hits": 145,
        "misses": 23,
        "cost_saved_usd": 2.34
      }
    ],
    "hourly": [
      {
        "hour": "2025-01-26T12:00:00Z",
        "hits": 12,
        "misses": 2
      }
    ]
  }
}
```

### Viewing Statistics

```bash
# View cache stats
npx @hivellm/classify cache-stats

# Output:
Cache Statistics
================

Overall:
  Total Entries: 1,234
  Cache Size: 45.2 MB / 1000 MB (4.5%)
  Hit Rate: 76.3% (942 hits, 292 misses)
  
Performance Savings:
  Time Saved: 2.3 hours
  Cost Saved: $23.45
  
By Provider:
  deepseek: 856 entries (84.4% hit rate) - $15.67 saved
  openai: 234 entries (62.0% hit rate) - $5.23 saved
  groq: 144 entries (91.2% hit rate) - $2.55 saved
  
By Template:
  legal: 456 entries (83.8% hit rate)
  financial: 334 entries (76.7% hit rate)
  engineering: 223 entries (68.9% hit rate)
  hr: 221 entries (72.4% hit rate)
  
Oldest Entry: 87 days ago
Newest Entry: 2 minutes ago
```

## Performance Analysis

### Cache Hit vs Miss

| Metric | Cache Hit | Cache Miss | Improvement |
|--------|-----------|------------|-------------|
| **Time** | 2-5ms | 2000-3000ms | **400-600x faster** |
| **Cost** | $0.00 | $0.0024-0.0042 | **100% savings** |
| **Network** | 0 KB | 2-10 KB | **100% savings** |
| **LLM Calls** | 0 | 2 | **100% savings** |

### Cache Warm-up

**Initial Processing** (Cold Start):
```
Day 1: Process 1000 documents
  - Cache hits: 0 (0%)
  - Time: ~40 minutes
  - Cost: ~$2.40
```

**Subsequent Processing** (Warm Cache):
```
Day 2: Process same 1000 documents
  - Cache hits: 1000 (100%)
  - Time: ~5 seconds
  - Cost: $0.00
  - Savings: 99.8% time, 100% cost
```

**Typical Production** (70% cache hit rate):
```
Process 1000 documents
  - Cache hits: 700 (70%)
  - Cache misses: 300 (30%)
  - Time: ~12 minutes (70% savings)
  - Cost: ~$0.72 (70% savings)
```

## Multi-System Shared Cache

### Centralized Cache Architecture

```
┌─────────────┐       ┌─────────────┐
│  System A   │       │  System B   │
│  (API)      │       │  (Batch)    │
└──────┬──────┘       └──────┬──────┘
       │                     │
       │   Both systems      │
       │   point to same     │
       │   cache directory   │
       │                     │
       └──────┬──────────────┘
              │
              ▼
    ┌──────────────────┐
    │  Shared Cache    │
    │  /shared/cache/  │
    └──────────────────┘
```

### Configuration

**System A**:
```bash
export CLASSIFY_CACHE_DIR=/shared/classify-cache
npx @hivellm/classify batch ./docs-a
```

**System B**:
```bash
export CLASSIFY_CACHE_DIR=/shared/classify-cache
npx @hivellm/classify batch ./docs-b
# Reuses System A's cache!
```

### Concurrent Access Handling

```typescript
import * as fs from 'fs-extra';
import lockfile from 'proper-lockfile';

async function withCacheLock<T>(
  cacheKey: string,
  operation: () => Promise<T>
): Promise<T> {
  const lockPath = path.join(CACHE_DIR, 'locks', `${cacheKey}.lock`);
  
  // Acquire lock
  const release = await lockfile.lock(lockPath, {
    retries: {
      retries: 5,
      minTimeout: 100,
      maxTimeout: 2000
    }
  });
  
  try {
    // Perform operation
    return await operation();
  } finally {
    // Release lock
    await release();
  }
}

// Usage
const result = await withCacheLock(cacheKey, async () => {
  // Read, modify, or write cache
  return await getCachedResult(cacheKey);
});
```

## Cache Cleanup

### Automatic Cleanup

**Configuration**:
```json
{
  "cache": {
    "cleanup": {
      "enabled": true,
      "older_than_days": 90,
      "max_entries": 10000,
      "schedule": "daily",
      "keep_high_hit_count": true,
      "min_hit_count_to_keep": 5
    }
  }
}
```

**Cleanup Logic**:
```typescript
async function cleanupCache() {
  const index = await loadCacheIndex();
  const now = Date.now();
  const cutoffTime = now - (config.cache.cleanup.older_than_days * 24 * 60 * 60 * 1000);
  
  let deleted = 0;
  
  for (const [key, entry] of Object.entries(index.entries)) {
    // Skip if accessed recently
    if (new Date(entry.last_accessed).getTime() > cutoffTime) {
      continue;
    }
    
    // Keep entries with high hit count
    if (config.cache.cleanup.keep_high_hit_count && 
        entry.hit_count >= config.cache.cleanup.min_hit_count_to_keep) {
      continue;
    }
    
    // Delete entry
    await fs.unlink(path.join(CACHE_DIR, 'results', `${key}.json`));
    delete index.entries[key];
    deleted++;
  }
  
  // If still over max_entries, delete least recently used
  const entries = Object.entries(index.entries)
    .sort((a, b) => 
      new Date(a[1].last_accessed).getTime() - 
      new Date(b[1].last_accessed).getTime()
    );
  
  while (entries.length > config.cache.cleanup.max_entries) {
    const [key] = entries.shift()!;
    await fs.unlink(path.join(CACHE_DIR, 'results', `${key}.json`));
    delete index.entries[key];
    deleted++;
  }
  
  await saveCacheIndex(index);
  console.log(`Cleanup complete: deleted ${deleted} entries`);
}
```

### Manual Cleanup

```bash
# Clear entire cache
npx @hivellm/classify clear-cache --all

# Clear old entries (90+ days)
npx @hivellm/classify clear-cache --older-than 90

# Clear specific model
npx @hivellm/classify clear-cache --model gpt-4o-mini

# Clear specific template
npx @hivellm/classify clear-cache --template legal

# Clear specific file (all models/templates)
npx @hivellm/classify clear-cache contract.pdf

# Clear low-confidence results
npx @hivellm/classify clear-cache --confidence-below 0.7
```

## Cache Compression

### Gzip Compression

**Enable in config**:
```json
{
  "cache": {
    "compression": true
  }
}
```

**Implementation**:
```typescript
import * as zlib from 'zlib';
import { promisify } from 'util';

const gzipAsync = promisify(zlib.gzip);
const gunzipAsync = promisify(zlib.gunzip);

async function compressResult(result: ClassificationResult): Promise<Buffer> {
  const json = JSON.stringify(result);
  return await gzipAsync(Buffer.from(json, 'utf8'));
}

async function decompressResult(compressed: Buffer): Promise<ClassificationResult> {
  const decompressed = await gunzipAsync(compressed);
  return JSON.parse(decompressed.toString('utf8'));
}
```

**Savings**:
- Original size: ~35-40 KB per entry
- Compressed size: ~8-12 KB per entry
- **Compression ratio**: 70-75%

## Cache Strategy Configuration

### Advanced Cache Strategy

```json
{
  "cache_strategy": {
    "include_in_key": ["file_sha256", "provider", "model", "template"],
    "cache_failures": false,
    "cache_low_confidence": false,
    "min_confidence_to_cache": 0.7,
    "cache_partial_results": false,
    "invalidate_on_template_update": true,
    "similarity_threshold": 0.95
  }
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `include_in_key` | string[] | See above | Fields to include in cache key |
| `cache_failures` | boolean | `false` | Cache failed classifications |
| `cache_low_confidence` | boolean | `false` | Cache low-confidence results |
| `min_confidence_to_cache` | number | `0.7` | Min confidence to cache |
| `cache_partial_results` | boolean | `false` | Cache partial results |
| `invalidate_on_template_update` | boolean | `true` | Invalidate when template changes |

## Monitoring Cache Health

### Health Checks

```bash
# Check cache health
npx @hivellm/classify cache-health

# Output:
Cache Health Report
===================

Status: ✓ Healthy

Metrics:
  - Hit Rate: 76.3% (target: >70%) ✓
  - Size: 45.2 MB / 1000 MB (4.5%) ✓
  - Entries: 1,234 / 10,000 (12.3%) ✓
  - Oldest Entry: 87 days ⚠ (consider cleanup)
  
Performance:
  - Avg Lookup Time: 3.2ms ✓
  - Avg Store Time: 12.1ms ✓
  
Recommendations:
  ⚠ Consider running cleanup (87 days is old)
  ✓ Hit rate is excellent
  ✓ Plenty of space available
```

### Metrics Export

```bash
# Export to Prometheus format
npx @hivellm/classify cache-metrics --format prometheus

# Output:
classify_cache_hits_total 942
classify_cache_misses_total 292
classify_cache_hit_rate 0.763
classify_cache_size_bytes 47456789
classify_cache_entries_total 1234
classify_cache_time_saved_seconds 8280
classify_cache_cost_saved_usd 23.45
```

## Best Practices

1. **Enable Caching**: Always use cache in production
2. **Shared Cache**: Use centralized cache for multi-system deployments
3. **Regular Cleanup**: Schedule cleanup to prevent unbounded growth
4. **Monitor Hit Rate**: Target 70%+ hit rate after warm-up
5. **Compression**: Enable compression to save disk space
6. **TTL Configuration**: Balance freshness vs. cache effectiveness
7. **Backup Cache**: Consider backing up cache for disaster recovery

## Troubleshooting

### Low Hit Rate (<50%)

**Causes**:
- Files are frequently modified (SHA256 changes)
- Different models/templates used
- Cache too small (max_entries reached)

**Solutions**:
- Increase `max_entries`
- Increase `ttl`
- Use consistent model/template

### Cache Growing Too Large

**Solutions**:
```bash
# Enable compression
export CLASSIFY_CACHE_COMPRESSION=true

# Run cleanup
npx @hivellm/classify clear-cache --older-than 60

# Reduce TTL
export CLASSIFY_CACHE_TTL=1296000  # 15 days instead of 30
```

### Slow Cache Lookups

**Causes**:
- Large index file
- Slow disk I/O
- Too many entries

**Solutions**:
- Move cache to faster disk (SSD)
- Reduce `max_entries`
- Use compression

---

**Congratulations!** You've completed the Classify CLI documentation. For implementation details, see the source code or contact the development team.

