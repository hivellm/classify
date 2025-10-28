// Project: vectorizer
CREATE (project:Project {
  name: "vectorizer",
  type: "rust",
  primaryLanguage: "rust",
  totalFiles: 216,
  rootDir: "/mnt/f/Node/hivellm/vectorizer"
})

// File: /mnt/f/Node/hivellm/vectorizer/src/lib.rs
CREATE (doc:Document {
      id: "Vectorizer Rust Library",
      title: "Vectorizer Rust Library",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Vectorizer Rust Library", language: "Rust", version: "VERSION", description: "High-performance, efficient queries, AI-driven discovery"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "lib.rs", type: "main_module", features: "hive-gpu,transmutation", exports: "BatchConfig,BatchOperation,BatchProcessor,Collection,VectorStore,BertEmbedding,Bm25Embedding,MiniLmEmbedding,SvdEmbedding,VectorizerError,EvaluationMetrics,QueryMetrics,QueryResult,CollectionConfig,Payload,SearchResult,Vector,SummarizationConfig,SummarizationError,SummarizationManager,SummarizationMethod,SummarizationResult"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Vectorizer Rust Library"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/hybrid_search.rs
CREATE (doc:Document {
      id: "Hybrid Retrieval System",
      title: "Hybrid Retrieval System",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Hybrid Retrieval System", language: "rust", content_type: "code_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "HybridRetriever", language: "rust", type: "struct", description: "Hybrid retrieval system combining sparse (BM25/TF-IDF) and dense (BERT, MiniLM) methods"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Hybrid Retrieval System"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/guardrails.rs
CREATE (doc:Document {
      id: "System Guardrails Implementation",
      title: "System Guardrails Implementation",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {title: "System Guardrails Implementation", language: "rust", purpose: "System stability and resource protection"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "guardrails", language: "rust", purpose: "Prevent BSODs and system overload through resource monitoring and throttling"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "System Guardrails Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/gpu_adapter.rs
CREATE (doc:Document {
      id: "GPU Adapter Module",
      title: "GPU Adapter Module",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "GPU Adapter Module", language: "rust", file_type: "rs"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "gpu_adapter", purpose: "GPU adapter that translates vectorizer types to hive-gpu types", main_functions: "vector_to_gpu_vector,gpu_vector_to_vector,distance_metric_to_gpu_metric,gpu_metric_to_distance_metric,hnsw_config_to_gpu_config,gpu_config_to_hnsw_config,gpu_error_to_vectorizer_error,vectorizer_error_to_gpu_error"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "GPU Adapter Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/error.rs
CREATE (doc:Document {
      id: "Vectorizer Error Types and Result Definitions",
      title: "Vectorizer Error Types and Result Definitions",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Vectorizer Error Types and Result Definitions", language: "rust", content_type: "error_definitions"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "VectorizerError", type: "error_enum", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Module {name: "VectorizerResult", type: "result_type", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e2)

MATCH (doc:Document {title: "Vectorizer Error Types and Result Definitions"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/workspace/validator.rs
CREATE (doc:Document {
      id: "Workspace Configuration Validation",
      title: "Workspace Configuration Validation",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Workspace Configuration Validation", language: "rust", file_type: "rs"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "workspace_validation", language: "rust", purpose: "workspace configuration validation"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Workspace Configuration Validation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/workspace/simplified_config.rs
CREATE (doc:Document {
      id: "Rust Data Structures for Vectorizer Configuration",
      title: "Rust Data Structures for Vectorizer Configuration",
      domain: "software",
      doc_type: "code_structure"
    })
CREATE (e0:Document {name: "Rust Data Structures for Vectorizer Configuration", language: "Rust", purpose: "Configuration structures for vectorizer workspace management"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "structures", language: "Rust", purpose: "Defines configuration structures for vectorizer workspace, projects, and collections"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Rust Data Structures for Vectorizer Configuration"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/workspace/parser.rs
CREATE (doc:Document {
      id: "Workspace Configuration Parser",
      title: "Workspace Configuration Parser",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Workspace Configuration Parser", language: "Rust", file_type: "rust_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "workspace_config_parser", language: "Rust", purpose: "YAML workspace configuration parsing and management"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Workspace Configuration Parser"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/workspace/mod.rs
CREATE (doc:Document {
      id: "Workspace and management",
      title: "Workspace and management",
      domain: "software",
      doc_type: "module_documentation"
    })
CREATE (e0:Document {name: "Workspace and management", language: "rust", content_type: "module_documentation"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "workspace_manager", description: "Provides functionality for managing multiple projects through centralized workspace file", submodules: "config,manager,simplified_config,validator"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Workspace and management"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/workspace/manager.rs
CREATE (doc:Document {
      id: "WorkspaceManager",
      title: "WorkspaceManager",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Module {name: "WorkspaceManager", language: "rust", description: "Manages workspace configuration and project operations"})
CREATE (doc)-[:MENTIONS]->(e0)

MATCH (doc:Document {title: "WorkspaceManager"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/workspace/config.rs
CREATE (doc:Document {
      id: "Rust Workspace Configuration Structures",
      title: "Rust Workspace Configuration Structures",
      domain: "software",
      doc_type: "code_structure"
    })
CREATE (e0:Document {name: "Rust Workspace Configuration Structures", language: "rust", content_type: "code_structure"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "structures", language: "rust", module_type: "data_structures"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Rust Workspace Configuration Structures"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/utils/mod.rs
CREATE (doc:Document {
      id: "Utility modules",
      title: "Utility modules",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Utility modules", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "file_hash"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Utility modules"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/utils/file_hash.rs
CREATE (doc:Document {
      id: "File Hash Utilities",
      title: "File Hash Utilities",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "File Hash Utilities", language: "Rust", purpose: "File hashing and metadata utilities"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "file_utils", language: "Rust", functions: "calculate_file_hash,get_file_modified_time", dependencies: "sha2,chrono,tempfile"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "File Hash Utilities"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/umicp/transport.rs
CREATE (doc:Document {
      id: "UMICP Transport HTTP",
      title: "UMICP Transport HTTP",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "UMICP Transport HTTP", language: "Rust", description: "HTTP transport handler for UMICP protocol with envelope processing and discovery service"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "umicp_handler", type: "HTTP Handler", description: "Main UMICP HTTP request handler with envelope validation and response processing"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Module {name: "umicp_discover_handler", type: "Discovery Handler", description: "UMICP discovery service handler for service enumeration"})
CREATE (doc)-[:MENTIONS]->(e2)

MATCH (doc:Document {title: "UMICP Transport HTTP"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/umicp/mod.rs
CREATE (doc:Document {
      id: "UMICP Protocol Vectorizer",
      title: "UMICP Protocol Vectorizer",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "UMICP Protocol Vectorizer", language: "rust", version: "0.2.1"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "discovery", type: "service", description: "VectorizerDiscoveryService"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "UMICP Protocol Vectorizer"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/umicp/handlers.rs
CREATE (doc:Document {
      id: "UMICP Handlers MCP",
      title: "UMICP Handlers MCP",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "UMICP Handlers MCP", language: "Rust", description: "UMICP MCP CallToolRequest handlers with native JSON support"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "umicp_handlers", language: "Rust", description: "Handles UMICP request processing and MCP tool calls with JSON serialization"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "UMICP Handlers MCP"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/umicp/discovery.rs
CREATE (doc:Document {
      id: "UMICP Tool Vectorizer Discovery Service",
      title: "UMICP Tool Vectorizer Discovery Service",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "UMICP Tool Vectorizer Discovery Service", language: "rust", type: "module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "VectorizerDiscoveryService", language: "rust", type: "service", features: "semantic-search,vector-storage,intelligent-discovery,file-operations,batch-operations,workspace-management,mcp-compatible", operations_count: "38"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "UMICP Tool Vectorizer Discovery Service"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/transmutation_integration/types.rs
CREATE (doc:Document {
      id: "Document Conversion Module",
      title: "Document Conversion Module",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "ConvertedDocument", language: "Rust", description: "Result structure for converted documents with markdown content and metadata"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "std::collections::HashMap", language: "Rust", description: "Standard library HashMap collection"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Module {name: "serde", language: "Rust", description: "Serialization and deserialization framework"})
CREATE (doc)-[:MENTIONS]->(e2)

MATCH (doc:Document {title: "Document Conversion Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/transmutation_integration/mod.rs
CREATE (doc:Document {
      id: "TransmutationProcessor",
      title: "TransmutationProcessor",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "TransmutationProcessor", language: "Rust", purpose: "Document conversion processor", features: "PDF,DOCX,XLSX,PPTX,Markdown conversion"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "transmutation_processor", language: "Rust", type: "struct", functionality: "Document format conversion with OCR support"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "TransmutationProcessor"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/storage/writer.rs
CREATE (doc:Document {
      id: "Storage Writer Implementation",
      title: "Storage Writer Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Module {name: "StorageWriter", language: "Rust", purpose: "Handles writing and archiving vector data collections"})
CREATE (doc)-[:MENTIONS]->(e0)

MATCH (doc:Document {title: "Storage Writer Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/storage/snapshot.rs
CREATE (doc:Document {
      id: "SnapshotManager Rust Module",
      title: "SnapshotManager Rust Module",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {title: "SnapshotManager Rust Module", language: "rust", file_type: "rs"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "SnapshotManager", language: "rust", type: "struct_impl", purpose: "Database snapshot management with creation, restoration, and cleanup functionality"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "SnapshotManager Rust Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/storage/reader.rs
CREATE (doc:Document {
      id: "Storage Reader Implementation",
      title: "Storage Reader Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Storage Reader Implementation", language: "Rust", type: "code_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "StorageReader", language: "Rust", type: "struct_implementation", description: "Reader for .vecdb compressed archive files with caching support"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Storage Reader Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/storage/mod.rs
CREATE (doc:Document {
      id: "Storage Vectorizer Module",
      title: "Storage Vectorizer Module",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Module {name: "storage", language: "rust", purpose: "unified storage system for vector data with .vecdb/.vecidx format", version: "1.0"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Struct {name: "StorageFormat", visibility: "public", traits: "Debug,Clone,Copy,PartialEq,Eq"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Enum {name: "StorageFormat", variants: "Legacy,Compact"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Function {name: "detect_format", visibility: "public", parameters: "data_dir: &Path,data_dir: &Path", return_type: "StorageFormat"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Function {name: "load_or_initialize", visibility: "public", parameters: "data_dir: &Path", return_type: "Result<usize>"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Constant {name: "STORAGE_VERSION", value: "1.0"})
CREATE (doc)-[:MENTIONS]->(e5)
CREATE (e6:Constant {name: "VECDB_FILE", value: "vectorizer.vecdb"})
CREATE (doc)-[:MENTIONS]->(e6)
CREATE (e7:Constant {name: "VECIDX_FILE", value: "vectorizer.vecidx"})
CREATE (doc)-[:MENTIONS]->(e7)

MATCH (doc:Document {title: "Storage Vectorizer Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/storage/migration.rs
CREATE (doc:Document {
      id: "StorageMigrator Implementation",
      title: "StorageMigrator Implementation",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "StorageMigrator Implementation", language: "rust", type: "source_code"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "StorageMigrator", language: "rust", purpose: "Storage migration utility for converting legacy vector storage to .vecdb format"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "StorageMigrator Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/storage/index.rs
CREATE (doc:Document {
      id: "Storage Index Management",
      title: "Storage Index Management",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Storage Index Management", language: "Rust", description: "Management of .vecidx files for vector storage indexing"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "storage_index", language: "Rust", description: "Core module for managing storage indices with collections, files, and compression tracking"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Storage Index Management"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/storage/config.rs
CREATE (doc:Document {
      id: "Storage Configuration Structures",
      title: "Storage Configuration Structures",
      domain: "software",
      doc_type: "code_documentation"
    })
CREATE (e0:Document {title: "Storage Configuration Structures", language: "rust", content_type: "configuration_structs"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "StorageConfig", language: "rust", type: "configuration_module"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Storage Configuration Structures"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/storage/compact.rs
CREATE (doc:Document {
      id: "StorageCompactor Implementation",
      title: "StorageCompactor Implementation",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Module {name: "StorageCompactor", language: "rust", type: "struct_implementation"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Document {name: "StorageCompactor Implementation", language: "rust", type: "code_module"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "StorageCompactor Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/summarization/types.rs
CREATE (doc:Document {
      id: "Rust Summarization Module",
      title: "Rust Summarization Module",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Rust Summarization Module", language: "rust", content_type: "code"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "summarization", language: "rust", module_type: "enum_definitions"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Rust Summarization Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/summarization/mod.rs
CREATE (doc:Document {
      id: "Rust Module Structure",
      title: "Rust Module Structure",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Rust Module Structure", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "config"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Module {name: "manager"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Module {name: "methods"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Module {name: "types"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Module {name: "tests"})
CREATE (doc)-[:MENTIONS]->(e5)

MATCH (doc:Document {title: "Rust Module Structure"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/summarization/methods.rs
CREATE (doc:Document {
      id: "Extractive Summarization Implementation",
      title: "Extractive Summarization Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Extractive Summarization Implementation", language: "Rust", content_type: "source_code"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "ExtractiveSummarizer", language: "Rust", type: "struct", purpose: "Text summarization using MMR algorithm"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Extractive Summarization Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/summarization/manager.rs
CREATE (doc:Document {
      id: "SummarizationManager Rust Module",
      title: "SummarizationManager Rust Module",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "SummarizationManager Rust Module", language: "rust", type: "code_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "SummarizationManager", language: "rust", type: "struct_implementation"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "SummarizationManager Rust Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/summarization/config.rs
CREATE (doc:Document {
      id: "SummarizationConfig Rust Module",
      title: "SummarizationConfig Rust Module",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "SummarizationConfig Rust Module", language: "rust", type: "configuration_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "summarization::config", language: "rust", type: "configuration", main_struct: "SummarizationConfig"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "SummarizationConfig Rust Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/server/rest_handlers.rs
CREATE (doc:Document {
      id: "REST API Vectorizer Server",
      title: "REST API Vectorizer Server",
      domain: "software",
      doc_type: "api_implementation"
    })
CREATE (e0:Document {name: "REST API Vectorizer Server", language: "Rust", type: "API Implementation"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "VectorizerServer", type: "REST API Server", functions: "health_check,get_stats,get_indexing_progress,search_vectors_by_text,search_by_file,list_vectors"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "REST API Vectorizer Server"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/server/replication_handlers.rs
CREATE (doc:Document {
      id: "REST API Replication Configuration",
      title: "REST API Replication Configuration",
      domain: "software",
      doc_type: "rust_api_module"
    })
CREATE (e0:Document {name: "REST API Replication Configuration", language: "rust", framework: "axum"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "replication_api", type: "REST API handlers", functions: "get_replication_status,configure_replication"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "REST API Replication Configuration"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/server/qdrant_vector_handlers.rs
CREATE (doc:Document {
      id: "Qdrant Operations REST API",
      title: "Qdrant Operations REST API",
      domain: "software",
      doc_type: "api_implementation"
    })
CREATE (e0:Document {name: "Qdrant Operations REST API", language: "Rust", framework: "Axum", purpose: "Vector database operations"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "operations", language: "Rust", type: "REST API handlers", functions: "upsert_points,retrieve_points,delete_points"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Qdrant Operations REST API"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/server/qdrant_search_handlers.rs
CREATE (doc:Document {
      id: "Qdrant REST API",
      title: "Qdrant REST API",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Qdrant REST API", language: "Rust", type: "API implementation"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "qdrant_api", language: "Rust", purpose: "Qdrant vector database REST API endpoints"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Qdrant REST API"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/server/qdrant_handlers.rs
CREATE (doc:Document {
      id: "REST API Vectorizer Module",
      title: "REST API Vectorizer Module",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "REST API Vectorizer Module", language: "Rust", type: "code_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "vectorizer_api", language: "Rust", framework: "axum", purpose: "REST API for vector database operations", features: "payload_schema_extraction,qdrant_config_conversion,collection_management"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "REST API Vectorizer Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/server/mod.rs
CREATE (doc:Document {
      id: "Vectorizer Server Implementation",
      title: "Vectorizer Server Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Module {name: "VectorizerServer", language: "Rust", type: "server_implementation"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "ServerState", language: "Rust", type: "state_struct"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Vectorizer Server Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/server/mcp_tools.rs
CREATE (doc:Document {
      id: "MCP Vectorizer Tools Implementation",
      title: "MCP Vectorizer Tools Implementation",
      domain: "software",
      doc_type: "code_implementation"
    })
CREATE (e0:Document {name: "MCP Vectorizer Tools Implementation", language: "Rust", content_type: "code"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "mcp_vectorizer_tools", language: "Rust", purpose: "Vector collection operations and MCP tool definitions"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "MCP Vectorizer Tools Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/server/mcp_performance.rs
CREATE (doc:Document {
      id: "Classify CLI",
      title: "Classify CLI",
      domain: "software",
      doc_type: "project_readme"
    })
CREATE (e0:Document {name: "Classify CLI", version: "0.6.1", status: "Production Ready", description: "Intelligent document classification for graph databases and full-text search using modern LLMs"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "classify-cli", language: "TypeScript", type: "CLI tool", main_features: "Ultra Cost-Optimized TINY templates,Automatic Template Selection,Multi-LLM Support,Dual Output (Graph + Full-text),SHA256-based Caching,Document Conversion,Prompt Compression,Database Integrations,Parallel Batch Processing"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Classify CLI"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/server/mcp_handlers.rs
CREATE (doc:Document {
      id: "MCP Tool Error Handling and Embedding Manager",
      title: "MCP Tool Error Handling and Embedding Manager",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Module {name: "mcp_tools", language: "rust", purpose: "MCP tool implementation with error handling and embedding management"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Function {name: "create_embedding_manager_for_collection", purpose: "Creates embedding manager with configurable embedding types"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:ErrorType {name: "MCPError", purpose: "Comprehensive error handling for MCP operations"})
CREATE (doc)-[:MENTIONS]->(e2)

MATCH (doc:Document {title: "MCP Tool Error Handling and Embedding Manager"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/server/mcp_connection_manager.rs
CREATE (doc:Document {
      id: "MCP Connection Pool Manager",
      title: "MCP Connection Pool Manager",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "MCP Connection Pool Manager", language: "rust", type: "module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "connection_manager", language: "rust", purpose: "MCP connection pooling and management"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "MCP Connection Pool Manager"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/server/file_operations_handlers.rs
CREATE (doc:Document {
      id: "Rust MCP Vectorizer File Operations Handler",
      title: "Rust MCP Vectorizer File Operations Handler",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Rust MCP Vectorizer File Operations Handler", language: "Rust", type: "code_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "file_operations_handler", language: "Rust", purpose: "MCP tool handlers for file operations including chunks, outlines, and related files"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Rust MCP Vectorizer File Operations Handler"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/server/error_middleware.rs
CREATE (doc:Document {
      id: "REST API Error Handling Module",
      title: "REST API Error Handling Module",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "REST API Error Handling Module", language: "Rust", framework: "Axum"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "error_handling", purpose: "Standardized error response handling for REST API", components: "ErrorResponse struct,VectorizerError conversion,HTTP status mapping"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "REST API Error Handling Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/server/discovery_handlers.rs
CREATE (doc:Document {
      id: "Discovery MCP Implementation",
      title: "Discovery MCP Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Discovery MCP Implementation", language: "Rust", type: "code_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "discovery", language: "Rust", functions: "handle_discover,handle_filter_collections,handle_score_collections,get_collection_refs"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Discovery MCP Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/security/tls.rs
CREATE (doc:Document {
      id: "TLS Configuration Module",
      title: "TLS Configuration Module",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "TLS Configuration Module", language: "rust", description: "TLS/mTLS support configuration module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "TlsConfig", type: "struct", description: "TLS configuration struct with certificate and key paths"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "TLS Configuration Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/security/rbac.rs
CREATE (doc:Document {
      id: "Role-Based Access Control (RBAC) System",
      title: "Role-Based Access Control (RBAC) System",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {title: "Role-Based Access Control (RBAC) System", language: "Rust", main_module: "rbac"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "rbac", language: "Rust", description: "Role-Based Access Control implementation with permissions, roles, and user management"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Role-Based Access Control (RBAC) System"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/security/rate_limit.rs
CREATE (doc:Document {
      id: "Rate Limiter Implementation",
      title: "Rate Limiter Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Rate Limiter Implementation", language: "Rust", description: "Rate limiting functionality for API with per-API-key support"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "rate_limiter", language: "Rust", description: "Rate limiter implementation with global and per-key rate limiting using governor crate"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Rate Limiter Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/security/mod.rs
CREATE (doc:Document {
      id: "Security Module",
      title: "Security Module",
      domain: "software",
      doc_type: "module_documentation"
    })
CREATE (e0:Document {title: "Security Module", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "security", features: "rate_limiting,tls,audit_logging,rbac,mfa,threat_detection,encryption"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Security Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/security/enhanced_security.rs
CREATE (doc:Document {
      id: "Enhanced Security Manager - Multi-Factor Authentication and Advanced Security Enforcement",
      title: "Enhanced Security Manager - Multi-Factor Authentication and Advanced Security Enforcement",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Enhanced Security Manager", language: "rust", description: "Multi-factor authentication and advanced security enforcement module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "EnhancedSecurityManager", type: "struct", description: "Enhanced security manager providing MFA, threat detection, and compliance monitoring"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Enhanced Security Manager - Multi-Factor Authentication and Advanced Security Enforcement"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/security/audit.rs
CREATE (doc:Document {
      id: "Audit Logging System",
      title: "Audit Logging System",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "audit_logging_system", language: "rust", description: "Audit logging system with entry tracking and authentication monitoring"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "audit_logger", language: "rust", description: "Audit logger implementation with entry management and authentication tracking"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Audit Logging System"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/search/mod.rs
CREATE (doc:Document {
      id: "Advanced Discovery System",
      title: "Advanced Discovery System",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Advanced Discovery System", language: "rust", description: "Advanced discovery system with sophisticated capabilities including multi-modal search, ranking, deduplication, query suggestion, optimization, and real-time updates"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "advanced_search", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Advanced Discovery System"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/search/advanced_search.rs
CREATE (doc:Document {
      id: "Advanced Search Engine Discovery Module",
      title: "Advanced Search Engine Discovery Module",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Advanced Search Engine Discovery Module", language: "Rust", description: "Multi-modal search engine with text, vector, and hybrid search algorithms, deduplication, suggestions, and optimization capabilities"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "discovery", language: "Rust", description: "Advanced search engine providing multi-modal search capabilities with real-time processing"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Advanced Search Engine Discovery Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/replication/types.rs
CREATE (doc:Document {
      id: "Rust Vector Database Replication Structures",
      title: "Rust Vector Database Replication Structures",
      domain: "software",
      doc_type: "code_structures"
    })
CREATE (e0:Document {name: "Rust Vector Database Replication Structures", language: "rust", content_type: "code_structures"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "replication_structures", language: "rust", purpose: "Defines data structures for vector database replication system"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Rust Vector Database Replication Structures"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/replication/sync.rs
CREATE (doc:Document {
      id: "Vector Store Snapshot Synchronization Module",
      title: "Vector Store Snapshot Synchronization Module",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Vector Store Snapshot Synchronization Module", language: "rust", type: "module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "synchronization", language: "rust", purpose: "Provides snapshot creation and incremental synchronization for vector stores"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Vector Store Snapshot Synchronization Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/replication/replication_log.rs
CREATE (doc:Document {
      id: "ReplicationLog Implementation",
      title: "ReplicationLog Implementation",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Module {name: "replication", language: "rust", purpose: "Replication log management for vector database operations", features: "circular_buffer,offset_tracking,operation_logging,thread_safe"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Struct {name: "ReplicationLog", purpose: "Thread-safe circular buffer for storing vector database operations", fields: "max_size,offset,operations,offset,timestamp,operation"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Enum {name: "VectorOperation", purpose: "Operations that can be performed on vector collections", variants: "CreateCollection,InsertVector,UpdateVector,DeleteVector"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Struct {name: "ReplicationOperation", purpose: "Wrapped operation with metadata for replication", fields: "offset,timestamp,operation"})
CREATE (doc)-[:MENTIONS]->(e3)

MATCH (doc:Document {title: "ReplicationLog Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/replication/replica.rs
CREATE (doc:Document {
      id: "Replica Node Implementation",
      title: "Replica Node Implementation",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Module {name: "replica", language: "rust", description: "Replica node implementation for vector database replication with master connection, sync operations, and auto-reconnect functionality"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Struct {name: "ReplicaNode", description: "Main replica node struct containing configuration, vector store, and replication state"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Struct {name: "ReplicaState", description: "Replication state tracking offset, heartbeat, connection status, and statistics"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Function {name: "start", description: "Main entry point that connects to master and processes updates with auto-reconnect"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Function {name: "connect_and_sync", description: "Handles connection to master and synchronization process"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Function {name: "receive_command", description: "Receives and deserializes replication commands from master"})
CREATE (doc)-[:MENTIONS]->(e5)

MATCH (doc:Document {title: "Replica Node Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/replication/mod.rs
CREATE (doc:Document {
      id: "Replication module Master-Replica architecture availability",
      title: "Replication module Master-Replica architecture availability",
      domain: "software",
      doc_type: "module"
    })
CREATE (e0:Document {title: "Replication module Master-Replica architecture availability", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "replication", description: "Master-Replica architecture for availability with Redis Synap inspired design"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Replication module Master-Replica architecture availability"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/replication/master.rs
CREATE (doc:Document {
      id: "Master Node Replication System",
      title: "Master Node Replication System",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Module {name: "master", language: "rust", description: "Master node implementation for vector database replication system"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Document {name: "master.rs", type: "source_code", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Master Node Replication System"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/replication/config.rs
CREATE (doc:Document {
      id: "Replication Configuration",
      title: "Replication Configuration",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Replication Configuration", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "ReplicationConfig", type: "struct"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Replication Configuration"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/quantization/traits.rs
CREATE (doc:Document {
      id: "Vector Quantization System",
      title: "Vector Quantization System",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Vector Quantization System", language: "Rust", type: "code_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "quantization", language: "Rust", type: "core_module"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Vector Quantization System"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/quantization/storage.rs
CREATE (doc:Document {
      id: "Quantized Vector Storage System",
      title: "Quantized Vector Storage System",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Quantized Vector Storage System", language: "rust", type: "system_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "quantized_vector_storage", language: "rust", purpose: "Memory-mapped storage for quantized vectors with caching and compression"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Quantized Vector Storage System"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/quantization/scalar.rs
CREATE (doc:Document {
      id: "Quantization Implementation",
      title: "Quantization Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Quantization Implementation", language: "Rust", content_type: "source_code"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "ScalarQuantization", language: "Rust", type: "struct", functionality: "Implements scalar quantization with 8-bit, 4-bit, 2-bit, and 1-bit precision"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Quantization Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/quantization/product.rs
CREATE (doc:Document {
      id: "Product Quantization Implementation",
      title: "Product Quantization Implementation",
      domain: "software",
      doc_type: "code_implementation"
    })
CREATE (e0:Document {name: "Product Quantization Implementation", language: "Rust", content_type: "source_code"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "ProductQuantization", language: "Rust", type: "struct_implementation", purpose: "High-dimensional vector quantization using product quantization method"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Product Quantization Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/quantization/mod.rs
CREATE (doc:Document {
      id: "Quantization System Implementation",
      title: "Quantization System Implementation",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Quantization System Implementation", language: "rust", main_module: "quantization"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "quantization", type: "rust_module", features: "optimization,scalar,hnsw_integration,simple_tests,product"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Quantization System Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/quantization/hnsw_integration.rs
CREATE (doc:Document {
      id: "HNSW Quantization Integration",
      title: "HNSW Quantization Integration",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "HNSW Quantization Integration", language: "rust", type: "module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "hnsw_quantization", language: "rust", purpose: "HNSW integration with quantization support", features: "quantized_search,hybrid_search,caching,scalar_quantization"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "HNSW Quantization Integration"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/processing/mod.rs
CREATE (doc:Document {
      id: "Advanced Pipeline Module",
      title: "Advanced Pipeline Module",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Advanced Pipeline Module", language: "rust", description: "Advanced pipeline module providing sophisticated capabilities including multi-stage processing, real-time data transformation, quality validation, performance optimization, and error handling recovery"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "advanced_pipeline", path: "advanced_pipeline", description: "Sophisticated pipeline module with multi-stage processing, real-time capabilities, data transformation, quality validation, performance optimization, and error handling recovery"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Advanced Pipeline Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/processing/advanced_pipeline.rs
CREATE (doc:Document {
      id: "Advanced Processing Pipeline",
      title: "Advanced Processing Pipeline",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {title: "Advanced Processing Pipeline", language: "rust", description: "Advanced multi-stage streaming transformation pipeline with quality assurance, monitoring, and recovery capabilities"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "AdvancedProcessingPipeline", language: "rust", type: "struct", description: "Main pipeline struct containing configuration, stages, sources, sinks, state, metrics, and error handling"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Advanced Processing Pipeline"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/persistence/wal.rs
CREATE (doc:Document {
      id: "Write-Ahead Log (WAL) Implementation",
      title: "Write-Ahead Log (WAL) Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Write-Ahead Log (WAL) Implementation", language: "Rust", type: "code_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "WriteAheadLog", language: "Rust", type: "struct", description: "WAL (Write-Ahead Log) implementation for persistence"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Write-Ahead Log (WAL) Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/persistence/types.rs
CREATE (doc:Document {
      id: "Enhanced Collection Metadata and WAL System",
      title: "Enhanced Collection Metadata and WAL System",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Enhanced Collection Metadata and WAL System", language: "rust", main_module: "collection_metadata"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "collection_metadata", language: "rust", purpose: "Collection metadata management and WAL operations"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Enhanced Collection Metadata and WAL System"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/persistence/mod.rs
CREATE (doc:Document {
      id: "Persistence Module",
      title: "Persistence Module",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Module {name: "persistence", language: "rust", purpose: "Vector store persistence and serialization"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Struct {name: "PersistedVectorStore", purpose: "Main container for persisted vector store data"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Struct {name: "PersistedCollection", purpose: "Persisted collection with vectors and metadata"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Struct {name: "PersistedVector", purpose: "Serialized vector representation with payload"})
CREATE (doc)-[:MENTIONS]->(e3)

MATCH (doc:Document {title: "Persistence Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/persistence/enhanced_store.rs
CREATE (doc:Document {
      id: "Enhanced Vector Store Implementation",
      title: "Enhanced Vector Store Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Enhanced Vector Store Implementation", language: "Rust", type: "code_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "EnhancedVectorStore", language: "Rust", type: "struct", description: "Enhanced vector store that supports both workspace and dynamic collections with metadata caching"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Enhanced Vector Store Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/persistence/dynamic.rs
CREATE (doc:Document {
      id: "Dynamic Collection Persistence Module",
      title: "Dynamic Collection Persistence Module",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Module {name: "DynamicCollectionPersistence", language: "rust", file_type: "rs"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Document {title: "Dynamic Collection Persistence Module", language: "rust", main_module: "DynamicCollectionPersistence"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Dynamic Collection Persistence Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/parallel/mod.rs
CREATE (doc:Document {
      id: "Parallel Processing Pipeline for Embeddings and Indexing",
      title: "Parallel Processing Pipeline for Embeddings and Indexing",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Parallel Processing Pipeline for Embeddings and Indexing", language: "Rust", content_type: "source_code"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "parallel_processing", language: "Rust", purpose: "Thread pool management and parallel processing pipeline for embeddings and indexing operations"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Parallel Processing Pipeline for Embeddings and Indexing"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/normalization/normalizer.rs
CREATE (doc:Document {
      id: "Text Normalization Module",
      title: "Text Normalization Module",
      domain: "software",
      doc_type: "Rust source code with documentation"
    })
CREATE (e0:Module {name: "super::detector", description: "Module containing ContentType detection"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "super::hasher", description: "Module containing content hashing functionality"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Class {name: "NormalizationLevel", description: "Enum defining normalization levels: Conservative, Moderate, Aggressive"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Class {name: "NormalizationPolicy", description: "Configuration for text normalization behavior"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Class {name: "NormalizedContent", description: "Result of text normalization containing normalized text and metadata"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Class {name: "NormalizationMetadata", description: "Metadata about the normalization process"})
CREATE (doc)-[:MENTIONS]->(e5)
CREATE (e6:Class {name: "TextNormalizer", description: "Main class for performing text normalization"})
CREATE (doc)-[:MENTIONS]->(e6)
CREATE (e7:Function {name: "TextNormalizer::new", description: "Constructor for TextNormalizer with policy"})
CREATE (doc)-[:MENTIONS]->(e7)
CREATE (e8:Function {name: "TextNormalizer::normalize", description: "Main normalization function that applies policy based on content type"})
CREATE (doc)-[:MENTIONS]->(e8)
CREATE (e9:Function {name: "TextNormalizer::normalize_query", description: "Specialized normalization for queries (always aggressive)"})
CREATE (doc)-[:MENTIONS]->(e9)
CREATE (e10:Function {name: "TextNormalizer::normalize_conservative", description: "Level 1 normalization: NFC, CRLF→LF, BOM removal"})
CREATE (doc)-[:MENTIONS]->(e10)
CREATE (e11:Function {name: "TextNormalizer::normalize_moderate", description: "Level 2 normalization: conservative + zero-width char removal, newline collapsing"})
CREATE (doc)-[:MENTIONS]->(e11)
CREATE (e12:Function {name: "TextNormalizer::normalize_aggressive", description: "Level 3 normalization: NFKC, whitespace collapsing, control char removal"})
CREATE (doc)-[:MENTIONS]->(e12)
CREATE (e13:Dependency {name: "serde", description: "Serialization/deserialization framework"})
CREATE (doc)-[:MENTIONS]->(e13)
CREATE (e14:Dependency {name: "unicode_normalization", description: "Unicode normalization functionality"})
CREATE (doc)-[:MENTIONS]->(e14)
CREATE (e15:Configuration {name: "NormalizationPolicy", description: "Configures normalization behavior with version, level, and options"})
CREATE (doc)-[:MENTIONS]->(e15)
CREATE (e16:API {name: "TextNormalizer API", description: "Public interface for text normalization operations"})
CREATE (doc)-[:MENTIONS]->(e16)
CREATE (e17:Documentation {name: "Code documentation", description: "Rust doc comments explaining types and functions"})
CREATE (doc)-[:MENTIONS]->(e17)

MATCH (doc:Document {title: "Text Normalization Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/normalization/mod.rs
CREATE (doc:Document {
      id: "Module Storage and Detection Documentation",
      title: "Module Storage and Detection Documentation",
      domain: "software",
      doc_type: "code documentation"
    })
CREATE (e0:Module {name: "vectorizer::normalization"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Class {name: "TextNormalizer"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Class {name: "NormalizationPolicy"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Configuration {name: "NormalizationPolicy::default"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Function {name: "TextNormalizer::new"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Function {name: "TextNormalizer::normalize"})
CREATE (doc)-[:MENTIONS]->(e5)
CREATE (e6:Module {name: "cache"})
CREATE (doc)-[:MENTIONS]->(e6)
CREATE (e7:Configuration {name: "CacheConfig"})
CREATE (doc)-[:MENTIONS]->(e7)
CREATE (e8:Class {name: "CacheManager"})
CREATE (doc)-[:MENTIONS]->(e8)
CREATE (e9:Class {name: "CacheStats"})
CREATE (doc)-[:MENTIONS]->(e9)
CREATE (e10:Module {name: "config"})
CREATE (doc)-[:MENTIONS]->(e10)
CREATE (e11:Configuration {name: "NormalizationConfig"})
CREATE (doc)-[:MENTIONS]->(e11)
CREATE (e12:Module {name: "detector"})
CREATE (doc)-[:MENTIONS]->(e12)
CREATE (e13:Class {name: "ContentType"})
CREATE (doc)-[:MENTIONS]->(e13)
CREATE (e14:Class {name: "ContentTypeDetector"})
CREATE (doc)-[:MENTIONS]->(e14)
CREATE (e15:Documentation {name: "Module documentation"})
CREATE (doc)-[:MENTIONS]->(e15)

MATCH (doc:Document {title: "Module Storage and Detection Documentation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/normalization/integration.rs
CREATE (doc:Document {
      id: "Normalization Pipeline Implementation",
      title: "Normalization Pipeline Implementation",
      domain: "software",
      doc_type: "Rust source code with documentation"
    })
CREATE (e0:Class {name: "NormalizationPipeline", description: "Main pipeline for document normalization processing"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Class {name: "ProcessedDocument", description: "Result structure for processed documents"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Function {name: "new", description: "Constructor for NormalizationPipeline"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Function {name: "process_document", description: "Main document processing method"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Function {name: "process_query", description: "Query normalization method"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Function {name: "is_duplicate", description: "Check if content is duplicate"})
CREATE (doc)-[:MENTIONS]->(e5)
CREATE (e6:Function {name: "cache_stats", description: "Get cache statistics"})
CREATE (doc)-[:MENTIONS]->(e6)
CREATE (e7:Function {name: "clear_cache", description: "Clear the cache"})
CREATE (doc)-[:MENTIONS]->(e7)
CREATE (e8:Function {name: "embedding_text", description: "Get text for embedding generation"})
CREATE (doc)-[:MENTIONS]->(e8)
CREATE (e9:Function {name: "display_text", description: "Get display text"})
CREATE (doc)-[:MENTIONS]->(e9)
CREATE (e10:Dependency {name: "parking_lot::RwLock", description: "RwLock implementation for synchronization"})
CREATE (doc)-[:MENTIONS]->(e10)
CREATE (e11:Dependency {name: "tempfile", description: "Temporary file utilities for testing"})
CREATE (doc)-[:MENTIONS]->(e11)
CREATE (e12:Dependency {name: "tokio", description: "Async runtime for tests"})
CREATE (doc)-[:MENTIONS]->(e12)
CREATE (e13:Configuration {name: "NormalizationConfig", description: "Configuration for normalization pipeline"})
CREATE (doc)-[:MENTIONS]->(e13)
CREATE (e14:Configuration {name: "CacheConfig", description: "Cache configuration settings"})
CREATE (doc)-[:MENTIONS]->(e14)
CREATE (e15:API {name: "ContentTypeDetector", description: "API for detecting content types"})
CREATE (doc)-[:MENTIONS]->(e15)
CREATE (e16:API {name: "TextNormalizer", description: "API for text normalization"})
CREATE (doc)-[:MENTIONS]->(e16)
CREATE (e17:API {name: "CacheManager", description: "Cache management API"})
CREATE (doc)-[:MENTIONS]->(e17)
CREATE (e18:API {name: "ContentHashCalculator", description: "API for content hashing"})
CREATE (doc)-[:MENTIONS]->(e18)
CREATE (e19:Test {name: "test_pipeline_basic", description: "Basic pipeline functionality test"})
CREATE (doc)-[:MENTIONS]->(e19)
CREATE (e20:Documentation {name: "module_docs", description: "Integration utilities pipelines documentation"})
CREATE (doc)-[:MENTIONS]->(e20)

MATCH (doc:Document {title: "Normalization Pipeline Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/normalization/hasher.rs
CREATE (doc:Document {
      id: "BLAKE3 Content Hash Implementation",
      title: "BLAKE3 Content Hash Implementation",
      domain: "software",
      doc_type: "Rust Source Code"
    })
CREATE (e0:Module {name: "std::fmt"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "serde"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Module {name: "hex"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Module {name: "blake3"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Module {name: "bincode"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Class {name: "ContentHash"})
CREATE (doc)-[:MENTIONS]->(e5)
CREATE (e6:Function {name: "ContentHash::from_bytes"})
CREATE (doc)-[:MENTIONS]->(e6)
CREATE (e7:Function {name: "ContentHash::as_bytes"})
CREATE (doc)-[:MENTIONS]->(e7)
CREATE (e8:Function {name: "ContentHash::to_hex"})
CREATE (doc)-[:MENTIONS]->(e8)
CREATE (e9:Function {name: "ContentHash::from_hex"})
CREATE (doc)-[:MENTIONS]->(e9)
CREATE (e10:Class {name: "ContentHashCalculator"})
CREATE (doc)-[:MENTIONS]->(e10)
CREATE (e11:Function {name: "ContentHashCalculator::new"})
CREATE (doc)-[:MENTIONS]->(e11)
CREATE (e12:Function {name: "ContentHashCalculator::hash"})
CREATE (doc)-[:MENTIONS]->(e12)
CREATE (e13:Function {name: "ContentHashCalculator::hash_bytes"})
CREATE (doc)-[:MENTIONS]->(e13)
CREATE (e14:Function {name: "ContentHashCalculator::verify"})
CREATE (doc)-[:MENTIONS]->(e14)
CREATE (e15:Function {name: "ContentHashCalculator::default"})
CREATE (doc)-[:MENTIONS]->(e15)
CREATE (e16:Class {name: "VectorKey"})
CREATE (doc)-[:MENTIONS]->(e16)
CREATE (e17:Function {name: "VectorKey::new"})
CREATE (doc)-[:MENTIONS]->(e17)
CREATE (e18:Function {name: "VectorKey::to_bytes"})
CREATE (doc)-[:MENTIONS]->(e18)
CREATE (e19:Function {name: "VectorKey::from_bytes"})
CREATE (doc)-[:MENTIONS]->(e19)
CREATE (e20:Function {name: "hex::encode"})
CREATE (doc)-[:MENTIONS]->(e20)
CREATE (e21:Class {name: "FromHexError"})
CREATE (doc)-[:MENTIONS]->(e21)
CREATE (e22:Function {name: "hex::decode"})
CREATE (doc)-[:MENTIONS]->(e22)
CREATE (e23:Test {name: "test_content_hash"})
CREATE (doc)-[:MENTIONS]->(e23)
CREATE (e24:Documentation {name: "Module Documentation"})
CREATE (doc)-[:MENTIONS]->(e24)

MATCH (doc:Document {title: "BLAKE3 Content Hash Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/normalization/detector.rs
CREATE (doc:Document {
      id: "Content Type Detection Module",
      title: "Content Type Detection Module",
      domain: "software",
      doc_type: "Rust Source Code"
    })
CREATE (e0:Module {name: "Detection", description: "Module for detecting content types based on file extensions and heuristics"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Class {name: "ContentType", description: "Enum representing different content types with variants like Code, Markdown, Table, Html, Plain, Json"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Class {name: "TableFormat", description: "Enum representing table formats such as Csv, Tsv, Psv"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Class {name: "ContentTypeDetector", description: "Class for detecting content types using cached regex patterns and heuristics"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Function {name: "ContentTypeDetector::new", description: "Constructor function to create a new ContentTypeDetector instance with initialized regex patterns"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Function {name: "ContentTypeDetector::detect", description: "Function to detect content type from content and optional file path, using extension and heuristics"})
CREATE (doc)-[:MENTIONS]->(e5)
CREATE (e6:Function {name: "ContentTypeDetector::detect_by_extension", description: "Function to detect content type based on file extension string"})
CREATE (doc)-[:MENTIONS]->(e6)
CREATE (e7:Function {name: "ContentTypeDetector::detect_by_heuristics", description: "Function to detect content type using regex patterns and heuristics on content"})
CREATE (doc)-[:MENTIONS]->(e7)
CREATE (e8:Function {name: "ContentTypeDetector::is_likely_table", description: "Function to check if content is likely a table based on delimiter consistency"})
CREATE (doc)-[:MENTIONS]->(e8)
CREATE (e9:Function {name: "ContentTypeDetector::detect_table_format", description: "Function to determine the table format (e.g., Csv, Tsv, Psv) from content lines"})
CREATE (doc)-[:MENTIONS]->(e9)
CREATE (e10:Dependency {name: "std::fmt", description: "Standard library module for formatting, used in the fmt function for ContentType"})
CREATE (doc)-[:MENTIONS]->(e10)
CREATE (e11:Dependency {name: "regex::Regex", description: "External regex crate for pattern matching in content detection"})
CREATE (doc)-[:MENTIONS]->(e11)
CREATE (e12:Documentation {name: "ContentType Documentation", description: "Inline documentation for ContentType enum and its variants"})
CREATE (doc)-[:MENTIONS]->(e12)

MATCH (doc:Document {title: "Content Type Detection Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/normalization/config.rs
CREATE (doc:Document {
      id: "NormalizationConfig Documentation",
      title: "NormalizationConfig Documentation",
      domain: "software",
      doc_type: "Code Documentation"
    })
CREATE (e0:Class {name: "NormalizationConfig", fields: "enabled: bool, policy: NormalizationPolicy, cache_enabled: bool, hot_cache_size: usize, normalize_queries: bool, store_raw_text: bool"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Dependency {name: "serde", crate: "serde"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Dependency {name: "super", module: "super"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Function {name: "default", purpose: "Provides default values for NormalizationConfig"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Function {name: "enabled", purpose: "Creates a configuration with normalization enabled"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Function {name: "conservative", purpose: "Creates a conservative normalization configuration"})
CREATE (doc)-[:MENTIONS]->(e5)
CREATE (e6:Function {name: "moderate", purpose: "Creates a moderate normalization configuration"})
CREATE (doc)-[:MENTIONS]->(e6)
CREATE (e7:Function {name: "aggressive", purpose: "Creates an aggressive normalization configuration"})
CREATE (doc)-[:MENTIONS]->(e7)
CREATE (e8:Configuration {name: "NormalizationConfig", description: "Configuration for text normalization settings"})
CREATE (doc)-[:MENTIONS]->(e8)
CREATE (e9:Documentation {name: "NormalizationConfig Documentation", content: "Describes the NormalizationConfig struct and its methods"})
CREATE (doc)-[:MENTIONS]->(e9)

MATCH (doc:Document {title: "NormalizationConfig Documentation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/monitoring/telemetry.rs
CREATE (doc:Document {
      id: "OpenTelemetry Integration",
      title: "OpenTelemetry Integration",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "OpenTelemetry Integration", language: "rust", description: "OpenTelemetry capabilities for vectorizer monitoring and tracing"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "telemetry", language: "rust", description: "OpenTelemetry tracing module with OTLP integration", functions: "try_init,shutdown"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "OpenTelemetry Integration"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/monitoring/system_collector.rs
CREATE (doc:Document {
      id: "SystemCollector Module",
      title: "SystemCollector Module",
      domain: "software",
      doc_type: "Rust Source Code"
    })
CREATE (e0:Module {name: "Collector", description: "System-level metrics collector"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Class {name: "SystemCollectorConfig", description: "Configuration for the system collector"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Class {name: "SystemCollector", description: "Main system metrics collector class"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Function {name: "SystemCollector::new", description: "Creates a new system collector with default config"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Function {name: "SystemCollector::with_config", description: "Creates a system collector with custom config"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Function {name: "SystemCollector::start", description: "Starts the collector as a tokio task"})
CREATE (doc)-[:MENTIONS]->(e5)
CREATE (e6:Function {name: "SystemCollector::collect_metrics", description: "Collects all metrics including memory and vector store"})
CREATE (doc)-[:MENTIONS]->(e6)
CREATE (e7:Function {name: "SystemCollector::collect_memory_metrics", description: "Collects memory usage metrics"})
CREATE (doc)-[:MENTIONS]->(e7)
CREATE (e8:Function {name: "SystemCollector::collect_vector_store_metrics", description: "Collects vector store metrics like collections and vectors count"})
CREATE (doc)-[:MENTIONS]->(e8)
CREATE (e9:Dependency {name: "tracing", description: "Used for debug and warn logging"})
CREATE (doc)-[:MENTIONS]->(e9)
CREATE (e10:Dependency {name: "tokio", description: "Used for async tasks and interval timing"})
CREATE (doc)-[:MENTIONS]->(e10)
CREATE (e11:Dependency {name: "memory_stats", description: "Used to get memory usage statistics"})
CREATE (doc)-[:MENTIONS]->(e11)
CREATE (e12:Configuration {name: "SystemCollectorConfig", description: "Defines interval_secs for metric collection"})
CREATE (doc)-[:MENTIONS]->(e12)
CREATE (e13:API {name: "VectorStore API", description: "Used to interact with vector store for metrics"})
CREATE (doc)-[:MENTIONS]->(e13)
CREATE (e14:Database {name: "VectorStore", description: "Stores vector data and provides collection methods"})
CREATE (doc)-[:MENTIONS]->(e14)
CREATE (e15:Test {name: "test_collector_creation", description: "Tests creation of SystemCollector with default config"})
CREATE (doc)-[:MENTIONS]->(e15)
CREATE (e16:Test {name: "test_custom_config", description: "Tests creation of SystemCollector with custom config"})
CREATE (doc)-[:MENTIONS]->(e16)
CREATE (e17:Documentation {name: "Module Documentation", description: "Documentation for the collector module and its components"})
CREATE (doc)-[:MENTIONS]->(e17)

MATCH (doc:Document {title: "SystemCollector Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/monitoring/registry.rs
CREATE (doc:Document {
      id: "Management Module",
      title: "Management Module",
      domain: "software",
      doc_type: "Rust Source Code"
    })
CREATE (e0:Module {name: "Management", description: "Provides global registry management for Prometheus metrics"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Function {name: "init", description: "Initializes the metrics registry idempotently"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Function {name: "get_registry", description: "Returns a clone of the global registry"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Dependency {name: "once_cell", description: "Used for lazy initialization and OnceCell"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Dependency {name: "parking_lot", description: "Provides RwLock for thread-safe access"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Dependency {name: "prometheus", properties: "[object Object]"})
CREATE (doc)-[:MENTIONS]->(e5)
CREATE (e6:Dependency {name: "tracing", description: "Used for logging info messages"})
CREATE (doc)-[:MENTIONS]->(e6)
CREATE (e7:Configuration {name: "REGISTRY", description: "Global lazy-initialized registry wrapped in Arc and RwLock"})
CREATE (doc)-[:MENTIONS]->(e7)
CREATE (e8:Test {name: "test_registry_init_idempotent", description: "Tests that init can be called multiple times without error"})
CREATE (doc)-[:MENTIONS]->(e8)
CREATE (e9:Test {name: "test_registry_access", description: "Tests that the registry can be accessed and contains metrics"})
CREATE (doc)-[:MENTIONS]->(e9)
CREATE (e10:Test {name: "test_metrics_export", description: "Tests recording and exporting metrics"})
CREATE (doc)-[:MENTIONS]->(e10)
CREATE (e11:Documentation {name: "Module Documentation", description: "Provides registration and management for metrics"})
CREATE (doc)-[:MENTIONS]->(e11)

MATCH (doc:Document {title: "Management Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/monitoring/performance.rs
CREATE (doc:Document {
      id: "Vectorizer Utilities",
      title: "Vectorizer Utilities",
      domain: "software",
      doc_type: "Code Documentation"
    })
CREATE (e0:Class {name: "OperationMetrics", fields: "operation,count,total_duration,avg_duration,min_duration,max_duration,success_count,error_count,p50_duration,p95_duration,p99_duration,recent_durations,throughput,error_rate,memory_usage,cpu_usage,thread_count,file_handles,disk_io_ops,network_io_bytes,available_memory,total_memory,memory_usage_percent,load_average_1m,load_average_5m,load_average_15m,disk_usage_percent,network_connections,process_count,uptime_seconds,name,vector_count,memory_usage,search_count,insert_count,update_count,delete_count,avg_search_time,last_access,system,operations,collections,uptime,generated_at,operations,collections,start_time,system_metrics"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Class {name: "SystemMetrics", fields: "memory_usage,cpu_usage,thread_count,file_handles,disk_io_ops,network_io_bytes,available_memory,total_memory,memory_usage_percent,load_average_1m,load_average_5m,load_average_15m,disk_usage_percent,network_connections,process_count,uptime_seconds"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Class {name: "CollectionMetrics", fields: "name,vector_count,memory_usage,search_count,insert_count,update_count,delete_count,avg_search_time,last_access"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Class {name: "PerformanceReport", fields: "system,operations,collections,uptime,generated_at"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Class {name: "PerformanceMonitor", fields: "operations,collections,start_time,system_metrics"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Function {name: "new", class: "PerformanceMonitor"})
CREATE (doc)-[:MENTIONS]->(e5)
CREATE (e6:Function {name: "record_operation", class: "PerformanceMonitor"})
CREATE (doc)-[:MENTIONS]->(e6)
CREATE (e7:Dependency {name: "std::collections::HashMap"})
CREATE (doc)-[:MENTIONS]->(e7)
CREATE (e8:Dependency {name: "std::sync::Arc"})
CREATE (doc)-[:MENTIONS]->(e8)
CREATE (e9:Dependency {name: "std::time::Duration"})
CREATE (doc)-[:MENTIONS]->(e9)
CREATE (e10:Dependency {name: "std::time::Instant"})
CREATE (doc)-[:MENTIONS]->(e10)
CREATE (e11:Dependency {name: "serde::Deserialize"})
CREATE (doc)-[:MENTIONS]->(e11)
CREATE (e12:Dependency {name: "serde::Serialize"})
CREATE (doc)-[:MENTIONS]->(e12)
CREATE (e13:Dependency {name: "tokio::sync::RwLock"})
CREATE (doc)-[:MENTIONS]->(e13)
CREATE (e14:Documentation {name: "Module Documentation", content: "utilities Vectorizer capabilities"})
CREATE (doc)-[:MENTIONS]->(e14)

MATCH (doc:Document {title: "Vectorizer Utilities"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/monitoring/mod.rs
CREATE (doc:Document {
      id: "Monitoring Capabilities Documentation",
      title: "Monitoring Capabilities Documentation",
      domain: "software",
      doc_type: "Code Documentation"
    })
CREATE (e0:Module {name: "monitoring", description: "Handles monitoring capabilities including metrics and correlation"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Function {name: "init", description: "Initializes the monitoring system"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Function {name: "export_metrics", description: "Exports metrics in Prometheus format"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Class {name: "Metrics", description: "Class for recording metrics"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Dependency {name: "OpenTelemetry", description: "Used for structured monitoring export"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Dependency {name: "prometheus", description: "Library for metrics encoding"})
CREATE (doc)-[:MENTIONS]->(e5)
CREATE (e6:Dependency {name: "tracing", description: "Used for logging"})
CREATE (doc)-[:MENTIONS]->(e6)
CREATE (e7:Dependency {name: "anyhow", description: "Error handling library"})
CREATE (doc)-[:MENTIONS]->(e7)
CREATE (e8:Dependency {name: "correlation", description: "Module for correlation ID handling"})
CREATE (doc)-[:MENTIONS]->(e8)
CREATE (e9:Dependency {name: "system_collector", description: "System metrics collection"})
CREATE (doc)-[:MENTIONS]->(e9)
CREATE (e10:Configuration {name: "SystemCollectorConfig", description: "Configuration for system collector"})
CREATE (doc)-[:MENTIONS]->(e10)
CREATE (e11:API {name: "HTTP Export", description: "API for exporting metrics via HTTP"})
CREATE (doc)-[:MENTIONS]->(e11)
CREATE (e12:Test {name: "test_init", description: "Tests the init function"})
CREATE (doc)-[:MENTIONS]->(e12)
CREATE (e13:Test {name: "test_export_metrics", description: "Tests the export_metrics function"})
CREATE (doc)-[:MENTIONS]->(e13)
CREATE (e14:Test {name: "test_init_monitoring", description: "Tests monitoring initialization"})
CREATE (doc)-[:MENTIONS]->(e14)
CREATE (e15:Test {name: "test_export_metrics_format", description: "Tests metrics export format"})
CREATE (doc)-[:MENTIONS]->(e15)
CREATE (e16:Test {name: "test_metrics_initialization", description: "Tests metrics initialization"})
CREATE (doc)-[:MENTIONS]->(e16)
CREATE (e17:Documentation {name: "Monitoring Documentation", description: "Documentation for monitoring capabilities"})
CREATE (doc)-[:MENTIONS]->(e17)

MATCH (doc:Document {title: "Monitoring Capabilities Documentation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/monitoring/metrics.rs
CREATE (doc:Document {
      id: "Monitoring Metrics Definitions",
      title: "Monitoring Metrics Definitions",
      domain: "software",
      doc_type: "Code Documentation"
    })
CREATE (e0:Module {name: "monitoring", description: "Module containing metrics definitions for monitoring system performance and business operations"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Class {name: "Metrics", description: "Struct defining various metrics for search, indexing, replication, system, performance, business, and error tracking"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Dependency {name: "once_cell", description: "External crate for lazy initialization"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Dependency {name: "prometheus", description: "External crate for metrics collection and exposition"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Function {name: "new", description: "Constructor function for creating a new Metrics instance"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Configuration {name: "Global METRICS", description: "Global lazy-initialized metrics instance"})
CREATE (doc)-[:MENTIONS]->(e5)

MATCH (doc:Document {title: "Monitoring Metrics Definitions"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/monitoring/correlation.rs
CREATE (doc:Document {
      id: "Correlation ID Module",
      title: "Correlation ID Module",
      domain: "software",
      doc_type: "Rust source code with documentation and tests"
    })
CREATE (e0:Module {name: "correlation_id_module", description: "Handles correlation ID tracking for HTTP requests"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Function {name: "generate_correlation_id", description: "Generates a unique correlation ID using UUID"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Function {name: "correlation_middleware", description: "Middleware to handle correlation ID in requests and responses"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Function {name: "current_correlation_id", description: "Retrieves the current correlation ID from task-local storage"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Dependency {name: "axum", description: "Web framework for Rust"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Dependency {name: "tokio", description: "Asynchronous runtime for Rust"})
CREATE (doc)-[:MENTIONS]->(e5)
CREATE (e6:Dependency {name: "uuid", description: "Library for generating UUIDs"})
CREATE (doc)-[:MENTIONS]->(e6)
CREATE (e7:Configuration {name: "CORRELATION_ID_HEADER", description: "Header name for correlation ID, set to 'X-Correlation-ID'"})
CREATE (doc)-[:MENTIONS]->(e7)
CREATE (e8:Test {name: "test_generate_correlation_id", description: "Tests uniqueness of generated correlation IDs"})
CREATE (doc)-[:MENTIONS]->(e8)
CREATE (e9:Test {name: "test_correlation_middleware", description: "Tests middleware adds correlation ID header to response"})
CREATE (doc)-[:MENTIONS]->(e9)
CREATE (e10:Test {name: "test_correlation_id_propagation", description: "Tests correlation ID is available in handler context"})
CREATE (doc)-[:MENTIONS]->(e10)
CREATE (e11:Documentation {name: "module_docs", description: "Provides ID tracking for correlation in HTTP requests"})
CREATE (doc)-[:MENTIONS]->(e11)

MATCH (doc:Document {title: "Correlation ID Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/models/mod.rs
CREATE (doc:Document {
      id: "Data Vectorizer",
      title: "Data Vectorizer",
      domain: "software",
      doc_type: "code_documentation"
    })
CREATE (e0:Class {name: "Vector", description: "Data structure for vector representation with unique identifier, vector data, and optional payload", attributes: "id: String,data: Vec<f32>,payload: Option<Payload>,id: String,quantized_data: Vec<u8>,min_val: f32,max_val: f32,payload: Option<Payload>,data: serde_json::Value,dimension: usize,metric: DistanceMetric,hnsw_config: HnswConfig,quantization: QuantizationConfig,compression: CompressionConfig,normalization: Option<NormalizationConfig>,Cosine,Euclidean,DotProduct,m: usize,ef_construction: usize,ef_search: usize,seed: Option<u64>"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Class {name: "QuantizedVector", description: "Memory-optimized vector representation with quantized data and reconstruction parameters", attributes: "id: String,quantized_data: Vec<u8>,min_val: f32,max_val: f32,payload: Option<Payload>"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Class {name: "Payload", description: "JSON payload data structure with normalization capabilities", attributes: "data: serde_json::Value"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Class {name: "CollectionConfig", description: "Configuration for vector collection including dimension, metric, and indexing settings", attributes: "dimension: usize,metric: DistanceMetric,hnsw_config: HnswConfig,quantization: QuantizationConfig,compression: CompressionConfig,normalization: Option<NormalizationConfig>"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Class {name: "DistanceMetric", description: "Enumeration of distance metrics for similarity calculations", attributes: "Cosine,Euclidean,DotProduct"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Class {name: "HnswConfig", description: "Configuration for HNSW (Hierarchical Navigable Small World) index", attributes: "m: usize,ef_construction: usize,ef_search: usize,seed: Option<u64>"})
CREATE (doc)-[:MENTIONS]->(e5)
CREATE (e6:Function {name: "from_vector", description: "Creates QuantizedVector from full precision Vector", parameters: "vector: Vector,,,data: &[f32],quantized: &[u8],min_val: f32,max_val: f32,&mut self,value: &mut serde_json::Value,&self", return_type: "QuantizedVector"})
CREATE (doc)-[:MENTIONS]->(e6)
CREATE (e7:Function {name: "to_vector", description: "Converts QuantizedVector back to full precision Vector", parameters: "", return_type: "Vector"})
CREATE (doc)-[:MENTIONS]->(e7)
CREATE (e8:Function {name: "memory_size", description: "Calculates memory usage of QuantizedVector", parameters: "", return_type: "usize"})
CREATE (doc)-[:MENTIONS]->(e8)
CREATE (e9:Function {name: "quantize_to_u8", description: "Quantizes f32 vector data to u8 range (0-255)", parameters: "data: &[f32]", return_type: "(Vec<u8>, f32, f32)"})
CREATE (doc)-[:MENTIONS]->(e9)
CREATE (e10:Function {name: "dequantize_from_u8", description: "Dequantizes u8 vector data back to f32 range", parameters: "quantized: &[u8],min_val: f32,max_val: f32", return_type: "Vec<f32>"})
CREATE (doc)-[:MENTIONS]->(e10)
CREATE (e11:Function {name: "normalize", description: "Normalizes text content in payload using conservative normalization", parameters: "&mut self", return_type: "()"})
CREATE (doc)-[:MENTIONS]->(e11)
CREATE (e12:Function {name: "normalize_value", description: "Recursively normalizes JSON values", parameters: "value: &mut serde_json::Value", return_type: "()"})
CREATE (doc)-[:MENTIONS]->(e12)
CREATE (e13:Function {name: "normalized", description: "Returns normalized copy of payload", parameters: "&self", return_type: "Payload"})
CREATE (doc)-[:MENTIONS]->(e13)
CREATE (e14:Dependency {name: "std::fmt", description: "Standard library formatting utilities"})
CREATE (doc)-[:MENTIONS]->(e14)
CREATE (e15:Dependency {name: "serde", description: "Serialization/deserialization framework"})
CREATE (doc)-[:MENTIONS]->(e15)
CREATE (e16:Dependency {name: "qdrant", description: "Vector database library"})
CREATE (doc)-[:MENTIONS]->(e16)
CREATE (e17:Dependency {name: "serde_json", description: "JSON serialization/deserialization"})
CREATE (doc)-[:MENTIONS]->(e17)
CREATE (e18:Configuration {name: "QuantizationConfig", description: "Configuration for vector quantization"})
CREATE (doc)-[:MENTIONS]->(e18)
CREATE (e19:Configuration {name: "CompressionConfig", description: "Configuration for data compression"})
CREATE (doc)-[:MENTIONS]->(e19)
CREATE (e20:Configuration {name: "NormalizationConfig", description: "Configuration for text normalization"})
CREATE (doc)-[:MENTIONS]->(e20)

MATCH (doc:Document {title: "Data Vectorizer"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/models/collection_metadata.rs
CREATE (doc:Document {
      id: "Software Metadata and Configuration Document",
      title: "Software Metadata and Configuration Document",
      domain: "software",
      doc_type: "Code Documentation"
    })
CREATE (e0:Class {name: "CollectionMetadataFile", description: "Represents metadata for a collection, including name, files, configuration, embedding model, and last update timestamp."})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Class {name: "FileMetadata", description: "Represents metadata for a file, including path, hash, size, last modified timestamp, chunk count, and indexed timestamp."})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Class {name: "CollectionIndexingConfig", description: "Configuration for collection indexing."})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Class {name: "EmbeddingModelInfo", description: "Information about the embedding model used."})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Dependency {name: "std::collections::HashMap", description: "Standard library hash map for data structures."})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Dependency {name: "serde::{Deserialize, Serialize}", description: "Serde library traits for serialization and deserialization."})
CREATE (doc)-[:MENTIONS]->(e5)
CREATE (e6:Dependency {name: "chrono::DateTime<chrono::Utc>", description: "Chrono library for date and time handling."})
CREATE (doc)-[:MENTIONS]->(e6)
CREATE (e7:Documentation {name: "Inline Documentation", description: "Comments describing fields and structures in the code."})
CREATE (doc)-[:MENTIONS]->(e7)

MATCH (doc:Document {title: "Software Metadata and Configuration Document"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/ml/mod.rs
CREATE (doc:Document {
      id: "Advanced Machine Integration Module Documentation",
      title: "Advanced Machine Integration Module Documentation",
      domain: "software",
      doc_type: "code_documentation"
    })
CREATE (e0:Module {name: "advanced_ml", description: "Provides sophisticated ML capabilities including multiple embedding, fine-tuning, transfer domain, versioning, A/B testing, performance, and automated selection"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Dependency {name: "advanced_ml", type: "internal_module"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Documentation {name: "module_docs", content: "Advanced machine integration. This module provides sophisticated ML capabilities including: Multiple embedding, fine-tuning, Transfer domain, versioning, A/B testing, performance, Automated selection"})
CREATE (doc)-[:MENTIONS]->(e2)

MATCH (doc:Document {title: "Advanced Machine Integration Module Documentation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/ml/advanced_ml.rs
CREATE (doc:Document {
      id: "ML System Configuration and Structure",
      title: "ML System Configuration and Structure",
      domain: "software",
      doc_type: "Code Documentation"
    })
CREATE (e0:Module {name: "crate::error"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Class {name: "AdvancedMlManager", description: "ML manager with configuration, registry, trainer, evaluator, monitor, and A/B testing"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Class {name: "MlConfig", description: "ML configuration including models, training, evaluation, monitoring, and A/B testing"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Class {name: "ModelConfig", description: "Model configuration with default model, available models, selection strategy, and caching"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Class {name: "ModelInfo", description: "Information about a model including ID, name, type, version, description, parameters, performance, and status"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Class {name: "ModelType", description: "Enumeration of model types: Embedding, Classification, Clustering, AnomalyDetection, Recommendation"})
CREATE (doc)-[:MENTIONS]->(e5)
CREATE (e6:Class {name: "ModelParameters", description: "Model parameters including architecture, size, dimensions, and hyperparameters"})
CREATE (doc)-[:MENTIONS]->(e6)
CREATE (e7:Class {name: "ModelPerformance", description: "Performance metrics for a model including accuracy, precision, recall, F1 score, inference time, and memory usage"})
CREATE (doc)-[:MENTIONS]->(e7)
CREATE (e8:Class {name: "ModelStatus", description: "Enumeration of model statuses: Ready, Training, Evaluating, Deployed, Deprecated, Error"})
CREATE (doc)-[:MENTIONS]->(e8)
CREATE (e9:Class {name: "ModelSelectionStrategy", description: "Strategies for model selection: BestPerformance, Fastest, Smallest, Random, Custom"})
CREATE (doc)-[:MENTIONS]->(e9)
CREATE (e10:Class {name: "ModelCachingConfig", description: "Caching configuration including enabled flag, cache size, TTL, and eviction policy"})
CREATE (doc)-[:MENTIONS]->(e10)
CREATE (e11:Class {name: "CacheEvictionPolicy", description: "Enumeration of cache eviction policies: Lru, Lfu, Fifo"})
CREATE (doc)-[:MENTIONS]->(e11)
CREATE (e12:Class {name: "TrainingConfig", description: "Training configuration including enabled flag, data source, parameters, schedule, and monitoring"})
CREATE (doc)-[:MENTIONS]->(e12)
CREATE (e13:Class {name: "DataSource", description: "Data source configuration including type and configuration details"})
CREATE (doc)-[:MENTIONS]->(e13)
CREATE (e14:Class {name: "DataSourceType", description: "Enumeration of data source types: FileSystem, Database, Api, MessageQueue"})
CREATE (doc)-[:MENTIONS]->(e14)
CREATE (e15:Class {name: "TrainingParameters", description: "Training parameters including learning rate, batch size, epochs, optimizer, loss function, and regularization"})
CREATE (doc)-[:MENTIONS]->(e15)
CREATE (e16:Dependency {name: "std::collections::HashMap"})
CREATE (doc)-[:MENTIONS]->(e16)
CREATE (e17:Dependency {name: "std::sync::{Arc, RwLock}"})
CREATE (doc)-[:MENTIONS]->(e17)
CREATE (e18:Dependency {name: "std::time::{Duration, Instant}"})
CREATE (doc)-[:MENTIONS]->(e18)
CREATE (e19:Dependency {name: "anyhow::Result"})
CREATE (doc)-[:MENTIONS]->(e19)
CREATE (e20:Dependency {name: "serde::{Deserialize, Serialize}"})
CREATE (doc)-[:MENTIONS]->(e20)
CREATE (e21:Dependency {name: "tokio::time::{interval, sleep}"})
CREATE (doc)-[:MENTIONS]->(e21)
CREATE (e22:Dependency {name: "serde_json::Value"})
CREATE (doc)-[:MENTIONS]->(e22)
CREATE (e23:Configuration {name: "MlConfig", description: "Overall ML configuration"})
CREATE (doc)-[:MENTIONS]->(e23)
CREATE (e24:Configuration {name: "ModelConfig", description: "Model-specific configuration"})
CREATE (doc)-[:MENTIONS]->(e24)
CREATE (e25:Configuration {name: "TrainingConfig", description: "Training-specific configuration"})
CREATE (doc)-[:MENTIONS]->(e25)
CREATE (e26:API {name: "DataSourceType::Api", description: "API data source type"})
CREATE (doc)-[:MENTIONS]->(e26)
CREATE (e27:Database {name: "DataSourceType::Database", description: "Database data source type"})
CREATE (doc)-[:MENTIONS]->(e27)
CREATE (e28:Documentation {name: "Inline comments", description: "Documentation comments for classes and fields"})
CREATE (doc)-[:MENTIONS]->(e28)

MATCH (doc:Document {title: "ML System Configuration and Structure"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/logging/mod.rs
CREATE (doc:Document {
      id: "Centralized Vectorizer Logging System",
      title: "Centralized Vectorizer Logging System",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Module {name: "vectorizer_logging", language: "rust", description: "Centralized logging system with file rotation and cleanup"})
CREATE (doc)-[:MENTIONS]->(e0)

MATCH (doc:Document {title: "Centralized Vectorizer Logging System"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/intelligent_search/simple_search_engine.rs
CREATE (doc:Document {
      id: "SimpleSearchEngine Module",
      title: "SimpleSearchEngine Module",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Module {name: "SimpleSearchEngine", language: "rust", purpose: "implements intelligent search without std::collections::HashMap"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Document {id: "doc1", content: "This is a test document about vectorizer", collection: "test"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "SimpleSearchEngine Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/intelligent_search/rest_api.rs
CREATE (doc:Document {
      id: "REST API Tools",
      title: "REST API Tools",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "REST API Tools", language: "rust", description: "implements REST API endpoints for intelligent search functionality"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "rest_api", language: "rust", description: "REST API handler module with search endpoints and request/response structures"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "REST API Tools"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/intelligent_search/query_generator.rs
CREATE (doc:Document {
      id: "QueryGenerator",
      title: "QueryGenerator",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "QueryGenerator", language: "rust", type: "module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "QueryGenerator", language: "rust", purpose: "query generation and expansion"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "QueryGenerator"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/intelligent_search/mod.rs
CREATE (doc:Document {
      id: "Intelligent Search Engine Implementation",
      title: "Intelligent Search Engine Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Module {name: "intelligent_search_engine", language: "Rust", description: "Intelligent search engine with query generation, MMR diversification, and context formatting capabilities"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Document {name: "IntelligentSearchConfig", type: "struct", description: "Configuration struct for intelligent search engine with query generation and diversification settings"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Document {name: "IntelligentSearchEngine", type: "struct", description: "Main intelligent search engine implementation with query generation, search, and result processing"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Document {name: "IntelligentSearchResult", type: "struct", description: "Search result structure containing content, score, collection, and document ID"})
CREATE (doc)-[:MENTIONS]->(e3)

MATCH (doc:Document {title: "Intelligent Search Engine Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/intelligent_search/mmr_diversifier.rs
CREATE (doc:Document {
      id: "MMR (Maximal Marginal Relevance) Diversifier",
      title: "MMR (Maximal Marginal Relevance) Diversifier",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Module {name: "MMRDiversifier", language: "Rust", purpose: "implements MMR diversification for search results"})
CREATE (doc)-[:MENTIONS]->(e0)

MATCH (doc:Document {title: "MMR (Maximal Marginal Relevance) Diversifier"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/intelligent_search/mcp_tools.rs
CREATE (doc:Document {
      id: "MCP Tools VectorStore EmbeddingManager",
      title: "MCP Tools VectorStore EmbeddingManager",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "MCP Tools VectorStore EmbeddingManager", language: "Rust", type: "code_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "MCP Tools", language: "Rust", purpose: "implements MCP capabilities for VectorStore EmbeddingManager"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "MCP Tools VectorStore EmbeddingManager"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/intelligent_search/mcp_server_integration.rs
CREATE (doc:Document {
      id: "MCP Search Integration",
      title: "MCP Search Integration",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "MCP Search Integration", language: "Rust", file_type: "rs"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "mcp_search", language: "Rust", main_functionality: "MCP server integration with intelligent search capabilities"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "MCP Search Integration"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/intelligent_search/examples.rs
CREATE (doc:Document {
      id: "MCP REST API Example Usage",
      title: "MCP REST API Example Usage",
      domain: "software",
      doc_type: "code_example"
    })
CREATE (e0:Document {name: "MCP REST API Example Usage", language: "Rust", content_type: "code_example"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "intelligent_search", submodules: "mcp_server_integration,mcp_tools,rest_api"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "MCP REST API Example Usage"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/intelligent_search/context_formatter.rs
CREATE (doc:Document {
      id: "ContextFormatter",
      title: "ContextFormatter",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Module {name: "ContextFormatter", language: "Rust", purpose: "Formatter for intelligent search results with content management and metadata formatting"})
CREATE (doc)-[:MENTIONS]->(e0)

MATCH (doc:Document {title: "ContextFormatter"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/file_watcher/watcher.rs
CREATE (doc:Document {
      id: "File Watcher Implementation",
      title: "File Watcher Implementation",
      domain: "software",
      doc_type: "source_code"
    })
CREATE (e0:Document {name: "File Watcher Implementation", language: "rust", file_type: "source_code"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "file_watcher", language: "rust", purpose: "File system monitoring and event handling", dependencies: "notify,tokio,std::path,std::sync::atomic"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "File Watcher Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/file_watcher/usage_example.rs
CREATE (doc:Document {
      id: "Integrated File Synchronization Manager",
      title: "Integrated File Synchronization Manager",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Integrated File Synchronization Manager", language: "Rust", content_type: "code_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "synchronization", language: "Rust", module_type: "core_system"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Integrated File Synchronization Manager"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/file_watcher/operations.rs
CREATE (doc:Document {
      id: "VectorOperations Module",
      title: "VectorOperations Module",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Module {name: "VectorOperations", language: "rust", purpose: "File change processing and vector indexing operations"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Document {name: "vector_operations.rs", language: "rust", type: "source_code"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "VectorOperations Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/file_watcher/mod.rs
CREATE (doc:Document {
      id: "File Watcher System",
      title: "File Watcher System",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "File Watcher System", language: "rust", type: "module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "FileWatcherSystem", language: "rust", type: "main_module"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "File Watcher System"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/file_watcher/metrics.rs
CREATE (doc:Document {
      id: "Metrics",
      title: "Metrics",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {title: "Metrics", language: "rust", main_module: "metrics"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "metrics", language: "rust", type: "code_module"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Metrics"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/file_watcher/integrated_sync.rs
CREATE (doc:Document {
      id: "Integrated Sync Manager",
      title: "Integrated Sync Manager",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Integrated Sync Manager", language: "rust", type: "module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "IntegratedSyncManager", language: "rust", type: "struct"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Module {name: "IntegratedSyncConfig", language: "rust", type: "struct"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Module {name: "SyncStats", language: "rust", type: "struct"})
CREATE (doc)-[:MENTIONS]->(e3)

MATCH (doc:Document {title: "Integrated Sync Manager"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/file_watcher/hash_validator.rs
CREATE (doc:Document {
      id: "HashValidator Rust Module",
      title: "HashValidator Rust Module",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "HashValidator Rust Module", language: "rust", file_type: "rs"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "HashValidator", type: "struct", purpose: "File hash validation and caching"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "HashValidator Rust Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/file_watcher/file_index.rs
CREATE (doc:Document {
      id: "FileIndex - Vector Collection Mapping System",
      title: "FileIndex - Vector Collection Mapping System",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Module {name: "file_index", language: "rust", purpose: "Vector collection mapping and file indexing system"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Struct {name: "CollectionVectorMapping", purpose: "Tracks collection metadata and optimization for vector storage"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Struct {name: "FileIndex", purpose: "Bidirectional mapping between files and vector collections"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Struct {name: "FileIndexStats", purpose: "Statistics about the file index state"})
CREATE (doc)-[:MENTIONS]->(e3)

MATCH (doc:Document {title: "FileIndex - Vector Collection Mapping System"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/file_watcher/enhanced_watcher.rs
CREATE (doc:Document {
      id: "Enhanced File Watcher System",
      title: "Enhanced File Watcher System",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Enhanced File Watcher System", language: "rust", type: "module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "enhanced_file_watcher", language: "rust", type: "system_module"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Enhanced File Watcher System"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/file_watcher/discovery.rs
CREATE (doc:Document {
      id: "File Discovery System",
      title: "File Discovery System",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "File Discovery System", language: "rust", type: "system_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "FileDiscovery", language: "rust", purpose: "file_discovery_and_indexing"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "File Discovery System"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/file_watcher/debouncer.rs
CREATE (doc:Document {
      id: "Debouncer",
      title: "Debouncer",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {title: "Debouncer", language: "rust", main_module: "debouncer"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "debouncer", language: "rust", type: "struct_implementation"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Debouncer"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/file_watcher/config.rs
CREATE (doc:Document {
      id: "FileWatcherConfig",
      title: "FileWatcherConfig",
      domain: "software",
      doc_type: "configuration"
    })
CREATE (e0:Document {name: "FileWatcherConfig", language: "rust", type: "configuration_struct"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "file_watcher", language: "rust", type: "configuration_module"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "FileWatcherConfig"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/file_operations/types.rs
CREATE (doc:Document {
      id: "Rust Vectorizer Data Structures",
      title: "Rust Vectorizer Data Structures",
      domain: "software",
      doc_type: "code_documentation"
    })
CREATE (e0:Document {title: "Rust Vectorizer Data Structures", language: "Rust", file_type: "rust"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "vectorizer_types", language: "Rust", purpose: "Data structures for vectorizer operations"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Rust Vectorizer Data Structures"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/file_operations/operations.rs
CREATE (doc:Document {
      id: "File Operations Module",
      title: "File Operations Module",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "File Operations Module", language: "Rust", type: "code_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "FileOperations", language: "Rust", purpose: "File content retrieval and management operations"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "File Operations Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/file_operations/mod.rs
CREATE (doc:Document {
      id: "File-level operations module for MCP",
      title: "File-level operations module for MCP",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Module {name: "file_operations", language: "rust", description: "Provides file-centric abstractions over chunk-based vector storage"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Document {name: "file_operations.rs", type: "source_code"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "File-level operations module for MCP"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/file_operations/mcp_integration.rs
CREATE (doc:Document {
      id: "MCP File Operations Handlers",
      title: "MCP File Operations Handlers",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "MCP File Operations Handlers", language: "Rust", file_type: "rs"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "FileMcpHandlers", language: "Rust", type: "struct"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "MCP File Operations Handlers"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/file_operations/errors.rs
CREATE (doc:Document {
      id: "FileOperationError Enum Definition",
      title: "FileOperationError Enum Definition",
      domain: "software",
      doc_type: "code"
    })
CREATE (e0:Document {name: "FileOperationError Enum Definition", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "FileOperationError", type: "enum"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "FileOperationError Enum Definition"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/file_operations/cache.rs
CREATE (doc:Document {
      id: "FileLevelCache Implementation",
      title: "FileLevelCache Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "FileLevelCache Implementation", language: "Rust", main_module: "file_level_cache"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "file_level_cache", language: "Rust", type: "cache_implementation"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "FileLevelCache Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/file_loader/persistence.rs
CREATE (doc:Document {
      id: "VectorStore Collection Management Module",
      title: "VectorStore Collection Management Module",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Module {name: "VectorStore", language: "Rust", purpose: "Collection management and persistence for vector database operations"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Function {name: "archive_collection_exists_in_vecdb", language: "Rust", purpose: "Check if collection exists in vector database"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Function {name: "save_collection_legacy_temp", language: "Rust", purpose: "Save collection data to temporary storage with metadata"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Function {name: "save_complete_metadata", language: "Rust", purpose: "Save collection metadata including indexed files information"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Function {name: "save_checksums", language: "Rust", purpose: "Generate and save file checksums for collection data"})
CREATE (doc)-[:MENTIONS]->(e4)

MATCH (doc:Document {title: "VectorStore Collection Management Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/file_loader/mod.rs
CREATE (doc:Document {
      id: "FileLoader Implementation",
      title: "FileLoader Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "FileLoader Implementation", language: "Rust", description: "Unified file loading and indexing infrastructure for vector store operations"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "FileLoader", language: "Rust", description: "Main struct for loading, chunking, and indexing project files into vector store", methods: "with_embedding_manager,load_and_index_project,collect_documents_sync,collect_documents_recursive,matches_patterns"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "FileLoader Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/file_loader/indexer.rs
CREATE (doc:Document {
      id: "Vector Indexer Implementation",
      title: "Vector Indexer Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Module {name: "indexer", language: "rust", purpose: "vector_indexing"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Document {name: "Vector Indexer Implementation", type: "rust_module", content_type: "source_code"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Vector Indexer Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/file_loader/config.rs
CREATE (doc:Document {
      id: "File Loader Configuration",
      title: "File Loader Configuration",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "File Loader Configuration", language: "Rust", type: "configuration_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "LoaderConfig", language: "Rust", type: "struct"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Module {name: "DocumentChunk", language: "Rust", type: "struct"})
CREATE (doc)-[:MENTIONS]->(e2)

MATCH (doc:Document {title: "File Loader Configuration"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/file_loader/chunker.rs
CREATE (doc:Document {
      id: "Text Chunking Utility",
      title: "Text Chunking Utility",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "chunker.rs", language: "rust", purpose: "Text chunking utility for document processing"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "Chunker", language: "rust", type: "struct", purpose: "Splits documents into chunks with configurable size and overlap"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Text Chunking Utility"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/evaluation/mod.rs
CREATE (doc:Document {
      id: "Search Quality Evaluation Module",
      title: "Search Quality Evaluation Module",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Search Quality Evaluation Module", language: "Rust", type: "evaluation_framework"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "evaluation", language: "Rust", purpose: "search_quality_metrics"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Search Quality Evaluation Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/embedding/real_models.rs
CREATE (doc:Document {
      id: "Real Model Embedder Implementation",
      title: "Real Model Embedder Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Real Model Embedder Implementation", language: "Rust", framework: "Candle", purpose: "Text embedding using transformer models"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "RealModelEmbedder", language: "Rust", type: "struct", features: "MiniLM,BERT,MPNet,E5,GTE,LaBSE", dimensions: "384,512,768"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Real Model Embedder Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/embedding/provider.rs
CREATE (doc:Document {
      id: "Embedding Provider Factory Implementation",
      title: "Embedding Provider Factory Implementation",
      domain: "software",
      doc_type: "code_implementation"
    })
CREATE (e0:Document {name: "Embedding Provider Factory Implementation", language: "Rust", file_type: "rs"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "EmbeddingProviderFactory", type: "factory", description: "Factory for creating embedding providers based on type"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Module {name: "ProviderRegistry", type: "registry", description: "Registry for managing embedding providers"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Module {name: "ProviderHealthChecker", type: "health_checker", description: "Health checker for providers"})
CREATE (doc)-[:MENTIONS]->(e3)

MATCH (doc:Document {title: "Embedding Provider Factory Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/embedding/openai.rs
CREATE (doc:Document {
      id: "OpenAI Embedding Provider Implementation",
      title: "OpenAI Embedding Provider Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "OpenAI Embedding Provider Implementation", language: "Rust", file_type: "rs"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "OpenAIProvider", type: "struct", purpose: "OpenAI API integration for text embeddings"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Module {name: "OpenAIConfig", type: "struct", purpose: "Configuration for OpenAI API settings"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Module {name: "OpenAIClient", type: "struct", purpose: "OpenAI API client implementation"})
CREATE (doc)-[:MENTIONS]->(e3)

MATCH (doc:Document {title: "OpenAI Embedding Provider Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/embedding/onnx_models.rs
CREATE (doc:Document {
      id: "ONNX Compat Layer for Vectorizer",
      title: "ONNX Compat Layer for Vectorizer",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "ONNX Compat Layer for Vectorizer", language: "Rust", file_type: "rust_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "onnx", language: "Rust", purpose: "ONNX compatibility layer providing deterministic embedding generation", main_structs: "OnnxModelType,OnnxConfig,OnnxEmbedder", features: "model_caching,batch_processing,deterministic_embeddings"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "ONNX Compat Layer for Vectorizer"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/embedding/mod.rs
CREATE (doc:Document {
      id: "Embedding Provider Module",
      title: "Embedding Provider Module",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Module {name: "embedding", language: "rust", description: "Embedding generation module with support for BM25, BERT, and OpenAI providers"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Trait {name: "EmbeddingProvider", description: "Async trait for generating embeddings from text"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Struct {name: "EmbeddingConfig", description: "Configuration for embedding providers"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Enum {name: "EmbeddingProviderType", description: "Types of embedding providers (BM25, BERT, OpenAI, etc.)"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Struct {name: "EmbeddingCache", description: "Thread-safe cache for storing embeddings"})
CREATE (doc)-[:MENTIONS]->(e4)

MATCH (doc:Document {title: "Embedding Provider Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/embedding/fast_tokenizer.rs
CREATE (doc:Document {
      id: "FastTokenizer - Ultra-fast Rust Tokenizer Implementation",
      title: "FastTokenizer - Ultra-fast Rust Tokenizer Implementation",
      domain: "software",
      doc_type: "source_code"
    })
CREATE (e0:Document {name: "FastTokenizer - Ultra-fast Rust Tokenizer Implementation", language: "Rust", file_type: "source_code"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "FastTokenizer", language: "Rust", type: "struct", description: "Ultra-fast tokenizer implementation with caching and batch processing capabilities"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Module {name: "FastTokenizerConfig", language: "Rust", type: "struct", description: "Configuration struct for tokenizer settings"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Module {name: "TokenizerCache", language: "Rust", type: "struct", description: "Cache implementation for tokenizer instances"})
CREATE (doc)-[:MENTIONS]->(e3)

MATCH (doc:Document {title: "FastTokenizer - Ultra-fast Rust Tokenizer Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/embedding/config.rs
CREATE (doc:Document {
      id: "Embedding Configuration Builder and Presets",
      title: "Embedding Configuration Builder and Presets",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Embedding Configuration Builder and Presets", language: "Rust", content_type: "source_code"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "providers", language: "Rust", module_type: "configuration_builder"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Embedding Configuration Builder and Presets"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/embedding/cache.rs
CREATE (doc:Document {
      id: "EmbeddingCache Rust Module",
      title: "EmbeddingCache Rust Module",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {title: "EmbeddingCache Rust Module", language: "rust", main_module: "persistence"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "persistence", language: "rust", description: "High-performance embedding cache with memory-mapped file support, parallel processing, and sharding"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "EmbeddingCache Rust Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/embedding/bm25.rs
CREATE (doc:Document {
      id: "BM25 Implementation",
      title: "BM25 Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "BM25 Implementation", language: "Rust", description: "BM25 (Best Matching 25) probabilistic ranking implementation for text search and embedding generation"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "BM25Provider", language: "Rust", type: "struct", description: "Main BM25 implementation providing embedding functionality with configurable parameters"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "BM25 Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/embedding/bert.rs
CREATE (doc:Document {
      id: "BERT Embedding Provider Implementation",
      title: "BERT Embedding Provider Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "BERT Embedding Provider Implementation", language: "Rust", type: "code_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "BERT", language: "Rust", type: "embedding_provider", description: "BERT (Bidirectional Encoder Representations from Transformers) transformer-based machine learning model for generating embeddings"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "BERT Embedding Provider Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/discovery/types.rs
CREATE (doc:Document {
      id: "Rust Vector Database Types and Structures",
      title: "Rust Vector Database Types and Structures",
      domain: "software",
      doc_type: "code_documentation"
    })
CREATE (e0:Document {name: "Rust Vector Database Types and Structures", language: "rust", file_type: "rs"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "vector_database_types", language: "rust", main_purpose: "Data structures for vector database operations"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Rust Vector Database Types and Structures"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/discovery/score.rs
CREATE (doc:Document {
      id: "Collection Scoring Module",
      title: "Collection Scoring Module",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Module {name: "CollectionScorer", language: "rust", purpose: "Collection scoring and ranking functionality"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Function {name: "score_collections", purpose: "Score and rank collections based on query terms"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Struct {name: "CollectionScorer", purpose: "Scorer implementation with configurable weights"})
CREATE (doc)-[:MENTIONS]->(e2)

MATCH (doc:Document {title: "Collection Scoring Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/discovery/render.rs
CREATE (doc:Document {
      id: "LLM Prompt Renderer",
      title: "LLM Prompt Renderer",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Module {name: "render_llm_prompt", language: "rust", purpose: "Generate LLM formatting prompts from AnswerPlan"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Function {name: "render_llm_prompt", parameters: "plan: &AnswerPlan,config: &PromptRenderConfig,prompt: String,max_tokens: usize", return_type: "DiscoveryResult<String>"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Function {name: "truncate_to_token_limit", parameters: "prompt: String,max_tokens: usize", return_type: "String"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Struct {name: "AnswerPlan", fields: "total_bullets,sources,sections,include_sources,max_prompt_tokens"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Struct {name: "PromptRenderConfig", fields: "include_sources,max_prompt_tokens"})
CREATE (doc)-[:MENTIONS]->(e4)

MATCH (doc:Document {title: "LLM Prompt Renderer"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/discovery/readme.rs
CREATE (doc:Document {
      id: "README Promotion Module",
      title: "README Promotion Module",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "README Promotion Module", language: "Rust"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "promote_readme", language: "Rust", purpose: "Promotes README files in search results with configurable boost and sorting"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "README Promotion Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/discovery/plan.rs
CREATE (doc:Document {
      id: "Answer Plan Builder Module",
      title: "Answer Plan Builder Module",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Answer Plan Builder Module", language: "rust", file_type: "rs"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "build_answer_plan", language: "rust", module_type: "function"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Answer Plan Builder Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/discovery/pipeline.rs
CREATE (doc:Document {
      id: "Discovery System Implementation",
      title: "Discovery System Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Module {name: "Discovery", language: "Rust", type: "struct", description: "Main discovery system for vector search and query processing"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "VectorStore", language: "Rust", type: "trait", description: "Vector storage interface"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Module {name: "EmbeddingManager", language: "Rust", type: "struct", description: "Manages embedding operations"})
CREATE (doc)-[:MENTIONS]->(e2)

MATCH (doc:Document {title: "Discovery System Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/discovery/mod.rs
CREATE (doc:Document {
      id: "Discovery intelligent context retrieval",
      title: "Discovery intelligent context retrieval",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {title: "Discovery intelligent context retrieval", language: "rust", content_type: "module_documentation"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "discovery", language: "rust", description: "Comprehensive discovery that mirrors IDE patterns with collection pre-filtering, query expansion, semantic focus, evidence compression, citations, and answer plan generation"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Discovery intelligent context retrieval"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/discovery/hybrid.rs
CREATE (doc:Document {
      id: "Hybrid HNSW BM25 Searcher Implementation",
      title: "Hybrid HNSW BM25 Searcher Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {title: "Hybrid HNSW BM25 Searcher Implementation", language: "rust", content_type: "source_code"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "HybridSearcher", language: "rust", type: "struct", description: "Hybrid search implementation combining HNSW vector search with BM25 sparse search using reciprocal rank fusion"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Hybrid HNSW BM25 Searcher Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/discovery/focus.rs
CREATE (doc:Document {
      id: "Semantic Focus Search Implementation",
      title: "Semantic Focus Search Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Module {name: "semantic_focus", language: "rust", purpose: "Deep semantic search with reranking and filtering"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Function {name: "semantic_focus", module: "semantic_focus", purpose: "Main semantic search function with embedding and reranking"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Function {name: "extract_metadata", module: "semantic_focus", purpose: "Extract metadata from document ID"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Function {name: "rerank_semantically", module: "semantic_focus", purpose: "Rerank chunks using semantic scoring"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Function {name: "sentence_quality_score", module: "semantic_focus", purpose: "Calculate quality score for sentence content"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Function {name: "term_frequency_score", module: "semantic_focus", purpose: "Calculate term frequency score for content"})
CREATE (doc)-[:MENTIONS]->(e5)

MATCH (doc:Document {title: "Semantic Focus Search Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/discovery/filter.rs
CREATE (doc:Document {
      id: "Collection Search and Filtering Module",
      title: "Collection Search and Filtering Module",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Module {name: "CollectionIndexer", language: "Rust", purpose: "Collection search and filtering with BM25 support"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Function {name: "search_collections", purpose: "Search collections using BM25 scoring"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Function {name: "filter_collections", purpose: "Pre-filter collections by include/exclude patterns"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Function {name: "extract_terms", purpose: "Extract and clean query terms, removing stopwords"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Function {name: "matches_any_pattern", purpose: "Check if collection name matches any include/exclude pattern"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Function {name: "filter_by_query_terms", purpose: "Filter collections based on query term matches"})
CREATE (doc)-[:MENTIONS]->(e5)

MATCH (doc:Document {title: "Collection Search and Filtering Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/discovery/expand.rs
CREATE (doc:Document {
      id: "Query Expansion Module",
      title: "Query Expansion Module",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Query Expansion Module", language: "Rust", type: "code_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "QueryExpander", language: "Rust", type: "struct"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Query Expansion Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/discovery/config.rs
CREATE (doc:Document {
      id: "DiscoveryConfig Rust Module",
      title: "DiscoveryConfig Rust Module",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "DiscoveryConfig Rust Module", language: "rust", file_type: "rs"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "DiscoveryConfig", type: "struct", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Module {name: "ScoringConfig", type: "struct", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Module {name: "ExpansionConfig", type: "struct", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Module {name: "BroadDiscoveryConfig", type: "struct", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Module {name: "SemanticFocusConfig", type: "struct", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e5)

MATCH (doc:Document {title: "DiscoveryConfig Rust Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/discovery/compress.rs
CREATE (doc:Document {
      id: "ExtractiveCompressor Rust Implementation",
      title: "ExtractiveCompressor Rust Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "ExtractiveCompressor Rust Implementation", language: "rust", file_type: "rs"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "ExtractiveCompressor", type: "struct", purpose: "evidence compression and text extraction"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "ExtractiveCompressor Rust Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/discovery/broad.rs
CREATE (doc:Document {
      id: "Broad Discovery Module - Multi-query MMR Implementation",
      title: "Broad Discovery Module - Multi-query MMR Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Module {name: "broad_discovery", language: "Rust", purpose: "Multi-query MMR (Maximal Marginal Relevance) diversity search across collections", main_functions: "broad_discovery,extract_metadata,content_similarity,deduplicate_chunks,apply_mmr"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Function {name: "broad_discovery", purpose: "Execute multiple queries across collections with MMR diversity", parameters: "queries,collections,config,vector_store,embedding_manager"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Function {name: "extract_metadata", purpose: "Extract metadata from document ID in format 'collection_name::file_path::chunk_index'"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Function {name: "content_similarity", purpose: "Calculate Jaccard similarity between two text contents"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Function {name: "deduplicate_chunks", purpose: "Remove duplicate chunks based on content similarity threshold"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Function {name: "apply_mmr", purpose: "Apply Maximal Marginal Relevance algorithm for diversity selection"})
CREATE (doc)-[:MENTIONS]->(e5)

MATCH (doc:Document {title: "Broad Discovery Module - Multi-query MMR Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/db/vector_store.rs
CREATE (doc:Document {
      id: "VectorStore CollectionType Implementation",
      title: "VectorStore CollectionType Implementation",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "VectorStore CollectionType Implementation", language: "rust", type: "module_implementation"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "CollectionType", language: "rust", type: "enum_implementation", description: "Enum for CPU or GPU-based vector collections with unified interface"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "VectorStore CollectionType Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/db/quantized_collection.rs
CREATE (doc:Document {
      id: "QuantizedCollection Memory-Optimized Vector Storage",
      title: "QuantizedCollection Memory-Optimized Vector Storage",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Module {name: "QuantizedCollection", language: "Rust", purpose: "Memory-optimized vector storage with quantization", features: "quantization,HNSW indexing,metadata tracking,vector search"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Document {name: "QuantizedCollection Implementation", type: "Rust module documentation", description: "Provides memory-optimized vector storage with quantization capabilities"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "QuantizedCollection Memory-Optimized Vector Storage"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/db/optimized_hnsw.rs
CREATE (doc:Document {
      id: "HNSW Operations Module",
      title: "HNSW Operations Module",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {title: "HNSW Operations Module", language: "rust", file_type: "rs"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "hnsw_operations", language: "rust", type: "implementation", description: "HNSW operations with pre-allocation, parallel processing, and memory-efficient computations"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "HNSW Operations Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/db/mod.rs
CREATE (doc:Document {
      id: "Database module for Vectorizer",
      title: "Database module for Vectorizer",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Database module for Vectorizer", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "auto_save"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Module {name: "collection"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Module {name: "collection_normalization"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Module {name: "hive_gpu_collection"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Module {name: "optimized_hnsw"})
CREATE (doc)-[:MENTIONS]->(e5)
CREATE (e6:Module {name: "vector_store"})
CREATE (doc)-[:MENTIONS]->(e6)

MATCH (doc:Document {title: "Database module for Vectorizer"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/db/hive_gpu_collection.rs
CREATE (doc:Document {
      id: "Hive-GPU VectorStore Implementation",
      title: "Hive-GPU VectorStore Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Hive-GPU VectorStore Implementation", language: "Rust", main_module: "HiveGpuCollection"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "HiveGpuCollection", language: "Rust", type: "struct"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Hive-GPU VectorStore Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/db/collection_normalization.rs
CREATE (doc:Document {
      id: "CollectionNormalizationHelper",
      title: "CollectionNormalizationHelper",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Module {name: "CollectionNormalizationHelper", language: "rust", purpose: "normalization helper for collections"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Document {name: "normalization_helper.rs", language: "rust", content_type: "source_code"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "CollectionNormalizationHelper"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/db/collection.rs
CREATE (doc:Document {
      id: "Vector Collection Implementation",
      title: "Vector Collection Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Module {name: "VectorCollection", language: "Rust", purpose: "Vector storage and similarity search with HNSW indexing"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Document {name: "Vector Collection Implementation", type: "Rust module documentation", content_type: "code"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Vector Collection Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/db/auto_save.rs
CREATE (doc:Document {
      id: "AutoSaveManager Rust Module",
      title: "AutoSaveManager Rust Module",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "AutoSaveManager Rust Module", language: "rust", file_type: "rs"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "AutoSaveManager", type: "struct", purpose: "automatic data persistence and snapshot management"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "AutoSaveManager Rust Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/config/vectorizer.rs
CREATE (doc:Document {
      id: "Vectorizer Configuration Structure",
      title: "Vectorizer Configuration Structure",
      domain: "software",
      doc_type: "code_structure"
    })
CREATE (e0:Document {name: "Vectorizer Configuration", language: "Rust", main_module: "config"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "VectorizerConfig", type: "struct", purpose: "Main configuration structure for Vectorizer application"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Module {name: "ServerConfig", type: "struct", purpose: "Server configuration settings"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Module {name: "LoggingConfig", type: "struct", purpose: "Logging configuration settings"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Module {name: "ProjectConfig", type: "struct", purpose: "Project configuration settings"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Module {name: "CollectionConfig", type: "struct", purpose: "Collection configuration settings"})
CREATE (doc)-[:MENTIONS]->(e5)
CREATE (e6:Module {name: "TransmutationConfig", type: "struct", purpose: "Document transmutation configuration"})
CREATE (doc)-[:MENTIONS]->(e6)

MATCH (doc:Document {title: "Vectorizer Configuration Structure"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/config/mod.rs
CREATE (doc:Document {
      id: "Configuration management for Vectorizer",
      title: "Configuration management for Vectorizer",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Configuration management for Vectorizer", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "enhanced_config"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Module {name: "file_watcher"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Module {name: "vectorizer"})
CREATE (doc)-[:MENTIONS]->(e3)

MATCH (doc:Document {title: "Configuration management for Vectorizer"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/config/file_watcher.rs
CREATE (doc:Document {
      id: "FileWatcherYamlConfig",
      title: "FileWatcherYamlConfig",
      domain: "software",
      doc_type: "rust_struct"
    })
CREATE (e0:Document {name: "FileWatcherYamlConfig", language: "rust", type: "struct"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "file_watcher_config", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "FileWatcherYamlConfig"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/config/enhanced_config.rs
CREATE (doc:Document {
      id: "Enhanced Configuration Management System",
      title: "Enhanced Configuration Management System",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {title: "Enhanced Configuration Management System", language: "rust", main_module: "management"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "management", description: "Provides enhanced configuration management with dynamic templates and inheritance", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Enhanced Configuration Management System"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/compression/zstd.rs
CREATE (doc:Document {
      id: "Zstd Compression Module",
      title: "Zstd Compression Module",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Zstd Compression Module", language: "rust", description: "Zstd compression algorithm implementation with configuration options"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "zstd_compression", type: "compression", language: "rust", description: "Zstd compression and decompression implementation with configurable options"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Zstd Compression Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/compression/traits.rs
CREATE (doc:Document {
      id: "Compression Module Interface",
      title: "Compression Module Interface",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Module {name: "compression", language: "rust", description: "Compression and decompression interfaces with performance metrics"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Trait {name: "Compressor", module: "compression"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Trait {name: "Decompressor", module: "compression"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Struct {name: "CompressionMethodConfig", module: "compression"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Struct {name: "CompressionMetrics", module: "compression"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Struct {name: "CompressionBenchmark", module: "compression"})
CREATE (doc)-[:MENTIONS]->(e5)

MATCH (doc:Document {title: "Compression Module Interface"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/compression/mod.rs
CREATE (doc:Document {
      id: "Compression Module",
      title: "Compression Module",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Module {name: "compression", language: "rust", capabilities: "I/O,LZ4", features: "automatic serde,compression algorithms,statistics tracking"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Document {title: "Compression Module", language: "rust", main_module: "compression"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Compression Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/compression/lz4.rs
CREATE (doc:Document {
      id: "LZ4 Compression Implementation",
      title: "LZ4 Compression Implementation",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {title: "LZ4 Compression Implementation", language: "rust", main_module: "lz4_compressor"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "lz4_compressor", type: "compression", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "LZ4 Compression Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/compression/config.rs
CREATE (doc:Document {
      id: "Compression Configuration Module",
      title: "Compression Configuration Module",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Module {name: "compression", language: "rust", description: "Compression configuration and presets module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Struct {name: "CompressionConfigBuilder", description: "Builder pattern for compression configuration"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Struct {name: "CompressionPresets", description: "Predefined compression configuration presets"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Struct {name: "CompressionConfigValidator", description: "Validator for compression configurations"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Enum {name: "DataType", description: "Data type classification for compression optimization"})
CREATE (doc)-[:MENTIONS]->(e4)

MATCH (doc:Document {title: "Compression Configuration Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/cli/utils.rs
CREATE (doc:Document {
      id: "CLI Utilities Module",
      title: "CLI Utilities Module",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Module {name: "CliUtils", language: "rust", description: "Utility CLI operations for directory management, file validation, and system information"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Function {name: "ensure_directory", purpose: "Ensure directory exists, create if it doesn't"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Function {name: "check_file_readable", purpose: "Check if file exists and is readable"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Function {name: "check_file_writable", purpose: "Check if file is writable or can be created"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Function {name: "format_bytes", purpose: "Format byte count into human readable string"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Function {name: "format_duration", purpose: "Format seconds into human readable duration"})
CREATE (doc)-[:MENTIONS]->(e5)
CREATE (e6:Function {name: "confirm_action", purpose: "Prompt user for confirmation with default value"})
CREATE (doc)-[:MENTIONS]->(e6)
CREATE (e7:Function {name: "get_system_info", purpose: "Get system information including OS, architecture, and versions"})
CREATE (doc)-[:MENTIONS]->(e7)
CREATE (e8:Function {name: "check_system_requirements", purpose: "Validate system requirements and display system info"})
CREATE (doc)-[:MENTIONS]->(e8)
CREATE (e9:Function {name: "validate_port", purpose: "Validate port number for network operations"})
CREATE (doc)-[:MENTIONS]->(e9)
CREATE (e10:Function {name: "validate_host", purpose: "Validate host address for network operations"})
CREATE (doc)-[:MENTIONS]->(e10)
CREATE (e11:Function {name: "generate_secure_string", purpose: "Generate secure random string of specified length"})
CREATE (doc)-[:MENTIONS]->(e11)
CREATE (e12:Function {name: "is_elevated", purpose: "Check if process is running with elevated privileges"})
CREATE (doc)-[:MENTIONS]->(e12)
CREATE (e13:Function {name: "get_current_dir", purpose: "Get current working directory"})
CREATE (doc)-[:MENTIONS]->(e13)
CREATE (e14:Function {name: "set_current_dir", purpose: "Set current working directory"})
CREATE (doc)-[:MENTIONS]->(e14)
CREATE (e15:Struct {name: "SystemInfo", purpose: "System information container"})
CREATE (doc)-[:MENTIONS]->(e15)

MATCH (doc:Document {title: "CLI Utilities Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/cli/mod.rs
CREATE (doc:Document {
      id: "Vectorizer CLI Command Structure",
      title: "Vectorizer CLI Command Structure",
      domain: "software",
      doc_type: "code_architecture"
    })
CREATE (e0:Document {name: "Vectorizer CLI Command Structure", language: "Rust", framework: "clap", purpose: "Administrative CLI for Vectorizer vector database"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "Cli", type: "main_cli", description: "Main CLI structure with configuration and subcommands"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Module {name: "Commands", type: "subcommand_enum", description: "Enum containing all available CLI subcommands"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Module {name: "ServerCommands", type: "server_management", description: "Server start, stop, restart operations"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Module {name: "UserCommands", type: "user_management", description: "User creation, listing, deletion, and role updates"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Module {name: "ApiKeyCommands", type: "api_key_management", description: "API key creation, listing, revocation, and testing"})
CREATE (doc)-[:MENTIONS]->(e5)
CREATE (e6:Module {name: "CollectionCommands", type: "collection_management", description: "Collection creation, listing, deletion, and retrieval"})
CREATE (doc)-[:MENTIONS]->(e6)
CREATE (e7:Module {name: "DbCommands", type: "database_management", description: "Database backup, restore, and optimization operations"})
CREATE (doc)-[:MENTIONS]->(e7)

MATCH (doc:Document {title: "Vectorizer CLI Command Structure"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/cli/config.rs
CREATE (doc:Document {
      id: "CLI Configuration Management",
      title: "CLI Configuration Management",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "CLI Configuration Management", language: "rust", type: "configuration_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "ConfigManager", language: "rust", type: "configuration_manager", purpose: "Handles CLI configuration file operations including loading, saving, validation and default generation"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "CLI Configuration Management"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/cli/commands.rs
CREATE (doc:Document {
      id: "CLI Server Management Module",
      title: "CLI Server Management Module",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Module {name: "CLI", language: "Rust", purpose: "Command-line interface for Vectorizer server management", main_functionality: "Server control, user management, API key management"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Function {name: "handle_server_command", purpose: "Handle server start/stop/restart operations"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Function {name: "handle_user_command", purpose: "Handle user creation, listing, deletion, and role updates"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Function {name: "handle_api_key_command", purpose: "Handle API key creation and management"})
CREATE (doc)-[:MENTIONS]->(e3)

MATCH (doc:Document {title: "CLI Server Management Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/cache/validation.rs
CREATE (doc:Document {
      id: "Cache Validator Implementation",
      title: "Cache Validator Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Cache Validator Implementation", language: "Rust", content_type: "source_code"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "CacheValidator", language: "Rust", module_type: "struct_implementation", main_functionality: "cache_validation"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Cache Validator Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/cache/query_cache.rs
CREATE (doc:Document {
      id: "Query Cache Implementation with LRU Eviction",
      title: "Query Cache Implementation with LRU Eviction",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {title: "Query Cache Implementation with LRU Eviction", language: "Rust", main_module: "QueryCache"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "QueryCache", language: "Rust", type: "struct", description: "LRU cache implementation for query results with TTL support"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Query Cache Implementation with LRU Eviction"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/cache/mod.rs
CREATE (doc:Document {
      id: "Query Caching Performance Improvement",
      title: "Query Caching Performance Improvement",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Query Caching Performance Improvement", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "advanced_cache"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Module {name: "query_cache"})
CREATE (doc)-[:MENTIONS]->(e2)

MATCH (doc:Document {title: "Query Caching Performance Improvement"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/cache/metadata.rs
CREATE (doc:Document {
      id: "Cache Metadata Structures",
      title: "Cache Metadata Structures",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Cache Metadata Structures", language: "rust", content_type: "code_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "cache_metadata", language: "rust", module_type: "data_structures", description: "Cache metadata structures for vector database operations"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Cache Metadata Structures"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/cache/manager.rs
CREATE (doc:Document {
      id: "CacheManager Implementation",
      title: "CacheManager Implementation",
      domain: "software",
      doc_type: "implementation"
    })
CREATE (e0:Document {title: "CacheManager Implementation", language: "rust", file_type: "implementation"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "CacheManager", language: "rust", type: "struct", description: "Async cache manager with metadata handling, collection management, and cleanup capabilities"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "CacheManager Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/cache/incremental.rs
CREATE (doc:Document {
      id: "IncrementalProcessor Rust Module",
      title: "IncrementalProcessor Rust Module",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "IncrementalProcessor Rust Module", language: "rust", type: "code_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "IncrementalProcessor", language: "rust", type: "struct", description: "Incremental file processing system with cache management, file change detection, and background workers"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "IncrementalProcessor Rust Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/cache/advanced_cache.rs
CREATE (doc:Document {
      id: "Advanced Multi-Layer Cache System",
      title: "Advanced Multi-Layer Cache System",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Advanced Multi-Layer Cache System", language: "rust", type: "module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "cache_system", language: "rust", description: "Multi-layer cache architecture with L1, L2, L3 layers, intelligent eviction policies, preloading, serialization, distributed caching, and analytics"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Advanced Multi-Layer Cache System"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/bin/vectorizer.rs
CREATE (doc:Document {
      id: "Vectorizer Unified MCP REST API",
      title: "Vectorizer Unified MCP REST API",
      domain: "software",
      doc_type: "source_code"
    })
CREATE (e0:Document {name: "Vectorizer Unified MCP REST API", language: "rust", file_type: "rs"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "main", language: "rust", purpose: "Server entry point and CLI configuration"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Vectorizer Unified MCP REST API"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/bin/vectorizer-cli.rs
CREATE (doc:Document {
      id: "Vectorizer CLI",
      title: "Vectorizer CLI",
      domain: "software",
      doc_type: "rust_cli_application"
    })
CREATE (e0:Document {name: "Vectorizer CLI", language: "Rust", description: "Unified Vectorizer CLI for running servers and managing services"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "main", type: "binary", description: "Main CLI application entry point"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Vectorizer CLI"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/benchmark/utils.rs
CREATE (doc:Document {
      id: "Rust Benchmark Utilities Module",
      title: "Rust Benchmark Utilities Module",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Rust Benchmark Utilities Module", language: "Rust", purpose: "Benchmark utility functions for timing, memory measurement, and statistical analysis"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "benchmarks", language: "Rust", description: "Provides utility functions for benchmarking including duration formatting, throughput calculation, statistical analysis, and timing operations"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Rust Benchmark Utilities Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/benchmark/system_monitor.rs
CREATE (doc:Document {
      id: "System Monitor Utilities",
      title: "System Monitor Utilities",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {title: "System Monitor Utilities", language: "rust", main_module: "system_monitor"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "system_monitor", language: "rust", purpose: "System resource monitoring and tracking"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "System Monitor Utilities"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/benchmark/runner.rs
CREATE (doc:Document {
      id: "BenchmarkRunner Implementation",
      title: "BenchmarkRunner Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "BenchmarkRunner Implementation", language: "Rust", content_type: "source_code"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "BenchmarkRunner", language: "Rust", type: "struct", purpose: "Performance benchmarking for HNSW vector operations"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "BenchmarkRunner Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/benchmark/reporter.rs
CREATE (doc:Document {
      id: "Vectorizer Benchmark Report Generator",
      title: "Vectorizer Benchmark Report Generator",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Vectorizer Benchmark Report Generator", language: "rust", description: "Provides report generation functionality for vectorizer benchmarks with support for JSON, CSV, HTML output formats"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "ReportGenerator", type: "struct", description: "Main struct for generating benchmark reports with configurable output options"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Vectorizer Benchmark Report Generator"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/benchmark/mod.rs
CREATE (doc:Document {
      id: "Vectorizer Benchmark Utilities",
      title: "Vectorizer Benchmark Utilities",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Vectorizer Benchmark Utilities", language: "rust", description: "Utilities for vectorizer database benchmarking and performance measurement"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "benchmark", description: "Benchmark utilities for vectorizer database performance testing"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Vectorizer Benchmark Utilities"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/benchmark/metrics.rs
CREATE (doc:Document {
      id: "Performance Metrics and Benchmarking System",
      title: "Performance Metrics and Benchmarking System",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Performance Metrics and Benchmarking System", language: "Rust", description: "Rust module providing performance metrics collection and benchmarking functionality for vector operations"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "results", language: "Rust", description: "Core module containing OperationMetrics, PerformanceMetrics, SystemInfo, and BenchmarkSummary structs for performance measurement"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Performance Metrics and Benchmarking System"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/benchmark/data_generator.rs
CREATE (doc:Document {
      id: "Test Data Generator Utilities",
      title: "Test Data Generator Utilities",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Module {name: "test_data_generator", language: "Rust", purpose: "Utilities for generating synthetic test data for vector database benchmarks"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Struct {name: "TestDataGenerator", purpose: "Main generator struct for creating test data"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Struct {name: "TestData", purpose: "Container for generated test data including vectors, documents, and metadata"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Struct {name: "TestDataMetadata", purpose: "Metadata about the generated test data"})
CREATE (doc)-[:MENTIONS]->(e3)

MATCH (doc:Document {title: "Test Data Generator Utilities"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/benchmark/config.rs
CREATE (doc:Document {
      id: "Benchmark Configuration Module",
      title: "Benchmark Configuration Module",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Benchmark Configuration Module", language: "rust", description: "Configuration structures for vector database benchmarking with HNSW, quantization, and GPU support"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "benchmark_config", language: "rust", description: "Contains BenchmarkConfig, HnswBenchmarkConfig, QuantizationBenchmarkConfig, and GpuBenchmarkConfig structures with serialization support"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Benchmark Configuration Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/batch/validation.rs
CREATE (doc:Document {
      id: "Batch Validator Module",
      title: "Batch Validator Module",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Batch Validator Module", language: "Rust", content_type: "source_code"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "BatchValidator", language: "Rust", type: "struct", purpose: "validation operations for batch operations including insert, update, delete, and search"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Batch Validator Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/batch/progress.rs
CREATE (doc:Document {
      id: "Progress Tracking Module",
      title: "Progress Tracking Module",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {title: "Progress Tracking Module", language: "rust", main_module: "progress_tracker"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "progress_tracker", language: "rust", type: "core_module"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Progress Tracking Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/batch/processor.rs
CREATE (doc:Document {
      id: "Batch Processing Module",
      title: "Batch Processing Module",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Batch Processing Module", language: "Rust", description: "Batch processing implementation with vector and document processors"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "VectorBatchProcessor", type: "struct", description: "Processes vectors with normalization and validation"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Module {name: "DocumentBatchProcessor", type: "struct", description: "Processes text documents with cleaning and tokenization"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Module {name: "GenericBatchProcessor", type: "struct", description: "Generic batch processor for any type with custom processing function"})
CREATE (doc)-[:MENTIONS]->(e3)

MATCH (doc:Document {title: "Batch Processing Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/batch/parallel.rs
CREATE (doc:Document {
      id: "Parallel Processing Module",
      title: "Parallel Processing Module",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "parallel_processor.rs", language: "rust", content_type: "source_code"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "ParallelProcessor", language: "rust", module_type: "struct", description: "Manages parallel processing of batch items with configurable workers and chunk size"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Parallel Processing Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/batch/operations.rs
CREATE (doc:Document {
      id: "Batch Operations Definitions",
      title: "Batch Operations Definitions",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Batch Operations Definitions", language: "Rust", description: "Defines batch operations for vector database operations including insert, update, delete, and search"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "batch_operations", language: "Rust", description: "Core module containing batch operation traits and implementations for vector database operations"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Batch Operations Definitions"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/batch/mod.rs
CREATE (doc:Document {
      id: "Batch Processing Configuration and Types",
      title: "Batch Processing Configuration and Types",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Batch Processing Configuration and Types", language: "Rust", content_type: "code_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "batch_processing", language: "Rust", module_type: "configuration_and_types"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Batch Processing Configuration and Types"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/batch/error.rs
CREATE (doc:Document {
      id: "Batch Processing Error Handling",
      title: "Batch Processing Error Handling",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Batch Processing Error Handling", language: "rust", type: "error_handling_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "batch_error_handling", language: "rust", purpose: "error_handling"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Batch Processing Error Handling"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/batch/config.rs
CREATE (doc:Document {
      id: "Batch Configuration Module",
      title: "Batch Configuration Module",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {title: "Batch Configuration Module", language: "rust", main_module: "batch_config"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "batch_config", language: "rust", purpose: "Configuration management for batch operations"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Batch Configuration Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/auth/roles.rs
CREATE (doc:Document {
      id: "Role-based Access Control (RBAC) System",
      title: "Role-based Access Control (RBAC) System",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Role-based Access Control (RBAC) System", language: "rust", main_module: "rbac"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "rbac", language: "rust", type: "authorization"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Role-based Access Control (RBAC) System"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/auth/mod.rs
CREATE (doc:Document {
      id: "Authorization Vectorizer",
      title: "Authorization Vectorizer",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {title: "Authorization Vectorizer", language: "Rust", main_module: "authorization"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "authorization", language: "Rust", description: "JWT-based API management with authentication, authorization, and rate limiting"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Authorization Vectorizer"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/auth/middleware.rs
CREATE (doc:Document {
      id: "Axum Authentication Middleware",
      title: "Axum Authentication Middleware",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Axum Authentication Middleware", language: "rust", framework: "axum"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "auth_middleware", purpose: "JWT and API key authentication middleware for Axum", components: "AuthMiddleware,RequireAuthMiddleware,RequireRoleMiddleware,RequirePermissionMiddleware,RateLimitMiddleware"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Axum Authentication Middleware"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/auth/jwt.rs
CREATE (doc:Document {
      id: "JWT Authentication Module",
      title: "JWT Authentication Module",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "JWT Authentication Module", language: "rust", type: "authentication"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "JwtManager", language: "rust", type: "struct", purpose: "JWT token management"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "JWT Authentication Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/auth/api_keys.rs
CREATE (doc:Document {
      id: "API Key Manager Implementation",
      title: "API Key Manager Implementation",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "API Key Manager Implementation", language: "rust", file_type: "rs"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "ApiKeyManager", type: "struct", purpose: "API key management and authentication"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "API Key Manager Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/api/mod.rs
CREATE (doc:Document {
      id: "Advanced API Integration Layer",
      title: "Advanced API Integration Layer",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Advanced API Integration Layer", language: "rust", description: "Advanced API integration layer providing RESTful API, OpenAPI/Swagger, GraphQL API, WebSocket, API versioning, rate limiting, API monitoring, and SDK generation libraries"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "advanced_api", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Advanced API Integration Layer"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/api/advanced_api.rs
CREATE (doc:Document {
      id: "API Integration Module",
      title: "API Integration Module",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "API Integration Module", language: "Rust", main_module: "AdvancedApiServer"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "AdvancedApiServer", language: "Rust", type: "API Server", description: "Advanced API server with configuration, routing, middleware, versioning, rate limiting, analytics, and documentation"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "API Integration Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/normalization/cache/warm_store.rs
CREATE (doc:Document {
      id: "WarmStore Implementation",
      title: "WarmStore Implementation",
      domain: "software",
      doc_type: "code_implementation"
    })
CREATE (e0:Document {name: "WarmStore Implementation", language: "rust", content_type: "source_code"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "WarmStore", language: "rust", type: "struct", purpose: "medium-term storage with memory-mapped files and sharding"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "WarmStore Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/normalization/cache/mod.rs
CREATE (doc:Document {
      id: "Multi-tier Cache Manager Architecture",
      title: "Multi-tier Cache Manager Architecture",
      domain: "software",
      doc_type: "architecture_document"
    })
CREATE (e0:Document {title: "Multi-tier Cache Manager Architecture", language: "rust", content_type: "architecture_document"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "vectorizer::normalization::cache", language: "rust", description: "Multi-tier caching system with hot (LFU), warm (memory-mapped), and cold (compressed) storage tiers"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Multi-tier Cache Manager Architecture"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/normalization/cache/metrics.rs
CREATE (doc:Document {
      id: "Cache Metrics Collector",
      title: "Cache Metrics Collector",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {name: "Cache Metrics Collector", language: "rust", description: "Observability module providing cache performance metrics collection and tracking"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "observability", language: "rust", description: "Cache metrics collector with hit/miss tracking, latency monitoring, and statistics generation"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Cache Metrics Collector"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/normalization/cache/hot_cache.rs
CREATE (doc:Document {
      id: "Hot LFU (Least Frequently Used) Cache Implementation",
      title: "Hot LFU (Least Frequently Used) Cache Implementation",
      domain: "software",
      doc_type: "rust_module"
    })
CREATE (e0:Document {title: "Hot LFU (Least Frequently Used) Cache Implementation", language: "rust", type: "module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "lfu_cache", language: "rust", type: "implementation"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Hot LFU (Least Frequently Used) Cache Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/normalization/cache/blob_store.rs
CREATE (doc:Document {
      id: "Zstandard Blob Storage Module",
      title: "Zstandard Blob Storage Module",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Zstandard Blob Storage Module", language: "rust", description: "A compressed blob storage system using Zstandard compression with persistent indexing"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "BlobStore", language: "rust", type: "struct", description: "Main blob storage implementation with compression and indexing capabilities"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Module {name: "BlobEntry", language: "rust", type: "struct", description: "Metadata structure for blob entries containing file path, offset, and size information"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Module {name: "CompressionStats", language: "rust", type: "struct", description: "Statistics structure for compression metrics and space savings"})
CREATE (doc)-[:MENTIONS]->(e3)

MATCH (doc:Document {title: "Zstandard Blob Storage Module"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/models/qdrant/search.rs
CREATE (doc:Document {
      id: "Qdrant Search Models",
      title: "Qdrant Search Models",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Qdrant Search Models", language: "Rust", content_type: "code_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "models", language: "Rust", module_type: "data_structures"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Qdrant Search Models"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/models/qdrant/point.rs
CREATE (doc:Document {
      id: "Qdrant Data Models and Structures",
      title: "Qdrant Data Models and Structures",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Qdrant Data Models and Structures", language: "Rust", type: "code_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "models", language: "Rust", purpose: "Data structures for Qdrant vector database operations"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Qdrant Data Models and Structures"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/models/qdrant/mod.rs
CREATE (doc:Document {
      id: "Qdrant API compatibility models",
      title: "Qdrant API compatibility models",
      domain: "software",
      doc_type: "module"
    })
CREATE (e0:Module {name: "qdrant_api", language: "rust", description: "Data structures compatible with Qdrant's API for seamless integration and migration to Qdrant Vectorizer"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "collection", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Module {name: "filter_processor", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Module {name: "search", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Module {name: "point", language: "rust"})
CREATE (doc)-[:MENTIONS]->(e4)

MATCH (doc:Document {title: "Qdrant API compatibility models"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/models/qdrant/filter_processor.rs
CREATE (doc:Document {
      id: "FilterProcessor Implementation",
      title: "FilterProcessor Implementation",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "FilterProcessor Implementation", language: "Rust", type: "code_module"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "FilterProcessor", language: "Rust", type: "struct", purpose: "Filter processing for Qdrant payloads"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "FilterProcessor Implementation"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/models/qdrant/filter.rs
CREATE (doc:Document {
      id: "Qdrant Filter Types and Builder",
      title: "Qdrant Filter Types and Builder",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Qdrant Filter Types and Builder", language: "Rust", main_module: "qdrant_filter"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "qdrant_filter", language: "Rust", description: "Qdrant vector database filter types and builder pattern implementation"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Qdrant Filter Types and Builder"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/models/qdrant/error.rs
CREATE (doc:Document {
      id: "Qdrant Error Models and Structures",
      title: "Qdrant Error Models and Structures",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Qdrant Error Models and Structures", language: "Rust", content_type: "code"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "qdrant_error_models", language: "Rust", module_type: "error_handling"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Qdrant Error Models and Structures"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/models/qdrant/config.rs
CREATE (doc:Document {
      id: "Qdrant Configuration Structures",
      title: "Qdrant Configuration Structures",
      domain: "software",
      doc_type: "code_documentation"
    })
CREATE (e0:Document {name: "Qdrant Configuration Structures", language: "Rust", main_module: "qdrant_config"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "qdrant_config", language: "Rust", purpose: "Configuration structures for Qdrant vector database server"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Qdrant Configuration Structures"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/models/qdrant/collection.rs
CREATE (doc:Document {
      id: "Qdrant Collection Models and Configuration",
      title: "Qdrant Collection Models and Configuration",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Module {name: "models", language: "rust", description: "Qdrant collection data structures and configuration models"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Document {name: "QdrantCollectionInfo", type: "struct", description: "Main collection information structure"})
CREATE (doc)-[:MENTIONS]->(e1)
CREATE (e2:Document {name: "QdrantCollectionStatus", type: "enum", description: "Collection status enumeration"})
CREATE (doc)-[:MENTIONS]->(e2)
CREATE (e3:Document {name: "QdrantCollectionConfig", type: "struct", description: "Collection configuration parameters"})
CREATE (doc)-[:MENTIONS]->(e3)
CREATE (e4:Document {name: "QdrantVectorsConfig", type: "struct", description: "Vector configuration settings"})
CREATE (doc)-[:MENTIONS]->(e4)
CREATE (e5:Document {name: "QdrantDistance", type: "enum", description: "Distance metric enumeration"})
CREATE (doc)-[:MENTIONS]->(e5)
CREATE (e6:Document {name: "QdrantHnswConfig", type: "struct", description: "HNSW index configuration"})
CREATE (doc)-[:MENTIONS]->(e6)
CREATE (e7:Document {name: "QdrantOptimizerConfig", type: "struct", description: "Collection optimizer settings"})
CREATE (doc)-[:MENTIONS]->(e7)
CREATE (e8:Document {name: "QdrantWalConfig", type: "struct", description: "Write-ahead log configuration"})
CREATE (doc)-[:MENTIONS]->(e8)
CREATE (e9:Document {name: "QdrantQuantizationConfig", type: "struct", description: "Quantization configuration"})
CREATE (doc)-[:MENTIONS]->(e9)
CREATE (e10:Document {name: "QdrantQuantizationType", type: "enum", description: "Quantization type enumeration"})
CREATE (doc)-[:MENTIONS]->(e10)
CREATE (e11:Document {name: "QdrantScalarQuantization", type: "struct", description: "Scalar quantization parameters"})
CREATE (doc)-[:MENTIONS]->(e11)
CREATE (e12:Document {name: "QdrantCollectionStats", type: "struct", description: "Collection statistics"})
CREATE (doc)-[:MENTIONS]->(e12)

MATCH (doc:Document {title: "Qdrant Collection Models and Configuration"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File: /mnt/f/Node/hivellm/vectorizer/src/models/qdrant/batch.rs
CREATE (doc:Document {
      id: "Qdrant Batch Operations",
      title: "Qdrant Batch Operations",
      domain: "software",
      doc_type: "code_module"
    })
CREATE (e0:Document {name: "Qdrant Batch Operations", language: "Rust", main_module: "models"})
CREATE (doc)-[:MENTIONS]->(e0)
CREATE (e1:Module {name: "models", language: "Rust"})
CREATE (doc)-[:MENTIONS]->(e1)

MATCH (doc:Document {title: "Qdrant Batch Operations"}), (project:Project {name: "vectorizer"})
CREATE (project)-[:CONTAINS_FILE]->(doc)

// File Import Relationships

