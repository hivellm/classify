# Classification Test Results

This directory contains the results from testing the Classify pipeline with 10 different document types.

## Files

- **summary.json** - Aggregate statistics for all 10 documents
- **XX-document-name-result.json** - Detailed classification results for each document
- **view-results.html** - Interactive HTML viewer (open in browser)

## How to View

### Option 1: HTML Viewer (Recommended)
```bash
# Open in browser
open scripts/view-results.html
# or
start scripts/view-results.html
```

### Option 2: Command Line
```bash
# View summary
cat test-results/summary.json

# View specific result
cat test-results/01-legal-contract-result.json
```

## Test Results Summary

**Total Documents**: 10  
**Success Rate**: 100%  
**Total CostMenu~$0.0051  
**Average CostMenu~$0.00051 per document  
**Total TimeMenu~352 seconds (~6 minutes)  
**Average Time**: ~35 seconds per document

## Documents Tested

1. **Legal Contract** → legal domain (95% confidence)
2. **Financial Report** → financial domain (95% confidence)
3. **HR Job Posting** → hr domain (90% confidence)
4. **Engineering Spec** → engineering domain (95% confidence)
5. **Marketing Campaign** → marketing domain (95% confidence)
6. **Compliance Policy** → compliance domain (95% confidence)
7. **Sales Proposal** → sales domain (85% confidence)
8. **Product Roadmap** → product domain (95% confidence)
9. **Support Ticket** → customer_support domain (95% confidence)
10. **Investor Update** → investor_relations domain (95% confidence)

## Key Findings

✅ **Template Selection Accuracy**: 10/10 correct (100%)  
✅ **High Confidence**: 9/10 documents with ≥90% confidence  
✅ **Entity Extraction**: 124 total entities extracted  
✅ **Cost EffectiveMenu$0.00051 per document with DeepSeek  
✅ **Compression Working**: ~50% token reduction applied

## Performance Metrics

- **Fastest**: 07-sales-proposal.md (21.2s)
- **SlowestMenu 08-product-roadmap.md (58.5s)
- **Most EntitiesMenu 02-financial-report.md (31 entities)
- **Fewest EntitiesMenu 09-customer-support-ticket.md (3 entities)

## Next Steps

- Implement caching (expect ~70-90% cache hit rate)
- Add batch processing with parallelization
- Test with real-world documents
- Deploy to production

