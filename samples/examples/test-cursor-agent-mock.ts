/**
 * Test cursor-agent event parsing with mocked output
 */

import { CursorAgentProvider } from '../../src/llm/providers/cursor-agent.js';

// Simulate cursor-agent stream output
const mockStreamOutput = `{"type":"system","subtype":"init","apiKeySource":"config","cwd":"/test","session_id":"test-123","model":"claude-sonnet-4","permissionMode":"accept"}
{"type":"user","message":{"role":"user","content":[{"type":"text","text":"Classify this document"}]},"session_id":"test-123"}
{"type":"assistant","message":{"role":"assistant","content":[{"type":"text","text":"{\\"domain\\":\\"test\\",\\"docType\\":\\"example\\"}"}]},"session_id":"test-123","timestamp_ms":1000}
{"type":"result","subtype":"success","duration_ms":1500,"duration_api_ms":1200,"is_error":false,"result":"success","session_id":"test-123","request_id":"req-123"}`;

async function testParsing() {
  console.log('🧪 Testing cursor-agent event parsing\n');

  const provider = new CursorAgentProvider();
  
  // Access private method via type assertion for testing
  const parseResponse = (provider as any).parseResponse.bind(provider);
  
  const result = parseResponse(mockStreamOutput, 'cursor-agent');
  
  console.log('✅ Parsing successful!');
  console.log('\n📊 Result:');
  console.log(`  - Content: ${result.content}`);
  console.log(`  - Finish Reason: ${result.finishReason}`);
  console.log(`  - Input Tokens: ${result.usage.inputTokens}`);
  console.log(`  - Output Tokens: ${result.usage.outputTokens}`);
  console.log(`  - Cost: $${result.costUsd}`);
  console.log(`  - Model: ${result.model}`);
  
  // Validate extracted JSON
  if (result.content.includes('domain') && result.content.includes('docType')) {
    console.log('\n✅ JSON extraction working!');
  } else {
    console.error('\n❌ JSON extraction failed!');
    process.exit(1);
  }
}

testParsing();

