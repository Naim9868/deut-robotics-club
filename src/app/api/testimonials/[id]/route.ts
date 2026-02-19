import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Testimonial from '@/lib/models/Testimonial';
import { deleteImage } from '@/lib/utils/cloudinary';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const testimonial = await Testimonial.findById(id).lean();
    
    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(testimonial);
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
    
    console.log('Updating testimonial:', id);
    
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
    
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(testimonial);
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
    
    const testimonial = await Testimonial.findById(id);
    if (testimonial?.avatar?.publicId) {
      await deleteImage(testimonial.avatar.publicId);
    }
    await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }
    
    // Note: Image deletion from Cloudinary would need to be handled separately
    
    return NextResponse.json({ 
      success: true,
      message: 'Testimonial deleted successfully' 
    });
  } catch (error: any) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete', message: error.message },
      { status: 500 }
    );
  }
}

// export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const { id } = await params;
//     await connectDB();
//     const testimonial = await Testimonial.findById(id);
//     if (testimonial?.avatar?.publicId) {
//       await deleteImage(testimonial.avatar.publicId);
//     }
//     await Testimonial.findByIdAndDelete(id);
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
//   }
// }