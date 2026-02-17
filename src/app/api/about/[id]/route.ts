import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import About from '@/lib/models/About';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await connectDB();
    
    const data = await About.findById(id);
    
    if (!data) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch', message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params in Next.js 15+
    const { id } = await params;
    
    await connectDB();
    const body = await request.json();

    // console.log('PUT Request - ID:', id);
    // console.log('PUT Request - Body:', JSON.stringify(body, null, 2));

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    // Ensure image object exists
    if (!body.image) {
      body.image = { url: '', alt: body.title || 'About image' };
    }

    const data = await About.findByIdAndUpdate(
      id, 
      {
        $set: {
          title: body.title,
          description: body.description || '',
          paragraphs: body.paragraphs || [],
          buttonText: body.buttonText || 'Learn More',
          buttonLink: body.buttonLink || '#',
          image: {
            url: body.image?.url || '',
            alt: body.image?.alt || body.title || 'About image'
          },
          isActive: body.isActive ?? true,
          order: body.order || 0
        }
      }, 
      { 
        new: true,
        runValidators: true 
      }
    );

    if (!data) {
      return NextResponse.json(
        { error: 'About section not found' },
        { status: 404 }
      );
    }

    // console.log('PUT Request - Updated:', data);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('PUT Error Details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    if (error.name === 'ValidationError') {
      // Format validation errors for better client-side handling
      const errors = Object.keys(error.errors).reduce((acc: any, key) => {
        acc[key] = {
          message: error.errors[key].message,
          value: error.errors[key].value
        };
        return acc;
      }, {});
      
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Duplicate key error' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update', message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await connectDB();
    
    console.log('DELETE Request - ID:', id);
    
    const data = await About.findByIdAndDelete(id);
    
    if (!data) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete', message: error.message },
      { status: 500 }
    );
  }
}