#!/bin/bash
cd /mnt/f/Node/hivellm/vectorizer

echo "Counting files per directory..."
echo ""

for dir in */; do
    count=$(find "$dir" -type f 2>/dev/null | wc -l)
    echo "$count $dir"
done | sort -rn | head -20

