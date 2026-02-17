// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, deleteImage } from '@/lib/utils/cloudinary';
// import { v2 as cloudinary } from 'cloudinary';

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'drc';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    const result = await uploadImage(base64, folder);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
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
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}