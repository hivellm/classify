import type { ClassifyOptions, ClassifyResult } from './types.js';
import { DocumentProcessor } from './preprocessing/document-processor.js';
import { TemplateLoader } from './templates/template-loader.js';
import { TemplateSelector } from './templates/template-selector.js';
import {
  ClassificationPipeline,
  type ClassificationPipelineResult,
} from './classification/pipeline.js';
import { FulltextGenerator } from './output/fulltext-generator.js';
import { ProviderFactory } from './llm/provider-factory.js';
import type { LLMProvider } from './llm/types.js';

/**
 * Main client for document classification
 */
export class ClassifyClient {
  private options: Required<ClassifyOptions>;
  private documentProcessor: DocumentProcessor;
  private templateLoader: TemplateLoader;
  private llmProvider: LLMProvider;
  private templateSelector: TemplateSelector;
  private classificationPipeline: ClassificationPipeline;
  private fulltextGenerator: FulltextGenerator;
  private templatesLoaded = false;

  constructor(options: ClassifyOptions = {}) {
    // Initialize with defaults, merging provided options
    this.options = {
      provider: options.provider ?? 'deepseek',
      model: options.model ?? 'deepseek-chat',
      apiKey: options.apiKey ?? process.env.DEEPSEEK_API_KEY ?? '',
      cacheEnabled: options.cacheEnabled ?? true,
      cacheDir: options.cacheDir ?? '.classify-cache',
      compressionEnabled: options.compressionEnabled ?? true,
      compressionRatio: options.compressionRatio ?? 0.5,
    };

    // Validate API key if provided
    if (this.options.apiKey === '') {
      console.warn(
        'Warning: No API key provided. Set DEEPSEEK_API_KEY or pass apiKey in options.'
      );
    }

    // Initialize components
    this.documentProcessor = new DocumentProcessor();
    this.templateLoader = new TemplateLoader();
    this.llmProvider = ProviderFactory.create(this.options.provider, {
      apiKey: this.options.apiKey,
      model: this.options.model,
    });
    this.templateSelector = new TemplateSelector(
      this.llmProvider,
      this.templateLoader,
      {
        compressionEnabled: this.options.compressionEnabled,
        compressionRatio: this.options.compressionRatio,
      }
    );
    this.classificationPipeline = new ClassificationPipeline(this.llmProvider, {
      compressionEnabled: this.options.compressionEnabled,
      compressionRatio: this.options.compressionRatio,
    });
    this.fulltextGenerator = new FulltextGenerator(this.llmProvider);
  }

  /**
   * Classify a document
   * @param filePath - Path to document file
   * @returns Classification result
   */
  async classify(filePath: string): Promise<ClassifyResult> {
    const startTime = Date.now();

    // Load templates if not loaded yet
    if (!this.templatesLoaded) {
      await this.templateLoader.loadTemplates();
      this.templatesLoaded = true;
    }

    // Step 1: Process document (convert to markdown + hash)
    const processedDoc = await this.documentProcessor.process(filePath);

    // TODO: Check cache here

    // Step 2: Select template using LLM
    const templateSelection = await this.templateSelector.select(
      processedDoc.markdown
    );

    // Get selected template
    const template = this.templateLoader.getTemplate(templateSelection.templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateSelection.templateId}`);
    }

    // Step 3: Extract entities and relationships
    const pipelineResult = await this.classificationPipeline.classify(
      processedDoc,
      template
    );

    // Step 4: Generate fulltext metadata
    const fulltextMetadata = await this.fulltextGenerator.generate(
      processedDoc,
      pipelineResult
    );

    // Step 5: Build final result
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
          input:
            templateSelection.tokens.input +
            pipelineResult.tokens.extraction.input,
          output:
            templateSelection.tokens.output +
            pipelineResult.tokens.extraction.output,
          total:
            templateSelection.tokens.input +
            templateSelection.tokens.output +
            pipelineResult.tokens.total,
        },
        costUsd: templateSelection.costUsd + pipelineResult.costUsd,
      },
    };

    return result;
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
      (
        entity: { type: string; properties: Record<string, unknown> },
        idx: number
      ) => {
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

