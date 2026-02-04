'use client';

import { Circle } from 'lucide-react';
import React, { useState, useRef, useEffect, useLayoutEffect, FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import { LoaderCircle } from 'lucide-react';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
};

type ChatMode = 'ask_bot' | 'ask_document';

export const ChatUI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chatMode, setChatMode] = useState<ChatMode>('ask_document');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowModeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

    // Determine endpoint based on chat mode
    const endpoint = chatMode === 'ask_bot'
      ? "http://127.0.0.1:8000/chat_nodoc"
      : "http://127.0.0.1:8000/chat";

    try {
      const controller = new AbortController();
      abortControllerRef.current = controller;
      setIsStreaming(true);
      setIsThinking(true);

      const response = await fetch(endpoint, {
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

        if (isThinking) setIsThinking(false);

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
      setIsThinking(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleModeChange = (mode: ChatMode) => {
    setChatMode(mode);
    setShowModeDropdown(false);
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const getModeLabel = (mode: ChatMode) => {
    return mode === 'ask_bot' ? '🤖 Chat with Xeno' : '📄 Ask from Document';
  };

  const getModeDescription = (mode: ChatMode) => {
    return mode === 'ask_bot'
      ? 'General conversation without document context'
      : 'Query with document context from your uploads';
  };

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
        {/* Mode Selector Header */}
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowModeDropdown(!showModeDropdown)}
              disabled={isStreaming}
              className="
                flex items-center gap-2 px-4 py-2 
                bg-gray-50 hover:bg-gray-100
                border border-gray-300 rounded-lg
                text-sm font-medium text-gray-700
                transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <span>{getModeLabel(chatMode)}</span>
              <svg
                className={`w-4 h-4 transition-transform ${showModeDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showModeDropdown && (
              <div className="
                absolute top-full left-0 mt-2 
                w-72 bg-white border border-gray-200 
                rounded-lg shadow-lg z-10
              ">
                <div className="p-2">
                  <button
                    onClick={() => handleModeChange('ask_bot')}
                    className={`
                      w-full text-left px-3 py-2 rounded-md
                      transition-colors
                      ${chatMode === 'ask_bot'
                        ? 'bg-purple-50 text-purple-700'
                        : 'hover:bg-gray-50 text-gray-700'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">🤖</span>
                      <span className="font-medium text-sm">Ask Bot</span>
                      {chatMode === 'ask_bot' && (
                        <svg className="w-4 h-4 ml-auto text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 ml-6">
                      General conversation without document context
                    </p>
                  </button>

                  <button
                    onClick={() => handleModeChange('ask_document')}
                    className={`
                      w-full text-left px-3 py-2 rounded-md
                      transition-colors
                      ${chatMode === 'ask_document'
                        ? 'bg-purple-50 text-purple-700'
                        : 'hover:bg-gray-50 text-gray-700'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">📄</span>
                      <span className="font-medium text-sm">Ask Document</span>
                      {chatMode === 'ask_document' && (
                        <svg className="w-4 h-4 ml-auto text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 ml-6">
                      Query with document context from your uploads
                    </p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 chat-scroll-container">

          {/* Empty State */}
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm text-center px-4">
              <p className="mb-2">Start a conversation by sending a message.</p>
              <p className="text-xs text-gray-400">
                Currently in <strong>{chatMode === 'ask_bot' ? 'Ask Bot' : 'Ask Document'}</strong> mode
              </p>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, index) => {
            const isLastMessage = index === messages.length - 1;
            const showThinking =
              isLastMessage &&
              msg.role === 'assistant' &&
              msg.content === "" &&
              isThinking;

            return (
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
                >
                  {msg.role === 'user' ? (
                    msg.content
                  ) : showThinking ? (
                    <div className="flex items-center gap-2 text-gray-800 animate-pulse">
                      <LoaderCircle className="w-6 h-6 animate-spin text-purple-500" />
                      <span className="text-s italic">
                        Xeno is thinking...
                      </span>
                    </div>
                  ) : (
                    <ReactMarkdown>
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            );
          })}

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
            placeholder={isStreaming ? "AI is responding..." : `Type your message (${getModeLabel(chatMode)})...`}
            disabled={isStreaming}
            className="
          flex-1 resize-none overflow-hidden
          rounded-xl border border-gray-300 
          px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-purple-400
          max-h-32
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