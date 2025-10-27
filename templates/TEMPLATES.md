# Classification Templates

## Overview

This directory contains 15 specialized templates for intelligent document classification. Each template defines entities, relationships, and classification fields for specific document types.

## Available Templates

### 1. **Software Project** (`software_project.json`)
**Priority:** 89 | **New in v0.3.0**

Specialized template for source code and software project artifacts.

**Best For:**
- Source code files (TypeScript, Python, Rust, etc.)
- Scripts and automation
- Code documentation and READMEs
- API specifications
- Configuration files (package.json, Cargo.toml)
- Test suites
- Build and deployment scripts

**Key Entities:**
- `Module` - Code modules, packages, namespaces
- `Function` - Functions, methods, procedures
- `Class` - Classes, interfaces, type definitions
- `Dependency` - External libraries and packages
- `API` - API endpoints and interfaces
- `Database` - Database models and schemas
- `Test` - Test suites and test cases
- `Script` - Build, deployment, automation scripts
- `Documentation` - README, guides, docs

**Key Relationships:**
- `IMPORTS` - Module imports another module
- `DEPENDS_ON` - Component depends on another
- `CALLS` - Function calls another function
- `IMPLEMENTS` - Class implements interface
- `CONTAINS` - Module contains classes/functions
- `TESTS` - Test validates component
- `DOCUMENTS` - Documentation describes component
- `ACCESSES` - Component accesses database
- `BUILDS` - Script builds artifact
- `EXPOSES` - Module exposes API

**Example Use Case:**
```typescript
// Input: AuthService.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  async login(email: string, password: string) {
    // Implementation
  }
}

// Output:
Entities:
- Module: AuthService (TypeScript)
- Dependency: bcrypt (password hashing)
- Dependency: jsonwebtoken (JWT tokens)
- Class: AuthService
- Function: login (async)

Relationships:
- AuthService IMPORTS bcrypt
- AuthService IMPORTS jsonwebtoken
- AuthService CONTAINS login
```

**Cypher Output:**
```cypher
MERGE (m:Module {name: 'AuthService', language: 'TypeScript'})
MERGE (d1:Dependency {name: 'bcrypt'})
MERGE (d2:Dependency {name: 'jsonwebtoken'})
MERGE (c:Class {name: 'AuthService'})
MERGE (f:Function {name: 'login', async: true})
MERGE (m)-[:IMPORTS]->(d1)
MERGE (m)-[:IMPORTS]->(d2)
MERGE (c)-[:CONTAINS]->(f)
```

---

### 2. **Academic Paper** (`academic_paper.json`)
**Priority:** 93 | **New in v0.3.0**

Specialized template for research papers and scientific articles.

**Best For:**
- Research papers
- Theses and dissertations
- Conference papers
- Journal articles
- Technical reports
- Preprints (arXiv)
- Review papers
- Case studies

**Key Entities:**
- `Author` - Paper authors and researchers
- `Institution` - Research institutions and universities
- `ResearchTopic` - Main research topics and fields
- `Methodology` - Research methodologies and approaches
- `Dataset` - Datasets used in research
- `Model` - ML models or theoretical models
- `Metric` - Evaluation metrics and performance measures
- `Finding` - Key research findings and contributions
- `Citation` - Referenced papers and works
- `Experiment` - Experimental setups and studies
- `Software` - Software tools and frameworks used
- `FundingSource` - Grants and funding agencies

**Key Relationships:**
- `AUTHORED_BY` - Paper authored by researcher
- `AFFILIATED_WITH` - Author affiliated with institution
- `USES_METHODOLOGY` - Research uses specific methodology
- `ANALYZES` - Study analyzes dataset
- `PROPOSES` - Paper proposes model or method
- `EVALUATES_WITH` - Model evaluated using metric
- `FINDS` - Research discovers finding
- `CITES` - Paper cites other work
- `BUILDS_ON` - Research builds on cited work
- `IMPLEMENTS` - Uses software implementation
- `FUNDED_BY` - Research funded by source
- `COMPARES_TO` - Model compared to baseline

**Example Use Case:**
```markdown
# Deep Learning for Image Classification

**Authors:** John Doe (Stanford), Jane Smith (MIT)

## Abstract
We propose a novel CNN architecture achieving 95.2% accuracy on ImageNet.

## Methodology
We trained ResNet-50 using PyTorch on ImageNet dataset.

## Results
Our model achieves 95.2% top-1 accuracy, outperforming baseline by 3.1%.
```

**Entities Extracted:**
- Author: John Doe (Stanford University)
- Author: Jane Smith (MIT)
- Institution: Stanford University
- Institution: MIT
- ResearchTopic: Deep Learning for Image Classification
- Model: ResNet-50 (CNN)
- Dataset: ImageNet
- Software: PyTorch
- Metric: top-1 accuracy (95.2%)

**Cypher Output:**
```cypher
MERGE (a1:Author {name: 'John Doe', affiliation: 'Stanford University'})
MERGE (a2:Author {name: 'Jane Smith', affiliation: 'MIT'})
MERGE (i1:Institution {name: 'Stanford University'})
MERGE (i2:Institution {name: 'MIT'})
MERGE (rt:ResearchTopic {name: 'Deep Learning for Image Classification', field: 'Computer Vision'})
MERGE (m:Model {name: 'ResNet-50', type: 'CNN'})
MERGE (d:Dataset {name: 'ImageNet'})
MERGE (s:Software {name: 'PyTorch'})
MERGE (met:Metric {name: 'top-1 accuracy', value: '95.2%', baseline: '92.1%'})
MERGE (rt)-[:AUTHORED_BY]->(a1)
MERGE (rt)-[:AUTHORED_BY]->(a2)
MERGE (a1)-[:AFFILIATED_WITH]->(i1)
MERGE (a2)-[:AFFILIATED_WITH]->(i2)
MERGE (rt)-[:PROPOSES]->(m)
MERGE (m)-[:ANALYZES]->(d)
MERGE (m)-[:IMPLEMENTS]->(s)
MERGE (m)-[:EVALUATES_WITH]->(met)
```

---

### 3. **Legal** (`legal.json`)
**Priority:** 95

For legal documents including contracts, agreements, NDAs, and regulatory filings.

---

### 4. **Financial** (`financial.json`)
**Priority:** 92

For financial statements, reports, budgets, invoices, and financial analysis.

---

### 5. **HR** (`hr.json`)
**Priority:** 88

For employment contracts, policies, performance reviews, and recruitment documents.

---

### 6. **Engineering** (`engineering.json`)
**Priority:** 85

For technical specifications, architecture documentation, and design documents.

---

### 7. **Accounting** (`accounting.json`)
**Priority:** 90

For ledgers, journal entries, reconciliations, and accounting reports.

---

### 8. **Strategic** (`strategic.json`)
**Priority:** 84

For strategic plans, business plans, and strategic initiatives.

---

### 9. **Investor Relations** (`investor_relations.json`)
**Priority:** 87

For earnings reports, investor presentations, and SEC filings.

---

### 10. **Marketing** (`marketing.json`)
**Priority:** 82

For campaigns, content, analytics, and marketing materials.

---

### 11. **Sales** (`sales.json`)
**Priority:** 83

For proposals, quotes, pipeline reports, and sales presentations.

---

### 12. **Operations** (`operations.json`)
**Priority:** 80

For SOPs, process documentation, and operational reports.

---

### 13. **Compliance** (`compliance.json`)
**Priority:** 86

For compliance reports, audits, and regulatory documents.

---

### 14. **Customer Support** (`customer_support.json`)
**Priority:** 78

For support tickets, knowledge base, and support reports.

---

### 15. **Product** (`product.json`)
**Priority:** 81

For product requirements, specifications, and roadmaps.

---

## Template Structure

Each template follows this structure:

```json
{
  "metadata": {
    "name": "template_name",
    "display_name": "Human Readable Name",
    "version": "1.0.0",
    "description": "Template description",
    "domains": ["domain1", "domain2"],
    "doc_types": ["type1", "type2"]
  },
  "llm_config": {
    "system_prompt": "Prompt for the LLM",
    "temperature": 0.2,
    "max_tokens": 4000
  },
  "entity_definitions": [],
  "relationship_definitions": [],
  "classification_fields": {},
  "examples": []
}
```

## Template Selection

The system automatically selects the best template based on:

1. **Key Indicators** - Matching document content with template keywords
2. **Priority** - Higher priority = more specialized
3. **Domain Expertise** - Matching document domain with template expertise
4. **Confidence Threshold** - If < 70%, uses base template

## Creating New Templates

1. Copy an existing template as a starting point
2. Update metadata with new name and description
3. Define entities relevant to your domain
4. Define relationships between entities
5. Add classification fields
6. Provide examples
7. Update `index.json` with new template metadata

## Usage

```typescript
import { ClassifyClient } from '@hivellm/classify';

const client = new ClassifyClient({
  apiKey: process.env.DEEPSEEK_API_KEY
});

// Auto-select template
const result = await client.classify('path/to/document.md');

// Force specific template
const result = await client.classify('path/to/code.ts', {
  templateId: 'software_project'
});
```

## Output Formats

### Cypher (Neo4j)
```cypher
MERGE (n:Entity {property: 'value'})
MERGE (n)-[:RELATIONSHIP]->(m)
```

### Full-Text Search Metadata
```json
{
  "title": "Document Title",
  "keywords": ["keyword1", "keyword2"],
  "summary": "AI-generated summary",
  "namedEntities": {
    "people": ["John Doe"],
    "organizations": ["TechCorp"]
  }
}
```

## License

MIT License - See LICENSE file for details.

