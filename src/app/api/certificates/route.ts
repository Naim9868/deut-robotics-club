import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Certificate from '@/lib/models/Certificate';

export async function GET() {
  try {
    await connectDB();
    const data = await Certificate.find().sort({ createdAt: -1 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Auto-generate cert number if not provided
    if (!body.certNumber) {
      const count = await Certificate.countDocuments();
      body.certNumber = `DRC-${String(count + 1).padStart(4, '0')}`;
    }

    const data = await Certificate.create(body);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Certificate number already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500 });
  }
}
