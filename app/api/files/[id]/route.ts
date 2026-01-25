import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const METADATA_FILE = path.join(process.cwd(), 'data', 'files.json');
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to get the actual values
    const { id: fileId } = await params;

    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }


    // Check if metadata file exists
    if (!existsSync(METADATA_FILE)) {
      return NextResponse.json(
        { error: 'No files found' },
        { status: 404 }
      );
    }

    // Read metadata file
    const metadataContent = await readFile(METADATA_FILE, 'utf-8');
    const files = JSON.parse(metadataContent);

    // Find the file to delete
    const fileIndex = files.findIndex((file: any) => file.id === fileId);

    if (fileIndex === -1) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    const fileToDelete = files[fileIndex];

    // Delete the physical file
    const filePath = fileToDelete.path || path.join(UPLOAD_DIR, fileToDelete.fileName);
    if (existsSync(filePath)) {
      try {
        await unlink(filePath);
      } catch (error) {
        console.error('Error deleting file:', error);
        // Continue even if file deletion fails (file might not exist)
      }
    }

    // Remove file from metadata
    files.splice(fileIndex, 1);

    // Save updated metadata
    await writeFile(METADATA_FILE, JSON.stringify(files, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

