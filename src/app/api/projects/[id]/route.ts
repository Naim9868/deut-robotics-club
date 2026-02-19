import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/lib/models/Project';
import { deleteImage } from '@/lib/utils/cloudinary';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const project = await Project.findById(id).lean();
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(project);
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
    
    console.log('Updating project:', id);
    
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
    
    const project = await Project.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(project);
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
          error: 'A project with this ID already exists',
          details: { id: 'Project ID must be unique' }
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

    const project = await Project.findById(id);
    if (project?.image?.publicId) {
      await deleteImage(project.image.publicId);
    }
    await Project.findByIdAndDelete(id);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Project deleted successfully' 
    });
  } catch (error: any) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete', message: error.message },
      { status: 500 }
    );
  }
}

