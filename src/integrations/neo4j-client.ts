/**
 * Neo4j Integration Client (REST API)
 * Sends classification graph structures to Neo4j via HTTP
 */
import type { ClassifyResult } from '../types.js';

export interface Neo4jConfig {
  url: string; // e.g., http://localhost:7474
  username: string;
  password: string;
  database?: string;
}

export class Neo4jClient {
  private config: Neo4jConfig;
  private authHeader: string;
  private headers: Record<string, string>;

  constructor(config: Neo4jConfig) {
    this.config = config;
    this.authHeader =
      'Basic ' + Buffer.from(`${config.username}:${config.password}`).toString('base64');
    this.headers = {
      Authorization: this.authHeader,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  /**
   * Test connection to Neo4j
   */
  async initialize(): Promise<void> {
    try {
      // Try to get server info to test connection
      const database = this.config.database ?? 'neo4j';
      const response = await fetch(`${this.config.url}/db/${database}/tx/commit`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          statements: [
            {
              statement: 'RETURN 1 as test',
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Neo4j connection failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      console.log('✅ Connected to Neo4j');
    } catch (error) {
      throw new Error(
        `Failed to connect to Neo4j: ${error instanceof Error ? error.message : error}`
      );
    }
  }

  /**
   * Execute Cypher query via REST API
   */
  private async executeCypher(cypher: string): Promise<any> {
    const database = this.config.database ?? 'neo4j';
    const response = await fetch(`${this.config.url}/db/${database}/tx/commit`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        statements: [
          {
            statement: cypher,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Neo4j query failed: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Insert classification result into Neo4j
   */
  async insertResult(result: ClassifyResult, sourceFile: string): Promise<void> {
    const fileHash = result.cacheInfo.hash;
    
    // Replace CREATE with MERGE and add file_hash as unique ID
    // This prevents duplicates when re-indexing the same file
    let enhancedCypher = result.graphStructure.cypher.replace(
      'CREATE (doc:Document {',
      `MERGE (doc:Document { file_hash: "${fileHash}" })\n      ON CREATE SET doc += {\n      source_file: "${sourceFile}",\n      classified_at: datetime(),\n      `
    );
    
    // Also add ON MATCH to update metadata on re-index
    enhancedCypher = enhancedCypher.replace(
      'CREATE (doc:Document { file_hash:',
      'MERGE (doc:Document { file_hash:'
    );
    
    // Add update clause for when document already exists
    if (!enhancedCypher.includes('ON MATCH SET')) {
      const insertPos = enhancedCypher.indexOf('}\n      ON CREATE SET');
      if (insertPos > -1) {
        enhancedCypher = enhancedCypher.slice(0, insertPos + 1) +
          `\n      ON MATCH SET doc.source_file = "${sourceFile}", doc.updated_at = datetime()` +
          enhancedCypher.slice(insertPos + 1);
      }
    }

    await this.executeCypher(enhancedCypher);
  }

  /**
   * Insert multiple results in batch using Neo4j transaction
   */
  async insertBatch(results: Array<{ result: ClassifyResult; file: string }>): Promise<void> {
    if (results.length === 0) return;

    // Build all Cypher statements for the batch
    const statements = results.map(({ result, file }) => {
      const fileHash = result.cacheInfo.hash;
      
      // Replace CREATE with MERGE and add file_hash as unique ID
      let enhancedCypher = result.graphStructure.cypher.replace(
        'CREATE (doc:Document {',
        `MERGE (doc:Document { file_hash: "${fileHash}" })\n      ON CREATE SET doc += {\n      source_file: "${file}",\n      classified_at: datetime(),\n      `
      );
      
      // Also replace any other CREATE (doc:Document patterns
      enhancedCypher = enhancedCypher.replace(
        'CREATE (doc:Document { file_hash:',
        'MERGE (doc:Document { file_hash:'
      );
      
      // Add update clause for when document already exists
      if (!enhancedCypher.includes('ON MATCH SET')) {
        const insertPos = enhancedCypher.indexOf('}\n      ON CREATE SET');
        if (insertPos > -1) {
          enhancedCypher = enhancedCypher.slice(0, insertPos + 1) +
            `\n      ON MATCH SET doc.source_file = "${file}", doc.updated_at = datetime()` +
            enhancedCypher.slice(insertPos + 1);
        }
      }

      return { statement: enhancedCypher };
    });

    // Execute all statements in a single transaction
    const database = this.config.database ?? 'neo4j';
    const response = await fetch(`${this.config.url}/db/${database}/tx/commit`, {
      method: 'POST',
      headers: {
        ...this.headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ statements }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Batch insert failed: ${response.status} ${error}`);
    }

    const data = await response.json();

    // Check for errors
    if (data.errors && data.errors.length > 0) {
      console.warn(`⚠️  Neo4j batch insert had ${data.errors.length} errors:`, data.errors.slice(0, 3));
    }
  }

  /**
   * Close connection (no-op for REST API)
   */
  async close(): Promise<void> {
    // No persistent connection to close
  }
}
