import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Events from '@/lib/models/Events';
import { deleteImage } from '@/lib/utils/cloudinary';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const event = await Events.findById(id).lean();
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(event);
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
    const { id } = await params;
    await connectDB();
    const body = await request.json();
    
    console.log('Updating event:', id);
    
    // Validate required fields
    const requiredFields = ['title', 'slug', 'description'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: missingFields.reduce((acc, field) => {
            acc[field] = `${field} is required`;
            return acc;
          }, {} as Record<string, string>)
        },
        { status: 400 }
      );
    }
    
    // Update fullDate if date fields changed
    if (body.date?.day && body.date?.month) {
      const year = body.date.year || new Date().getFullYear();
      body.date.fullDate = new Date(`${body.date.month} ${body.date.day}, ${year}`);
    }
    
    const event = await Events.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(event);
  } catch (error: any) {
    console.error('PUT Error:', error);
    
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
    
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          error: 'An event with this slug already exists',
          details: { slug: 'Slug must be unique' }
        },
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
    
    const event = await Events.findById(id);
    if (event?.image?.publicId) {
      await deleteImage(event.image.publicId);
    }
    await Events.findByIdAndDelete(id);

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Event deleted successfully' 
    });
  } catch (error: any) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete', message: error.message },
      { status: 500 }
    );
  }
}

