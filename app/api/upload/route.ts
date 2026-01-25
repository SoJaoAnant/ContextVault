import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Define the uploads directory path
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const METADATA_FILE = path.join(process.cwd(), 'data', 'files.json');

// Ensure directories exist
async function ensureDirectories() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
  const dataDir = path.join(process.cwd(), 'data');
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }
  // Initialize metadata file if it doesn't exist
  if (!existsSync(METADATA_FILE)) {
    await writeFile(METADATA_FILE, JSON.stringify([]), 'utf-8');
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDirectories();

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadedFiles = [];
    const allowedTypes = ['.pdf', '.md', '.txt', '.csv'];
    const maxSize = 20 * 1024 * 1024; // 20MB

    // Read existing metadata
    let fileMetadata: any[] = [];
    try {
      const metadataContent = await readFile(METADATA_FILE, 'utf-8');
      fileMetadata = JSON.parse(metadataContent);
    } catch (error) {
      fileMetadata = [];
    }

    for (const file of files) {
      // Validate file type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        continue; // Skip invalid files
      }

      // Validate file size
      if (file.size > maxSize) {
        continue; // Skip oversized files
      }

      // Generate unique filename to avoid conflicts
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 9);
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueFileName = `${timestamp}_${randomStr}_${sanitizedName}`;
      const filePath = path.join(UPLOAD_DIR, uniqueFileName);

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // Create metadata entry
      const metadata = {
        id: `${timestamp}_${randomStr}`,
        originalName: file.name,
        fileName: uniqueFileName,
        type: fileExtension.substring(1).toUpperCase(),
        size: file.size,
        uploadedAt: new Date().toISOString(),
        path: filePath,
      };

      fileMetadata.push(metadata);
      uploadedFiles.push(metadata);
    }

    // Save updated metadata
    await writeFile(METADATA_FILE, JSON.stringify(fileMetadata, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

