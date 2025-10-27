import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Neo4jClient } from '../../src/integrations/neo4j-client.js';
import type { ClassifyResult } from '../../src/types.js';

// Mock fetch
global.fetch = vi.fn();

describe('Neo4jClient', () => {
  let client: Neo4jClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new Neo4jClient({
      url: 'http://localhost:7474',
      username: 'neo4j',
      password: 'password',
    });
  });

  describe('initialize', () => {
    it('should successfully connect to Neo4j', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [{ data: [{ row: [1] }] }] }),
      } as Response);

      await expect(client.initialize()).resolves.toBeUndefined();
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:7474/db/neo4j/tx/commit',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: expect.stringContaining('Basic'),
          }),
        }),
      );
    });

    it('should throw error on connection failure', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: async () => 'Invalid credentials',
      } as Response);

      await expect(client.initialize()).rejects.toThrow('Neo4j connection failed');
    });

    it('should use custom database name', async () => {
      const customClient = new Neo4jClient({
        url: 'http://localhost:7474',
        username: 'neo4j',
        password: 'password',
        database: 'mydb',
      });

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [] }),
      } as Response);

      await customClient.initialize();
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:7474/db/mydb/tx/commit',
        expect.any(Object),
      );
    });
  });

  describe('insertResult', () => {
    const mockResult: ClassifyResult = {
      classification: {
        template: 'legal',
        confidence: 0.95,
        domain: 'legal',
        docType: 'contract',
      },
      graphStructure: {
        cypher: 'CREATE (n:Document {name: "test"})',
        entities: [{ type: 'Document', properties: { name: 'test' } }],
        relationships: [],
      },
      fulltextMetadata: {
        keywords: ['test'],
        summary: 'test',
        searchFields: {},
      },
      cacheInfo: {
        cached: false,
        cachedAt: Date.now(),
      },
    };

    it('should insert result successfully', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [], errors: [] }),
      } as Response);

      await expect(client.insertResult(mockResult, 'test.pdf')).resolves.toBeUndefined();
      expect(fetch).toHaveBeenCalled();
    });

    it('should handle insertion errors', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'Database error',
      } as Response);

      await expect(client.insertResult(mockResult, 'test.pdf')).rejects.toThrow();
    });
  });

});

