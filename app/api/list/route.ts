import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // List all blobs with the 'poetry/' prefix
    const { blobs } = await list({ 
      prefix: 'poetry/',
      limit: 100 // Adjust if you need more
    });
    
    // Sort by upload date, newest first
    const sortedBlobs = blobs.sort((a, b) => {
      const aTime = new Date(a.uploadedAt || 0).getTime();
      const bTime = new Date(b.uploadedAt || 0).getTime();
      return bTime - aTime;
    });

    return NextResponse.json({ 
      blobs: sortedBlobs,
      count: sortedBlobs.length 
    });
    
  } catch (error) {
    console.error('List error:', error);
    return NextResponse.json({ blobs: [], error: 'Failed to fetch poems' }, { status: 500 });
  }
}
