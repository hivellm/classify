#!/usr/bin/env tsx
/**
 * Query Neo4j and Elasticsearch to verify classification quality
 */
import { config } from 'dotenv';
config();

async function queryElasticsearch() {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║  Elasticsearch Queries                            ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  const esUrl = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';
  const index = process.env.ELASTICSEARCH_INDEX || 'classify-documents';

  // Query 1: Get sample documents
  console.log('📊 Sample Documents:\n');
  const sampleResponse = await fetch(`${esUrl}/${index}/_search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      size: 3,
      query: { match_all: {} },
    }),
  });

  const sampleData: any = await sampleResponse.json();
  sampleData.hits.hits.forEach((hit: any, i: number) => {
    const doc = hit._source;
    console.log(`${i + 1}. ${doc.title}`);
    console.log(`   📁 File: ${doc.sourceFile}`);
    console.log(`   🏷️  Domain: ${doc.domain} | Type: ${doc.docType}`);
    console.log(`   🎯 Confidence: ${(doc.classification.confidence * 100).toFixed(1)}%`);
    console.log(`   🔑 Keywords: ${doc.keywords.slice(0, 5).join(', ')}`);
    if (doc.summary) {
      console.log(`   📝 Summary: ${doc.summary.substring(0, 100)}...`);
    }
    console.log('');
  });

  // Query 2: Aggregate by domain
  console.log('📈 Documents by Domain:\n');
  const aggResponse = await fetch(`${esUrl}/${index}/_search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      size: 0,
      aggs: {
        by_domain: {
          terms: { field: 'domain', size: 10 },
        },
      },
    }),
  });

  const aggData: any = await aggResponse.json();
  aggData.aggregations.by_domain.buckets.forEach((bucket: any) => {
    console.log(`   ${bucket.key}: ${bucket.doc_count} documents`);
  });

  // Query 3: Aggregate by docType
  console.log('\n📋 Documents by Type:\n');
  const typeResponse = await fetch(`${esUrl}/${index}/_search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      size: 0,
      aggs: {
        by_type: {
          terms: { field: 'docType', size: 20 },
        },
      },
    }),
  });

  const typeData: any = await typeResponse.json();
  typeData.aggregations.by_type.buckets.forEach((bucket: any) => {
    console.log(`   ${bucket.key}: ${bucket.doc_count} documents`);
  });

  // Query 4: Search for "database" related docs
  console.log('\n🔍 Search: "database":\n');
  const searchResponse = await fetch(`${esUrl}/${index}/_search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      size: 3,
      query: {
        multi_match: {
          query: 'database',
          fields: ['title', 'summary', 'keywords'],
        },
      },
    }),
  });

  const searchData: any = await searchResponse.json();
  searchData.hits.hits.forEach((hit: any) => {
    const doc = hit._source;
    console.log(`   • ${doc.title} (${doc.sourceFile})`);
    console.log(`     Score: ${hit._score.toFixed(2)}`);
  });
}

async function queryNeo4j() {
  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log('║  Neo4j Queries                                    ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  const neo4jUrl = process.env.NEO4J_URL || 'http://localhost:7474';
  const username = process.env.NEO4J_USERNAME || 'neo4j';
  const password = process.env.NEO4J_PASSWORD || 'password';
  const database = process.env.NEO4J_DATABASE || 'neo4j';

  const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

  const runQuery = async (cypher: string) => {
    const response = await fetch(`${neo4jUrl}/db/${database}/tx/commit`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        statements: [{ statement: cypher }],
      }),
    });
    const data: any = await response.json();
    return data.results[0];
  };

  // Query 1: Count documents
  console.log('📊 Total Documents:\n');
  const countResult = await runQuery('MATCH (d:Document) RETURN count(d) as total');
  console.log(`   Total: ${countResult.data[0].row[0]} documents\n`);

  // Query 2: Sample documents
  console.log('📁 Sample Documents:\n');
  const docsResult = await runQuery(`
    MATCH (d:Document) 
    RETURN d.title, d.source_file, d.domain, d.doc_type 
    LIMIT 5
  `);
  docsResult.data.forEach((row: any, i: number) => {
    console.log(`${i + 1}. ${row.row[0]}`);
    console.log(`   📁 ${row.row[1]}`);
    console.log(`   🏷️  ${row.row[2]} / ${row.row[3]}\n`);
  });

  // Query 3: Count entities
  console.log('🔢 Entity Statistics:\n');
  const entityResult = await runQuery(`
    MATCH (e)
    WHERE NOT e:Document
    WITH labels(e)[0] as type, count(*) as count
    RETURN type, count
    ORDER BY count DESC
    LIMIT 10
  `);
  entityResult.data.forEach((row: any) => {
    console.log(`   ${row.row[0]}: ${row.row[1]} nodes`);
  });

  // Query 4: Documents with most entities
  console.log('\n📈 Documents with Most Entities:\n');
  const mostEntitiesResult = await runQuery(`
    MATCH (d:Document)-[:MENTIONS]->(e)
    WITH d, count(e) as entityCount
    RETURN d.title, d.source_file, entityCount
    ORDER BY entityCount DESC
    LIMIT 5
  `);
  mostEntitiesResult.data.forEach((row: any) => {
    console.log(`   • ${row.row[0]} (${row.row[1]})`);
    console.log(`     Entities: ${row.row[2]}`);
  });

  // Query 5: Find specific entity
  console.log('\n🔍 Documents Mentioning "React":\n');
  const reactResult = await runQuery(`
    MATCH (d:Document)-[:MENTIONS]->(e)
    WHERE e.name =~ '(?i).*react.*'
    RETURN DISTINCT d.title, d.source_file
    LIMIT 5
  `);
  if (reactResult.data.length > 0) {
    reactResult.data.forEach((row: any) => {
      console.log(`   • ${row.row[0]} (${row.row[1]})`);
    });
  } else {
    console.log('   (No documents found)');
  }

  // Query 6: Relationship stats
  console.log('\n🔗 Relationship Statistics:\n');
  const relResult = await runQuery(`
    MATCH (d:Document)-[r]->(e)
    WITH type(r) as relType, count(*) as count
    RETURN relType, count
    ORDER BY count DESC
    LIMIT 5
  `);
  relResult.data.forEach((row: any) => {
    console.log(`   ${row.row[0]}: ${row.row[1]} relationships`);
  });
}

async function main() {
  try {
    await queryElasticsearch();
    await queryNeo4j();

    console.log('\n╔═══════════════════════════════════════════════════╗');
    console.log('║  Verification Complete!                           ║');
    console.log('╚═══════════════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

main().catch(console.error);

