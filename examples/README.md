# Classify Examples

This directory contains example scripts demonstrating how to use Classify with Transmutation Lite for document conversion and classification.

## Prerequisites

1. Install dependencies:
```bash
npm install
```

2. Set your API key:
```bash
export DEEPSEEK_API_KEY=sk-your-key-here
```

## Examples

### 1. Convert and Classify Single Document

Convert a document to Markdown and then classify it.

```bash
npx tsx examples/convert-and-classify.ts path/to/document.pdf
```

**What it does:**
- Converts the document to Markdown using Transmutation Lite
- Classifies the Markdown content using DeepSeek
- Displays classification results (domain, type, confidence)
- Shows graph structure (Cypher) and fulltext metadata

### 2. Batch Convert and Classify

Process an entire directory of documents.

```bash
npx tsx examples/batch-convert-classify.ts path/to/documents
```

**What it does:**
- Recursively finds all supported documents
- Converts each to Markdown
- Classifies each document
- Shows progress and statistics
- Groups results by domain

## Supported Document Formats

- PDF (`.pdf`)
- Word Documents (`.docx`)
- Excel Spreadsheets (`.xlsx`)
- PowerPoint Presentations (`.pptx`)
- HTML (`.html`, `.htm`)
- Plain Text (`.txt`)

## Integration in Your Code

```typescript
import { convert } from '@hivellm/transmutation-lite';
import { ClassifyClient } from '@hivellm/classify';

// Convert document
const conversionResult = await convert('./document.pdf');

// Classify
const classifier = new ClassifyClient({
  provider: 'deepseek',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const result = await classifier.classifyText(conversionResult.markdown);

console.log(result.classification.domain); // e.g., "legal"
console.log(result.classification.doc_type); // e.g., "contract"
```

## Performance Tips

1. **Enable Caching**: Classification results are cached by SHA256 hash
2. **Use Compression**: Enable prompt compression for 50% token reduction
3. **Batch Processing**: Use parallel processing for multiple documents
4. **Limit Pages**: Use `maxPages` option to process only first N pages

## See Also

- [Classify README](../README.md)
- [Transmutation Lite README](../../transmutation-lite/README.md)

