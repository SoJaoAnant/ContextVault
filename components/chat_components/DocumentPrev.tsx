'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useFileContext, type SessionFile, type SupportedFileType } from '@/contexts/FileContext';

type DocumentMeta = {
  id: string;
  name: string;
  type: SupportedFileType;
  blob: Blob;
};

export const DocumentPrev = () => {
  const { files } = useFileContext();
  const [selectedDoc, setSelectedDoc] = useState<DocumentMeta | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [textContent, setTextContent] = useState<string>('');
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const documents = useMemo(
    () =>
      files.map((f) => ({
        id: f.id,
        name: f.name,
        type: f.type,
        blob: f.blob,
      })),
    [files]
  );

  useEffect(() => {
    if (documents.length > 0 && !selectedDoc) {
      setSelectedDoc(documents[0]);
    } else if (documents.length === 0) {
      setSelectedDoc(null);
    } else if (selectedDoc && !documents.find((d) => d.id === selectedDoc.id)) {
      setSelectedDoc(documents[0]);
    }
  }, [documents, selectedDoc]);

  const loadTextContent = useCallback(async (blob: Blob) => {
    const text = await blob.text();
    setTextContent(text);
  }, []);

  useEffect(() => {
    if (!selectedDoc) {
      setTextContent('');
      setObjectUrl(null);
      return;
    }

    if (selectedDoc.type === 'pdf') {
      setTextContent('');
      const url = URL.createObjectURL(selectedDoc.blob);
      setObjectUrl(url);
      return () => {
        URL.revokeObjectURL(url);
        setObjectUrl(null);
      };
    }

    if (['md', 'txt', 'csv'].includes(selectedDoc.type)) {
      loadTextContent(selectedDoc.blob);
      setObjectUrl(null);
    }
  }, [selectedDoc, loadTextContent]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleSelectDoc = (doc: DocumentMeta) => {
    setSelectedDoc(doc);
  };

  return (
    <div className="w-full h-full py-4 pr-4 pl-2">
      <div
        className="
          bg-white
          w-full h-full 
          rounded-2xl 
          border-2 border-gray-400
          shadow-md
          flex
          overflow-hidden
        "
      >
        {/* Sidebar toggle / header */}
        <div className="absolute z-10 m-4 -ml-0.5 mt-10">
          <button
            type="button"
            onClick={toggleSidebar}
            className="
              inline-flex items-center gap-2
              px-2.5 py-1 text-sm font-medium
              bg-purple-500 text-white
              hover:bg-purple-600
              rounded-tr-lg
              rounded-br-lg
              shadow-sm
              border-2
              border-gray-400
            "
          >
            <span>{isSidebarOpen ? '<' : '>'}</span>
          </button>
        </div>

        {/* Sidebar with document list */}
        <aside
          className={`
            h-full border-r border-gray-200 bg-gray-50
            transition-all duration-200 ease-in-out
            ${isSidebarOpen ? 'w-64' : 'w-0'} 
            overflow-hidden
          `}
        >
          <div className="h-full flex flex-col">
            <div className="px-4 pt-12 pb-3 pl-10 border-b border-gray-200">
              <h2 className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Your documents
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {documents.length === 0 && (
                <div className="p-4 text-xs text-gray-400">
                  No documents in this session. Upload files on the home page.
                </div>
              )}

              <ul className="py-2 text-sm">
                {documents.map((doc) => (
                  <li key={doc.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectDoc(doc)}
                      className={`
                        w-full text-left px-4 py-2 flex items-center justify-between
                        hover:bg-gray-100
                        ${selectedDoc?.id === doc.id ? 'bg-gray-200 font-medium' : ''}
                      `}
                    >
                      <span className="truncate">{doc.name}</span>
                      <span className="ml-2 text-[11px] uppercase text-gray-500">{doc.type}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main preview pane */}
        <main className="flex-1 h-full bg-white relative">
          {!selectedDoc && (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Select a document from the list or upload files on the home page.
            </div>
          )}

          {selectedDoc && (
            <div className="w-full h-full">
              {selectedDoc.type === 'pdf' && objectUrl && (
                <iframe
                  src={objectUrl}
                  className="w-full h-full border-0 rounded-b-2xl"
                  title={selectedDoc.name}
                />
              )}

              {['md', 'txt', 'csv'].includes(selectedDoc.type) && (
                <div className="w-full h-full overflow-y-auto px-8 pb-6">
                  {selectedDoc.type === 'md' ? (
                    <article className="prose prose-sm max-w-none pt-4">
                      <ReactMarkdown>{textContent}</ReactMarkdown>
                    </article>
                  ) : (
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 pt-4">
                      {textContent}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
