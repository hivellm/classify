import { describe, it, expect, beforeAll } from 'vitest';
import { TemplateLoader } from '../../src/templates/template-loader.js';
import { join } from 'path';

describe('TemplateLoader', () => {
  const loader = new TemplateLoader();
  const templateDir = join(process.cwd(), 'templates');

  beforeAll(async () => {
    await loader.loadTemplates(templateDir);
  });

  describe('loadTemplates', () => {
    it('should load templates from directory', () => {
      const templates = loader.getAllTemplates();
      expect(templates.length).toBeGreaterThan(0);
    });

    it('should load template index', () => {
      const index = loader.getIndex();
      expect(index).toBeDefined();
      expect(Array.isArray(index.templates)).toBe(true);
    });
  });

  describe('getTemplate', () => {
    it('should get template by name', () => {
      const template = loader.getTemplate('base');
      expect(template).toBeDefined();
      expect(template?.metadata.name).toBe('base');
    });

    it('should return undefined for non-existent template', () => {
      const template = loader.getTemplate('non-existent');
      expect(template).toBeUndefined();
    });
  });

  describe('getAllTemplates', () => {
    it('should return all templates', () => {
      const templates = loader.getAllTemplates();
      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBeGreaterThan(0);
    });

    it('should return templates with required fields', () => {
      const templates = loader.getAllTemplates();
      templates.forEach((template) => {
        expect(template.metadata.name).toBeDefined();
        expect(template.metadata.display_name).toBeDefined();
        expect(Array.isArray(template.metadata.domains)).toBe(true);
        expect(Array.isArray(template.entity_definitions)).toBe(true);
        expect(Array.isArray(template.relationship_definitions)).toBe(true);
        expect(template.llm_config.system_prompt).toBeDefined();
      });
    });
  });

  describe('getTemplateIds', () => {
    it('should return array of template IDs', () => {
      const ids = loader.getTemplateIds();
      expect(Array.isArray(ids)).toBe(true);
      expect(ids.length).toBeGreaterThan(0);
      expect(ids).toContain('base');
    });
  });

  describe('hasTemplate', () => {
    it('should return true for existing template', () => {
      expect(loader.hasTemplate('base')).toBe(true);
    });

    it('should return false for non-existent template', () => {
      expect(loader.hasTemplate('non-existent')).toBe(false);
    });
  });
});

