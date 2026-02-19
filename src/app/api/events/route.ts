import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Events from '@/lib/models/Events';

export async function GET() {
  try {
    await connectDB();
    const data = await Events.find()
      .sort({ featured: -1, order: 1, 'date.fullDate': -1 })
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
    
    console.log('Creating event:', body.title);
    
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
    
    // Validate date fields
    if (!body.date?.day || !body.date?.month) {
      return NextResponse.json(
        { 
          error: 'Date information incomplete',
          details: {
            day: !body.date?.day ? 'Day is required' : undefined,
            month: !body.date?.month ? 'Month is required' : undefined
          }
        },
        { status: 400 }
      );
    }
    
    // Create fullDate
    const year = body.date.year || new Date().getFullYear();
    body.date.fullDate = new Date(`${body.date.month} ${body.date.day}, ${year}`);
    
    const event = await Events.create(body);
    
    return NextResponse.json(event, { status: 201 });
  } catch (error: any) {
    console.error('POST Error:', error);
    
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
      { error: 'Failed to create', message: error.message },
      { status: 500 }
    );
  }
}