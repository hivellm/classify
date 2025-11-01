#!/usr/bin/env node

/**
 * Template Selector Test Utility
 * 
 * This script simulates the LLM template selection process for testing purposes.
 * It reads the index.json and scores each template against a given document title/content.
 */

const fs = require('fs');
const path = require('path');

// Load template index
const indexPath = path.join(__dirname, 'index.json');
const templateIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

/**
 * Calculate template match score based on keyword indicators
 */
function calculateScore(documentText, template) {
  const text = documentText.toLowerCase();
  const indicators = template.key_indicators.map(i => i.toLowerCase());
  
  let matchCount = 0;
  let matchedIndicators = [];
  
  for (const indicator of indicators) {
    if (text.includes(indicator)) {
      matchCount++;
      matchedIndicators.push(indicator);
    }
  }
  
  // Calculate confidence score (0-1)
  const indicatorScore = matchCount / indicators.length;
  const priorityBonus = (template.priority - 50) / 50 * 0.2; // Up to 0.2 bonus for high priority
  const confidence = Math.min(indicatorScore + priorityBonus, 1.0);
  
  return {
    template: template.name,
    confidence: Math.round(confidence * 100) / 100,
    matchCount,
    totalIndicators: indicators.length,
    matchedIndicators: matchedIndicators.slice(0, 5), // Top 5 matches
    priority: template.priority
  };
}

/**
 * Select best template for a document
 */
function selectTemplate(documentText) {
  const scores = templateIndex.templates
    .map(template => calculateScore(documentText, template))
    .sort((a, b) => {
      // Sort by confidence first, then priority
      if (b.confidence !== a.confidence) {
        return b.confidence - a.confidence;
      }
      return b.priority - a.priority;
    });
  
  const bestMatch = scores[0];
  const shouldUseFallback = bestMatch.confidence < 0.7 && bestMatch.template !== 'base';
  
  return {
    selected: shouldUseFallback ? 'base' : bestMatch.template,
    confidence: shouldUseFallback ? 0.5 : bestMatch.confidence,
    reasoning: shouldUseFallback 
      ? `Low confidence (${bestMatch.confidence}), using fallback template`
      : `Best match with ${bestMatch.matchCount} indicators matched`,
    allScores: scores,
    usedFallback: shouldUseFallback
  };
}

/**
 * Display results in a formatted table
 */
function displayResults(result) {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║           TEMPLATE SELECTION RESULT                            ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
  
  console.log(`Selected Template: \x1b[32m${result.selected}\x1b[0m`);
  console.log(`Confidence Score:  \x1b[33m${(result.confidence * 100).toFixed(0)}%\x1b[0m`);
  console.log(`Reasoning:         ${result.reasoning}`);
  
  if (result.usedFallback) {
    console.log(`\n⚠️  Using fallback template due to low confidence\n`);
  }
  
  console.log('\n┌─────────────────────────────────────────────────────────────────┐');
  console.log('│ ALL TEMPLATE SCORES (Top 10)                                   │');
  console.log('├──────────────────────┬──────────┬──────────┬─────────────────────┤');
  console.log('│ Template             │ Priority │ Confidence│ Matched Indicators  │');
  console.log('├──────────────────────┼──────────┼──────────┼─────────────────────┤');
  
  result.allScores.slice(0, 10).forEach((score, index) => {
    const highlight = index === 0 ? '\x1b[32m' : '';
    const reset = index === 0 ? '\x1b[0m' : '';
    const template = score.template.padEnd(20);
    const priority = String(score.priority).padStart(8);
    const confidence = `${(score.confidence * 100).toFixed(0)}%`.padStart(9);
    const indicators = score.matchedIndicators.slice(0, 2).join(', ');
    
    console.log(`│ ${highlight}${template}${reset} │ ${priority} │ ${confidence} │ ${indicators.substring(0, 19).padEnd(19)} │`);
  });
  
  console.log('└──────────────────────┴──────────┴──────────┴─────────────────────┘\n');
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node test-selector.js "<document text or title>"');
    console.log('\nExamples:');
    console.log('  node test-selector.js "Employment Contract - Software Engineer"');
    console.log('  node test-selector.js "Q4 Financial Statement - Revenue Report"');
    console.log('  node test-selector.js "API Technical Specification v2.0"');
    process.exit(1);
  }
  
  const documentText = args.join(' ');
  console.log(`\nAnalyzing document: "${documentText}"\n`);
  
  const result = selectTemplate(documentText);
  displayResults(result);
}

// Export for programmatic usage
module.exports = {
  selectTemplate,
  calculateScore,
  templateIndex
};

