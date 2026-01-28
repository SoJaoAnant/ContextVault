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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const Response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await Response.json()

      // Fake assistant response for now – echoes user message
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.Response,
      };

      // Add user message
      setMessages((prev) => [...prev, assistantMessage]);
      // setInput('');

    } catch (error) {
      console.error("Failed to connect to ContextVault backend : ", error);
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
            placeholder="Type your message..."
            className="
          flex-1 resize-none overflow-hidden
          rounded-xl border border-gray-300 
          px-3 py-2 text-sm 
          focus:outline-none focus:ring-2 focus:ring-purple-400
          max-h-32  /* Limits how tall it can grow before scrolling */
        "
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className={`
              inline-flex items-center justify-center
              rounded-xl px-4 py-2 text-sm font-medium
              transition-colors
              ${input.trim()
                ? 'bg-purple-500 text-white hover:bg-purple-600'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};




