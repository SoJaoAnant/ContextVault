'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

type SupportedDocType = 'pdf' | 'md' | 'txt';

type DocumentMeta = {
  id: string;
  name: string;
  path: string; // relative path to the file, e.g. /uploads/foo.pdf
  type: SupportedDocType;
};

export const DocumentPrev = () => {
  const [documents, setDocuments] = useState<DocumentMeta[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentMeta | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string>('');

  // Fetch the list of documents from a JSON endpoint
  // You can back this with data/files.json on the server side.
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/files'); // TODO: implement this API to read data/files.json
        if (!res.ok) {
          throw new Error(`Failed to load documents: ${res.status}`);
        }

        const data = await res.json();

        const filesList: DocumentMeta[] = (data.files || []).map((file: any) => ({
          id: file.id,
          name: file.name,
          path: file.path, // This will be "/api/files/{id}/content"
          type: file.type.toLowerCase() as SupportedDocType, // Ensure lowercase
        }));

        setDocuments(filesList);

        if (filesList.length > 0 && !selectedDoc) {
          setSelectedDoc(filesList[0]);
        }

      } catch (err) {
        console.error(err);
        setError('Unable to load your documents.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  // Load text content for md/txt when selection changes
  useEffect(() => {
    const loadContent = async () => {
      if (!selectedDoc) {
        setTextContent('');
        return;
      }

      if (selectedDoc.type === 'md' || selectedDoc.type === 'txt') {
        try {
          setLoading(true);
          setError(null);

          const res = await fetch(selectedDoc.path);
          if (!res.ok) {
            throw new Error(`Failed to load document: ${res.status}`);
          }

          const text = await res.text();
          setTextContent(text);
        } catch (err) {
          console.error(err);
          setError('Unable to load this document.');
          setTextContent('');
        } finally {
          setLoading(false);
        }
      } else {
        // PDFs are rendered via <iframe>, no need to fetch text
        setTextContent('');
      }
    };

    loadContent();
  }, [selectedDoc]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleSelectDoc = (doc: DocumentMeta) => {
    setSelectedDoc(doc);
    // Keep sidebar open on large screens, close on small (optional)
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
            <span>
              {isSidebarOpen ? '<' : '>'}
            </span>
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
              {loading && documents.length === 0 && (
                <div className="p-4 text-xs text-gray-500">Loading documents...</div>
              )}

              {error && (
                <div className="p-4 text-xs text-red-500">
                  {error}
                </div>
              )}

              {!loading && !error && documents.length === 0 && (
                <div className="p-4 text-xs text-gray-400">
                  No documents found in your uploads.
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
                      <span className="ml-2 text-[11px] uppercase text-gray-500">
                        {doc.type}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main preview pane */}
        <main className="flex-1 h-full bg-white relative ">
          {!selectedDoc && !loading && (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Select a document from the list to preview it here.
            </div>
          )}

          {loading && (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
              Loading document...
            </div>
          )}

          {error && selectedDoc && !loading && (
            <div className="w-full h-full flex items-center justify-center text-red-500 text-sm px-4 text-center">
              {error}
            </div>
          )}

          {!loading && selectedDoc && !error && (
            <div className="w-full h-full">
              {selectedDoc.type === 'pdf' && (
                <iframe
                  src={selectedDoc.path}
                  className="w-full h-full border-0 rounded-b-2xl"
                  title={selectedDoc.name}
                />
              )}

              {(selectedDoc.type === 'md' || selectedDoc.type === 'txt') && (
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
