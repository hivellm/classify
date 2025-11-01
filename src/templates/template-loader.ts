import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

/**
 * Classification template (simplified view of actual template structure)
 */
export interface ClassificationTemplate {
  /** Schema version */
  $schema: string;

  /** Template version */
  version: string;

  /** Template metadata */
  metadata: {
    name: string;
    display_name: string;
    description: string;
    domains: string[];
    priority: number;
    indicators: string[];
    document_types: string[];
  };

  /** LLM configuration */
  llm_config: {
    provider: string;
    model: string;
    temperature: number;
    max_tokens: number;
    system_prompt: string;
    fallback_models?: string[];
  };

  /** Document types */
  document_types: Array<{
    type: string;
    display_name: string;
    description: string;
    indicators: string[];
    required_entities: string[];
    optional_entities: string[];
    priority: number;
  }>;

  /** Entity definitions */
  entity_definitions: Array<{
    type: string;
    description: string;
    properties: Record<string, { type: string; required: boolean }>;
    extraction_methods: string[];
    patterns?: string[];
  }>;

  /** Relationship definitions */
  relationship_definitions: Array<{
    type: string;
    description: string;
    source: string;
    target: string[];
    properties?: Record<string, { type: string; required: boolean }>;
    extraction_methods: string[];
  }>;

  /** Graph schema */
  graph_schema: {
    nodes: unknown[];
    relationships: unknown[];
  };

  /** Fulltext schema */
  fulltext_schema: {
    required_fields: string[];
    extracted_fields: unknown[];
    keyword_extraction: unknown;
    categories: string[];
    summary: unknown;
  };

  /** Extraction rules */
  extraction_rules: unknown[];

  /** Validation rules */
  validation_rules: unknown[];
}

/**
 * Template index for LLM selection
 */
export interface TemplateIndex {
  $schema: string;
  version: string;
  metadata: {
    description: string;
    total_templates: number;
    last_updated: string;
  };
  templates: Array<{
    name: string;
    priority: number;
    display_name: string;
    description: string;
    best_for: string[];
    key_indicators: string[];
    example_documents: string[];
    domain_expertise: string[];
    use_when: string;
  }>;
}

/**
 * Template Loader
 * Loads and validates classification templates
 */
export class TemplateLoader {
  private templates: Map<string, ClassificationTemplate> = new Map();
  private index: TemplateIndex | null = null;

  /**
   * Load templates from directory
   * @param templateDir - Directory containing template JSON files
   */
  async loadTemplates(templateDir?: string): Promise<void> {
    const dir = templateDir ?? this.getDefaultTemplateDir();

    // Load index first
    const indexPath = join(dir, 'index.json');
    const indexContent = await readFile(indexPath, 'utf-8');
    this.index = JSON.parse(indexContent) as TemplateIndex;

    // Load all template files
    const files = await readdir(dir);
    const templateFiles = files.filter((f) => f.endsWith('.json') && f !== 'index.json');

    for (const file of templateFiles) {
      const filePath = join(dir, file);
      const content = await readFile(filePath, 'utf-8');
      const template = JSON.parse(content) as ClassificationTemplate;

      // Validate template
      this.validateTemplate(template);

      this.templates.set(template.metadata.name, template);
    }
  }

  /**
   * Get a template by ID
   */
  getTemplate(id: string): ClassificationTemplate | undefined {
    return this.templates.get(id);
  }

  /**
   * Get all templates
   */
  getAllTemplates(): ClassificationTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get template index
   */
  getIndex(): TemplateIndex {
    if (!this.index) {
      throw new Error('Templates not loaded. Call loadTemplates() first.');
    }
    return this.index;
  }

  /**
   * Get template IDs
   */
  getTemplateIds(): string[] {
    return Array.from(this.templates.keys());
  }

  /**
   * Check if a template exists
   */
  hasTemplate(id: string): boolean {
    return this.templates.has(id);
  }

  /**
   * Get default template directory
   */
  private getDefaultTemplateDir(): string {
    // Get the directory of this module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // When running from dist/, go up ONE level to find templates/
    // dist/index.js or dist/cli.js -> ../templates/standard
    const templatePath = join(__dirname, '..', 'templates', 'standard');

    return templatePath;
  }

  /**
   * Validate template structure
   */
  private validateTemplate(template: ClassificationTemplate): void {
    if (!template.metadata?.name || typeof template.metadata.name !== 'string') {
      throw new Error('Template must have a valid metadata.name');
    }

    if (!template.metadata?.display_name || typeof template.metadata.display_name !== 'string') {
      throw new Error(`Template ${template.metadata.name} must have a valid display_name`);
    }

    if (!Array.isArray(template.metadata?.domains) || template.metadata.domains.length === 0) {
      throw new Error(`Template ${template.metadata.name} must have domains array`);
    }

    if (!Array.isArray(template.entity_definitions)) {
      throw new Error(`Template ${template.metadata.name} must have entity_definitions array`);
    }

    if (!Array.isArray(template.relationship_definitions)) {
      throw new Error(
        `Template ${template.metadata.name} must have relationship_definitions array`
      );
    }

    if (!template.llm_config?.system_prompt) {
      throw new Error(
        `Template ${template.metadata.name} must have valid llm_config.system_prompt`
      );
    }
  }
}
