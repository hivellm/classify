# Classify Examples

Practical examples demonstrating the usage of Classify features.

## Available Examples

### `map-project-example.ts`

Maps an entire codebase with relationship analysis and generates Neo4j-compatible outputs.

**Usage:**
```bash
# Map current directory
npx tsx examples/map-project-example.ts

# Map specific project
npx tsx examples/map-project-example.ts /path/to/project

# Set API key
export DEEPSEEK_API_KEY=sk-...
npx tsx examples/map-project-example.ts ./my-project
```

**Features:**
- Analyzes project structure and metadata
- Extracts file relationships (imports/dependencies)
- Detects circular dependencies
- Generates multiple output formats:
  - `project-{name}-{date}.cypher` - Neo4j import script
  - `project-{name}-{date}.json` - Detailed statistics
  - `project-{name}-{date}-graph.csv` - Relationship graph

**Output Example:**
```
🚀 Mapping project: /path/to/project

📊 Project Information:
   Name: my-project
   Type: nodejs
   Primary Language: typescript
   
📈 Statistics:
   Files Analyzed: 42
   Total Entities: 156
   Import Dependencies: 98
   Processing Time: 23.45s
   Total Cost: $0.0328
   
🔗 Import Analysis:
   Internal: 67
   External: 31
   
✅ No circular dependencies detected

💾 Exporting results...
   ✅ Cypher: output/my-project-2025-01-27.cypher
   ✅ Summary: output/my-project-2025-01-27.json
   ✅ Graph CSV: output/my-project-2025-01-27-graph.csv
```

## Running Examples

All examples can be run with:
```bash
npx tsx examples/{example-name}.ts
```

## Requirements

- Node.js 18+
- Valid API key for LLM provider (DeepSeek recommended)
- `tsx` installed globally or via `npx`

## Cost Estimates

With TINY templates (default):
- Small project (<50 files): ~$0.03
- Medium project (100-500 files): ~$0.07-$0.35  
- Large project (1000+ files): ~$0.70+

Cache hits reduce costs to $0.00 for previously processed files.

