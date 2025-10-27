/**
 * Test script to classify 10 different documents
 */
import { ClassifyClient } from '../../src/client.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import 'dotenv/config';

// Test documents in different domains
const testDocuments = [
  {
    filename: '01-legal-contract.md',
    content: `# Service Agreement

This Service Agreement ("Agreement") is entered into on January 15, 2025, between TechCorp Inc. ("Client") and DataSolutions LLC ("Service Provider").

## 1. Services
The Service Provider agrees to provide cloud infrastructure management services including server maintenance, security updates, and 24/7 monitoring.

## 2. Term
This Agreement shall commence on February 1, 2025 and continue for a period of twelve (12) months.

## 3. Compensation
Client agrees to pay Service Provider $5,000 USD per month, payable within 15 days of invoice date.

## 4. Termination
Either party may terminate this Agreement with 30 days written notice.

## 5. Liability
Service Provider's total liability shall not exceed the fees paid in the preceding six months.

Signed by:
- John Smith, CEO, TechCorp Inc.
- Sarah Johnson, Managing Partner, DataSolutions LLC`,
  },
  {
    filename: '02-financial-report.md',
    content: `# Q4 2024 Financial Report

**Company**: MegaCorp Technologies  
**Period**: October 1 - December 31, 2024  
**Prepared by**: Finance Department

## Executive Summary

Q4 2024 revenue reached $45.2M, representing 18% growth year-over-year.

## Income Statement

| Category | Q4 2024 | Q3 2024 | Change |
|----------|---------|---------|--------|
| Revenue | $45.2M | $38.3M | +18% |
| Cost of Goods Sold | $18.5M | $15.2M | +22% |
| Gross Profit | $26.7M | $23.1M | +16% |
| Operating Expenses | $15.3M | $14.8M | +3% |
| Net Income | $11.4M | $8.3M | +37% |

## Balance Sheet Highlights
- Total Assets: $180.5M
- Total Liabilities: $75.2M
- Shareholders' Equity: $105.3M

## Cash Flow
Operating cash flow: $18.7M  
Free cash flow: $12.4M

Prepared by: Michael Chen, CFO  
Date: January 10, 2025`,
  },
  {
    filename: '03-hr-job-posting.md',
    content: `# Senior Software Engineer - Full Stack

**Location**: San Francisco, CA (Hybrid)  
**Department**: Engineering  
**Employment Type**: Full-time  
**Salary Range**: $140,000 - $180,000

## About the Role

We're seeking an experienced Senior Software Engineer to join our growing engineering team. You'll work on building scalable web applications using React, Node.js, and PostgreSQL.

## Responsibilities
- Design and implement new features for our SaaS platform
- Collaborate with product managers and designers
- Mentor junior engineers
- Write clean, maintainable code with tests
- Participate in code reviews and architecture discussions

## Requirements
- 5+ years of professional software development experience
- Strong proficiency in TypeScript/JavaScript
- Experience with React, Node.js, and SQL databases
- Bachelor's degree in Computer Science or equivalent
- Excellent communication skills

## Benefits
- Competitive salary and equity
- Health, dental, and vision insurance
- 401(k) matching
- Unlimited PTO
- Remote work flexibility

**Contact**: recruiting@techcompany.com  
**Posted**: January 20, 2025`,
  },
  {
    filename: '04-engineering-spec.md',
    content: `# API Gateway Design Specification

**Version**: 2.0  
**Author**: Tech Architecture Team  
**Date**: January 2025

## Overview
This document specifies the design for our new microservices API Gateway using Kong and GraphQL.

## Architecture

### Components
1. **Kong Gateway** - API routing, rate limiting, authentication
2. **GraphQL Federation** - Unified API schema across services
3. **Redis Cache** - Response caching layer
4. **PostgreSQL** - Configuration storage

### System Requirements
- Throughput: 10,000 requests/second
- Latency: p99 < 100ms
- Availability: 99.9% SLA

## API Endpoints

### Authentication
\`\`\`
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
\`\`\`

### GraphQL Gateway
\`\`\`
POST /graphql
GET /graphql (GraphQL Playground)
\`\`\`

## Security
- JWT-based authentication
- Rate limiting: 1000 requests/hour per API key
- CORS configuration
- Request validation middleware

## Deployment
- Docker containers on Kubernetes
- Auto-scaling: 3-10 replicas
- Blue-green deployment strategy

**Status**: Design Approved  
**Next**: Implementation Sprint 2025-02`,
  },
  {
    filename: '05-marketing-campaign.md',
    content: `# Q1 2025 Product Launch Campaign

**Campaign**: CloudSync Pro Launch  
**Duration**: March 1 - May 31, 2025  
**Budget**: $250,000  
**Target**: 10,000 new users

## Campaign Overview
Launch campaign for CloudSync Pro, our new enterprise file synchronization solution.

## Target Audience
- IT Managers at companies with 50-500 employees
- Industries: Technology, Finance, Healthcare
- Geographic focus: North America, Europe

## Campaign Channels

### Digital Advertising ($120K)
- Google Ads: $50K
- LinkedIn Sponsored Content: $40K
- Facebook/Instagram: $30K

### Content Marketing ($60K)
- Blog posts: 12 articles
- Whitepapers: 3 technical guides
- Case studies: 5 customer success stories
- Webinars: 4 live sessions

### Email Marketing ($30K)
- Newsletter series: 8 emails
- Drip campaigns for trials
- Targeted outreach to enterprise leads

### Events ($40K)
- Conference sponsorships: 2 events
- Virtual demo sessions: 8 sessions

## KPIs
- Website traffic: +150%
- Trial signups: 5,000
- Conversions: 10% (500 paying customers)
- CAC target: <$500

**Campaign Manager**: Lisa Martinez  
**Approved by**: VP Marketing`,
  },
  {
    filename: '06-compliance-policy.md',
    content: `# Data Privacy and GDPR Compliance Policy

**Effective Date**: January 1, 2025  
**Version**: 3.2  
**Owner**: Legal & Compliance Department

## Purpose
This policy ensures compliance with GDPR, CCPA, and other data protection regulations.

## Scope
Applies to all employees, contractors, and third-party vendors handling personal data.

## Data Protection Principles

### 1. Lawfulness and Transparency
- Obtain explicit consent before collecting personal data
- Provide clear privacy notices
- Document legal basis for processing

### 2. Purpose Limitation
- Collect data only for specified purposes
- Do not use data for incompatible purposes
- Delete data when no longer needed

### 3. Data Minimization
- Collect only necessary data
- Review data collection quarterly
- Implement data retention schedules

### 4. Accuracy
- Maintain accurate and up-to-date records
- Allow individuals to correct their data
- Regular data quality audits

### 5. Storage Limitation
- Personal data retention: 7 years maximum
- Marketing data: 2 years after last contact
- Financial records: As required by law

### 6. Security
- Encryption at rest and in transit
- Access controls and authentication
- Regular security assessments
- Incident response procedures

## Data Subject Rights
- Right to access
- Right to rectification
- Right to erasure
- Right to data portability
- Right to object

## Compliance Officer
**Name**: Robert Williams  
**Email**: compliance@company.com  
**Phone**: +1 (555) 123-4567`,
  },
  {
    filename: '07-sales-proposal.md',
    content: `# Enterprise Software Proposal

**To**: Global Enterprises Inc.  
**From**: SoftwareSolutions Corp.  
**Date**: January 25, 2025  
**Proposal #**: ESP-2025-0042

## Executive Summary
SoftwareSolutions Corp. proposes a comprehensive enterprise resource planning (ERP) solution for Global Enterprises Inc., estimated at $500,000 for implementation and first year support.

## Proposed Solution

### Software Modules
1. **Finance & Accounting** - GL, AP, AR, Fixed Assets
2. **Human Resources** - HRIS, Payroll, Benefits
3. **Supply Chain** - Inventory, Procurement, Warehousing
4. **CRM** - Sales automation, Customer service

### Implementation Timeline
- Phase 1 (Months 1-2): Requirements gathering & customization
- Phase 2 (Months 3-4): Data migration & testing
- Phase 3 (Month 5): Training & go-live
- Phase 4 (Months 6-12): Support & optimization

## Pricing

| Item | Cost |
|------|------|
| Software Licenses (500 users) | $200,000 |
| Implementation Services | $180,000 |
| Training (5 sessions) | $40,000 |
| Year 1 Support & Maintenance | $80,000 |
| **Total** | **$500,000** |

## Payment Terms
- 30% upon contract signing
- 40% upon go-live
- 30% after 90 days of successful operation

## ROI Projection
Estimated annual savings: $750,000 through process automation and efficiency gains.

**Valid Until**: February 28, 2025  
**Sales Representative**: Jennifer Davis  
**Contact**: jennifer.davis@softwaresolutions.com`,
  },
  {
    filename: '08-product-roadmap.md',
    content: `# Product Roadmap - CloudSync Pro

**Product**: CloudSync Pro  
**Timeframe**: 2025 H1  
**Product Manager**: David Lee

## Q1 2025 (Jan-Mar)

### Version 3.0 - Enterprise Features
- **Multi-region sync** - Sync across AWS, Azure, GCP
- **Advanced permissions** - Role-based access control
- **Audit logs** - Complete activity tracking
- **API v2** - RESTful API with webhooks

Target: March 15, 2025

## Q2 2025 (Apr-Jun)

### Version 3.1 - AI-Powered Features
- **Smart file categorization** - ML-based auto-tagging
- **Duplicate detection** - Intelligent deduplication
- **Content search** - Natural language search
- **Automated workflows** - If-this-then-that rules

Target: June 30, 2025

## Feature Priorities

### P0 - Critical
- Security enhancements
- Performance optimization
- Bug fixes

### P1 - High
- Multi-region sync
- Advanced permissions
- API v2

### P2 - Medium
- AI features
- Mobile apps improvements
- Integrations (Slack, Teams)

## Success Metrics
- User adoption: 80% of enterprise customers
- Performance: 99.9% uptime
- Support tickets: <5% related to new features

## Dependencies
- Infrastructure team: Multi-region setup
- ML team: AI model training
- Security team: Compliance review`,
  },
  {
    filename: '09-customer-support-ticket.md',
    content: `# Support Ticket #CS-2025-1842

**Customer**: Acme Corporation  
**Reported by**: Alice Brown (alice.brown@acme.com)  
**Priority**: High  
**Status**: In Progress  
**Created**: January 26, 2025 10:30 AM

## Issue Description
Customer reports that file synchronization is failing for files larger than 100MB. Upload gets stuck at 67% progress and eventually times out after 5 minutes.

## Steps to Reproduce
1. Attempt to upload a 150MB video file
2. Monitor upload progress
3. Observe failure at ~67% completion

## Impact
- Affects 15 users in the Design team
- Blocking project delivery deadline
- Customer requested escalation

## Investigation Notes

**10:45 AM** - Initial investigation by Support Agent Tom Wilson
- Verified issue occurs consistently
- Checked server logs - no errors on backend
- Timeout appears to be client-side

**11:30 AM** - Escalated to Engineering (Ticket #ENG-5521)
- Engineering team investigating network timeout settings
- Suspect issue with chunked upload configuration

**2:15 PM** - Update from Engineering
- Root cause: Upload chunk size too large (10MB)
- Solution: Reduce chunk size to 5MB
- Fix will be deployed in next patch release

## Resolution Plan
1. Deploy hotfix to production (ETA: Jan 27, 9:00 AM)
2. Notify affected customers
3. Monitor for 48 hours
4. Follow up with customer

## Customer Communication
Email sent to Alice Brown with update and ETA.

**Assigned to**: Tom Wilson (Support) + Engineering Team  
**Next update**: January 27, 2025`,
  },
  {
    filename: '10-investor-update.md',
    content: `# Q4 2024 Investor Update

**Company**: NextGen AI Solutions  
**Date**: January 20, 2025  
**To**: Board of Directors and Investors

## Key Highlights

### Financial Performance
- Revenue: $12.5M (+45% YoY)
- ARR: $48M (+52% YoY)
- Gross Margin: 78%
- Burn Rate: $1.2M/month
- Runway: 18 months

### Product Milestones
✅ Launched AI Chat v2.0 (December 2024)  
✅ Achieved SOC 2 Type II certification  
✅ Integrated with 5 new enterprise platforms  
🔄 Beta testing AI Agents (Q1 2025 launch)

### Customer Growth
- Total Customers: 450 (+120 new in Q4)
- Enterprise Customers: 85 (+25 new)
- Net Revenue Retention: 135%
- Churn Rate: 2.1% (industry avg: 5%)

### Team Expansion
- Headcount: 85 employees (was 65)
- Key hires: VP Engineering, Head of Sales
- Engineering team: 45 (53% of company)

## Strategic Updates

### Fundraising
Currently in discussions for Series B round:
- Target: $30M
- Lead investor: TBD
- Expected close: Q2 2025

### Market Position
- #3 in AI tools category (G2 rankings)
- 4.8/5 customer satisfaction score
- Featured in TechCrunch, VentureBeat

### Challenges
- Increased competition from OpenAI, Anthropic
- Talent acquisition in competitive market
- Infrastructure costs scaling with growth

## Q1 2025 Focus
1. Complete Series B fundraising
2. Launch AI Agents product
3. Expand sales team (10 new AEs)
4. International expansion (EU market)

**Next Board Meeting**: March 15, 2025  
**Prepared by**: Emily Thompson, CEO`,
  },
];

async function main() {
  console.log('🚀 Starting classification test with 10 documents...\n');

  // Create directories
  const testDir = join(process.cwd(), 'tests', 'test-documents');
  const resultsDir = join(process.cwd(), 'tests', 'test-results');
  await mkdir(testDir, { recursive: true });
  await mkdir(resultsDir, { recursive: true });

  // Write test documents
  console.log('📝 Creating test documents...');
  for (const doc of testDocuments) {
    const filePath = join(testDir, doc.filename);
    await writeFile(filePath, doc.content);
    console.log(`  ✅ ${doc.filename}`);
  }

  // Initialize Classify client
  const client = new ClassifyClient({
    provider: 'deepseek',
    apiKey: process.env.DEEPSEEK_API_KEY,
    cacheEnabled: false, // Disable cache for testing
    compressionEnabled: true,
    compressionRatio: 0.5, // 50% compression
  });

  console.log('\n🤖 Classifying documents with DeepSeek + Compression...\n');

  const results = [];
  let totalCost = 0;
  let totalTime = 0;
  let totalTokensOriginal = 0;
  let totalTokensCompressed = 0;

  // Classify each document
  for (let i = 0; i < testDocuments.length; i++) {
    const doc = testDocuments[i];
    const filePath = join(testDir, doc.filename);

    console.log(`[${i + 1}/10] Classifying ${doc.filename}...`);

    try {
      const startTime = Date.now();
      const result = await client.classify(filePath);
      const duration = Date.now() - startTime;

      // Save full result to JSON file
      const resultFilename = doc.filename.replace('.md', '-result.json');
      const resultPath = join(resultsDir, resultFilename);
      await writeFile(resultPath, JSON.stringify(result, null, 2));

      results.push({
        filename: doc.filename,
        template: result.classification.template,
        domain: result.classification.domain,
        docType: result.classification.docType,
        confidence: result.classification.confidence,
        entities: result.graphStructure.entities.length,
        cost: result.performance.costUsd,
        timeMs: duration,
        tokens: result.performance.tokens?.total || 0,
      });

      totalCost += result.performance.costUsd ?? 0;
      totalTime += duration;

      console.log(`  ✅ Template: ${result.classification.template}`);
      console.log(`  📊 Domain: ${result.classification.domain}`);
      console.log(`  🎯 Confidence: ${(result.classification.confidence * 100).toFixed(1)}%`);
      console.log(`  🏷️  Entities: ${result.graphStructure.entities.length}`);
      console.log(`  💰 Cost: $${result.performance.costUsd?.toFixed(6) || '0'}`);
      console.log(`  ⏱️  Time: ${duration}ms`);
      console.log(`  🔢 Tokens: ${result.performance.tokens?.total || 'N/A'}`);
      console.log(`  💾 Saved: ${resultFilename}`);
      console.log('');
    } catch (error) {
      console.error(`  ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    }
  }

  // Summary
  console.log('\n📊 SUMMARY\n');
  console.log('═'.repeat(70));
  console.log(`Documents Classified: ${results.length}/10`);
  console.log(`Total Cost: $${totalCost.toFixed(6)}`);
  console.log(`Average Cost: $${(totalCost / results.length).toFixed(6)} per document`);
  console.log(`Total Time: ${(totalTime / 1000).toFixed(2)}s`);
  console.log(`Average Time: ${(totalTime / results.length / 1000).toFixed(2)}s per document`);
  console.log('═'.repeat(70));

  console.log('\n📋 RESULTS TABLE\n');
  console.log('File'.padEnd(35), '│', 'Template'.padEnd(15), '│', 'Domain'.padEnd(15), '│', 'Entities', '│', 'Cost');
  console.log('─'.repeat(35), '┼', '─'.repeat(15), '┼', '─'.repeat(15), '┼', '─'.repeat(8), '┼', '─'.repeat(10));

  results.forEach((r) => {
    console.log(
      r.filename.padEnd(35),
      '│',
      r.template.padEnd(15),
      '│',
      r.domain.padEnd(15),
      '│',
      r.entities.toString().padEnd(8),
      '│',
      `$${r.cost.toFixed(6)}`
    );
  });

  // Save summary
  const summary = {
    totalDocuments: results.length,
    totalCost: totalCost,
    averageCost: totalCost / results.length,
    totalTimeMs: totalTime,
    averageTimeMs: totalTime / results.length,
    results,
  };

  const summaryPath = join(resultsDir, 'summary.json');
  await writeFile(summaryPath, JSON.stringify(summary, null, 2));

  console.log(`\n💾 Results saved to: ${resultsDir}/`);
  console.log(`   - summary.json`);
  console.log(`   - Individual result files for each document`);
  console.log('\n✨ Test complete!');
}

main().catch(console.error);

