# Cursor-Agent Test Example

## Overview
This example demonstrates using the cursor-agent provider to map a real Rust project (vectorizer) with **zero API costs** and **100% local execution**.

⚠️ **IMPORTANT**: cursor-agent is a CLI tool that comes with Cursor IDE. It requires:
1. **Cursor IDE Pro** subscription
2. **Manual enablement** in Cursor settings
3. Authentication with your Cursor account

## Prerequisites

### 1. Install Cursor IDE
Download from: https://cursor.com

### 2. Enable cursor-agent
In Cursor IDE:
- Go to Settings → Features
- Enable "Agent Mode" or "CLI Tools"
- Restart Cursor

### 3. Verify installation
```bash
cursor-agent --version
```

If `cursor-agent` is not found:
- Check Cursor IDE settings
- Verify your subscription includes CLI access
- Contact Cursor support

### 4. Build the classify package
```bash
cd F:\Node\hivellm\classify
npm run build
```

## Running the Test

```bash
cd F:\Node\hivellm\classify
node samples/examples/test-cursor-agent.ts
```

## What it Does

1. **Creates ClassifyClient** with cursor-agent provider (no API key!)
2. **Scans vectorizer project** (limited to 100 files)
3. **Generates project mapping** with:
   - File categorization
   - Language detection
   - Project structure analysis
   - Cypher output for Neo4j/Nexus
4. **Saves results** to `samples/results/`

## Expected Output

```
🚀 Testing cursor-agent provider with ProjectMapper
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Client created with cursor-agent provider
   - Provider: cursor-agent (local execution)
   - Cost: $0.00
   - Privacy: 100% local

📁 Scanning: F:\Node\hivellm\vectorizer
⏳ This may take 10-30 minutes with cursor-agent...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ SUCCESS!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Statistics:
  - Files scanned: 100
  - Files categorized: 95
  - Duration: 15.32 minutes
  - Cost: $0.00 (cursor-agent is free!)

📁 File Categories:
  - source: 87
  - config: 8
  - documentation: 5

📊 Language Distribution:
  - Rust: 87
  - TOML: 8
  - Markdown: 5

💾 Cypher output saved to: samples/results/cursor-agent-vectorizer-100.cypher
💾 JSON summary saved to: samples/results/cursor-agent-vectorizer-100.json

✨ Test completed successfully!

💡 Next steps:
   - Load the Cypher into Neo4j/Nexus
   - Explore the project graph
   - Compare with API provider results
```

## Performance Expectations

| Metric | Estimated Value |
|--------|----------------|
| **Duration** | 10-30 minutes (100 files) |
| **Cost** | $0.00 (completely free) |
| **Privacy** | 100% local execution |
| **Network** | Minimal (cursor-agent initial handshake only) |

## Comparison with API Providers

### DeepSeek (API)
- **Duration**: ~2 minutes (100 files)
- **Cost**: ~$0.07
- **Privacy**: Data sent to API

### Cursor-Agent (Local)
- **Duration**: ~15 minutes (100 files)
- **Cost**: $0.00
- **Privacy**: 100% local

**Trade-off**: cursor-agent is **7-8x slower** but **completely free** and **private**.

## Troubleshooting

### Error: cursor-agent not found
```bash
npm install -g cursor-agent
cursor-agent login
```

### Error: Permission denied
Make sure cursor-agent is logged in and has permissions to access files.

### Slow Performance
This is expected! cursor-agent runs locally and processes each file individually. For large projects, consider:
- Using API providers (faster but costs money)
- Processing in batches
- Running overnight

## Use Cases

### When to use cursor-agent:
- ✅ Privacy-sensitive projects
- ✅ No budget for APIs
- ✅ Learning/experimentation
- ✅ Offline environments

### When to use API providers:
- ✅ Production workflows
- ✅ Time-sensitive tasks
- ✅ Large-scale projects (1000+ files)
- ✅ Cost is acceptable

## Files Generated

- `samples/results/cursor-agent-vectorizer-100.cypher` - Neo4j/Nexus import
- `samples/results/cursor-agent-vectorizer-100.json` - Statistics and metadata

## Next Steps

1. Load Cypher into your graph database
2. Explore the project structure
3. Compare results with API providers
4. Try with your own projects!

