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

  constructor(config: Neo4jConfig) {
    this.config = config;
    this.authHeader = 'Basic ' + Buffer.from(`${config.username}:${config.password}`).toString('base64');
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
        headers: {
          'Authorization': this.authHeader,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
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
        throw new Error(`Neo4j connection failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      console.log('✅ Connected to Neo4j');
    } catch (error) {
      throw new Error(`Failed to connect to Neo4j: ${error instanceof Error ? error.message : error}`);
    }
  }

  /**
   * Execute Cypher query via REST API
   */
  private async executeCypher(cypher: string): Promise<any> {
    const database = this.config.database ?? 'neo4j';
    const response = await fetch(`${this.config.url}/db/${database}/tx/commit`, {
      method: 'POST',
      headers: {
        'Authorization': this.authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
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
    // Add source file metadata to document
    const enhancedCypher = result.graphStructure.cypher.replace(
      'CREATE (doc:Document {',
      `CREATE (doc:Document {\n      source_file: "${sourceFile}",\n      classified_at: datetime(),\n      `
    );

    await this.executeCypher(enhancedCypher);
  }

  /**
   * Insert multiple results in batch
   */
  async insertBatch(results: Array<{ result: ClassifyResult; file: string }>): Promise<void> {
    for (const { result, file } of results) {
      await this.insertResult(result, file);
    }
  }

  /**
   * Close connection (no-op for REST API)
   */
  async close(): Promise<void> {
    // No persistent connection to close
  }
}


