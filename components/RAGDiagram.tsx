import React from 'react';
import Image from 'next/image';

/**
 * RAG System Diagram Component
 * Complex flowchart showing the working of a RAG system
 * 
 * TODO: Replace placeholder boxes with actual diagram/image
 * TODO: Add interactive elements if needed
 * TODO: Consider using a diagramming library (e.g., react-flow, mermaid) for better visualization
 */

export const RAGDiagram=()=> {

  const diagramTitleWords = ["Working", "of", "a", "RAG", "System"];

  return (
    <section className="w-full py-12 px-8 bg-white mb-10">
      <div className="max-w-[1400px] mx-auto flex items-center gap-8">
        <div className="flex-1 flex justify-start items-start">
          <Image 
            src="/rag_diagram.png" 
            alt="RAG Diagram" 
            width={1000} 
            height={800} 
            className="w-[90%] h-auto object-contain"
          />
        </div>

        <div className="flex justify-center items-center pl-4 pr-12">
          <h2 className="text-[3.2rem] font-bold text-black flex flex-col items-center gap-2 leading-tight">
            {diagramTitleWords.map((word, index) => (
              <span key={index} className="block">
                {word}
              </span>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
}

