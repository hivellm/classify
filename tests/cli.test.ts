import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

const CLI_PATH = './dist/cli.js';

describe('CLI', () => {
  describe('--help', () => {
    it('should display help message', () => {
      const output = execSync(`node ${CLI_PATH} --help`, { encoding: 'utf-8' });
      
      expect(output).toContain('Usage: classify');
      expect(output).toContain('Intelligent document classification');
      expect(output).toContain('Commands:');
      expect(output).toContain('document');
      expect(output).toContain('batch');
      expect(output).toContain('list-templates');
    });
  });

  describe('--version', () => {
    it('should display version', () => {
      const output = execSync(`node ${CLI_PATH} --version`, { encoding: 'utf-8' });
      
      expect(output).toMatch(/\d+\.\d+\.\d+/);
      expect(output.trim()).toBe('0.1.0');
    });
  });

  describe('list-templates', () => {
    it('should list all available templates', () => {
      const output = execSync(`node ${CLI_PATH} list-templates`, { encoding: 'utf-8' });
      
      expect(output).toContain('Available Templates');
      expect(output).toContain('legal');
      expect(output).toContain('financial');
      expect(output).toContain('hr');
      expect(output).toContain('engineering');
      expect(output).toContain('base');
    });

    it('should show template priorities', () => {
      const output = execSync(`node ${CLI_PATH} list-templates`, { encoding: 'utf-8' });
      
      expect(output).toContain('Priority: 95'); // legal
      expect(output).toContain('Priority: 50'); // base
    });
  });

  describe('document command', () => {
    it('should show not implemented message', () => {
      try {
        execSync(`node ${CLI_PATH} document test.pdf`, { encoding: 'utf-8' });
      } catch (error: any) {
        const output = error.stdout?.toString() || '';
        expect(output).toContain('Classifying document: test.pdf');
        expect(output).toContain('Not implemented yet');
      }
    });
  });

  describe('batch command', () => {
    it('should show not implemented message', () => {
      try {
        execSync(`node ${CLI_PATH} batch ./docs`, { encoding: 'utf-8' });
      } catch (error: any) {
        const output = error.stdout?.toString() || '';
        expect(output).toContain('Batch processing directory: ./docs');
        expect(output).toContain('Not implemented yet');
      }
    });
  });

  describe('cache-stats command', () => {
    it('should show cache statistics header', () => {
      try {
        execSync(`node ${CLI_PATH} cache-stats`, { encoding: 'utf-8' });
      } catch (error: any) {
        const output = error.stdout?.toString() || '';
        expect(output).toContain('Cache Statistics');
        expect(output).toContain('Not implemented yet');
      }
    });
  });
});

