//! Vector Database Library
//! 
//! Provides high-performance vector search and storage capabilities
//! with HNSW indexing and multiple distance metrics.

use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::Path;

pub mod handler;
pub mod model;
pub mod storage;

/// Vector database instance
pub struct VectorDB {
    storage: storage::Storage,
    index: hnsw::Index,
    metadata: HashMap<String, String>,
}

impl VectorDB {
    /// Create a new vector database instance
    /// 
    /// # Arguments
    /// * `path` - Database file path
    /// * `dimension` - Vector dimension
    /// 
    /// # Returns
    /// A new VectorDB instance
    pub fn new(path: impl AsRef<Path>, dimension: usize) -> Result<Self> {
        let storage = storage::Storage::open(path).context("Failed to open storage")?;
        let index = hnsw::Index::new(dimension);
        
        Ok(Self {
            storage,
            index,
            metadata: HashMap::new(),
        })
    }

    /// Insert a vector with metadata
    /// 
    /// # Arguments
    /// * `id` - Document ID
    /// * `vector` - Vector data
    /// * `metadata` - Document metadata
    pub async fn insert(
        &mut self,
        id: String,
        vector: Vec<f32>,
        metadata: serde_json::Value,
    ) -> Result<()> {
        // Validate vector dimension
        if vector.len() != self.index.dimension() {
            anyhow::bail!("Vector dimension mismatch");
        }

        // Insert into HNSW index
        self.index.insert(&id, &vector)?;

        // Store metadata
        self.storage
            .put(&id, &metadata)
            .context("Failed to store metadata")?;

        Ok(())
    }

    /// Search for similar vectors
    /// 
    /// # Arguments
    /// * `query` - Query vector
    /// * `k` - Number of results
    /// 
    /// # Returns
    /// Vec of (id, distance) tuples
    pub async fn search(&self, query: &[f32], k: usize) -> Result<Vec<(String, f32)>> {
        let results = self.index.search(query, k)?;
        Ok(results)
    }

    /// Delete a vector by ID
    pub async fn delete(&mut self, id: &str) -> Result<()> {
        self.index.remove(id)?;
        self.storage.delete(id)?;
        Ok(())
    }

    /// Get total number of vectors
    pub fn count(&self) -> usize {
        self.index.len()
    }

    /// Close database and flush to disk
    pub async fn close(self) -> Result<()> {
        self.storage.flush()?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_insert_and_search() {
        let db = VectorDB::new("test.db", 128).unwrap();
        // Test implementation
    }
}

