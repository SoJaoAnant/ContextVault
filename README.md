![Demo Screenshot](./public/ContextVaultBanner.png)

## 📚 RAG Based AI Document Assistant

A Retrieval-Augmented Generation (RAG) system that allows users to upload documents, store them in a vector database, and query them using an LLM.

## 🚀 Features

- 📄 Upload PDF / DOCX / txt files
- ✂️  chunking & preprocessing
- 🧠 Embedding generation
- 🗃️ Vector database storage using Chroma
- 💬 Dual chat modes:
    - General-purpose AI chat
    - Document-aware RAG querying
- 📃 Document preview section

## 🛠️ Tech Stack

### ⚙ Backend
- Chunking, Preprocessing and Retrieval using Langchain's modules
- Embedding using Gemini's embedding-001
- AI Model using Grok's llama-4-maverick-17b-128e-instruct
- Vector Database using Chroma  

### 🎨 Frontend
- Next.js, Tailwind and JavaScript

### API endpoints
- Backend and Frontend connected thru FastAPI endpoints
