'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';

export type SupportedFileType = 'pdf' | 'md' | 'txt' | 'csv';

export type SessionFile = {
  id: string;
  name: string;
  type: SupportedFileType;
  size: number;
  uploadedAt: string;
  blob: Blob;
};

type FileContextValue = {
  files: SessionFile[];
  addFiles: (newFiles: SessionFile[]) => void;
  removeFile: (id: string) => void;
};

const FileContext = createContext<FileContextValue | null>(null);

const ALLOWED_EXTENSIONS = ['.pdf', '.md', '.txt', '.csv'];
const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20MB
const MAX_FILES = 5;

export function FileProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<SessionFile[]>([]);

  const addFiles = useCallback((newFiles: SessionFile[]) => {
    setFiles((prev) => {
      const remaining = MAX_FILES - prev.length;
      if (remaining <= 0) return prev;
      return [...prev, ...newFiles.slice(0, remaining)];
    });
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return (
    <FileContext.Provider value={{ files, addFiles, removeFile }}>
      {children}
    </FileContext.Provider>
  );
}

export function useFileContext() {
  const ctx = useContext(FileContext);
  if (!ctx) {
    throw new Error('useFileContext must be used within FileProvider');
  }
  return ctx;
}

export { ALLOWED_EXTENSIONS, MAX_SIZE_BYTES, MAX_FILES };
