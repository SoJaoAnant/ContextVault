'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export const UploadSection = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = ['.pdf', '.md', '.txt', '.csv'];
  const maxSize = 20 * 1024 * 1024; // 20MB in bytes

  // Format file size to readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Get file type from extension
  const getFileType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toUpperCase() || 'UNKNOWN';
    return extension;
  };

  // Validate file
  const validateFile = (file: File): boolean => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      alert(`File type not supported. Supported formats: ${allowedTypes.join(', ')}`);
      return false;
    }

    if (file.size > maxSize) {
      alert(`File size exceeds 20MB limit. Your file is ${formatFileSize(file.size)}`);
      return false;
    }

    return true;
  };

  // Fetch uploaded files from server
  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch('/api/files');
      const data = await response.json();
      if (data.files) {
        setUploadedFiles(data.files);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  // Load files on component mount
  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  // Upload files to server
  const uploadFilesToServer = async (files: File[]) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh the file list after successful upload
        await fetchUploadedFiles();
        alert(`Successfully uploaded ${data.files?.length || files.length} file(s)`);
      } else {
        alert(`Upload failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Delete file from server
  const handleDeleteFile = async (fileId: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh the file list after successful deletion
        await fetchUploadedFiles();
      } else {
        alert(`Delete failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  // Handle file selection
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    
    Array.from(files).forEach((file) => {
      if (validateFile(file)) {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      // Upload files to server
      await uploadFilesToServer(validFiles);
    }
  };

  // Drag and drop handlers
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

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle upload button click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className='flex justify-center items-center gap-40 bg-white '>

      {/* Upload Section */}
      <div
        className={`flex flex-col bg-gray-200 my-10 w-100 h-120 justify-center items-center rounded-2xl border-4 border-dashed ${
          isDragging ? 'border-purple-600 bg-purple-50' : 'border-purple-400'
        } transition-colors`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.md,.txt,.csv"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Upload Logo */}
        <div className='flex justify-center items-center w-15 h-15'>
          <Image
            src="/upload_logo.png"
            alt="upload_logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>

        {/* Upload Text and Logo*/}
        <div className='text-center text-gray-700 '>
          <p className='text-lg font-medium'>
            Drag or Select documents to upload
          </p>
          <p className='text-m text-gray-500'>
            Supported formats: (.pdf, .md, .txt, .csv)
          </p>
          <p className='text-m text-gray-500'>
            Max size : 20mb
          </p>
        </div>

        {/* Upload Button */} 
        <div className='mt-15'>
          <button
            onClick={handleUploadClick}
            disabled={isUploading}
            className={`w-25 h-9 rounded-2xl bg-purple-400 flex items-center justify-center cursor-pointer hover:bg-purple-500 active:scale-95 transition ${
              isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <p className='text-black font-normal'>{isUploading ? 'Uploading...' : 'Upload'}</p>
            <Image className='w-5 h-5 ml-1 object-contain'
              src="/upload_logo_2.png"
              alt="upload_logo"
              width={100}
              height={100}
            />
          </button>
        </div>

      </div>

      {/* Uploaded Documents Section */}
      <div className='flex flex-col bg-gray-200 my-10 w-100 h-120 items-center justify-start rounded-2xl border-4 border-dashed border-purple-400 p-7 overflow-y-auto'>

        {/* Text Heading */}
        <p className='text-xl font-semibold tracking-wide text-gray-800 mb-4'>
          Documents Uploaded : {uploadedFiles.length > 0 && `(${uploadedFiles.length})`}
        </p>

        <div className="w-full h-px bg-gray-500 mb-12" />

        {/* Files display */}
        {uploadedFiles.length === 0 ? (
          <p className='text-gray-500 text-sm'>No documents uploaded yet</p>
        ) : (
          <div className='w-full space-y-3'>
            {uploadedFiles.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className='flex items-center w-full h-13 rounded border-2 border-gray-500 bg-gray-100 hover:bg-gray-300 transition'
              >
                <Image
                  src="/file_icon.png"
                  alt="file_icon"
                  width={32}
                  height={32}
                  className="mx-3 shrink-0 opacity-80"
                />

                <div className='my-1 flex-1 min-w-0'>
                  <p className='text-sm font-semibold text-gray-800 leading-tight truncate'>
                    {uploadedFile.name}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {uploadedFile.type} | {formatFileSize(uploadedFile.size)}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(uploadedFile.id, uploadedFile.name);
                  }}
                  className='ml-3 mr-3 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded transition-colors active:scale-95'
                  title="Delete file"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}