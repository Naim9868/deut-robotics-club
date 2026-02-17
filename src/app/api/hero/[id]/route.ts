import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Hero from '@/lib/models/Hero';
import { deleteImage } from '@/lib/utils/cloudinary';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    await connectDB();
    const data = await Hero.findById(id);
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    
    const { id } = await params;
    await connectDB();
    const body = await req.json();
    const data = await Hero.findByIdAndUpdate(id, body, { new: true });
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    await connectDB();
    const hero = await Hero.findById(id);
    if (hero?.images) {
      for (const img of hero.images) {
        if (img.publicId) await deleteImage(img.publicId);
      }
    }
    await Hero.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}