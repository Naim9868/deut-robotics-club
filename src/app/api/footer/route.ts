import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Footer from '@/lib/models/Footer';

export async function GET() {
  try {
    await connectDB();
    const data = await Footer.find();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const data = await Footer.create(body);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}