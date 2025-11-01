"""
Data Processing Pipeline
Processes user data, generates embeddings, and stores in vector database
"""

import asyncio
import pandas as pd
import numpy as np
from typing import List, Dict, Any
from pathlib import Path
import json
import logging
from sentence_transformers import SentenceTransformer
import httpx

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
VECTOR_DB_URL = "http://localhost:8080"
MODEL_NAME = "all-MiniLM-L6-v2"
BATCH_SIZE = 32


class DataProcessor:
    """Processes and embeds documents for vector search"""
    
    def __init__(self, model_name: str = MODEL_NAME):
        """Initialize processor with embedding model"""
        self.model = SentenceTransformer(model_name)
        self.dimension = self.model.get_sentence_embedding_dimension()
        logger.info(f"Loaded model {model_name} with dimension {self.dimension}")
    
    def load_data(self, file_path: Path) -> pd.DataFrame:
        """
        Load data from CSV or JSON file
        
        Args:
            file_path: Path to data file
            
        Returns:
            DataFrame with loaded data
        """
        if file_path.suffix == '.csv':
            return pd.read_csv(file_path)
        elif file_path.suffix == '.json':
            return pd.read_json(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_path.suffix}")
    
    def generate_embeddings(self, texts: List[str]) -> np.ndarray:
        """
        Generate embeddings for list of texts
        
        Args:
            texts: List of text strings
            
        Returns:
            NumPy array of embeddings
        """
        logger.info(f"Generating embeddings for {len(texts)} texts")
        embeddings = self.model.encode(texts, batch_size=BATCH_SIZE, show_progress_bar=True)
        return embeddings
    
    async def upload_to_vectordb(self, documents: List[Dict[str, Any]]) -> None:
        """
        Upload documents and embeddings to vector database
        
        Args:
            documents: List of documents with text and metadata
        """
        async with httpx.AsyncClient() as client:
            for i, doc in enumerate(documents):
                try:
                    response = await client.post(
                        f"{VECTOR_DB_URL}/vectors",
                        json={
                            "id": doc["id"],
                            "vector": doc["embedding"].tolist(),
                            "metadata": doc["metadata"]
                        }
                    )
                    response.raise_for_status()
                    
                    if (i + 1) % 100 == 0:
                        logger.info(f"Uploaded {i + 1}/{len(documents)} documents")
                        
                except Exception as e:
                    logger.error(f"Failed to upload document {doc['id']}: {e}")
    
    async def process_file(self, input_path: Path, text_column: str = "text") -> None:
        """
        Complete processing pipeline: load → embed → upload
        
        Args:
            input_path: Path to input data file
            text_column: Name of column containing text
        """
        # Load data
        logger.info(f"Loading data from {input_path}")
        df = self.load_data(input_path)
        logger.info(f"Loaded {len(df)} records")
        
        # Generate embeddings
        texts = df[text_column].tolist()
        embeddings = self.generate_embeddings(texts)
        
        # Prepare documents
        documents = []
        for idx, (_, row) in enumerate(df.iterrows()):
            doc = {
                "id": f"doc_{idx}",
                "embedding": embeddings[idx],
                "metadata": {
                    "text": row[text_column],
                    **{k: v for k, v in row.items() if k != text_column}
                }
            }
            documents.append(doc)
        
        # Upload to vector database
        logger.info("Uploading to vector database")
        await self.upload_to_vectordb(documents)
        logger.info("Processing complete!")


async def main():
    """Main entry point"""
    processor = DataProcessor()
    
    # Process sample data
    input_file = Path("data/documents.csv")
    await processor.process_file(input_file)


if __name__ == "__main__":
    asyncio.run(main())

