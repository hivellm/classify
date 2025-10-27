#!/bin/bash
# Build script for User Management System
# Builds all components: TypeScript, Rust, Python, and React frontend

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════╗"
echo "║  Building User Management System                  ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"
command -v node >/dev/null 2>&1 || { echo "Node.js required but not installed. Aborting." >&2; exit 1; }
command -v cargo >/dev/null 2>&1 || { echo "Rust required but not installed. Aborting." >&2; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "Python 3 required but not installed. Aborting." >&2; exit 1; }

echo -e "${GREEN}✓ All prerequisites met${NC}"
echo ""

# Install Node.js dependencies
echo -e "${BLUE}Installing Node.js dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Node.js dependencies installed${NC}"
echo ""

# Build TypeScript
echo -e "${BLUE}Building TypeScript...${NC}"
npm run build
echo -e "${GREEN}✓ TypeScript built successfully${NC}"
echo ""

# Build Rust vector database
echo -e "${BLUE}Building Rust vector database...${NC}"
cd rust-vector-db
cargo build --release --all-features
echo -e "${GREEN}✓ Rust binary built: target/release/vector-db${NC}"
cd ..
echo ""

# Setup Python environment
echo -e "${BLUE}Setting up Python environment...${NC}"
cd python-pipeline
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt --quiet
echo -e "${GREEN}✓ Python environment ready${NC}"
cd ..
echo ""

# Build React frontend
echo -e "${BLUE}Building React frontend...${NC}"
npm run build:client
echo -e "${GREEN}✓ React frontend built: dist/client${NC}"
echo ""

# Run tests
echo -e "${BLUE}Running tests...${NC}"
npm test
cargo test --manifest-path=rust-vector-db/Cargo.toml
cd python-pipeline && source venv/bin/activate && pytest && cd ..
echo -e "${GREEN}✓ All tests passed${NC}"
echo ""

# Build summary
echo "╔════════════════════════════════════════════════════╗"
echo "║  Build Complete! ✓                                 ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""
echo "Build artifacts:"
echo "  - TypeScript API: dist/"
echo "  - Rust binary: rust-vector-db/target/release/vector-db"
echo "  - React frontend: dist/client/"
echo "  - Python venv: python-pipeline/venv/"
echo ""
echo "To start services:"
echo "  npm start                  # Start API server"
echo "  ./rust-vector-db/target/release/vector-db  # Start vector DB"
echo "  docker-compose up          # Start all services"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"

