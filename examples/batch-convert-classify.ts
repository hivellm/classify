/**
 * Example: Batch convert and classify multiple documents
 * 
 * This example shows how to process multiple documents in a directory,
 * converting them to Markdown and then classifying each one.
 */

import { Converter } from '@hivellm/transmutation-lite';
import { ClassifyClient } from '@hivellm/classify';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

async function batchConvertAndClassify(
  directoryPath: string,
  options: {
    recursive?: boolean;
    parallel?: number;
    maxPages?: number;
  } = {}
) {
  const { recursive = false, parallel = 4, maxPages = 0 } = options;

  try {
    // Initialize converters
    const converter = new Converter();
    const classifier = new ClassifyClient({
      provider: 'deepseek',
      apiKey: process.env.DEEPSEEK_API_KEY,
      cacheEnabled: true,
      compressionEnabled: true,
    });

    // Find all files
    const files = await findFiles(directoryPath, recursive);
    const supportedFiles = files.filter((file) => converter.isSupported(file));

    console.log(`📁 Found ${supportedFiles.length} supported files`);

    if (supportedFiles.length === 0) {
      console.log('❌ No supported files found');
      return [];
    }

    const results = [];
    let completed = 0;
    let failed = 0;

    // Process files in batches for parallelism
    for (let i = 0; i < supportedFiles.length; i += parallel) {
      const batch = supportedFiles.slice(i, i + parallel);

      await Promise.all(
        batch.map(async (filePath) => {
          try {
            // Convert
            const conversionResult = await converter.convertFile(filePath, {
              maxPages,
              preserveFormatting: true,
            });

            // Classify
            const classificationResult = await classifier.classifyText(
              conversionResult.markdown
            );

            completed++;
            console.log(
              `✅ [${completed}/${supportedFiles.length}] ${filePath.split('/').pop()} - ${classificationResult.classification.domain}/${classificationResult.classification.doc_type} (${conversionResult.conversionTimeMs}ms + ${classificationResult.performance.totalTimeMs}ms)`
            );

            results.push({
              filePath,
              conversion: conversionResult,
              classification: classificationResult,
            });
          } catch (error) {
            failed++;
            console.error(
              `❌ [${completed + failed}/${supportedFiles.length}] ${filePath.split('/').pop()}: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
          }
        })
      );
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Total: ${supportedFiles.length}`);
    console.log(`   Success: ${completed}`);
    console.log(`   Failed: ${failed}`);

    // Statistics by domain
    const byDomain = results.reduce(
      (acc, r) => {
        const domain = r.classification.classification.domain;
        acc[domain] = (acc[domain] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    console.log(`\n📈 By Domain:`);
    Object.entries(byDomain)
      .sort(([, a], [, b]) => b - a)
      .forEach(([domain, count]) => {
        console.log(`   ${domain}: ${count}`);
      });

    return results;
  } catch (error) {
    console.error(`❌ Batch processing failed:`, error);
    throw error;
  }
}

async function findFiles(
  dir: string,
  recursive: boolean = false
): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = await stat(fullPath);

    if (stats.isDirectory() && recursive) {
      const subFiles = await findFiles(fullPath, recursive);
      files.push(...subFiles);
    } else if (stats.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

// Example usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const directoryPath = process.argv[2];

  if (!directoryPath) {
    console.error('Usage: tsx batch-convert-classify.ts <directory-path>');
    console.error('Example: tsx batch-convert-classify.ts ./documents');
    process.exit(1);
  }

  batchConvertAndClassify(directoryPath, {
    recursive: true,
    parallel: 4,
    maxPages: 10,
  })
    .then(() => {
      console.log('\n✨ Batch processing complete!');
    })
    .catch((error) => {
      console.error('\n❌ Batch processing failed:', error.message);
      process.exit(1);
    });
}

export { batchConvertAndClassify };

