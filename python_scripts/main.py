from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import ChatOllama, OllamaEmbeddings
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi import FastAPI, UploadFile, File
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

async def process_file(file: UploadFile):
    content = await file.read()
    text = ""

    if file.filename.endswith('.pdf'):
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        for page in pdf_reader.pages:
            text += page.extract_text()
    else:
        text = content.decode("utf-8")

    doc = Document(page_content=text, metadata={"source": file.filename})
    
    chunks = text_splitter.split_documents([doc])
    
    vector_db.add_documents(chunks)

@app.post("/chat")
async def chat_endpoint(request: ChatRequest) -> StreamingResponse:
    def token_generator():
        for chunk in llm.stream(request.message):
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
    
    #################################################
    ##########  LANGCHAIN IMPLEMENTATION  ###########
    #################################################  
    
          
        
    return {"message": "Files received", "details": uploaded_details}

print("The end is never the end")