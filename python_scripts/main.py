from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import ChatOllama, OllamaEmbeddings
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.prompts import ChatPromptTemplate
from fastapi.responses import StreamingResponse
from langchain_core.documents import Document
from langchain_chroma import Chroma
from pydantic import BaseModel
from typing import List 
import PyPDF2
import time
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # need to replace when getting deployed
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

llm = ChatOllama(model="gemma2:2b")

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size = 1000,
    chunk_overlap = 200,
)

embeddings = OllamaEmbeddings(model = "nomic-embed-text")

now_time = time.strftime("%H%M%S", time.localtime())

vector_db = Chroma(
    collection_name=f"context_vault_{now_time}",
    embedding_function=embeddings,
    persist_directory="./chroma_db"
)

print(f"⚙ DEBUG: Vector Database initialized")

RAG_prompt_template = """
Answer the question based ONLY on the following context:
{context}

Question: {question}
"""

async def process_file(file: UploadFile):
    try:
        content = await file.read()
        text = ""

        if not content:
            raise ValueError("Uploaded file is empty")

        if file.filename.lower().endswith(".pdf"):
            try:
                pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
                for page in pdf_reader.pages:
                    text += page.extract_text() or ""
            except Exception as pdf_err:
                raise RuntimeError("Failed to read PDF file") from pdf_err

        else:
            try:
                text = content.decode("utf-8")
            except UnicodeDecodeError:
                raise ValueError("File is not valid UTF-8 text")

        if not text.strip():
            raise ValueError("No extractable text found in file")

        doc = Document(
            page_content=text,
            metadata={"source": file.filename}
        )

        chunks = text_splitter.split_documents([doc])

        if not chunks:
            raise RuntimeError("Document chunking failed")

        vector_db.add_documents(chunks)

        return {"status": "success", "chunks_added": len(chunks)}

    except Exception as e:
        print(f"[ERROR] File processing failed: {e}")

        raise HTTPException(
            status_code=400,
            detail=f"File processing failed: {str(e)}"
        )

@app.post("/chat")
async def chat_endpoint(request: ChatRequest) -> StreamingResponse:
    
    docs = vector_db.similarity_search(request.message, k=3)
    
    context_text = "\n\n---\n\n".join([doc.page_content for doc in docs])
    
    prompt = RAG_prompt_template.format(context=context_text, question=request.message)
    
    def token_generator():
        for chunk in llm.stream(prompt):
            content = getattr(chunk, "content", None)
            if not content:
                continue
            yield content

    return StreamingResponse(token_generator(), media_type="text/plain")

@app.post("/upload")
async def upload_documents(files: List[UploadFile] = File(...)):
    uploaded_details = []
    
    print(f"--- Received {len(files)} files ---")
    
    for file in files:
        print(f"⚙ DEBUG: Received File: {file.filename}")
        await file.seek(0)
        
        await process_file(file)
        
        uploaded_details.append({
            "filename": file.filename,
            "status": "Verified in Backend"
        })
        print(f"⚙ DEBUG: DB has {vector_db._collection.count()} embeddings")
    
    #################################################
    ##########  LANGCHAIN IMPLEMENTATION  ###########
    #################################################  
        
    return {"message": "Files received", "details": uploaded_details}