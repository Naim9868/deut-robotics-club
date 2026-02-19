import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Committee from '@/lib/models/Committee';

export async function GET() {
  try {
    await connectDB();
    const data = await Committee.find()
      .sort({ isExecutive: -1, order: 1, name: 1 })
      .lean();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch', message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    
    console.log('Creating committee member:', body.name);
    
    // Ensure image object exists
    if (!body.image) {
      body.image = { 
        url: `https://ui-avatars.com/api/?name=${encodeURIComponent(body.name || 'User')}&background=1e1e1e&color=e63946&size=200`,
        alt: body.name || 'Committee member'
      };
    }
    
    // Ensure socialLinks object exists
    if (!body.socialLinks) {
      body.socialLinks = { linkedin: '', github: '', facebook: '' };
    }
    
    const member = await Committee.create(body);
    
    return NextResponse.json(member, { status: 201 });
  } catch (error: any) {
    console.error('POST Error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).reduce((acc: any, key) => {
        acc[key] = error.errors[key].message;
        return acc;
      }, {});
      
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create', message: error.message },
      { status: 500 }
    );
  }
}