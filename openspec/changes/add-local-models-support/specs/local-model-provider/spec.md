# Local Model Provider Specification

## Purpose

Define requirements and behavior for local model support in the classify library, enabling privacy-preserving, offline document classification using embedding and instruction models running entirely on the user's machine.

## ADDED Requirements

### Requirement: Local Model Provider Interface

The system SHALL provide a LocalModelProvider that implements the LLMProvider interface for local model execution.

#### Scenario: Provider initialization
- **WHEN** user initializes ClassifyClient with a local model name
- **THEN** system creates appropriate LocalModelProvider instance
- **AND** no API key is required
- **AND** provider type is auto-detected from model name

#### Scenario: Model loading
- **GIVEN** model is downloaded in `/models` directory
- **WHEN** provider is initialized
- **THEN** system loads model into memory
- **AND** validates model integrity
- **AND** prepares tokenizer and configuration

#### Scenario: Classification request
- **WHEN** user calls complete() method with prompt
- **THEN** system processes locally without network calls
- **AND** returns standard LLMCompletionResponse format
- **AND** includes token counts and timing metrics

### Requirement: Embedding Models Support

The system SHALL support embedding-based classification using GTE-Multilingual, Multilingual-E5-Small, and BGE-M3 models.

#### Scenario: GTE-Multilingual classification
- **GIVEN** gte-multilingual model is loaded
- **WHEN** classifying a document with categories
- **THEN** system generates document embedding vector
- **AND** generates embedding for each category
- **AND** calculates cosine similarity scores
- **AND** returns highest scoring category with confidence

#### Scenario: Multilingual-E5-Small classification
- **GIVEN** multilingual-e5-small model is loaded
- **WHEN** processing multilingual content
- **THEN** system normalizes text embeddings
- **AND** supports 100+ languages
- **AND** returns classification with similarity score

#### Scenario: BGE-M3 classification
- **GIVEN** bge-m3 model is loaded
- **WHEN** classifying complex documents
- **THEN** system uses multi-granularity embeddings
- **AND** supports multi-functionality (dense, sparse, multi-vec)
- **AND** returns weighted classification scores

### Requirement: Instruction Models Support

The system SHALL support instruction-based classification using Qwen2.5-1.5B-Instruct and Llama-3.2-1B-Instruct models.

#### Scenario: Qwen2.5 instruction classification
- **GIVEN** qwen2.5-1.5b-instruct model is loaded
- **WHEN** classifying a document
- **THEN** system formats classification prompt with categories
- **AND** generates response with reasoning
- **AND** parses JSON output for category
- **AND** validates response against category list

#### Scenario: Llama 3.2 instruction classification
- **GIVEN** llama-3.2-1b-instruct model is loaded
- **WHEN** processing classification request
- **THEN** system applies Llama chat template
- **AND** generates classification with explanation
- **AND** extracts structured result
- **AND** handles formatting variations

### Requirement: NLI-Based Classification

The system SHALL support zero-shot classification using mDeBERTa-v3-base-MNLI-XNLI model via Natural Language Inference.

#### Scenario: Zero-shot NLI classification
- **GIVEN** mdeberta-v3-base-mnli-xnli model is loaded
- **WHEN** classifying text into categories
- **THEN** system creates hypothesis for each category ("This text is about {category}")
- **AND** calculates entailment score for each hypothesis
- **AND** returns category with highest entailment score
- **AND** supports 14 languages

#### Scenario: Multi-label NLI classification
- **GIVEN** NLI model and multiple valid categories
- **WHEN** document belongs to multiple categories
- **THEN** system returns all categories above entailment threshold
- **AND** ranks categories by entailment score
- **AND** includes confidence scores per category

### Requirement: Model Download Management

The system SHALL provide automatic model downloading with progress tracking and caching.

#### Scenario: First-time model usage
- **GIVEN** model is not in `/models` directory
- **WHEN** user attempts classification with that model
- **THEN** system prompts for download confirmation
- **AND** downloads model from HuggingFace Hub
- **AND** displays download progress (MB downloaded, % complete)
- **AND** verifies download integrity via checksum
- **AND** caches model for future use

#### Scenario: Model already downloaded
- **GIVEN** model exists in `/models` directory with valid metadata
- **WHEN** user initializes provider
- **THEN** system loads from cache without downloading
- **AND** validates cached model integrity
- **AND** proceeds directly to classification

#### Scenario: Download interruption
- **GIVEN** download is in progress
- **WHEN** network connection is lost or user cancels
- **THEN** system saves partial download state
- **AND** allows resume on next attempt
- **AND** verifies partial download integrity

#### Scenario: Corrupted cache
- **GIVEN** cached model fails integrity check
- **WHEN** system detects corruption
- **THEN** deletes corrupted files
- **AND** initiates fresh download
- **AND** logs corruption event

### Requirement: CLI Model Selection

The system SHALL provide `--model` CLI parameter for local model selection.

#### Scenario: Explicit model selection
- **WHEN** user runs `classify -i file.ts --model=qwen2.5-1.5b-instruct`
- **THEN** system uses specified local model
- **AND** auto-downloads if not cached
- **AND** displays model info before classification

#### Scenario: Invalid model name
- **WHEN** user specifies non-existent model
- **THEN** system displays error with available models list
- **AND** suggests similar model names
- **AND** exits with code 1

#### Scenario: Interactive model selection
- **GIVEN** user runs `classify -i file.ts` without `--model`
- **WHEN** interactive mode is available
- **THEN** system prompts for model selection
- **AND** displays categorized list (cloud vs local)
- **AND** shows model sizes and descriptions
- **AND** remembers selection for session

### Requirement: Model Management CLI

The system SHALL provide model management commands for listing, downloading, and removing models.

#### Scenario: List available models
- **WHEN** user runs `classify model list`
- **THEN** system displays all supported models
- **AND** indicates which are downloaded (cached)
- **AND** shows model sizes and types
- **AND** displays download status

#### Scenario: Download specific model
- **WHEN** user runs `classify model download bge-m3`
- **THEN** system downloads model to `/models/bge-m3/`
- **AND** displays progress bar with speed and ETA
- **AND** verifies download integrity
- **AND** creates metadata.json

#### Scenario: Remove cached model
- **WHEN** user runs `classify model remove llama-3.2-1b-instruct`
- **THEN** system prompts for confirmation
- **AND** deletes model directory
- **AND** removes from cache registry
- **AND** displays freed disk space

#### Scenario: Display model info
- **WHEN** user runs `classify model info gte-multilingual`
- **THEN** system displays comprehensive model information:
  - Model type (embedding/instruction/nli)
  - Size on disk
  - Download status
  - Supported languages
  - Performance characteristics
  - Use case recommendations

### Requirement: File and Directory Processing

The system SHALL support file and directory classification with local models identical to cloud providers.

#### Scenario: Single file classification
- **WHEN** user classifies single file with local model
- **THEN** system processes identically to cloud providers
- **AND** applies same preprocessing pipeline
- **AND** uses same template structure
- **AND** returns same output format

#### Scenario: Directory batch processing
- **WHEN** user classifies directory with local model
- **THEN** system processes all files in parallel
- **AND** uses model caching for efficiency
- **AND** displays progress per file
- **AND** aggregates results identically to cloud providers

#### Scenario: Large directory handling
- **GIVEN** directory with 1000+ files
- **WHEN** using local model for classification
- **THEN** system batches file processing
- **AND** manages memory to prevent OOM
- **AND** unloads/reloads model if needed
- **AND** provides estimated completion time

### Requirement: Quality Benchmarking

The system SHALL provide quality comparison benchmarks against premium cloud models.

#### Scenario: Benchmark execution
- **WHEN** user runs benchmark suite
- **THEN** system classifies test dataset with all models
- **AND** calculates accuracy metrics per model
- **AND** measures inference performance
- **AND** generates comparison report

#### Scenario: Accuracy metrics
- **GIVEN** benchmark dataset with ground truth labels
- **WHEN** comparing model performance
- **THEN** system calculates:
  - Overall accuracy
  - Per-category precision
  - Per-category recall
  - F1 scores
  - Confusion matrix

#### Scenario: Performance metrics
- **WHEN** benchmarking models
- **THEN** system measures:
  - Average classification time (ms)
  - Tokens per second
  - Memory usage (MB)
  - Model loading time
  - First classification latency

#### Scenario: Cost comparison
- **WHEN** generating comparison report
- **THEN** system includes cost analysis:
  - Cloud models: API cost per 1000 classifications
  - Local models: $0.00 per classification
  - One-time cost: Model download (time/bandwidth)
  - TCO comparison over different usage volumes

### Requirement: Error Handling and Recovery

The system SHALL handle errors gracefully with clear messaging and recovery options.

#### Scenario: Model not found locally
- **WHEN** specified model is not downloaded
- **THEN** system displays clear error message
- **AND** suggests download command
- **AND** offers to download automatically (with confirmation)

#### Scenario: Insufficient memory
- **WHEN** system cannot load model due to memory constraints
- **THEN** displays memory requirement vs available
- **AND** suggests smaller alternative models
- **AND** provides memory management tips
- **AND** exits gracefully

#### Scenario: Invalid model response
- **WHEN** local model returns unparseable output
- **THEN** system attempts JSON extraction
- **AND** logs raw response for debugging
- **AND** retries with modified prompt (up to 2 retries)
- **AND** returns error with actionable message if all retries fail

#### Scenario: Model loading timeout
- **GIVEN** model loading exceeds 5 minutes
- **WHEN** timeout is reached
- **THEN** system cancels loading
- **AND** checks for corruption
- **AND** suggests re-downloading model
- **AND** provides support information

### Requirement: Performance Optimization

The system SHALL optimize local model performance through caching and batching strategies.

#### Scenario: Model caching
- **GIVEN** multiple classification requests in same session
- **WHEN** using same local model
- **THEN** system keeps model loaded in memory
- **AND** reuses loaded model for subsequent requests
- **AND** unloads only when memory pressure detected
- **AND** implements LRU cache for multiple models

#### Scenario: Batch processing optimization
- **WHEN** classifying multiple files
- **THEN** system batches inference requests
- **AND** processes batches in parallel (up to CPU cores)
- **AND** shares model instance across workers
- **AND** minimizes model loading overhead

#### Scenario: Memory management
- **GIVEN** limited available memory
- **WHEN** processing large workloads
- **THEN** system monitors memory usage
- **AND** unloads models when threshold reached
- **AND** provides clear memory warnings
- **AND** continues processing with automatic model reloading

### Requirement: Configuration and Customization

The system SHALL provide configuration options for local model behavior.

#### Scenario: Custom models directory
- **WHEN** user specifies `modelsDir` in configuration
- **THEN** system uses custom directory for model storage
- **AND** creates directory if not exists
- **AND** validates directory permissions
- **AND** supports relative and absolute paths

#### Scenario: Inference parameters
- **WHEN** using instruction models
- **THEN** system allows configuration of:
  - `maxTokens`: Maximum generation length
  - `temperature`: Sampling temperature (default 0.1)
  - `topP`: Nucleus sampling threshold
  - `timeout`: Maximum inference time

#### Scenario: Download configuration
- **WHEN** downloading models
- **THEN** system respects configuration for:
  - Download timeout
  - Retry attempts
  - Concurrent downloads
  - Bandwidth limits (optional)

### Requirement: Documentation and Guidance

The system SHALL provide comprehensive documentation for local model usage.

#### Scenario: Model selection guide
- **WHEN** user views documentation
- **THEN** provides decision tree for model selection:
  - Speed priority → E5 Small or GTE
  - Accuracy priority → Qwen or Llama
  - Zero-shot needs → mDeBERTa
  - Multilingual → GTE or BGE-M3

#### Scenario: Hardware requirements
- **WHEN** user checks requirements
- **THEN** documentation specifies per model:
  - Minimum RAM (e.g., 4GB for E5, 8GB for Qwen)
  - Recommended CPU (e.g., 4+ cores)
  - Disk space (model size + 20% overhead)
  - Expected performance (classifications/sec)

#### Scenario: Migration guide
- **WHEN** existing user wants to try local models
- **THEN** documentation provides:
  - Side-by-side comparison with cloud models
  - Migration steps with examples
  - Performance expectations
  - Cost-benefit analysis

### Requirement: Testing and Validation

The system SHALL include comprehensive tests for local model functionality.

#### Scenario: Unit tests per provider
- **GIVEN** each local model provider
- **WHEN** running unit tests
- **THEN** tests verify:
  - Model loading/unloading
  - Classification logic
  - Error handling
  - Response formatting

#### Scenario: Integration tests
- **WHEN** running integration test suite
- **THEN** tests validate:
  - End-to-end classification with each model
  - CLI commands functionality
  - Model download/caching
  - Batch processing

#### Scenario: Performance regression tests
- **WHEN** changes affect local models
- **THEN** CI runs performance benchmarks
- **AND** compares against baseline metrics
- **AND** fails if regression > 10%
- **AND** reports performance changes

#### Scenario: Cross-platform tests
- **WHEN** running CI pipeline
- **THEN** tests execute on:
  - Ubuntu (latest)
  - Windows (latest)
  - macOS (latest)
- **AND** validates model compatibility
- **AND** checks platform-specific issues

