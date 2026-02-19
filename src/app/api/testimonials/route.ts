import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Testimonial from '@/lib/models/Testimonial';

export async function GET() {
  try {
    await connectDB();
    const data = await Testimonial.find()
      .sort({ featured: -1, order: 1, createdAt: -1 })
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
    
    console.log('Creating testimonial for:', body.name);
    
    // Validate required fields
    if (!body.name || !body.role || !body.text) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: {
            ...(!body.name && { name: 'Name is required' }),
            ...(!body.role && { role: 'Role is required' }),
            ...(!body.text && { text: 'Testimonial text is required' })
          }
        },
        { status: 400 }
      );
    }
    
    // Ensure avatar object exists
    if (!body.avatar) {
      body.avatar = { 
        url: `https://ui-avatars.com/api/?name=${encodeURIComponent(body.name)}&background=1e1e1e&color=e63946&size=200`,
        alt: body.name
      };
    }
    
    const testimonial = await Testimonial.create(body);
    
    return NextResponse.json(testimonial, { status: 201 });
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