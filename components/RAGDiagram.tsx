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
    <section style={diagramSectionStyles}>
      <div style={diagramContainerStyles}>
        <div style={imageContainerStyles}>
          <Image 
            src="/rag_diagram.png" 
            alt="RAG Diagram" 
            width={1000} 
            height={800} 
            style={{ 
              width: '90%',
              height: 'auto',
              objectFit: 'contain' 
            }}
          />
        </div>

        <div style={titleContainerStyles}>
          <h2 style={diagramTitleStyles}>
            {diagramTitleWords.map((word, index) => (
              <span key={index} style={wordStyles}>
                {word}
              </span>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
}

const diagramSectionStyles: React.CSSProperties = {
  width: '100%',
  padding: '3rem 2rem',
  backgroundColor: '#ffffff',
  marginBottom: '2.5rem',
};

const diagramContainerStyles: React.CSSProperties = {
  maxWidth: '1400px',
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  gap: '2rem',
};

const imageContainerStyles: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  justifyContent: 'left',
  alignItems: 'left',
};

const titleContainerStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingLeft: '1rem',
  paddingRight: '3rem',
};

const diagramTitleStyles: React.CSSProperties = {
  fontSize: '3.2rem',
  fontWeight: '700',
  color: '#000000',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
  lineHeight: '1.2',
};

const wordStyles: React.CSSProperties = {
  display: 'block',
};

