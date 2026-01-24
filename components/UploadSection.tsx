import React from 'react';

/**
 * Document Upload Section Component
 * Allows users to upload documents
 * 
 * TODO: Implement actual file upload functionality
 * TODO: Add file validation and preview
 * TODO: Connect to backend API for file processing
 * TODO: Replace placeholder icons with actual icon components
*/

export const UploadSection=()=> {
  return (
    <section style={uploadSectionStyles}>
      <div style={uploadContainerStyles}>
        <div style={uploadAreaStyles}>
          <div style={uploadBoxStyles}>
            <h3 style={uploadTitleStyles}>Upload a document!</h3>
          </div>
          
          <div style={uploadControlsStyles}>
            <button style={uploadButtonStyles}>
              Upload
            </button>
            
            <div style={infoBoxStyles}>
              <span style={iconStyles}>📄</span>
              <span style={infoTextStyles}>Click the button to upload a document</span>
            </div>
          </div>
        </div>

        <div style={uploadedSectionStyles}>
          <div style={uploadedLabelStyles}>Uploaded :</div>
          <div style={uploadedFilesStyles}>
            <span style={iconStyles}>📄</span>
            <span style={fileNamesStyles}>file names</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Styles
const uploadSectionStyles: React.CSSProperties = {
  width: '100%',
  padding: '3rem 2rem',
  backgroundColor: '#ffffff',
  marginTop: '2.5rem',
  marginBottom: '4rem'
};

const uploadContainerStyles: React.CSSProperties = {
  maxWidth: '800px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
};

const uploadAreaStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  flexWrap: 'wrap',
};

const uploadBoxStyles: React.CSSProperties = {
  flex: '1',
  minWidth: '300px',
  padding: '2rem',
  backgroundColor: '#f5f5f5',
  border: '2px dashed #d0d0d0',
  borderRadius: '8px',
  textAlign: 'center',
};

const uploadTitleStyles: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#000000',
};

const uploadControlsStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  flexWrap: 'wrap',
};

const uploadButtonStyles: React.CSSProperties = {
  padding: '0.75rem 2rem',
  backgroundColor: '#000000',
  color: '#ffffff',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
};

const infoBoxStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1rem',
  backgroundColor: '#f5f5f5',
  borderRadius: '4px',
  border: '1px solid #e0e0e0',
};

const iconStyles: React.CSSProperties = {
  fontSize: '1.25rem',
};

const infoTextStyles: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#666666',
};

const uploadedSectionStyles: React.CSSProperties = {
  width: '100%',
  padding: '1.5rem',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
};

const uploadedLabelStyles: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: '600',
  color: '#000000',
  marginBottom: '0.75rem',
};

const uploadedFilesStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem',
};

const fileNamesStyles: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#666666',
};

