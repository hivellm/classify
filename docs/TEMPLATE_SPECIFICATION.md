# Classify CLI - Template Specification

**Version:** 1.0  
**Last Updated:** 2025-01-26

## Overview

Templates define how documents should be classified, what entities to extract, and how to structure the output for graph databases and full-text search. Each template includes metadata for LLM-based automatic selection.

## Template Structure

### Complete Template Schema

```json
{
  "$schema": "https://hivellm.org/schemas/classify-template-v1.json",
  "version": "1.0",
  
  "metadata": {
    "name": "legal",
    "display_name": "Legal Documents",
    "description": "Classification template for legal documents including contracts, laws, regulations, and cases",
    "domains": ["legal", "compliance"],
    "priority": 100,
    
    "indicators": [
      "agreement", "contract", "parties", "whereas",
      "jurisdiction", "law", "regulation", "clause"
    ],
    
    "document_types": [
      "contract", "law", "regulation", "case",
      "legal_opinion", "memorandum"
    ],
    
    "example_titles": [
      "Service Agreement", "Employment Contract",
      "Privacy Policy", "Terms and Conditions",
      "Case Law Summary"
    ],
    
    "use_cases": [
      "Contract analysis and party extraction",
      "Legal compliance checking",
      "Case law classification",
      "Regulatory document indexing"
    ]
  },
  
  "llm_config": {
    "provider": "deepseek",
    "model": "deepseek-chat",
    "temperature": 0.1,
    "max_tokens": 2000,
    "system_prompt": "You are an expert legal document classifier...",
    "fallback_models": [
      "gpt-4o-mini",
      "llama-3.1-8b-instant",
      "gemini-2.0-flash"
    ]
  },
  
  "document_types": [ /* ... */ ],
  "entity_definitions": [ /* ... */ ],
  "relationship_definitions": [ /* ... */ ],
  "graph_schema": { /* ... */ },
  "fulltext_schema": { /* ... */ },
  "extraction_rules": [ /* ... */ ],
  "validation_rules": [ /* ... */ ]
}
```

## Metadata Section

**Purpose**: Used by LLM for automatic template selection.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Unique identifier (lowercase, no spaces) |
| `display_name` | string | Yes | Human-readable name |
| `description` | string | Yes | Detailed description of template purpose |
| `domains` | string[] | Yes | List of domains this template covers |
| `priority` | number | No | Selection priority (higher = preferred), default: 50 |
| `indicators` | string[] | Yes | Keywords that suggest this template |
| `document_types` | string[] | Yes | Types of documents this handles |
| `example_titles` | string[] | No | Example document titles |
| `use_cases` | string[] | No | Common use cases |

### Example

```json
{
  "metadata": {
    "name": "financial",
    "display_name": "Financial Documents",
    "description": "Financial documents including invoices, receipts, reports, and transactions",
    "domains": ["financial", "accounting"],
    "priority": 90,
    "indicators": [
      "invoice", "payment", "amount", "vendor",
      "transaction", "receipt", "balance", "account"
    ],
    "document_types": [
      "invoice", "receipt", "financial_report",
      "transaction", "statement", "budget"
    ],
    "example_titles": [
      "Invoice #12345", "Quarterly Financial Report",
      "Bank Statement", "Expense Receipt"
    ],
    "use_cases": [
      "Invoice processing and vendor extraction",
      "Financial report analysis",
      "Transaction categorization",
      "Expense tracking"
    ]
  }
}
```

## LLM Configuration

**Purpose**: Define LLM behavior for classification.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `provider` | string | No | Default provider (deepseek, openai, etc.) |
| `model` | string | No | Default model for this template |
| `temperature` | number | No | Temperature (0.0-1.0), default: 0.1 |
| `max_tokens` | number | No | Max output tokens, default: 2000 |
| `system_prompt` | string | Yes | System prompt for classification |
| `fallback_models` | string[] | No | Fallback models if primary fails |

### Example

```json
{
  "llm_config": {
    "provider": "deepseek",
    "model": "deepseek-chat",
    "temperature": 0.1,
    "max_tokens": 2000,
    "system_prompt": "You are an expert financial document classifier. Extract invoice details, vendor information, amounts, and payment terms with high accuracy. Always identify currency and payment methods.",
    "fallback_models": [
      "gpt-4o-mini",
      "claude-3-5-haiku-latest"
    ]
  }
}
```

## Document Types

**Purpose**: Define supported document types and their characteristics.

```json
{
  "document_types": [
    {
      "type": "invoice",
      "display_name": "Invoice",
      "description": "Commercial invoice for goods or services",
      "indicators": ["invoice", "bill", "amount due", "vendor"],
      "required_entities": ["vendor", "amount", "date", "invoice_number"],
      "optional_entities": ["purchaser", "payment_terms", "due_date"],
      "priority": 100
    },
    {
      "type": "receipt",
      "display_name": "Receipt",
      "description": "Payment receipt confirmation",
      "indicators": ["receipt", "paid", "confirmation"],
      "required_entities": ["vendor", "amount", "date"],
      "optional_entities": ["payment_method", "transaction_id"],
      "priority": 80
    }
  ]
}
```

## Entity Definitions

**Purpose**: Define what entities to extract from documents.

```json
{
  "entity_definitions": [
    {
      "type": "Party",
      "description": "Legal or financial entity (person or organization)",
      "properties": {
        "name": { "type": "string", "required": true },
        "role": { "type": "string", "required": true },
        "type": { "type": "enum", "values": ["person", "company", "organization"] },
        "identifier": { "type": "string", "required": false }
      },
      "extraction_methods": ["ner", "pattern", "llm"],
      "validation": {
        "name": "^[A-Za-z0-9\\s,.-]+$",
        "min_length": 2
      }
    },
    {
      "type": "Date",
      "description": "Important dates in the document",
      "properties": {
        "date": { "type": "date", "required": true },
        "date_type": { 
          "type": "enum", 
          "values": ["effective", "expiration", "signed", "due"],
          "required": true
        }
      },
      "extraction_methods": ["pattern", "llm"],
      "patterns": [
        "\\d{4}-\\d{2}-\\d{2}",
        "\\d{2}/\\d{2}/\\d{4}",
        "(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\s+\\d{1,2},\\s+\\d{4}"
      ]
    },
    {
      "type": "Amount",
      "description": "Monetary amounts",
      "properties": {
        "value": { "type": "number", "required": true },
        "currency": { "type": "string", "required": true },
        "amount_type": {
          "type": "enum",
          "values": ["total", "subtotal", "tax", "fee"],
          "required": false
        }
      },
      "extraction_methods": ["pattern", "llm"],
      "patterns": [
        "\\$[0-9,]+(?:\\.[0-9]{2})?",
        "€[0-9,]+(?:\\.[0-9]{2})?",
        "[0-9,]+(?:\\.[0-9]{2})?\\s*(?:USD|EUR|GBP)"
      ]
    }
  ]
}
```

## Relationship Definitions

**Purpose**: Define relationships between entities.

```json
{
  "relationship_definitions": [
    {
      "type": "PARTY_TO",
      "description": "Entity is a party to the document",
      "source": "Document",
      "target": ["Party"],
      "properties": {
        "role": {
          "type": "enum",
          "values": ["provider", "client", "witness", "signatory"],
          "required": true
        },
        "date_signed": { "type": "date", "required": false }
      },
      "extraction_methods": ["llm", "heuristic"]
    },
    {
      "type": "REFERENCES",
      "description": "Document references another document or law",
      "source": "Document",
      "target": ["Document", "Law", "Regulation"],
      "properties": {
        "context": { "type": "string", "required": false },
        "page_number": { "type": "number", "required": false }
      },
      "extraction_methods": ["pattern", "llm"],
      "patterns": [
        "pursuant to",
        "in accordance with",
        "as per",
        "reference to"
      ]
    },
    {
      "type": "HAS_AMOUNT",
      "description": "Document has associated monetary amount",
      "source": "Document",
      "target": ["Amount"],
      "properties": {
        "amount_type": { "type": "string", "required": true }
      },
      "extraction_methods": ["llm"]
    }
  ]
}
```

## Graph Schema

**Purpose**: Define graph structure for Nexus.

```json
{
  "graph_schema": {
    "nodes": [
      {
        "type": "LegalDocument",
        "labels": ["Document", "LegalDocument"],
        "description": "Legal document node in graph",
        "required_properties": [
          "id", "title", "doc_type", "domain", "created_at"
        ],
        "optional_properties": [
          "jurisdiction", "effective_date", "expiration_date",
          "status", "parties", "clauses"
        ],
        "indexes": [
          { "property": "id", "type": "unique" },
          { "property": "doc_type", "type": "index" },
          { "property": "jurisdiction", "type": "index" }
        ]
      },
      {
        "type": "Party",
        "labels": ["Entity", "Party"],
        "description": "Party entity (person or organization)",
        "required_properties": ["name", "type"],
        "optional_properties": ["role", "identifier", "contact"],
        "indexes": [
          { "property": "name", "type": "fulltext" }
        ]
      },
      {
        "type": "Clause",
        "labels": ["Content", "Clause"],
        "description": "Contract clause or section",
        "required_properties": ["clause_type", "text"],
        "optional_properties": ["section_number", "importance"],
        "indexes": [
          { "property": "clause_type", "type": "index" }
        ]
      }
    ],
    
    "relationships": [
      {
        "type": "PARTY_TO",
        "description": "Party is involved in document",
        "source": "LegalDocument",
        "target": "Party",
        "properties": ["role", "date_signed"],
        "required": ["role"]
      },
      {
        "type": "HAS_CLAUSE",
        "description": "Document contains clause",
        "source": "LegalDocument",
        "target": "Clause",
        "properties": ["position", "mandatory"],
        "required": []
      },
      {
        "type": "REFERENCES",
        "description": "Document references another entity",
        "source": "LegalDocument",
        "target": ["LegalDocument", "Law"],
        "properties": ["context", "page"],
        "required": []
      }
    ],
    
    "constraints": [
      "Document id must be unique",
      "Party name must not be empty",
      "Effective date must be before expiration date"
    ]
  }
}
```

## Full-text Schema

**Purpose**: Define metadata for full-text search indexing.

```json
{
  "fulltext_schema": {
    "required_fields": [
      "title", "domain", "doc_type", "created_at"
    ],
    
    "extracted_fields": [
      {
        "name": "parties",
        "type": "array",
        "description": "List of parties involved",
        "extraction_method": "ner",
        "index": true
      },
      {
        "name": "effective_date",
        "type": "date",
        "description": "Document effective date",
        "extraction_method": "pattern",
        "patterns": ["\\d{4}-\\d{2}-\\d{2}"],
        "index": true
      },
      {
        "name": "jurisdiction",
        "type": "string",
        "description": "Legal jurisdiction",
        "extraction_method": "llm",
        "index": true
      },
      {
        "name": "contract_value",
        "type": "number",
        "description": "Total contract value",
        "extraction_method": "pattern",
        "patterns": ["\\$[0-9,]+"],
        "index": false
      }
    ],
    
    "keyword_extraction": {
      "enabled": true,
      "method": "tfidf",
      "min_frequency": 2,
      "max_keywords": 20,
      "exclude_stopwords": true,
      "preserve_entities": true
    },
    
    "categories": [
      "legal", "contract", "agreement",
      "compliance", "regulatory"
    ],
    
    "summary": {
      "enabled": true,
      "method": "llm",
      "max_length": 500
    }
  }
}
```

## Extraction Rules

**Purpose**: Define how to extract information from documents.

```json
{
  "extraction_rules": [
    {
      "name": "extract_parties",
      "description": "Extract party names from contract",
      "method": "ner",
      "entity_types": ["PERSON", "ORG"],
      "confidence_threshold": 0.8,
      "post_processing": [
        "deduplicate",
        "normalize_whitespace",
        "title_case"
      ]
    },
    {
      "name": "extract_dates",
      "description": "Extract important dates",
      "method": "pattern",
      "patterns": [
        {
          "pattern": "effective date:?\\s*([\\w\\s,]+)",
          "type": "effective_date",
          "flags": "i"
        },
        {
          "pattern": "expiration date:?\\s*([\\w\\s,]+)",
          "type": "expiration_date",
          "flags": "i"
        }
      ],
      "date_parser": "flexible"
    },
    {
      "name": "extract_clauses",
      "description": "Extract contract clauses",
      "method": "section_detection",
      "patterns": [
        "Article \\d+",
        "Section \\d+\\.\\d+",
        "Clause \\d+"
      ],
      "include_content": true,
      "max_clause_length": 2000
    }
  ]
}
```

## Validation Rules

**Purpose**: Validate extracted data.

```json
{
  "validation_rules": [
    {
      "field": "parties",
      "rules": [
        { "type": "required", "message": "At least one party must be identified" },
        { "type": "min_length", "value": 1 },
        { "type": "max_length", "value": 10 }
      ]
    },
    {
      "field": "effective_date",
      "rules": [
        { "type": "required", "message": "Effective date is required" },
        { "type": "date_format", "format": "YYYY-MM-DD" },
        { "type": "date_range", "min": "1900-01-01", "max": "2100-12-31" }
      ]
    },
    {
      "field": "confidence",
      "rules": [
        { "type": "min_value", "value": 0.6, "message": "Confidence too low" }
      ]
    }
  ]
}
```

## Built-in Templates

### 1. Legal Template (`templates/legal.json`)

- **Domains**: legal, compliance
- **Document Types**: contract, law, regulation, case, legal_opinion
- **Key Entities**: Party, Clause, Law, Date, Jurisdiction
- **Use Cases**: Contract analysis, compliance checking, case law

### 2. Financial Template (`templates/financial.json`)

- **Domains**: financial, accounting
- **Document Types**: invoice, receipt, report, transaction, statement
- **Key Entities**: Vendor, Amount, Account, Transaction, PaymentMethod
- **Use Cases**: Invoice processing, financial reporting, expense tracking

### 3. HR Template (`templates/hr.json`)

- **Domains**: hr, recruitment
- **Document Types**: resume, policy, evaluation, job_description
- **Key Entities**: Person, Skill, Experience, Education, Certification
- **Use Cases**: Resume screening, policy management, performance reviews

### 4. Engineering Template (`templates/engineering.json`)

- **Domains**: engineering, technical
- **Document Types**: code, specification, design, documentation, api
- **Key Entities**: Function, Class, API, Dependency, Component
- **Use Cases**: Code documentation, API specs, system design

### 5. Base Template (`templates/base.json`)

- **Domains**: general
- **Document Types**: document, text, article
- **Key Entities**: Document, Entity, Date
- **Use Cases**: Generic documents, fallback template

## Custom Template Creation

### Step 1: Create Template File

```bash
cp templates/base.json templates/custom.json
```

### Step 2: Update Metadata

```json
{
  "metadata": {
    "name": "custom",
    "display_name": "Custom Documents",
    "description": "Your custom document type",
    "domains": ["custom"],
    "indicators": ["keyword1", "keyword2"],
    "document_types": ["custom_type"],
    "priority": 50
  }
}
```

### Step 3: Define Entities and Relationships

Customize `entity_definitions`, `relationship_definitions`, `graph_schema`, and `fulltext_schema`.

### Step 4: Validate Template

```bash
npx @hivellm/classify validate-template templates/custom.json
```

### Step 5: Test Template

```bash
npx @hivellm/classify document test.pdf --template templates/custom.json
```

## Template Inheritance (Future Feature)

```json
{
  "extends": "base.json",
  "metadata": {
    "name": "specialized_legal"
  },
  "entity_definitions": [
    // Inherits from base, adds new entities
  ]
}
```

## Best Practices

1. **Specific Indicators**: Use distinctive keywords for accurate template selection
2. **Clear Descriptions**: Help LLM understand when to use the template
3. **Comprehensive Entities**: Define all important entity types
4. **Validation Rules**: Ensure data quality with proper validation
5. **Test Thoroughly**: Test with real documents before production use
6. **Document Examples**: Include example documents for reference
7. **Version Control**: Track template changes over time

---

**Next**: See [LLM_PROVIDERS.md](./LLM_PROVIDERS.md) for LLM provider configuration.

