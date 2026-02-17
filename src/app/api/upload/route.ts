// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, deleteImage } from '@/lib/utils/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'drc';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
    // console.log('Folder:', folder);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // console.log('Base64 created, length:', base64.length);

    const result = await uploadImage(base64, folder);
    // console.log('Upload result:', result);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Upload error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json(
      { error: 'Upload failed', details: error.message }, 
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { publicId } = await req.json();

    if (!publicId) {
      return NextResponse.json({ error: 'No publicId provided' }, { status: 400 });
    }

    await deleteImage(publicId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Delete failed', details: error.message }, 
      { status: 500 }
    );
  }
}