import { createHash } from 'crypto';
import { readFile } from 'fs/promises';
import { Converter } from '@hivellm/transmutation-lite';

/**
 * Document processing result
 */
export interface ProcessedDocument {
  /** Original file path */
  filePath: string;

  /** Markdown content */
  markdown: string;

  /** SHA256 hash of original content */
  hash: string;

  /** Document metadata */
  metadata: {
    /** File format (pdf, docx, etc) */
    format: string;

    /** File size in bytes */
    fileSize: number;

    /** Page count (if applicable) */
    pageCount?: number;

    /** Processing time in ms */
    processingTimeMs: number;
  };
}

/**
 * Document Preprocessor
 * Converts documents to Markdown and calculates SHA256 hashes
 */
export class DocumentProcessor {
  private converter: Converter;

  constructor() {
    this.converter = new Converter({
      enableCache: true,
      cacheSize: 100,
    });
  }

  /**
   * Process a document file
   * @param filePath - Path to document
   * @returns Processed document with markdown and hash
   */
  async process(filePath: string): Promise<ProcessedDocument> {
    const startTime = Date.now();

    // Read file content for hashing
    const buffer = await readFile(filePath);
    const hash = this.calculateHash(buffer);

    // Convert to markdown
    const result = await this.converter.convertFile(filePath);

    const processingTimeMs = Date.now() - startTime;

    return {
      filePath,
      markdown: result.markdown,
      hash,
      metadata: {
        format: result.metadata.format,
        fileSize: result.metadata.fileSize,
        pageCount: result.metadata.pageCount,
        processingTimeMs,
      },
    };
  }

  /**
   * Process markdown text directly (for testing or when already in markdown)
   * @param content - Markdown content
   * @returns Processed document
   */
  async processMarkdown(content: string): Promise<ProcessedDocument> {
    const hash = this.calculateHash(Buffer.from(content, 'utf-8'));

    return {
      filePath: '<markdown-input>',
      markdown: content,
      hash,
      metadata: {
        format: 'markdown',
        fileSize: Buffer.byteLength(content, 'utf-8'),
        processingTimeMs: 0,
      },
    };
  }

  /**
   * Calculate SHA256 hash of buffer
   */
  private calculateHash(buffer: Buffer): string {
    return createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Check if a file format is supported
   */
  isSupported(filePath: string): boolean {
    return this.converter.isSupported(filePath);
  }

  /**
   * Get supported formats
   */
  getSupportedFormats(): string[] {
    return this.converter.getSupportedFormats();
  }
}

