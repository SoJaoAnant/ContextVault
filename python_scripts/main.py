from fastapi import FastAPI
from pydantic import BaseModel
from langchain_ollama import ChatOllama
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"], # need to replace when getting deployed
    allow_methods = ["*"],
    allow_headers = ["*"],
)

class ChatRequest(BaseModel):
    message: str
    
llm = ChatOllama(model = "gemma2:2b")

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    
    ########################
    # RAG system goes here #
    ########################
    
    response = await llm.ainvoke(request.message)
    
    return {"Response" : response.content}

print("The end is never the end")