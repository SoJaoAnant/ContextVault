from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from fastapi import FastAPI, UploadFile, File, HTTPException
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.prompts import ChatPromptTemplate
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from langchain_core.documents import Document
from langchain_openai import ChatOpenAI
from langchain_chroma import Chroma
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List
import PyPDF2
import time
import io
import os
 
load_dotenv(".env.local", override=True)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Replace with specific origins in production
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

# ==================== LLM Configuration ====================
llm = ChatOpenAI(
    model="meta-llama/llama-4-maverick-17b-128e-instruct",
    api_key=os.getenv("GROK_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
    temperature=0.7,
    max_tokens=600,
    top_p=0.95,
    frequency_penalty=0.2,
    presence_penalty=0.1,
    streaming=True  # Enable streaming explicitly
)

# ==================== Text Splitter ====================
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len,
    is_separator_regex=False,
)

# ==================== Embeddings ====================
doc_embeddings = GoogleGenerativeAIEmbeddings(
    model="models/text-embedding-004",
)

COLLECTION_NAME = os.getenv("CHROMA_COLLECTION_NAME", "context_vault_db")

vector_db = Chroma(
    collection_name=COLLECTION_NAME, 
    embedding_function=doc_embeddings,
    persist_directory="./chroma_db",
) 

print(f"✅ Vector DB initialized: {COLLECTION_NAME}")
print(f"📊 Current document count: {vector_db._collection.count()}")

# ==================== RAG Prompt Template ====================
RAG_prompt_template = ChatPromptTemplate.from_template("""
You are a helpful and factual assistant with access to specific documents.

Answer the question based ONLY on the context provided below.
If the answer cannot be found in the context, respond with: "I don't have enough information in the provided documents to answer this question."

Do not make up information or use knowledge outside the provided context.

Format your response in **clear markdown**:
- Start with a short heading using `##`
- Use bullet points for lists of facts or steps
- Use **bold** to highlight key terms or important points
- Use code blocks for code or commands when appropriate

Context:
{context}

Question: {question}

Answer:
""")

system_prompt = """
You are a helpful chatbot named Xeno.
You have a cheerful personality and when asked about your well being, you respond cheerfully.
You also use appropriate emojis when responding.

Always format your answers in markdown:
- Start with a short heading using `##`
- Use bullet points for structure when helpful
- Use **bold** to emphasize key terms and important ideas
- Use code blocks for code or commands when appropriate
"""


# ==================== RAG Chain Implementation ====================
def format_docs(docs): 
    """Format retrieved documents into a single context string.""" 
    return "\n\n---\n\n".join([doc.page_content for doc in docs])

# Create the RAG chain using LCEL (LangChain Expression Language)
rag_chain = (
    {
        "context": lambda x: format_docs(
            vector_db.similarity_search(x["question"], k=5)
        ),
        "question": lambda x: x["question"]
    }
    | RAG_prompt_template
    | llm
    | StrOutputParser()
)

# ==================== File Processing ====================
async def process_file(file: UploadFile):
    """Process uploaded file and add to vector database."""
    try:
        content = await file.read()
        text = ""

        if not content:
            raise ValueError("Uploaded file is empty")

        # Handle PDF files
        if file.filename.lower().endswith(".pdf"):
            try:
                pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
                for page_num, page in enumerate(pdf_reader.pages):
                    page_text = page.extract_text() or ""
                    if page_text.strip():
                        text += f"\n--- Page {page_num + 1} ---\n{page_text}"
            except Exception as pdf_err:
                raise RuntimeError(f"Failed to read PDF: {str(pdf_err)}") from pdf_err

        # Handle text files
        elif file.filename.lower().endswith((".txt", ".md", ".csv")):
            try:
                text = content.decode("utf-8")
            except UnicodeDecodeError:
                raise ValueError("File is not valid UTF-8 text")
        
        else:
            raise ValueError(f"Unsupported file type: {file.filename}. Only PDF and text files are supported.")

        if not text.strip():
            raise ValueError("No extractable text found in file")

        # Create document with metadata
        doc = Document(
            page_content=text,
            metadata={
                "source": file.filename,
                "upload_time": time.strftime("%Y-%m-%d %H:%M:%S"),
                "file_type": file.filename.split('.')[-1].lower()
            }
        )

        # Split into chunks
        chunks = text_splitter.split_documents([doc])

        if not chunks:
            raise RuntimeError("Document chunking failed - no chunks created")

        # Add to vector database
        vector_db.add_documents(chunks)
        
        print(f"✅ Successfully processed: {file.filename} ({len(chunks)} chunks)")

        return {
            "status": "success",
            "filename": file.filename,
            "chunks_added": len(chunks),
            "total_docs_in_db": vector_db._collection.count()
        }

    except Exception as e:
        print(f"❌ ERROR processing {file.filename}: {e}")
        raise HTTPException(
            status_code=400,
            detail=f"File processing failed: {str(e)}"
        )

# ==================== Endpoints ====================

@app.post("/upload")
async def upload_documents(files: List[UploadFile] = File(...)):
    """Upload and process multiple documents."""
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")
    
    uploaded_details = []
    
    print(f"\n📤 Received {len(files)} file(s) for upload")
    start_time = time.time()
    
    for file in files:
        try:
            await file.seek(0)  # Reset file pointer
            result = await process_file(file)
            uploaded_details.append(result)
            
        except HTTPException as he:
            # If one file fails, log it but continue with others
            uploaded_details.append({
                "status": "failed",
                "filename": file.filename,
                "error": he.detail
            })
            print(f"⚠️  Failed to process {file.filename}: {he.detail}")
    
    end_time = time.time()
    processing_time = round(end_time - start_time, 2)
    
    print(f"⏱️  Total processing time: {processing_time}s")
    print(f"📊 Vector DB now contains: {vector_db._collection.count()} documents\n")
    
    return {
        "message": f"Processed {len(files)} file(s)",
        "processing_time_seconds": processing_time,
        "details": uploaded_details,
        "total_documents_in_db": vector_db._collection.count()
    }


@app.post("/chat")
async def chat_endpoint(request: ChatRequest) -> StreamingResponse:
    
    print(f"\n💬 RAG Query: {request.message[:100]}...")
    
    try:
        def token_generator():
            try:
                # Stream the response from the RAG chain
                for chunk in rag_chain.stream({"question": request.message}):
                    if chunk:
                        yield chunk
                        
            except Exception as e:
                print(f"❌ Streaming error: {e}")
                yield f"\n\n[Error: {str(e)}]"
        
        return StreamingResponse(token_generator(), media_type="text/plain")
    
    except Exception as e:
        print(f"❌ Chat endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/chat_nodoc")
async def chat_nodoc_endpoint(request: ChatRequest) -> StreamingResponse:
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=request.message)
    ]
    
    print(f"\n💬 Direct Query: {request.message[:100]}...")
    
    try:
        def token_generator():
            try:
                for chunk in llm.stream(messages):
                    content = getattr(chunk, "content", None)
                    if content:
                        yield content
                        
            except Exception as e:
                print(f"❌ Streaming error: {e}")
                yield f"\n\n[Error: {str(e)}]"
        
        return StreamingResponse(token_generator(), media_type="text/plain")
    
    except Exception as e:
        print(f"❌ Chat_nodoc endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats")
async def get_stats():
    """Get current database statistics."""
    try:
        doc_count = vector_db._collection.count()
        return {
            "collection_name": COLLECTION_NAME,
            "total_documents": doc_count,
            "embedding_model": "text-embedding-004", 
            "llm_model": "llama-4-maverick-17b"
        }
    except Exception as e:
        print(f"Stats Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/clear")
async def clear_database():
    """Clear all documents from the vector database."""
    global vector_db  # Must declare BEFORE using the variable
    
    try:
        # Delete and recreate the collection
        vector_db._client.delete_collection(COLLECTION_NAME)
        
        # Recreate it
        vector_db = Chroma(
            collection_name=COLLECTION_NAME,
            embedding_function=doc_embeddings,
            persist_directory="./chroma_db",
        )
        
        print(f"🗑️  Database cleared: {COLLECTION_NAME}")
        
        return {
            "message": "Database cleared successfully",
            "collection_name": COLLECTION_NAME
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== Startup Event ====================
@app.on_event("startup")
async def startup_event():
    print("\n" + "="*50)
    print("🚀 ContextVault Backend Started")
    print("="*50)
    print(f"📦 Collection: {COLLECTION_NAME}")
    print(f"📊 Documents: {vector_db._collection.count()}")
    print(f"🤖 LLM: llama-4-maverick-17b")
    print(f"🔍 Embeddings: text-embedding-004")
    print("="*50 + "\n")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)