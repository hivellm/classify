# Classify Templates

This directory contains two sets of classification templates optimized for different use cases.

## Directory Structure

```
templates/
├── tiny/          ← DEFAULT (70-80% cost savings)
│   ├── index.json
│   ├── base.json
│   ├── legal.json
│   ├── financial.json
│   ├── engineering.json
│   ├── academic_paper.json
│   ├── accounting.json
│   ├── compliance.json
│   ├── customer_support.json
│   ├── hr.json
│   ├── investor_relations.json
│   ├── marketing.json
│   ├── operations.json
│   ├── product.json
│   ├── sales.json
│   ├── software_project.json
│   └── strategic.json
│
└── standard/      ← Full-featured templates
    ├── index.json
    ├── base.json
    ├── legal.json
    ├── financial.json
    ├── engineering.json
    └── ... (16 templates total)
```

## Template Sets

### 🚀 TINY Templates (DEFAULT)

**Location:** `templates/tiny/`  
**Schema:** `schemas/classify-template-tiny-v1.json`

**Characteristics:**
- ✅ **70-80% token savings** vs standard templates
- ✅ **$0.0006-$0.0008 per document**
- ✅ **400-500 max output tokens**
- ✅ **2-3 entities max**
- ✅ **1-2 relationships max**
- ✅ **Minimal extraction** (title, type, 1-2 key fields)

**Use When:**
- High-volume document processing
- Cost optimization is critical
- Basic classification is sufficient
- Fulltext search + simple graphs

**Templates:**
1. `base` (priority 100) - Default for general documents
2. `legal` (95) - Contracts, agreements
3. `academic_paper` (93) - Research papers
4. `financial` (92) - Financial statements
5. `accounting` (90) - Ledgers, journals
6. `software_project` (89) - Source code
7. `hr` (88) - HR documents
8. `investor_relations` (87) - Earnings reports
9. `compliance` (86) - Compliance docs
10. `engineering` (85) - Technical docs
11. `strategic` (84) - Strategic plans
12. `sales` (83) - Sales proposals
13. `marketing` (82) - Marketing campaigns
14. `product` (81) - Product requirements
15. `operations` (80) - SOPs
16. `customer_support` (78) - Support tickets

### 📊 STANDARD Templates

**Location:** `templates/standard/`  
**Schema:** `schemas/classify-template-v1.json`

**Characteristics:**
- ✅ **Full metadata extraction**
- ✅ **$0.0024-$0.0036 per document**
- ✅ **1500-4000 max output tokens**
- ✅ **4-10 entities**
- ✅ **4-10 relationships**
- ✅ **Comprehensive extraction**

**Use When:**
- Rich metadata is required
- Complex graph relationships needed
- Detailed entity extraction important
- Cost is not a primary concern

## Configuration

### Default (Tiny Templates)

The system uses TINY templates by default:

```typescript
// src/templates/template-loader.ts
private getDefaultTemplateDir(): string {
  return join(__dirname, '..', '..', 'templates', 'tiny');
}
```

### Use Standard Templates

To use standard templates, specify the directory:

```typescript
const loader = new TemplateLoader();
await loader.loadTemplates('templates/standard');
```

Or via CLI:

```bash
npx @hivellm/classify document file.pdf --templates-dir templates/standard
```

## Cost Comparison

**1000 documents, 70% cache hit:**

| Template Set | Cost | Savings |
|--------------|------|---------|
| **Tiny** | **$0.21** | **70-80%** |
| Standard | $0.72 | baseline |

**Per Document:**

| Template | Output Tokens | Cost |
|----------|--------------|------|
| **tiny/base** | **400** | **$0.0007** |
| **tiny/engineering** | **500** | **$0.0008** |
| standard/base | 1500 | $0.0024 |
| standard/engineering | 2000 | $0.0036 |

## Schema Differences

### Tiny Schema Limits

```json
{
  "entity_definitions": {
    "maxItems": 3
  },
  "relationship_definitions": {
    "maxItems": 2
  },
  "llm_config": {
    "max_tokens": {
      "minimum": 100,
      "maximum": 1000
    },
    "system_prompt": {
      "maxLength": 200
    }
  }
}
```

### Standard Schema

No strict limits - full flexibility for complex classification.

## Migration Guide

### From Standard to Tiny

1. Identify which templates you use most
2. Test with tiny versions
3. Verify output quality meets needs
4. Update configuration to use tiny directory
5. Monitor cost savings

### From Tiny to Standard

1. Update template directory config
2. Rebuild cache if needed
3. Expect 3-4x cost increase
4. Benefit from richer metadata

## Template Selection

Both tiny and standard use the same selection algorithm:

1. LLM analyzes document
2. Matches key indicators
3. Selects best template by priority
4. Falls back to `base` if uncertain

The difference is in **what gets extracted**, not **which template is selected**.

## Performance

### Tiny Templates
- **Extraction Time:** 1.5-2.0s
- **Output Size:** 200-500 tokens
- **Cache Size:** ~50% smaller

### Standard Templates
- **Extraction Time:** 2.2-2.8s
- **Output Size:** 800-2000 tokens
- **Cache Size:** Baseline

## Recommendations

**Use TINY if:**
- Processing > 1000 documents
- Budget is limited
- Basic classification sufficient
- Fulltext search is primary use case

**Use STANDARD if:**
- Need rich metadata
- Complex graph relationships required
- < 500 documents to process
- Cost is not a concern

---

**Default:** TINY templates (70-80% cost savings)  
**Last Updated:** 2025-10-27
