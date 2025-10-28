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
    let cypher = result.graphStructure.cypher;
    
    // Replace CREATE with MERGE and add file_hash as unique identifier
    cypher = cypher.replace(
      'CREATE (doc:Document {\n',
      `MERGE (doc:Document { file_hash: "${fileHash}" })
      ON CREATE SET doc +={\n      file_hash: "${fileHash}",\n      source_file: "${sourceFile}",\n      classified_at: datetime(),\n`
    );
    
    // Replace "    })" with "    }" (remove closing paren) and add ON MATCH
    cypher = cypher.replace(
      '\n    })\nCREATE',
      `\n    }
      ON MATCH SET doc.updated_at = datetime()
CREATE`
    );

    await this.executeCypher(cypher);
  }

  /**
   * Insert multiple results in batch using Neo4j transaction
   */
  async insertBatch(results: Array<{ result: ClassifyResult; file: string }>): Promise<void> {
    if (results.length === 0) return;

    // Build all Cypher statements for the batch
    const statements = results.map(({ result, file }) => {
      const fileHash = result.cacheInfo.hash;
      let cypher = result.graphStructure.cypher;
      
      // Replace CREATE with MERGE and add file_hash as unique identifier
      cypher = cypher.replace(
        'CREATE (doc:Document {\n',
        `MERGE (doc:Document { file_hash: "${fileHash}" })
      ON CREATE SET doc += {\n      file_hash: "${fileHash}",\n      source_file: "${file}",\n      classified_at: datetime(),\n`
      );
      
      // Replace "    })" with "    }" (remove closing paren) and add ON MATCH
      cypher = cypher.replace(
        '\n    })\nCREATE',
        `\n    }
      ON MATCH SET doc.updated_at = datetime()
CREATE`
      );

      return { statement: cypher };
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

    const data = (await response.json()) as any;

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
