import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const METADATA_FILE = path.join(process.cwd(), 'data', 'files.json');

export async function GET() {
  try {
    // Check if metadata file exists
    if (!existsSync(METADATA_FILE)) {
      return NextResponse.json({ files: [] });
    }

    // Read metadata file
    const metadataContent = await readFile(METADATA_FILE, 'utf-8');
    const files = JSON.parse(metadataContent);

    // Return files (without the full path for security)
    const filesList = files.map((file: any) => ({
      id: file.id,
      name: file.originalName,
      type: file.type,
      size: file.size,
      uploadedAt: file.uploadedAt,
    }));

    return NextResponse.json({ files: filesList });
  } catch (error) {
    console.error('Error reading files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

