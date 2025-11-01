import type { ClassifyOptions, ClassifyResult, ClassifyFileOptions } from './types.js';
import { DocumentProcessor } from './preprocessing/document-processor.js';
import { TemplateLoader } from './templates/template-loader.js';
import { TemplateSelector } from './templates/template-selector.js';
import {
  ClassificationPipeline,
  type ClassificationPipelineResult,
} from './classification/pipeline.js';
import { FulltextGenerator } from './output/fulltext-generator.js';
import { CacheManager } from './cache/cache-manager.js';
import { ProviderFactory } from './llm/provider-factory.js';
import type { LLMProvider } from './llm/types.js';

/**
 * Main client for document classification
 */
export class ClassifyClient {
  private options: Omit<Required<ClassifyOptions>, 'templatesDir'> & { templatesDir?: string };
  private documentProcessor: DocumentProcessor;
  private templateLoader: TemplateLoader;
  private llmProvider: LLMProvider;
  private templateSelector: TemplateSelector;
  private classificationPipeline: ClassificationPipeline;
  private fulltextGenerator: FulltextGenerator;
  private cacheManager: CacheManager;
  private templatesLoaded = false;

  private templatesDir?: string;

  constructor(options: ClassifyOptions = {}) {
    this.templatesDir = options.templatesDir;

    // Initialize with defaults, merging provided options
    this.options = {
      provider: options.provider ?? 'deepseek',
      model: options.model ?? 'deepseek-chat',
      apiKey: options.apiKey ?? process.env.DEEPSEEK_API_KEY ?? '',
      cacheEnabled: options.cacheEnabled ?? true,
      cacheDir: options.cacheDir ?? '.classify-cache',
      templatesDir: options.templatesDir,
      compressionEnabled: options.compressionEnabled ?? true,
      compressionRatio: options.compressionRatio ?? 0.5,
    };

    // Validate API key if provided (unless using cursor-agent)
    if (this.options.apiKey === '' && this.options.provider !== 'cursor-agent') {
      console.warn('Warning: No API key provided. Set DEEPSEEK_API_KEY or pass apiKey in options.');
    }

    // Initialize components
    this.documentProcessor = new DocumentProcessor();
    this.templateLoader = new TemplateLoader();

    // cursor-agent doesn't need API key, others do
    const apiKey = this.options.provider === 'cursor-agent' ? 'not-needed' : this.options.apiKey;

    this.llmProvider = ProviderFactory.create(this.options.provider, {
      apiKey,
      model: this.options.model,
    });
    this.templateSelector = new TemplateSelector(this.llmProvider, this.templateLoader, {
      compressionEnabled: this.options.compressionEnabled,
      compressionRatio: this.options.compressionRatio,
    });
    this.classificationPipeline = new ClassificationPipeline(this.llmProvider, {
      compressionEnabled: this.options.compressionEnabled,
      compressionRatio: this.options.compressionRatio,
    });
    this.fulltextGenerator = new FulltextGenerator(this.llmProvider);
    this.cacheManager = new CacheManager({
      cacheDir: this.options.cacheDir,
      enabled: this.options.cacheEnabled,
    });
  }

  /**
   * Classify a document
   * @param filePath - Path to document file
   * @param options - Classification options
   * @returns Classification result
   */
  async classify(filePath: string, options: ClassifyFileOptions = {}): Promise<ClassifyResult> {
    const startTime = Date.now();

    // Initialize cache
    await this.cacheManager.initialize();

    // Load templates if not loaded yet
    if (!this.templatesLoaded) {
      await this.templateLoader.loadTemplates(this.templatesDir);
      this.templatesLoaded = true;
    }

    // Step 1: Process document (convert to markdown + hash)
    const processedDoc = await this.documentProcessor.process(filePath);

    // Step 2: Check cache
    const cached = await this.cacheManager.get(processedDoc.hash);
    if (cached) {
      // Return cached result with updated timing
      cached.performance.totalTimeMs = Date.now() - startTime;
      return cached;
    }

    // Step 3: Select template using LLM or use forced templateId
    let templateSelection;
    if (options.templateId) {
      // Use forced template
      templateSelection = {
        templateId: options.templateId,
        confidence: 1.0,
        tokens: { input: 0, output: 0, total: 0 },
        costUsd: 0,
      };
    } else {
      // Auto-select template using LLM
      templateSelection = await this.templateSelector.select(processedDoc.markdown);
    }

    // Get selected template
    const template = this.templateLoader.getTemplate(templateSelection.templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateSelection.templateId}`);
    }

    // Step 4: Extract entities and relationships
    const pipelineResult = await this.classificationPipeline.classify(processedDoc, template);

    // Step 5: Generate fulltext metadata
    const fulltextMetadata = await this.fulltextGenerator.generate(processedDoc, pipelineResult);

    // Step 6: Build final result
    const totalTimeMs = Date.now() - startTime;

    const result: ClassifyResult = {
      classification: {
        template: templateSelection.templateId,
        confidence: templateSelection.confidence,
        domain: pipelineResult.classification.domain,
        docType: pipelineResult.classification.docType,
      },
      graphStructure: {
        cypher: this.generateCypher(pipelineResult),
        entities: pipelineResult.entities,
        relationships: pipelineResult.relationships,
      },
      fulltextMetadata: {
        title: fulltextMetadata.title,
        domain: fulltextMetadata.domain,
        docType: fulltextMetadata.docType,
        extractedFields: fulltextMetadata.extractedFields,
        keywords: fulltextMetadata.keywords,
        summary: fulltextMetadata.summary,
      },
      cacheInfo: {
        cached: false,
        hash: processedDoc.hash,
      },
      performance: {
        totalTimeMs,
        tokens: {
          input: templateSelection.tokens.input + pipelineResult.tokens.extraction.input,
          output: templateSelection.tokens.output + pipelineResult.tokens.extraction.output,
          total:
            templateSelection.tokens.input +
            templateSelection.tokens.output +
            pipelineResult.tokens.total,
        },
        costUsd: templateSelection.costUsd + pipelineResult.costUsd,
      },
    };

    // Step 7: Cache the result
    await this.cacheManager.set(processedDoc.hash, result);

    return result;
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<import('./cache/cache-manager.js').CacheStats> {
    return this.cacheManager.getStats();
  }

  /**
   * Clear cache
   */
  async clearCache(options?: { olderThanDays?: number }): Promise<number> {
    if (options?.olderThanDays) {
      return this.cacheManager.clearOlderThan(options.olderThanDays);
    }
    return this.cacheManager.clear();
  }

  /**
   * Generate Cypher statements from classification result
   */
  private generateCypher(result: ClassificationPipelineResult): string {
    const statements: string[] = [];

    // Create Document node
    const docProps = `{
      id: "${result.classification.title.replace(/"/g, '\\"')}",
      title: "${result.classification.title.replace(/"/g, '\\"')}",
      domain: "${result.classification.domain}",
      doc_type: "${result.classification.docType}"
    }`;
    statements.push(`CREATE (doc:Document ${docProps})`);

    // Create entity nodes and relationships
    result.entities.forEach(
      (entity: { type: string; properties: Record<string, unknown> }, idx: number) => {
        const entityVar = `e${idx}`;
        const props = Object.entries(entity.properties)
          .map(([k, v]) => `${k}: "${String(v).replace(/"/g, '\\"')}"`)
          .join(', ');

        statements.push(`CREATE (${entityVar}:${entity.type} {${props}})`);
        statements.push(`CREATE (doc)-[:MENTIONS]->(${entityVar})`);
      }
    );

    return statements.join('\n');
  }
}
