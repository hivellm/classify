import type { ClassificationPipelineResult } from '../classification/pipeline.js';
import type { ProcessedDocument } from '../preprocessing/document-processor.js';
import type { LLMProvider } from '../llm/types.js';

/**
 * Fulltext metadata for search engines
 */
export interface FulltextMetadata {
  /** Document title */
  title: string;

  /** Document domain */
  domain: string;

  /** Document type */
  docType: string;

  /** Document summary */
  summary: string;

  /** Keywords for search */
  keywords: string[];

  /** Extracted fields */
  extractedFields: Record<string, unknown>;

  /** Named entities (people, orgs, locations) */
  namedEntities: {
    people: string[];
    organizations: string[];
    locations: string[];
    dates: string[];
    amounts: string[];
  };

  /** Document metadata */
  metadata: {
    fileSize: number;
    format: string;
    pageCount?: number;
    hash: string;
  };

  /** Full content for indexing */
  content: string;

  /** Content preview (first 500 chars) */
  preview: string;

  /** Timestamp */
  indexedAt: string;
}

/**
 * Fulltext Metadata Generator
 * Generates rich metadata for fulltext search engines
 */
export class FulltextGenerator {
  constructor(private llmProvider: LLMProvider) {}

  /**
   * Generate fulltext metadata from classification result
   */
  async generate(
    document: ProcessedDocument,
    classification: ClassificationPipelineResult
  ): Promise<FulltextMetadata> {
    // Extract keywords from document content
    const keywords = await this.extractKeywords(document.markdown);

    // Generate summary
    const summary = await this.generateSummary(document.markdown);

    // Extract named entities by category
    const namedEntities = this.categorizeEntities(classification.entities);

    // Build extracted fields from entities
    const extractedFields = this.buildExtractedFields(classification.entities);

    return {
      title: classification.classification.title,
      domain: classification.classification.domain,
      docType: classification.classification.docType,
      summary,
      keywords,
      extractedFields,
      namedEntities,
      metadata: {
        fileSize: document.metadata.fileSize,
        format: document.metadata.format,
        pageCount: document.metadata.pageCount,
        hash: document.hash,
      },
      content: document.markdown,
      preview: document.markdown.slice(0, 500).replace(/\n/g, ' ').trim(),
      indexedAt: new Date().toISOString(),
    };
  }

  /**
   * Extract keywords using TF-IDF-like approach
   */
  private async extractKeywords(content: string): Promise<string[]> {
    // Simple keyword extraction (can be enhanced with TF-IDF)
    const words = content
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3);

    // Count frequency
    const frequency: Record<string, number> = {};
    words.forEach((word) => {
      frequency[word] = (frequency[word] ?? 0) + 1;
    });

    // Remove common stopwords
    const stopwords = new Set([
      'this',
      'that',
      'with',
      'from',
      'have',
      'will',
      'been',
      'were',
      'said',
      'each',
      'which',
      'their',
      'would',
      'there',
      'about',
      'into',
      'than',
      'them',
      'these',
      'could',
      'other',
      'should',
    ]);

    Object.keys(frequency).forEach((word) => {
      if (stopwords.has(word)) {
        delete frequency[word];
      }
    });

    // Sort by frequency and take top 20
    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([word]) => word);
  }

  /**
   * Generate document summary using LLM
   */
  private async generateSummary(content: string): Promise<string> {
    try {
      const response = await this.llmProvider.complete({
        model: this.llmProvider.defaultModel,
        messages: [
          {
            role: 'system',
            content:
              'You are a document summarization expert. Create concise, informative summaries.',
          },
          {
            role: 'user',
            content: `Summarize this document in 2-3 sentences (max 150 words):

${content.slice(0, 2000)}${content.length > 2000 ? '...' : ''}`,
          },
        ],
        temperature: 0.3,
        maxTokens: 200,
      });

      return response.content.trim();
    } catch (error) {
      console.warn('Failed to generate summary:', error);
      // Fallback: use first paragraph
      const firstParagraph = content.split('\n\n')[0];
      return firstParagraph?.slice(0, 150) ?? 'No summary available';
    }
  }

  /**
   * Categorize entities by type
   */
  private categorizeEntities(
    entities: Array<{ type: string; properties: Record<string, unknown> }>
  ): {
    people: string[];
    organizations: string[];
    locations: string[];
    dates: string[];
    amounts: string[];
  } {
    const result = {
      people: [] as string[],
      organizations: [] as string[],
      locations: [] as string[],
      dates: [] as string[],
      amounts: [] as string[],
    };

    entities.forEach((entity) => {
      const name = String(entity.properties.name ?? '');

      switch (entity.type.toLowerCase()) {
        case 'person':
        case 'party':
        case 'individual':
        case 'employee':
        case 'author':
        case 'contact':
          if (name) result.people.push(name);
          break;

        case 'organization':
        case 'company':
        case 'corporation':
        case 'vendor':
        case 'client':
        case 'department':
          if (name) result.organizations.push(name);
          break;

        case 'location':
        case 'address':
        case 'city':
        case 'country':
          if (name) result.locations.push(name);
          break;

        case 'date':
        case 'deadline':
        case 'event': {
          const date = entity.properties.date ?? entity.properties.value;
          if (date) result.dates.push(String(date));
          break;
        }

        case 'amount':
        case 'price':
        case 'cost':
        case 'budget':
        case 'revenue': {
          const value = entity.properties.value ?? entity.properties.amount;
          if (value) result.amounts.push(String(value));
          break;
        }
      }
    });

    return result;
  }

  /**
   * Build extracted fields from entities
   */
  private buildExtractedFields(
    entities: Array<{ type: string; properties: Record<string, unknown> }>
  ): Record<string, unknown> {
    const fields: Record<string, unknown> = {};

    entities.forEach((entity) => {
      // Add all entity properties to extracted fields
      Object.entries(entity.properties).forEach(([key, value]) => {
        const fieldName = `${entity.type.toLowerCase()}_${key}`;
        
        if (!fields[fieldName]) {
          fields[fieldName] = value;
        } else if (Array.isArray(fields[fieldName])) {
          (fields[fieldName] as unknown[]).push(value);
        } else {
          fields[fieldName] = [fields[fieldName], value];
        }
      });
    });

    return fields;
  }
}

