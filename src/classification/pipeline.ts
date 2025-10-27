import type { ProcessedDocument } from '../preprocessing/document-processor.js';
import type { ClassificationTemplate } from '../templates/template-loader.js';
import type { LLMProvider, LLMMessage } from '../llm/types.js';
import { PromptCompressor } from '../compression/prompt-compressor.js';

/**
 * Classification result from pipeline
 */
export interface ClassificationPipelineResult {
  /** Selected template */
  template: ClassificationTemplate;

  /** Template selection confidence */
  confidence: number;

  /** Extracted entities */
  entities: Array<{
    type: string;
    properties: Record<string, unknown>;
  }>;

  /** Extracted relationships */
  relationships: Array<{
    type: string;
    source: string;
    target: string;
    properties: Record<string, unknown>;
  }>;

  /** Document classification */
  classification: {
    domain: string;
    docType: string;
    title: string;
  };

  /** Token usage */
  tokens: {
    selection: { input: number; output: number };
    extraction: { input: number; output: number };
    total: number;
  };

  /** Cost tracking */
  costUsd: number;

  /** Compression metrics */
  compression?: {
    originalTokens: number;
    compressedTokens: number;
    tokenReduction: number;
    compressionTimeMs: number;
  };
}

/**
 * Classification Pipeline
 * Orchestrates the complete classification process
 */
export class ClassificationPipeline {
  private compressor: PromptCompressor;

  constructor(
    private llmProvider: LLMProvider,
    options: { compressionEnabled?: boolean; compressionRatio?: number } = {}
  ) {
    this.compressor = new PromptCompressor({
      enabled: options.compressionEnabled ?? true,
      targetRatio: options.compressionRatio ?? 0.5,
    });
  }

  /**
   * Classify a processed document using a template
   * @param document - Processed document
   * @param template - Classification template
   * @returns Classification result
   */
  async classify(
    document: ProcessedDocument,
    template: ClassificationTemplate
  ): Promise<ClassificationPipelineResult> {
    // Build extraction prompt
    const messages = this.buildExtractionMessages(document, template);

    // Compress only document content, keep JSON instructions intact
    const userMessage = messages[1];
    if (!userMessage) {
      throw new Error('User message not found in extraction prompt');
    }
    
    // Extract document content for compression (between ``` markers)
    let compressionResult = null;
    const contentMatch = userMessage.content.match(/```markdown\n([\s\S]*?)\n```/);
    if (contentMatch && contentMatch[1]) {
      const originalContent = contentMatch[1];
      compressionResult = this.compressor.compress(originalContent);
      
      // Replace only the document content, keep JSON instructions
      userMessage.content = userMessage.content.replace(
        /```markdown\n[\s\S]*?\n```/,
        `\`\`\`markdown\n${compressionResult.compressed}\n\`\`\``
      );
    }

    // Execute LLM extraction
    const response = await this.llmProvider.complete({
      model: template.llm_config.model,
      messages,
      temperature: template.llm_config.temperature,
      maxTokens: template.llm_config.max_tokens,
      jsonMode: true,
    });

    // Parse LLM response
    const extracted = JSON.parse(response.content) as {
      title: string;
      doc_type: string;
      entities: Array<{ type: string; properties: Record<string, unknown> }>;
      relationships: Array<{
        type: string;
        source: string;
        target: string;
        properties: Record<string, unknown>;
      }>;
    };

    return {
      template,
      confidence: 1.0, // TODO: Calculate based on extraction quality
      entities: extracted.entities ?? [],
      relationships: extracted.relationships ?? [],
      classification: {
        domain: template.metadata.domains[0] ?? 'general',
        docType: extracted.doc_type ?? 'document',
        title: extracted.title ?? 'Untitled Document',
      },
      tokens: {
        selection: { input: 0, output: 0 }, // Filled by caller
        extraction: {
          input: response.usage.inputTokens,
          output: response.usage.outputTokens,
        },
        total: response.usage.totalTokens,
      },
      costUsd: response.costUsd,
      ...(compressionResult &&
        this.compressor.isEnabled() && {
          compression: {
            originalTokens: compressionResult.originalTokens,
            compressedTokens: compressionResult.compressedTokens,
            tokenReduction: compressionResult.tokenReduction,
            compressionTimeMs: compressionResult.compressionTimeMs,
          },
        }),
    };
  }

  /**
   * Build messages for entity/relationship extraction
   */
  private buildExtractionMessages(
    document: ProcessedDocument,
    template: ClassificationTemplate
  ): LLMMessage[] {
    const systemPrompt = template.llm_config.system_prompt;

    const userPrompt = `Analyze this document and extract structured information according to the template.

Document Content:
\`\`\`markdown
${document.markdown.slice(0, 10000)}${document.markdown.length > 10000 ? '\n...(truncated)' : ''}
\`\`\`

Expected entities: ${template.entity_definitions.map((e) => e.type).join(', ')}
Expected relationships: ${template.relationship_definitions.map((r) => r.type).join(', ')}

IMPORTANT: Respond with valid JSON in this exact format:
{
  "title": "Document title",
  "doc_type": "specific document type from template",
  "entities": [
    {
      "type": "EntityType",
      "properties": { "name": "value", ... }
    }
  ],
  "relationships": [
    {
      "type": "RELATIONSHIP_TYPE",
      "source": "source_entity_name",
      "target": "target_entity_name",
      "properties": {}
    }
  ]
}

Your entire response must be valid JSON. Do not include any other text.`;

    return [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];
  }
}

