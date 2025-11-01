#!/bin/bash
# Monitor classification progress

RESULTS_FILE="samples/vectorizer-results/summary.json"

echo "🔍 Monitoring Vectorizer Classification Progress..."
echo ""

while true; do
  if [ -f "$RESULTS_FILE" ]; then
    echo "✅ Classification completed!"
    echo ""
    cat "$RESULTS_FILE" | jq '{
      totalFiles,
      successCount,
      failCount,
      totalCost,
      "totalTimeMinutes": (.totalTime / 1000 / 60 | floor),
      cacheHitRate: (.cacheHitRate * 100 | floor),
      totalEntities,
      totalRelationships
    }'
    break
  else
    # Check if process is still running
    if pgrep -f "classify-vectorizer.ts" > /dev/null; then
      echo "⏳ Still processing..."
      echo "   $(date '+%H:%M:%S')"
      sleep 10
    else
      echo "❌ Process not running. Check for errors."
      break
    fi
  fi
done

