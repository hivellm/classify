# Compare TINY vs STANDARD Templates
# This script runs a comprehensive comparison between template sets

Write-Host "🔬 TINY vs STANDARD Template Comparison" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  No .env file found. Creating from .env.example..." -ForegroundColor Yellow
    if (Test-Path "env-example.txt") {
        Copy-Item "env-example.txt" ".env"
        Write-Host "✅ Created .env file. Please configure it with your API keys.`n" -ForegroundColor Green
        exit 1
    }
}

# Load environment variables
Get-Content .env | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)\s*=\s*(.+)\s*$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        Set-Item -Path "env:$name" -Value $value
    }
}

Write-Host "📋 Prerequisites Check:" -ForegroundColor Cyan
Write-Host "  ✓ DeepSeek API Key: $(if ($env:DEEPSEEK_API_KEY) { 'Set' } else { 'Missing' })" -ForegroundColor $(if ($env:DEEPSEEK_API_KEY) { 'Green' } else { 'Red' })
Write-Host "  ✓ Elasticsearch: $(if ($env:ELASTICSEARCH_URL) { $env:ELASTICSEARCH_URL } else { 'http://localhost:9200 (default)' })" -ForegroundColor Green
Write-Host "  ✓ Neo4j: $(if ($env:NEO4J_URL) { $env:NEO4J_URL } else { 'http://localhost:7474 (default)' })" -ForegroundColor Green
Write-Host ""

if (-not $env:DEEPSEEK_API_KEY) {
    Write-Host "❌ DEEPSEEK_API_KEY not set in .env file" -ForegroundColor Red
    Write-Host "   Please add: DEEPSEEK_API_KEY=sk-your-key-here`n" -ForegroundColor Yellow
    exit 1
}

# Check if databases are running
Write-Host "🔍 Checking database connectivity..." -ForegroundColor Cyan

try {
    $esUrl = if ($env:ELASTICSEARCH_URL) { $env:ELASTICSEARCH_URL } else { "http://localhost:9200" }
    $esResponse = Invoke-WebRequest -Uri "$esUrl/_cluster/health" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "  ✅ Elasticsearch is running" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Elasticsearch not responding at $esUrl" -ForegroundColor Yellow
    Write-Host "     Results will not be indexed in Elasticsearch" -ForegroundColor Yellow
}

try {
    $neo4jUrl = if ($env:NEO4J_URL) { $env:NEO4J_URL } else { "http://localhost:7474" }
    $neo4jResponse = Invoke-WebRequest -Uri $neo4jUrl -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "  ✅ Neo4j is running" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Neo4j not responding at $neo4jUrl" -ForegroundColor Yellow
    Write-Host "     Results will not be indexed in Neo4j" -ForegroundColor Yellow
}

Write-Host ""

# Build TypeScript
Write-Host "🔨 Building TypeScript..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build complete`n" -ForegroundColor Green

# Run comparison
Write-Host "🚀 Starting comparison (this may take several minutes)...`n" -ForegroundColor Cyan
node --loader tsx samples/scripts/compare-tiny-vs-standard.ts

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Comparison completed successfully!" -ForegroundColor Green
    Write-Host "`n📊 View results:" -ForegroundColor Cyan
    Write-Host "   JSON Report: samples/results/tiny-vs-standard-comparison.json" -ForegroundColor White
    Write-Host "   Elasticsearch STANDARD: $esUrl/classify-standard" -ForegroundColor White
    Write-Host "   Elasticsearch TINY: $esUrl/classify-tiny" -ForegroundColor White
    Write-Host "   Neo4j Browser: $neo4jUrl/browser/`n" -ForegroundColor White
    
    Write-Host "🔍 Example Neo4j Queries:" -ForegroundColor Cyan
    Write-Host "   Compare entity counts:" -ForegroundColor White
    Write-Host "     MATCH (d:STANDARD) RETURN count(d) as standard_docs" -ForegroundColor Gray
    Write-Host "     MATCH (d:TINY) RETURN count(d) as tiny_docs`n" -ForegroundColor Gray
    
    Write-Host "   Compare graph complexity:" -ForegroundColor White
    Write-Host "     MATCH (d:STANDARD)-[r]->() RETURN count(r) as standard_rels" -ForegroundColor Gray
    Write-Host "     MATCH (d:TINY)-[r]->() RETURN count(r) as tiny_rels`n" -ForegroundColor Gray
} else {
    Write-Host "`n❌ Comparison failed" -ForegroundColor Red
    exit 1
}

