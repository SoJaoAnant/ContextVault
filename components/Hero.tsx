import React from 'react';

/**
 * Hero Section Component
 * Main title and call-to-action section
 */

export const Hero = () => {
  return (
    <section style={heroStyles}>
      <div style={heroContainerStyles}>
        <h1 style={titleStyles}>
          Secure, Semantic, Seamless
        </h1>
        
        <p style={subtitleStyles}>
          Upload your documents and query about it with an LLM
        </p>
        
        <button style={ctaButtonStyles}>
          Start Now
        </button>
      </div>
    </section>
  );
}

// Styles
const heroStyles: React.CSSProperties = {
  width: '100%',
  padding: '4rem 2rem',
  textAlign: 'center',
};

const heroContainerStyles: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  marginTop: '5rem',
  marginBottom: '5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1.5rem',
};

const titleStyles: React.CSSProperties = {
  fontSize: '4rem',
  fontWeight: '700',
  color: '#000000',
  lineHeight: '1.2',
  marginBottom: '1rem',
};

const subtitleStyles: React.CSSProperties = {
  fontSize: '1.5rem',
  color: '#666666',
  fontWeight: '400',
  marginBottom: '1rem',
};

const ctaButtonStyles: React.CSSProperties = {
  padding: '1rem 2.5rem',
  backgroundColor: '#000000',
  color: '#ffffff',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1.125rem',
  fontWeight: '600',
  cursor: 'pointer',
  marginTop: '1rem',
  transition: 'background-color 0.2s',
};

