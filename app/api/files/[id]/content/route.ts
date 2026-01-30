import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const METADATA_FILE = path.join(process.cwd(), 'data', 'files.json');
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
        }

        // Read metadata to find the file
        if (!existsSync(METADATA_FILE)) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        const metadataContent = await readFile(METADATA_FILE, 'utf-8');
        const files = JSON.parse(metadataContent);
        const file = files.find((f: any) => f.id === id);

        if (!file) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        // Construct file path
        const filePath = file.path || path.join(UPLOAD_DIR, file.fileName);

        if (!existsSync(filePath)) {
            return NextResponse.json({ error: 'File not found on disk' }, { status: 404 });
        }

        // Read and serve the file
        const fileBuffer = await readFile(filePath);
        const fileExtension = path.extname(file.fileName).toLowerCase();

        // Set appropriate content type
        const contentTypeMap: Record<string, string> = {
            '.pdf': 'application/pdf',
            '.md': 'text/markdown',
            '.txt': 'text/plain',
        };

        const contentType = contentTypeMap[fileExtension] || 'application/octet-stream';

        // Header values must be ASCII (ByteString). Strip non-ASCII to avoid "character at index N has a value of 55357" error.
        const safeFilename = (file.originalName || file.fileName || 'document')
            .replace(/[^\x00-\x7F]+/g, '_')
            .replace(/"/g, "'");

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `inline; filename="${safeFilename}"`,
            },
        });

    } catch (error) {
        console.error('Error serving file:', error);
        return NextResponse.json(
            { error: 'Failed to serve file', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}