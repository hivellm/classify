import { describe, it, expect, beforeAll } from 'vitest';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { DocumentProcessor } from '../../src/preprocessing/document-processor.js';

describe('DocumentProcessor', () => {
  const testDir = join(process.cwd(), 'tests', 'temp-preprocessing');
  const processor = new DocumentProcessor();

  beforeAll(async () => {
    // Create test directory
    await mkdir(testDir, { recursive: true });
  });

  describe('processMarkdown', () => {
    it('should process markdown text', async () => {
      const content = '# Test Document\n\nThis is a test.';
      const result = await processor.processMarkdown(content);

      expect(result.markdown).toBe(content);
      expect(result.hash).toMatch(/^[a-f0-9]{64}$/); // SHA256 hex
      expect(result.metadata.format).toBe('markdown');
      expect(result.metadata.fileSize).toBeGreaterThan(0);
    });

    it('should generate consistent hashes', async () => {
      const content = '# Test';
      const result1 = await processor.processMarkdown(content);
      const result2 = await processor.processMarkdown(content);

      expect(result1.hash).toBe(result2.hash);
    });

    it('should generate different hashes for different content', async () => {
      const result1 = await processor.processMarkdown('# Test 1');
      const result2 = await processor.processMarkdown('# Test 2');

      expect(result1.hash).not.toBe(result2.hash);
    });
  });

  describe('process', () => {
    it('should process a text file', async () => {
      const filePath = join(testDir, 'test.txt');
      await writeFile(filePath, 'Test content');

      const result = await processor.process(filePath);

      expect(result.filePath).toBe(filePath);
      expect(result.markdown).toContain('Test content');
      expect(result.hash).toMatch(/^[a-f0-9]{64}$/);
      expect(result.metadata.format).toBe('txt');
      expect(result.metadata.processingTimeMs).toBeGreaterThanOrEqual(0);
    });

    it('should process an HTML file', async () => {
      const filePath = join(testDir, 'test.html');
      await writeFile(filePath, '<html><body><h1>Test</h1></body></html>');

      const result = await processor.process(filePath);

      expect(result.markdown).toContain('Test');
      expect(result.metadata.format).toBe('html');
    });
  });

  describe('isSupported', () => {
    it('should return true for supported formats', () => {
      expect(processor.isSupported('test.pdf')).toBe(true);
      expect(processor.isSupported('test.docx')).toBe(true);
      expect(processor.isSupported('test.txt')).toBe(true);
      expect(processor.isSupported('test.html')).toBe(true);
    });

    it('should return false for unsupported formats', () => {
      expect(processor.isSupported('test.unknown')).toBe(false);
      expect(processor.isSupported('test.exe')).toBe(false);
    });
  });

  describe('getSupportedFormats', () => {
    it('should return list of supported formats', () => {
      const formats = processor.getSupportedFormats();

      expect(Array.isArray(formats)).toBe(true);
      expect(formats.length).toBeGreaterThan(0);
      expect(formats).toContain('pdf');
      expect(formats).toContain('docx');
    });
  });
});

