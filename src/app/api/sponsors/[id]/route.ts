import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Sponsor from '@/lib/models/Sponsor';
import { deleteImage } from '@/lib/utils/cloudinary';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const sponsor = await Sponsor.findById(id).lean();
    
    if (!sponsor) {
      return NextResponse.json(
        { error: 'Sponsor not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(sponsor);
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
    
    console.log('Updating sponsor:', id);
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: { name: 'Sponsor name is required' }
        },
        { status: 400 }
      );
    }
    
    // Validate category
    const validCategories = ['PLATINUM', 'GOLD', 'SILVER', 'PARTNER'];
    if (body.category && !validCategories.includes(body.category)) {
      return NextResponse.json(
        { 
          error: 'Invalid category',
          details: { category: 'Category must be PLATINUM, GOLD, SILVER, or PARTNER' }
        },
        { status: 400 }
      );
    }
    
    const sponsor = await Sponsor.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!sponsor) {
      return NextResponse.json(
        { error: 'Sponsor not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(sponsor);
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
    
    const sponsor = await Sponsor.findById(id);
    if (sponsor?.logo?.publicId) {
      await deleteImage(sponsor.logo.publicId);
    }
    await Sponsor.findByIdAndDelete(id);
    
    if (!sponsor) {
      return NextResponse.json(
        { error: 'Sponsor not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Sponsor deleted successfully' 
    });
  } catch (error: any) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete', message: error.message },
      { status: 500 }
    );
  }
}

