import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Timeline from '@/lib/models/Timeline';

export async function GET() {
  try {
    await connectDB();
    const data = await Timeline.find().sort({ year: 1 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const data = await Timeline.create(body);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}