# Tasks: Add Cursor-Agent LLM Provider Support

## Phase 1: Research
- [ ] **RESEARCH-001**: Study rulebook cursor-agent parser implementation
- [ ] **RESEARCH-002**: Analyze cursor-agent CLI flags and output format
- [ ] **RESEARCH-003**: Test cursor-agent manually for classification tasks
- [ ] **RESEARCH-004**: Document cursor-agent response format for LLM classification

## Phase 2: Implement CursorAgent Provider
- [ ] **IMPLEMENT-001**: Create `src/llm/providers/cursor-agent.ts`
- [ ] **IMPLEMENT-002**: Define CursorAgentProvider class extending BaseLLMProvider
- [ ] **IMPLEMENT-003**: Import cursor-agent stream parser from rulebook pattern
- [ ] **IMPLEMENT-004**: Implement `complete()` method using cursor-agent CLI
- [ ] **IMPLEMENT-005**: Add stream parsing for JSON responses
- [ ] **IMPLEMENT-006**: Extract tokens and cost from responses
- [ ] **IMPLEMENT-007**: Add timeout handling (30 minutes as in rulebook)
- [ ] **IMPLEMENT-008**: Implement retry logic
- [ ] **IMPLEMENT-009**: Add progress callbacks for stream output

## Phase 3: Integration
- [ ] **INTEGRATE-001**: Add cursor-agent to ProviderFactory
- [ ] **INTEGRATE-002**: Update client options to support cursor-agent
- [ ] **INTEGRATE-003**: Add environment variable: `USE_CURSOR_AGENT`
- [ ] **INTEGRATE-004**: Update type definitions

## Phase 4: Testing
- [ ] **TEST-001**: Write unit tests for CursorAgentProvider
- [ ] **TEST-002**: Test stream parsing logic
- [ ] **TEST-003**: Test complete() method with mock cursor-agent output
- [ ] **TEST-004**: Test error handling and timeouts
- [ ] **TEST-005**: Integration test with ClassificationPipeline

## Phase 5: Documentation
- [ ] **DOCS-001**: Update README.md with cursor-agent provider
- [ ] **DOCS-002**: Add installation instructions for cursor-agent
- [ ] **DOCS-003**: Add usage examples
- [ ] **DOCS-004**: Document environment variables
- [ ] **DOCS-005**: Update CHANGELOG.md

## Phase 6: Quality Assurance
- [ ] **QA-001**: Run full test suite (npm test)
- [ ] **QA-002**: Verify 77%+ coverage (npm run test:coverage)
- [ ] **QA-003**: Run type-check (npm run type-check)
- [ ] **QA-004**: Run linter (npm run lint)
- [ ] **QA-005**: Run formatter (npm run format)
- [ ] **QA-006**: Final code review

## Dependencies
- RESEARCH tasks must complete before IMPLEMENT
- IMPLEMENT tasks must complete before INTEGRATE
- All INTEGRATE tasks must complete before TEST
- All TEST tasks must pass before DOCS
- All DOCS must complete before QA

## Estimated Timeline
- Phase 1 (Research): 2 hours
- Phase 2 (Implement): 6 hours
- Phase 3 (Integrate): 3 hours
- Phase 4 (Testing): 4 hours
- Phase 5 (Documentation): 2 hours
- Phase 6 (QA): 2 hours
**Total: ~19 hours (~2.5 days)**

## Priority
**Medium** - Alternative provider for privacy-focused users

## Blockers
- Need access to cursor-agent for testing
- Need to verify cursor-agent works well for JSON classification outputs
