"use client"

import React from 'react';
import Image from 'next/image';


/**
 * Header Component
 * Contains the logo and navigation links
 * 
 * TODO: Replace placeholder logo with actual logo image
 * TODO: Add proper navigation links and routing
 */

export const Header=()=> {
  return (
    <header style={headerStyles}>
      <div style={headerContainerStyles}>
        <div style={logoSectionStyles}>
          <Image 
            src="/logo.png" 
            alt="ContextVault" 
            width={100} 
            height={100} 
            style={{ objectFit: 'contain' }}
          />
          <span style={brandNameStyles}>ContextVault</span>
        </div>

        <nav style={navStyles}>
          <a href="#" style={navLinkStyles}>Page</a>
          <a href="#" style={navLinkStyles}>Page</a>
          <a href="#" style={navLinkStyles}>Page</a>
          <button 
          // onClick={()=>(console.log("masti hogyi oye"))}
          style={buttonStyles}>Button</button>
        </nav>
      </div>
    </header>
  );
}

// Styles
const headerStyles: React.CSSProperties = {
  width: '100%',
  padding: '1.5rem 2rem',
  borderBottom: '1px solid #9e9e9e',
};

const headerContainerStyles: React.CSSProperties = {
  maxWidth: '1400px',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const logoSectionStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
};

const logoPlaceholderStyles: React.CSSProperties = {
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '24px',
};

const logoTextStyles: React.CSSProperties = {
  fontSize: '24px',
};

const brandNameStyles: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#000000',
};

const navStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '2rem',
};

const navLinkStyles: React.CSSProperties = {
  fontSize: '1rem',
  color: '#000000',
  fontWeight: '400',
  transition: 'color 0.2s',
};

const buttonStyles: React.CSSProperties = {
  padding: '0.5rem 1.5rem',
  backgroundColor: '#000000',
  color: '#ffffff',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
};

