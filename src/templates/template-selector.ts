import type { LLMProvider } from '../llm/types.js';
import type { TemplateLoader, TemplateIndex } from './template-loader.js';

/**
 * Template selection result
 */
export interface TemplateSelection {
  /** Selected template ID */
  templateId: string;

  /** Confidence score (0-1) */
  confidence: number;

  /** Reasoning for selection */
  reasoning: string;

  /** Token usage */
  tokens: {
    input: number;
    output: number;
  };

  /** Cost in USD */
  costUsd: number;
}

/**
 * Template Selector
 * Uses LLM to select the best template for a document
 */
export class TemplateSelector {
  constructor(
    private llmProvider: LLMProvider,
    private templateLoader: TemplateLoader
  ) {}

  /**
   * Select best template for a document
   * @param documentContent - Document markdown content
   * @returns Template selection result
   */
  async select(documentContent: string): Promise<TemplateSelection> {
    const index = this.templateLoader.getIndex();
    const prompt = this.buildSelectionPrompt(index, documentContent);

    const response = await this.llmProvider.complete({
      model: this.llmProvider.defaultModel,
      messages: [
        {
          role: 'system',
          content: prompt.system,
        },
        {
          role: 'user',
          content: prompt.user,
        },
      ],
      temperature: 0.3, // Low temperature for consistent selection
      jsonMode: true,
    });

    // Parse LLM response
    const result = JSON.parse(response.content) as {
      template_id: string;
      confidence: number;
      reasoning: string;
    };

    // Validate selected template exists
    if (!this.templateLoader.hasTemplate(result.template_id)) {
      throw new Error(
        `LLM selected invalid template: ${result.template_id}`
      );
    }

    return {
      templateId: result.template_id,
      confidence: result.confidence,
      reasoning: result.reasoning,
      tokens: {
        input: response.usage.inputTokens,
        output: response.usage.outputTokens,
      },
      costUsd: response.costUsd,
    };
  }

  /**
   * Build template selection prompt
   */
  private buildSelectionPrompt(
    index: TemplateIndex,
    documentContent: string
  ): { system: string; user: string } {
    const templatesInfo = index.templates
      .map(
        (t) =>
          `- **${t.name}**: ${t.display_name} - ${t.description}\n  Domains: ${t.domain_expertise.join(', ')}\n  Indicators: ${t.key_indicators.join(', ')}`
      )
      .join('\n\n');

    const system = `You are a document classification expert. Your task is to analyze a document and select the most appropriate classification template.

Available templates:

${templatesInfo}

Analyze the document content and select the SINGLE best template that matches:
1. The document's domain and purpose
2. The type of entities and relationships present
3. The document's structure and content

Respond with JSON in this exact format:
{
  "template_id": "selected_template_id",
  "confidence": 0.95,
  "reasoning": "Brief explanation of why this template was selected"
}

Confidence should be between 0 and 1, where:
- 0.9-1.0: Excellent match
- 0.7-0.9: Good match
- 0.5-0.7: Moderate match
- <0.5: Poor match (use base template)

If the document doesn't fit any specialized template well, select "base" with appropriate confidence.`;

    const user = `Analyze this document and select the best classification template:

\`\`\`markdown
${documentContent.slice(0, 3000)}${documentContent.length > 3000 ? '\n...(truncated)' : ''}
\`\`\`

Respond with JSON only.`;

    return { system, user };
  }
}

