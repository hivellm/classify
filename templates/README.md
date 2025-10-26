# Classification Templates

This directory contains all classification templates used by the Classify CLI for document classification.

## 📋 Template Overview

| Template | Priority | Domain | Use Case |
|----------|----------|--------|----------|
| **legal** | 95 | Legal/Contracts | Contracts, agreements, NDAs, legal opinions |
| **financial** | 92 | Finance | Financial statements, budgets, invoices |
| **accounting** | 90 | Accounting | Ledgers, journals, reconciliations |
| **hr** | 88 | Human Resources | Employment contracts, policies, reviews |
| **investor_relations** | 87 | Investor Relations | Earnings reports, investor presentations |
| **compliance** | 86 | Compliance/Audit | Compliance reports, audits, certifications |
| **engineering** | 85 | Engineering | Technical specs, architecture, API docs |
| **strategic** | 84 | Strategy | Strategic plans, business plans, analysis |
| **sales** | 83 | Sales | Proposals, quotes, pipeline reports |
| **marketing** | 82 | Marketing | Campaigns, analytics, content |
| **product** | 81 | Product | PRDs, roadmaps, requirements |
| **operations** | 80 | Operations | SOPs, processes, workflows |
| **customer_support** | 78 | Support | Tickets, FAQs, knowledge base |
| **base** | 50 | General | Fallback for unclassified documents |

## 🎯 Template Selection Process

The Classify CLI uses an intelligent LLM-based selection process:

1. **Document Analysis**: The LLM analyzes the document title and content
2. **Indicator Matching**: Compares document against template `key_indicators`
3. **Priority Ranking**: Higher priority templates are more specialized
4. **Confidence Scoring**: Returns confidence score (0-1)
5. **Fallback**: Uses `base` template if confidence < 70%

### Selection Index

The `index.json` file provides the LLM with:
- Complete template descriptions
- Key indicators for each domain
- Example documents
- Selection guidelines
- Decision process steps

## 📁 Template Structure

Each template follows the `classify-template-v1.json` schema and includes:

### Metadata
```json
{
  "name": "template_name",
  "display_name": "Human-readable name",
  "description": "What this template is for",
  "domains": ["domain1", "domain2"],
  "priority": 85,
  "indicators": ["keyword1", "keyword2", ...],
  "document_types": ["type1", "type2", ...],
  "example_titles": ["Example 1", "Example 2", ...]
}
```

### LLM Configuration
```json
{
  "provider": "deepseek",
  "model": "deepseek-chat",
  "temperature": 0.1,
  "max_tokens": 2000,
  "system_prompt": "Expert prompt for extraction",
  "fallback_models": ["gpt-4o-mini", "gemini-2.0-flash"]
}
```

### Entity Definitions
Defines entities to extract (e.g., Person, Organization, Contract, etc.)

### Relationship Definitions
Defines relationships between entities (e.g., SIGNS, EMPLOYS, OWNS)

### Graph Schema
Cypher-compatible graph structure for Nexus/Neo4j

### Fulltext Schema
Field definitions for full-text search engines (Lexum, Elasticsearch)

### Extraction Rules
Specific LLM prompts and patterns for data extraction

### Validation Rules
Field validation rules for extracted data

## 🚀 Usage

### CLI Usage
```bash
# Let LLM choose template automatically
npx @hivellm/classify document contract.pdf

# Force specific template
npx @hivellm/classify document contract.pdf --template legal

# Show template selection reasoning
npx @hivellm/classify document contract.pdf --explain
```

### Programmatic Usage
```typescript
import { ClassifyClient } from '@hivellm/classify';

const client = new ClassifyClient({
  model: 'deepseek-chat',
  cacheDir: '.classify-cache'
});

// Automatic template selection
const result = await client.classify('document.pdf');
console.log(`Selected template: ${result.template.name}`);
console.log(`Confidence: ${result.template.confidence}`);
```

## 📝 Creating Custom Templates

To create a new template:

1. **Copy base template**: `cp base.json my_template.json`
2. **Update metadata**: Set name, description, indicators
3. **Define entities**: Add domain-specific entities
4. **Define relationships**: Add entity relationships
5. **Configure LLM**: Set appropriate prompts and temperature
6. **Add to index**: Update `index.json` with new template
7. **Validate**: Run `npx @hivellm/classify validate-template my_template.json`

### Template Best Practices

✅ **Do:**
- Use descriptive, domain-specific indicators
- Set appropriate priority (50-100)
- Include clear example titles
- Use low temperature (0.0-0.3) for factual extraction
- Provide specific system prompts
- Include fallback models

❌ **Don't:**
- Use generic indicators (document, report, etc.)
- Set priority > 100 or < 50
- Use high temperature for structured extraction
- Forget to validate against schema

## 🔍 Template Validation

Validate template against JSON Schema:

```bash
# Validate single template
npx @hivellm/classify validate-template templates/legal.json

# Validate all templates
npx @hivellm/classify validate-templates templates/*.json

# Test template selection
npx @hivellm/classify test-selection document.pdf --show-all-scores
```

## 📊 Template Performance

Track template performance:

```bash
# Show template usage stats
npx @hivellm/classify stats

# Example output:
# Template       Uses  Avg Confidence  Cache Hit Rate
# legal          245   0.92           87%
# financial      189   0.88           91%
# engineering    156   0.85           82%
```

## 🔄 Template Updates

Templates are versioned using semantic versioning:

- **Major**: Breaking changes to entity/relationship structure
- **Minor**: New entities or relationships added
- **Patch**: Bug fixes, improved prompts, better indicators

Current version: **v1.0**

## 📚 Additional Resources

- [Template Specification](../docs/TEMPLATE_SPECIFICATION.md)
- [API Reference](../docs/API_REFERENCE.md)
- [Integration Guide](../docs/INTEGRATION.md)
- [JSON Schema](../schemas/classify-template-v1.json)

## 🤝 Contributing

To contribute new templates:

1. Create template following the schema
2. Add comprehensive test cases
3. Update `index.json`
4. Submit PR with example documents
5. Document domain expertise required

## 📄 License

All templates are part of the HiveLLM Classify project and licensed under MIT.

