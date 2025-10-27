/**
 * Elasticsearch Integration Client (REST API)
 * Sends classification fulltext metadata to Elasticsearch via HTTP
 */
import type { ClassifyResult } from '../types.js';

export interface ElasticsearchConfig {
  url: string; // e.g., http://localhost:9200
  auth?: {
    username: string;
    password: string;
  };
  apiKey?: string;
  index: string;
}

export class ElasticsearchClient {
  private config: ElasticsearchConfig;
  private headers: Record<string, string>;

  constructor(config: ElasticsearchConfig) {
    this.config = config;
    
    // Setup auth headers
    this.headers = {
      'Content-Type': 'application/json',
    };

    if (config.apiKey) {
      this.headers['Authorization'] = `ApiKey ${config.apiKey}`;
    } else if (config.auth) {
      const credentials = Buffer.from(`${config.auth.username}:${config.auth.password}`).toString('base64');
      this.headers['Authorization'] = `Basic ${credentials}`;
    }
  }

  /**
   * Test connection and create index if needed
   */
  async initialize(): Promise<void> {
    try {
      // Test connection
      const pingResponse = await fetch(`${this.config.url}/_cluster/health`, {
        headers: this.headers,
      });

      if (!pingResponse.ok) {
        throw new Error(`Elasticsearch connection failed: ${pingResponse.status} ${pingResponse.statusText}`);
      }

      console.log('✅ Connected to Elasticsearch');
      
      // Ensure index exists
      await this.ensureIndex();
    } catch (error) {
      throw new Error(`Failed to connect to Elasticsearch: ${error instanceof Error ? error.message : error}`);
    }
  }

  /**
   * Ensure index exists with proper mapping
   */
  private async ensureIndex(): Promise<void> {
    // Check if index exists
    const checkResponse = await fetch(`${this.config.url}/${this.config.index}`, {
      method: 'HEAD',
      headers: this.headers,
    });

    if (checkResponse.status === 404) {
      // Create index with mapping
      const createResponse = await fetch(`${this.config.url}/${this.config.index}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify({
          mappings: {
            properties: {
              title: { type: 'text' },
              domain: { type: 'keyword' },
              docType: { type: 'keyword' },
              keywords: { type: 'keyword' },
              summary: { type: 'text' },
              extractedFields: { type: 'object', enabled: true },
              sourceFile: { type: 'keyword' },
              classifiedAt: { type: 'date' },
              classification: {
                properties: {
                  template: { type: 'keyword' },
                  confidence: { type: 'float' },
                },
              },
            },
          },
        }),
      });

      if (!createResponse.ok) {
        const error = await createResponse.text();
        throw new Error(`Failed to create index: ${error}`);
      }

      console.log(`✅ Created index: ${this.config.index}`);
    }
  }

  /**
   * Insert classification result into Elasticsearch
   */
  async insertResult(result: ClassifyResult, sourceFile: string): Promise<void> {
    const document = {
      title: result.fulltextMetadata.title,
      domain: result.fulltextMetadata.domain,
      docType: result.fulltextMetadata.docType,
      keywords: result.fulltextMetadata.keywords,
      summary: result.fulltextMetadata.summary,
      extractedFields: result.fulltextMetadata.extractedFields,
      sourceFile,
      classifiedAt: new Date().toISOString(),
      classification: {
        template: result.classification.template,
        confidence: result.classification.confidence,
      },
    };

    const response = await fetch(`${this.config.url}/${this.config.index}/_doc`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(document),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to index document: ${error}`);
    }
  }

  /**
   * Insert multiple results in batch using bulk API
   */
  async insertBatch(results: Array<{ result: ClassifyResult; file: string }>): Promise<void> {
    // Build NDJSON for bulk API
    const bulkBody = results
      .map(({ result, file }) => {
        const action = JSON.stringify({ index: { _index: this.config.index } });
        const document = JSON.stringify({
          title: result.fulltextMetadata.title,
          domain: result.fulltextMetadata.domain,
          docType: result.fulltextMetadata.docType,
          keywords: result.fulltextMetadata.keywords,
          summary: result.fulltextMetadata.summary,
          extractedFields: result.fulltextMetadata.extractedFields,
          sourceFile: file,
          classifiedAt: new Date().toISOString(),
          classification: {
            template: result.classification.template,
            confidence: result.classification.confidence,
          },
        });
        return `${action}\n${document}`;
      })
      .join('\n') + '\n';

    const response = await fetch(`${this.config.url}/_bulk?refresh=true`, {
      method: 'POST',
      headers: {
        ...this.headers,
        'Content-Type': 'application/x-ndjson',
      },
      body: bulkBody,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Bulk insert failed: ${error}`);
    }

    const responseData: any = await response.json();
    if (responseData.errors) {
      const erroredDocuments = responseData.items.filter((item: any) => item.index?.error);
      console.error('Bulk insert errors:', erroredDocuments);
      throw new Error(`Elasticsearch bulk insert had ${erroredDocuments.length} errors`);
    }
  }

  /**
   * Close connection (no-op for REST API)
   */
  async close(): Promise<void> {
    // No persistent connection to close
  }
}

