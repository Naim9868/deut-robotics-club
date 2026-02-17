import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import About from '@/lib/models/About';

export async function GET() {
  try {
    await connectDB();
    const data = await About.find().sort({ order: 1 });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data', message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    console.log('POST Request - Body:', JSON.stringify(body, null, 2));
    
    const data = await About.create(body);
    console.log('POST Request - Created:', data);
    
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('POST Error Details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create', message: error.message },
      { status: 500 }
    );
  }
}