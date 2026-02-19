import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Timeline from '@/lib/models/Timeline';
import { deleteImage } from '@/lib/utils/cloudinary';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    await connectDB();
    const data = await Timeline.findById(id);
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
    const data = await Timeline.findByIdAndUpdate(id, body, { new: true });
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
    const timeline = await Timeline.findById(id);
    if (timeline?.image?.publicId) {
      await deleteImage(timeline.image.publicId);
    }
    await Timeline.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}