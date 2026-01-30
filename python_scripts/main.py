from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from langchain_ollama import ChatOllama

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


@app.post("/chat")
async def chat_endpoint(request: ChatRequest) -> StreamingResponse:
    """
    Stream the model response chunk-by-chunk so the frontend
    can render it progressively.
    """

    def token_generator():
        # Sync streaming generator from ChatOllama
        for chunk in llm.stream(request.message):
            content = getattr(chunk, "content", None)
            if not content:
                continue
            # Yield raw text chunks; frontend handles aggregation
            yield content

    return StreamingResponse(token_generator(), media_type="text/plain")


print("The end is never the end")