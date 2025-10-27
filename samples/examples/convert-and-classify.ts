/**
 * Example: Convert document and classify using Classify + Transmutation Lite
 * 
 * This example demonstrates how to integrate Transmutation Lite with Classify
 * to convert documents to Markdown before classification.
 */

import { convert } from '@hivellm/transmutation-lite';
import { ClassifyClient } from '@hivellm/classify';

async function convertAndClassify(filePath: string) {
  try {
    // Step 1: Convert document to Markdown
    console.log(`📄 Converting: ${filePath}`);
    const conversionResult = await convert(filePath);

    console.log(`✅ Converted successfully!`);
    console.log(`   Format: ${conversionResult.metadata.format}`);
    console.log(`   Pages: ${conversionResult.metadata.pageCount || 'N/A'}`);
    console.log(`   Time: ${conversionResult.conversionTimeMs}ms`);
    console.log(`   Length: ${conversionResult.markdown.length} characters`);

    if (conversionResult.warnings && conversionResult.warnings.length > 0) {
      console.log(`⚠️  Warnings:`);
      conversionResult.warnings.forEach((warning) =>
        console.log(`   - ${warning}`)
      );
    }

    // Step 2: Classify the markdown content
    console.log(`\n🤖 Classifying document...`);

    const classifier = new ClassifyClient({
      provider: 'deepseek',
      model: 'deepseek-chat',
      apiKey: process.env.DEEPSEEK_API_KEY,
      cacheEnabled: true,
      compressionEnabled: true,
    });

    const classificationResult = await classifier.classifyText(
      conversionResult.markdown
    );

    console.log(`✅ Classification complete!`);
    console.log(`   Domain: ${classificationResult.classification.domain}`);
    console.log(`   Type: ${classificationResult.classification.doc_type}`);
    console.log(`   Confidence: ${classificationResult.classification.confidence}`);
    console.log(`   Cache Hit: ${classificationResult.cacheInfo.cached}`);
    console.log(`   Total Time: ${classificationResult.performance.totalTimeMs}ms`);

    // Display graph structure (Cypher)
    if (classificationResult.graphStructure) {
      console.log(`\n📊 Graph Structure (Cypher):`);
      console.log(classificationResult.graphStructure.cypher);
    }

    // Display fulltext metadata
    if (classificationResult.fulltextMetadata) {
      console.log(`\n🔍 Fulltext Metadata:`);
      console.log(JSON.stringify(classificationResult.fulltextMetadata, null, 2));
    }

    return {
      conversion: conversionResult,
      classification: classificationResult,
    };
  } catch (error) {
    console.error(`❌ Error:`, error);
    throw error;
  }
}

// Example usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('Usage: tsx convert-and-classify.ts <file-path>');
    console.error('Example: tsx convert-and-classify.ts contract.pdf');
    process.exit(1);
  }

  convertAndClassify(filePath)
    .then(() => {
      console.log('\n✨ Done!');
    })
    .catch((error) => {
      console.error('\n❌ Failed:', error.message);
      process.exit(1);
    });
}

export { convertAndClassify };

