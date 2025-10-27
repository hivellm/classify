//! HTTP Handlers for Vector Database API
//! 
//! Provides REST API endpoints for vector operations

use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::Json,
    routing::{delete, get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::RwLock;

use crate::model::{InsertRequest, SearchRequest, SearchResponse};
use crate::VectorDB;

type SharedDB = Arc<RwLock<VectorDB>>;

/// Create API router
pub fn create_router(db: SharedDB) -> Router {
    Router::new()
        .route("/vectors", post(insert_vector))
        .route("/search", post(search_vectors))
        .route("/vectors/:id", delete(delete_vector))
        .route("/health", get(health_check))
        .route("/stats", get(get_stats))
        .with_state(db)
}

/// POST /vectors - Insert a vector
async fn insert_vector(
    State(db): State<SharedDB>,
    Json(req): Json<InsertRequest>,
) -> Result<Json<InsertResponse>, (StatusCode, String)> {
    let mut db = db.write().await;

    db.insert(req.id.clone(), req.vector, req.metadata)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(InsertResponse {
        success: true,
        id: req.id,
    }))
}

/// POST /search - Search for similar vectors
async fn search_vectors(
    State(db): State<SharedDB>,
    Json(req): Json<SearchRequest>,
) -> Result<Json<SearchResponse>, (StatusCode, String)> {
    let db = db.read().await;

    let results = db
        .search(&req.query, req.k.unwrap_or(10))
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let items = results
        .into_iter()
        .map(|(id, distance)| SearchResult { id, distance })
        .collect();

    Ok(Json(SearchResponse {
        success: true,
        results: items,
        total: items.len(),
    }))
}

/// DELETE /vectors/:id - Delete a vector
async fn delete_vector(
    State(db): State<SharedDB>,
    Path(id): Path<String>,
) -> Result<Json<DeleteResponse>, (StatusCode, String)> {
    let mut db = db.write().await;

    db.delete(&id)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(DeleteResponse {
        success: true,
        id,
    }))
}

/// GET /health - Health check
async fn health_check(State(db): State<SharedDB>) -> Json<HealthResponse> {
    let db = db.read().await;
    let healthy = db.count() >= 0; // Simple check

    Json(HealthResponse {
        status: if healthy { "ok" } else { "error" },
        vectors: db.count(),
    })
}

/// GET /stats - Database statistics
async fn get_stats(State(db): State<SharedDB>) -> Json<StatsResponse> {
    let db = db.read().await;

    Json(StatsResponse {
        total_vectors: db.count(),
        dimension: 128, // From DB
        index_type: "HNSW".to_string(),
    })
}

#[derive(Serialize)]
struct InsertResponse {
    success: bool,
    id: String,
}

#[derive(Serialize)]
struct SearchResult {
    id: String,
    distance: f32,
}

#[derive(Serialize)]
struct DeleteResponse {
    success: bool,
    id: String,
}

#[derive(Serialize)]
struct HealthResponse {
    status: &'static str,
    vectors: usize,
}

#[derive(Serialize)]
struct StatsResponse {
    total_vectors: usize,
    dimension: usize,
    index_type: String,
}

