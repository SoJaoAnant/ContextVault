import React from 'react';

/**
 * Footer Component
 * Contains "made by Anant with ♥"
 */

export const Footer=()=> {
  return (
    <footer style={footerStyles}>
      <div style={footerContainerStyles}>
        <p style={footerTextStyles}>Made with ♥ by Anant</p>
      </div>
    </footer>
  );
}

// Styles
const footerStyles: React.CSSProperties = {
  width: '100%',
  padding: '0rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const footerContainerStyles: React.CSSProperties = {
  width: '100%',
  padding: '1.0rem 2rem',
  backgroundColor: '#cacaca',
  borderRadius: '4px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const footerTextStyles: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: '400',
  color: '#595959',
  margin: '0',
};