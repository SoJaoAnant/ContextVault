'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  useFileContext,
  ALLOWED_EXTENSIONS,
  MAX_SIZE_BYTES,
  MAX_FILES,
  type SessionFile,
  type SupportedFileType,
} from '@/contexts/FileContext';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://127.0.0.1:8000';

export const UploadSection = () => {
  const { files, addFiles, removeFile } = useFileContext();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getFileType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toUpperCase() || 'UNKNOWN';
    return extension;
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return {
        valid: false,
        error: `"${file.name}" has an unsupported format. Supported: ${ALLOWED_EXTENSIONS.join(', ')}`,
      };
    }

    if (file.size > MAX_SIZE_BYTES) {
      return {
        valid: false,
        error: `"${file.name}" exceeds 20MB limit. Your file is ${formatFileSize(file.size)}`,
      };
    }

    return { valid: true };
  };

  const fileToSessionFile = async (file: File): Promise<SessionFile> => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const type = ext as SupportedFileType;
    const id = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    return {
      id,
      name: file.name,
      type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      blob: file,
    };
  };

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setUploadError(null);

    if (files.length >= MAX_FILES) {
      setUploadError(`Maximum ${MAX_FILES} files allowed. Remove some files before adding more.`);
      return;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(fileList).forEach((file) => {
      const { valid, error } = validateFile(file);
      if (valid) {
        validFiles.push(file);
      } else if (error) {
        errors.push(error);
      }
    });

    const slotsRemaining = MAX_FILES - files.length;
    if (validFiles.length > slotsRemaining) {
      errors.push(
        `Only ${slotsRemaining} slot(s) remaining. Maximum ${MAX_FILES} files allowed.`
      );
    }

    if (errors.length > 0) {
      setUploadError(errors.join('\n'));
    }

    const filesToAdd = validFiles.slice(0, slotsRemaining);
    if (filesToAdd.length > 0) {
      setIsUploading(true);
      try {
        const sessionFiles = await Promise.all(filesToAdd.map(fileToSessionFile));

        const formData = new FormData();
        filesToAdd.forEach((file) => {
          formData.append('files', file); // 'files' must match the Python parameter name
        });

        const controller = new AbortController();

        let response;
        try {
          response = await fetch(`${BACKEND_BASE_URL}/upload`, {
            method: "POST",
            body: formData,
            signal: controller.signal,
          });
        } catch (fetchError) {
          if (fetchError instanceof Error) {
            throw new Error('🚨 Backend is offline. Either wait for the server to start or check out the Demo page to see how it works!');
          }
          throw fetchError;
        }

        if (!response.ok) {
          let errorMessage = `Backend error (${response.status})`;

          try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorData.message || errorMessage;
          } catch {
            // If response isn't JSON, use status text
            errorMessage = `${errorMessage}: ${response.statusText}`;
          }

          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log("✅ Vault updated:", result);

        // 🔧 FIX: Check if any files failed on backend
        const failedFiles = result.details?.filter((d: any) => d.status === 'failed');
        if (failedFiles && failedFiles.length > 0) {
          const failureMessages = failedFiles.map((f: any) =>
            `${f.filename}: ${f.error}`
          ).join('\n');
          setUploadError(`Some files failed:\n${failureMessages}`);
        }

        // Only add successfully processed files to UI
        const successfulFiles = result.details?.filter((d: any) => d.status === 'success') || [];
        if (successfulFiles.length > 0) {
          addFiles(sessionFiles.slice(0, successfulFiles.length));
        }

        // Clear error only if all files succeeded
        if (!failedFiles || failedFiles.length === 0) {
          setUploadError(null);
        }

      } catch (err) {
        console.error('❌ Upload error:', err);

        // 🔧 FIX: Show user-friendly error messages
        if (err instanceof Error) {
          setUploadError(err.message);
        } else {
          setUploadError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDeleteFile = (fileId: string, fileName: string) => {
    if (!confirm(`Are you sure you want to remove "${fileName}"?`)) return;
    removeFile(fileId);
    setUploadError(null);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="flex justify-center items-center gap-40">
      {/* Upload Section */}
      <div
        className={`flex flex-col bg-gray-200 my-10 w-100 h-120 justify-center items-center rounded-2xl border-4 border-dashed ${isDragging ? 'border-purple-600 bg-purple-50' : 'border-purple-400'
          } transition-colors`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.md,.txt,.csv"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex justify-center items-center w-15 h-15">
          <Image
            src="/upload_logo.png"
            alt="upload_logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>

        <div className="text-center my-10 text-gray-700">
          <p className="text-lg font-medium">Drag or Select documents to upload</p>
          <p className="text-xs text-gray-500">Supported formats: (.pdf, .md, .txt, .csv)</p>
          <p className="text-xs text-gray-500">Max size: 20MB · Max {MAX_FILES} files</p>
        </div>

        {uploadError && (
          <div className="mt-3 px-4 py-2 max-w-md rounded-lg bg-red-100 border-2 border-red-300 text-red-700 text-sm whitespace-pre-line">
            <p className="font-semibold mb-1">❌ Upload Failed</p>
            {uploadError}
          </div>
        )}

        <button
          onClick={handleUploadClick}
          disabled={isUploading || files.length >= MAX_FILES}
          className={`
            min-w-fit px-4 py-2 
            rounded-2xl border-2 border-purple-300 bg-purple-400 
            flex items-center justify-center cursor-pointer 
            hover:border-purple-400 hover:bg-purple-500 
            active:scale-95 transition 
            ${isUploading || files.length >= MAX_FILES ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <p className="text-black font-normal whitespace-nowrap">
            {files.length >= MAX_FILES ? 'Limit reached' : isUploading ? 'Adding...' : 'Upload'}
          </p>
          <Image
            className="w-5 h-5 ml-1 object-contain shrink-0"
            src="/upload_logo_2.png"
            alt="upload_logo"
            width={100}
            height={100}
          />
        </button>
        <div className="mt-5 h-8 flex items-center justify-center">
          <p
            className={`
              text-sm text-gray-600 transition-opacity
              ${isUploading ? 'opacity-100' : 'opacity-0'}
            `}
          >
            The file is being uploaded...
            <br />
            it may take up to a minute 😃
          </p>
        </div>
      </div>

      {/* Uploaded Documents Section */}
      <div className="flex flex-col bg-gray-200 my-10 w-100 h-120 items-center justify-start rounded-2xl border-4 border-dashed border-purple-400 p-7 overflow-y-auto">
        <p className="text-xl font-semibold tracking-wide text-gray-800 mb-4">
          Documents Uploaded : {files.length > 0 && `(${files.length})`}
        </p>

        <div className="w-full h-px bg-gray-500 mb-12" />

        {files.length === 0 ? (
          <p className="text-gray-500 text-sm">No documents uploaded yet (session-only)</p>
        ) : (
          <div className="w-full space-y-3">
            {files.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="flex items-center w-full h-13 rounded border-2 border-gray-500 bg-gray-100 hover:bg-gray-300 transition"
              >
                <Image
                  src="/file_icon.png"
                  alt="file_icon"
                  width={32}
                  height={32}
                  className="mx-3 shrink-0 opacity-80"
                />

                <div className="my-1 flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 leading-tight truncate">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getFileType(uploadedFile.name)} | {formatFileSize(uploadedFile.size)}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(uploadedFile.id, uploadedFile.name);
                  }}
                  className="ml-3 mr-3 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded transition-colors active:scale-95"
                  title="Remove file"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};