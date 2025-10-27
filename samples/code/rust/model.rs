//! Data Models and Validation
//! 
//! Defines request/response structures and validation logic

use serde::{Deserialize, Serialize};
use validator::Validate;

/// Request to insert a vector
#[derive(Debug, Clone, Serialize, Deserialize, Validate)]
pub struct InsertRequest {
    /// Document ID (must be unique)
    #[validate(length(min = 1, max = 255))]
    pub id: String,

    /// Vector data
    #[validate(length(min = 1, max = 4096))]
    pub vector: Vec<f32>,

    /// Optional metadata
    pub metadata: serde_json::Value,
}

/// Request to search vectors
#[derive(Debug, Clone, Serialize, Deserialize, Validate)]
pub struct SearchRequest {
    /// Query vector
    #[validate(length(min = 1, max = 4096))]
    pub query: Vec<f32>,

    /// Number of results (default: 10, max: 100)
    #[validate(range(min = 1, max = 100))]
    pub k: Option<usize>,

    /// Minimum similarity threshold (0.0 to 1.0)
    #[validate(range(min = 0.0, max = 1.0))]
    pub threshold: Option<f32>,

    /// Optional metadata filters
    pub filters: Option<serde_json::Value>,
}

/// Search response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SearchResponse {
    /// Success flag
    pub success: bool,

    /// Search results
    pub results: Vec<SearchResult>,

    /// Total results found
    pub total: usize,
}

/// Individual search result
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SearchResult {
    /// Document ID
    pub id: String,

    /// Similarity score (0.0 to 1.0)
    pub score: f32,

    /// Document metadata
    pub metadata: Option<serde_json::Value>,
}

/// Vector metadata
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VectorMetadata {
    /// Original document title
    pub title: String,

    /// Document type
    pub doc_type: String,

    /// Tags for categorization
    pub tags: Vec<String>,

    /// Timestamp
    pub timestamp: i64,
}

impl VectorMetadata {
    /// Create new metadata
    pub fn new(title: String, doc_type: String) -> Self {
        Self {
            title,
            doc_type,
            tags: Vec::new(),
            timestamp: chrono::Utc::now().timestamp(),
        }
    }

    /// Add tag to metadata
    pub fn add_tag(&mut self, tag: String) {
        if !self.tags.contains(&tag) {
            self.tags.push(tag);
        }
    }

    /// Check if has tag
    pub fn has_tag(&self, tag: &str) -> bool {
        self.tags.iter().any(|t| t == tag)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_metadata_creation() {
        let meta = VectorMetadata::new("Test Doc".to_string(), "article".to_string());
        assert_eq!(meta.title, "Test Doc");
        assert_eq!(meta.doc_type, "article");
    }

    #[test]
    fn test_add_tag() {
        let mut meta = VectorMetadata::new("Test".to_string(), "test".to_string());
        meta.add_tag("important".to_string());
        assert!(meta.has_tag("important"));
    }
}

