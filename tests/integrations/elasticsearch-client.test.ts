import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ElasticsearchClient } from '../../src/integrations/elasticsearch-client.js';
import type { ClassifyResult } from '../../src/types.js';

// Mock fetch
global.fetch = vi.fn();

describe('ElasticsearchClient', () => {
  let client: ElasticsearchClient;

  const mockResult: ClassifyResult = {
    classification: {
      template: 'legal',
      confidence: 0.95,
      domain: 'legal',
      docType: 'contract',
    },
    graphStructure: {
      cypher: 'CREATE (n:Document)',
      entities: [],
      relationships: [],
    },
    fulltextMetadata: {
      keywords: ['contract', 'legal'],
      summary: 'Legal contract document',
      searchFields: { title: 'Contract' },
    },
    cacheInfo: {
      cached: false,
      cachedAt: Date.now(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    client = new ElasticsearchClient({
      url: 'http://localhost:9200',
      index: 'test-index',
    });
  });

  describe('initialize', () => {
    it('should successfully connect to Elasticsearch', async () => {
      // Mock health check
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ cluster_name: 'test', version: { number: '8.0.0' } }),
      } as Response);

      // Mock index exists check
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
      } as Response);

      await expect(client.initialize()).resolves.toBeUndefined();
      expect(fetch).toHaveBeenCalled();
    });

    it('should create index if it does not exist', async () => {
      // First call: health check
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ cluster_name: 'test' }),
      } as Response);

      // Second call: index check (404 = doesn't exist)
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      // Third call: create index
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ acknowledged: true }),
      } as Response);

      await client.initialize();
      expect(fetch).toHaveBeenCalledTimes(3);
    });

    it('should use authentication when provided', async () => {
      const authClient = new ElasticsearchClient({
        url: 'http://localhost:9200',
        index: 'test-index',
        auth: {
          username: 'elastic',
          password: 'password',
        },
      });

      // Mock health check
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ cluster_name: 'test' }),
      } as Response);

      // Mock index check
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
      } as Response);

      await authClient.initialize();
      expect(fetch).toHaveBeenCalled();
    });

    it('should use API key when provided', async () => {
      const apiClient = new ElasticsearchClient({
        url: 'http://localhost:9200',
        index: 'test-index',
        apiKey: 'test-api-key',
      });

      // Mock health check
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ cluster_name: 'test' }),
      } as Response);

      // Mock index check
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
      } as Response);

      await apiClient.initialize();
      expect(fetch).toHaveBeenCalled();
    });

    it('should throw error on connection failure', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
        text: async () => 'Cluster unavailable',
      } as Response);

      await expect(client.initialize()).rejects.toThrow('Elasticsearch connection failed');
    });
  });

  describe('insertResult', () => {
    it('should insert document successfully', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: 'created', _id: '1' }),
      } as Response);

      await expect(client.insertResult(mockResult, 'contract.pdf')).resolves.toBeUndefined();
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('test-index/_doc'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should handle insertion errors', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: async () => 'Invalid document',
      } as Response);

      await expect(client.insertResult(mockResult, 'test.pdf')).rejects.toThrow();
    });

    it('should include fulltext metadata', async () => {
      let capturedBody: any;
      vi.mocked(fetch).mockImplementationOnce(async (url, options: any) => {
        capturedBody = JSON.parse(options.body);
        return {
          ok: true,
          json: async () => ({ result: 'created' }),
        } as Response;
      });

      await client.insertResult(mockResult, 'test.pdf');

      expect(capturedBody).toBeDefined();
      expect(capturedBody.keywords).toEqual(['contract', 'legal']);
      expect(capturedBody.summary).toBe('Legal contract document');
    });
  });

  describe('close', () => {
    it('should close connection without errors', async () => {
      await expect(client.close()).resolves.toBeUndefined();
    });
  });
});
