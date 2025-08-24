import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

function unauthorized(msg: string, code = 401) {
  return new Response(msg, { status: code });
}

export async function POST(req: NextRequest) {
  try {
    // Gate: only your phone/shortcut can upload
    const phone = req.headers.get('x-phone');
    const token = req.headers.get('x-upload-token');

    // Check phone number
    if (phone !== process.env.ALLOWED_PHONE) {
      return unauthorized('Unauthorized: phone number not allowed');
    }

    // Check upload token
    if (token !== process.env.UPLOAD_TOKEN) {
      return unauthorized('Unauthorized: invalid token');
    }

    // Optional: Check timestamp to prevent replay attacks
    const ts = Number(req.headers.get('x-ts') || 0);
    if (ts && Math.abs(Date.now() - ts) > 5 * 60 * 1000) {
      return unauthorized('Unauthorized: request expired');
    }

    // Parse the form data
    const form = await req.formData();
    const file = form.get('file');
    
    if (!(file instanceof File)) {
      return new Response('No file provided', { status: 400 });
    }

    // Get optional title/caption
    const title = (form.get('title') as string) || '';
    
    // Create safe filename
    const safeName = file.name?.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase() || 'poem.png';
    const key = `poetry/${Date.now()}-${safeName}`;

    // Upload to Vercel Blob
    const blob = await put(key, file, {
      access: 'public',
      addRandomSuffix: true,
      contentType: file.type || 'image/png',
    });

    // Return the URL and metadata
    return NextResponse.json({ 
      url: blob.url, 
      title,
      uploadedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Upload error:', error);
    return new Response('Upload failed', { status: 500 });
  }
}
