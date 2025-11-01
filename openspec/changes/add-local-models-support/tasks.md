# Tasks: Add Local Models Support for Classification

## Phase 1: Research & Planning
- [ ] **RESEARCH-001**: Evaluate `@xenova/transformers` for Node.js compatibility
- [ ] **RESEARCH-002**: Test each model locally for classification tasks
- [ ] **RESEARCH-003**: Benchmark embedding models vs instruction models for classification
- [ ] **RESEARCH-004**: Document model capabilities, sizes, and requirements
- [ ] **RESEARCH-005**: Design prompt templates for instruction models
- [ ] **RESEARCH-006**: Research optimal classification strategies per model type

## Phase 2: Core Infrastructure
- [ ] **INFRA-001**: Create `src/llm/providers/local-model.ts` base class
- [ ] **INFRA-002**: Implement model downloader with progress tracking
- [ ] **INFRA-003**: Create model cache manager for `/models` directory
- [ ] **INFRA-004**: Add model metadata storage (JSON manifest)
- [ ] **INFRA-005**: Implement model loading with memory management
- [ ] **INFRA-006**: Add model type detection (embedding vs instruction)
- [ ] **INFRA-007**: Create provider factory integration

## Phase 3: Embedding Models Implementation
- [ ] **EMBED-001**: Implement GTE-Multilingual provider
  - [ ] Model download from HuggingFace
  - [ ] Text embedding generation
  - [ ] Similarity-based classification
- [ ] **EMBED-002**: Implement Multilingual-E5-Small provider
  - [ ] Model configuration
  - [ ] Efficient inference
  - [ ] Classification logic
- [ ] **EMBED-003**: Implement BGE-M3 provider
  - [ ] Model loading
  - [ ] Multi-granularity embeddings
  - [ ] Classification scoring

## Phase 4: Instruction Models Implementation
- [ ] **INSTRUCT-001**: Implement mDeBERTa-v3 provider
  - [ ] Zero-shot NLI classification
  - [ ] Entailment scoring
  - [ ] Label mapping
- [ ] **INSTRUCT-002**: Implement Qwen2.5-1.5B provider
  - [ ] Model loading with quantization options
  - [ ] Prompt template formatting
  - [ ] JSON response parsing
  - [ ] Token counting
- [ ] **INSTRUCT-003**: Implement Llama-3.2-1B provider
  - [ ] Model loading
  - [ ] Chat template formatting
  - [ ] Response extraction
  - [ ] Error handling

## Phase 5: CLI Integration
- [ ] **CLI-001**: Add `--model` parameter to classify command
  - [ ] Model name validation
  - [ ] Auto-download if not cached
  - [ ] Progress display
- [ ] **CLI-002**: Create `model` command group
  - [ ] `classify model list` - Show available models
  - [ ] `classify model download <name>` - Download specific model
  - [ ] `classify model remove <name>` - Delete cached model
  - [ ] `classify model info <name>` - Show model details
- [ ] **CLI-003**: Add model selection to interactive mode
- [ ] **CLI-004**: Update help text with model examples

## Phase 6: Quality Benchmarking
- [ ] **BENCH-001**: Create benchmark dataset (100+ samples)
  - [ ] Code files (TypeScript, Python, Rust, etc.)
  - [ ] Documentation files
  - [ ] Configuration files
  - [ ] Mixed content
- [ ] **BENCH-002**: Classify dataset with DeepSeek (baseline)
- [ ] **BENCH-003**: Classify dataset with Claude (baseline)
- [ ] **BENCH-004**: Classify dataset with each local model
- [ ] **BENCH-005**: Calculate accuracy metrics
  - [ ] Precision per category
  - [ ] Recall per category
  - [ ] F1 scores
  - [ ] Overall accuracy
- [ ] **BENCH-006**: Measure inference performance
  - [ ] Tokens per second
  - [ ] Memory usage
  - [ ] Time per classification
- [ ] **BENCH-007**: Create comparison table and charts

## Phase 7: Testing
- [ ] **TEST-001**: Unit tests for LocalModelProvider base class
- [ ] **TEST-002**: Unit tests for model downloader
- [ ] **TEST-003**: Unit tests for each embedding provider
- [ ] **TEST-004**: Unit tests for each instruction provider
- [ ] **TEST-005**: Integration tests with ClassificationPipeline
- [ ] **TEST-006**: CLI tests for `--model` parameter
- [ ] **TEST-007**: CLI tests for model management commands
- [ ] **TEST-008**: End-to-end tests with real models (CI skip option)

## Phase 8: Documentation
- [ ] **DOCS-001**: Create `docs/LOCAL_MODELS.md` guide
  - [ ] Installation instructions
  - [ ] Model selection guide
  - [ ] Performance comparison
  - [ ] Use case recommendations
- [ ] **DOCS-002**: Update README.md
  - [ ] Add local models section
  - [ ] Update quick start with `--model` flag
  - [ ] Add model comparison table
- [ ] **DOCS-003**: Update API_REFERENCE.md
  - [ ] LocalModelProvider API
  - [ ] Model configuration options
  - [ ] Type definitions
- [ ] **DOCS-004**: Create model selection decision tree
- [ ] **DOCS-005**: Add troubleshooting guide
  - [ ] Common errors
  - [ ] Memory issues
  - [ ] Model download failures
- [ ] **DOCS-006**: Update CHANGELOG.md for v0.8.0

## Phase 9: Quality Assurance
- [ ] **QA-001**: Run full test suite (`npm test`)
- [ ] **QA-002**: Verify 95%+ coverage (`npm run test:coverage`)
- [ ] **QA-003**: Run type-check (`npm run type-check`)
- [ ] **QA-004**: Run linter (`npm run lint`)
- [ ] **QA-005**: Run formatter (`npm run format`)
- [ ] **QA-006**: Test on Windows, macOS, Linux
- [ ] **QA-007**: Test with different Node.js versions (18, 20, 22)
- [ ] **QA-008**: Validate model downloads on slow connections
- [ ] **QA-009**: Test with limited disk space scenarios
- [ ] **QA-010**: Memory leak testing with multiple classifications

## Phase 10: Release Preparation
- [ ] **RELEASE-001**: Update package.json to v0.8.0
- [ ] **RELEASE-002**: Update all dependency versions
- [ ] **RELEASE-003**: Create migration guide for users
- [ ] **RELEASE-004**: Prepare release notes
- [ ] **RELEASE-005**: Update examples with local model usage
- [ ] **RELEASE-006**: Create video demo/tutorial (optional)
- [ ] **RELEASE-007**: Final code review
- [ ] **RELEASE-008**: Create git tag v0.8.0

## Dependencies

```
RESEARCH (Phase 1) → INFRA (Phase 2)
INFRA (Phase 2) → EMBED (Phase 3) + INSTRUCT (Phase 4)
EMBED + INSTRUCT → CLI (Phase 5)
EMBED + INSTRUCT → BENCH (Phase 6)
ALL IMPLEMENTATION → TEST (Phase 7)
ALL IMPLEMENTATION → DOCS (Phase 8)
ALL PREVIOUS → QA (Phase 9)
QA PASSED → RELEASE (Phase 10)
```

## Estimated Timeline

- Phase 1 (Research): 8 hours
- Phase 2 (Infrastructure): 12 hours
- Phase 3 (Embedding Models): 16 hours
- Phase 4 (Instruction Models): 20 hours
- Phase 5 (CLI): 8 hours
- Phase 6 (Benchmarking): 12 hours
- Phase 7 (Testing): 16 hours
- Phase 8 (Documentation): 10 hours
- Phase 9 (QA): 8 hours
- Phase 10 (Release): 4 hours

**Total: ~114 hours (2-3 weeks of full-time work)**

## Priority

**HIGH** - Major feature for v0.8.0 release, provides significant value for privacy and cost-conscious users

## Success Metrics

- ✅ All 6 models working end-to-end
- ✅ Classification accuracy within acceptable range (>80% of premium models)
- ✅ Comprehensive test coverage (95%+)
- ✅ Complete documentation with examples
- ✅ Performance benchmarks published
- ✅ Zero breaking changes for existing users

