import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/lib/models/Project';

export async function GET() {
  try {
    await connectDB();
    const data = await Project.find()
      .sort({ featured: -1, order: 1, title: 1 })
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
    
    console.log('Creating project:', body.title);
    
    // Validate required fields
    const requiredFields = ['id', 'title', 'tag', 'category'];
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
    
    // Validate category
    const validCategories = ['COMBAT', 'AI', 'AERO', 'AUTO'];
    if (body.category && !validCategories.includes(body.category)) {
      return NextResponse.json(
        { 
          error: 'Invalid category',
          details: { category: 'Category must be COMBAT, AI, AERO, or AUTO' }
        },
        { status: 400 }
      );
    }
    
    // Validate status
    const validStatuses = ['ACTIVE', 'TESTING', 'MAINTENANCE', 'UNKNOWN'];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { 
          error: 'Invalid status',
          details: { status: 'Status must be ACTIVE, TESTING, MAINTENANCE, or UNKNOWN' }
        },
        { status: 400 }
      );
    }
    
    // Ensure image object exists
    if (!body.image) {
      body.image = { 
        url: `https://ui-avatars.com/api/?name=${encodeURIComponent(body.title)}&background=1e1e1e&color=e63946&size=200`,
        alt: body.title
      };
    }
    
    const project = await Project.create(body);
    
    return NextResponse.json(project, { status: 201 });
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
          error: 'A project with this ID already exists',
          details: { id: 'Project ID must be unique' }
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