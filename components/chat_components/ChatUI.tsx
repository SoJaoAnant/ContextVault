'use client';

import React, { useState, useRef, useEffect, useLayoutEffect, FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
};

export const ChatUI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useLayoutEffect(() => {
    if (textareaRef.current) {
      // Reset height to calculate correctly when shrinking
      textareaRef.current.style.height = "inherit";
      // Set new height based on content
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isStreaming) {
      // Ignore keyboard submit while streaming
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Prevent new messages while a response is streaming
    if (isStreaming) return;

    const trimmed = input.trim();
    if (!trimmed) return;

    const userId = Date.now();
    const assistantId = userId + 1;

    const userMessage: Message = {
      id: userId,
      role: "user",
      content: trimmed,
    };

    const assistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
    };

    // Add both user and an empty assistant message immediately,
    // so the assistant bubble appears and fills in as we stream.
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");

    try {
      const controller = new AbortController();
      abortControllerRef.current = controller;
      setIsStreaming(true);

      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
        signal: controller.signal,
      });

      // 👇 fetch doesn't throw on 4xx/5xx, so we check manually
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Streaming not supported in this browser.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = "";

      // Read streamed chunks and append them to the assistant message
      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        if (!value) continue;

        const chunkText = decoder.decode(value, { stream: !done });
        buffer += chunkText;

        // Optional: emit content in "word-like" pieces instead of raw characters
        const parts = buffer.split(/(\s+)/); // keep whitespace
        const complete = parts.slice(0, -1).join("");
        buffer = parts[parts.length - 1] ?? "";

        if (complete) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId
                ? { ...msg, content: msg.content + complete }
                : msg
            )
          );
        }
      }

      // Flush any remaining partial text in the buffer
      if (buffer) {
        const remaining = buffer;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: msg.content + remaining }
              : msg
          )
        );
      }

    } catch (error) {
      // If the user pressed Stop, fetch will reject with an AbortError.
      if (error instanceof DOMException && error.name === "AbortError") {
        // Just stop streaming; keep whatever text we already have.
        console.warn("Streaming aborted by user.");
      } else {
        console.error("Failed to connect to ContextVault backend:", error);

        // 🧯 Fallback assistant message
        const errorMessage: Message = {
          id: Date.now() + 1,
          role: "assistant",
          content:
            "⚠️ Failed to connect to the LLM server.\n" +
            "Either the backend is down or the model rage-quit. Try again later.",
        };

        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };


  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="w-full h-full py-4 pl-4 pr-2">
      {/* Outer Chat Container */}
      <div
        className="
          bg-white 
          w-full h-full 
          rounded-2xl
          border-2 border-gray-400 
          shadow-md
          flex flex-col
        "
      >
        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 chat-scroll-container">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              Start a conversation by sending a message.
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                py-2 px-3 text-sm wrap-break-word rounded-2xl
                ${msg.role === 'user'
                    ? 'bg-purple-500 text-white rounded-br-sm max-w-[80%]'
                    : 'text-gray-900 w-full prose prose-sm max-w-none'}
                `}
              >{msg.role === 'user' ? (
                msg.content
              ) : (
                <ReactMarkdown>
                  {msg.content}
                </ReactMarkdown>
              )}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-gray-200 px-3 py-2 flex items-center gap-2"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isStreaming? "AI is responding..." : "Type your message..."}
            disabled={isStreaming}
            className="
          flex-1 resize-none overflow-hidden
          rounded-xl border border-gray-300 
          px-3 py-2 text-sm 
          focus:outline-none focus:ring-2 focus:ring-purple-400
          max-h-32  /* Limits how tall it can grow before scrolling */
        "
          />
          <button
            type={isStreaming ? "button" : "submit"}
            onClick={isStreaming ? handleStop : undefined}
            disabled={!input.trim() && !isStreaming}
            className={`
              inline-flex items-center justify-center
              rounded-xl px-4 py-2 text-sm font-medium
              transition-colors
              ${isStreaming
                ? 'bg-red-500 text-white hover:bg-red-600'
                : input.trim()
                  ? 'bg-purple-500 text-white hover:bg-purple-600'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {isStreaming ? "Stop" : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};




