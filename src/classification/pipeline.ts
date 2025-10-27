import type { ProcessedDocument } from '../preprocessing/document-processor.js';
import type { ClassificationTemplate } from '../templates/template-loader.js';
import type { LLMProvider, LLMMessage } from '../llm/types.js';

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
}

/**
 * Classification Pipeline
 * Orchestrates the complete classification process
 */
export class ClassificationPipeline {
  constructor(private llmProvider: LLMProvider) {}

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

Respond with JSON in this format:
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
}`;

    return [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];
  }
}

