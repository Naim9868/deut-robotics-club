import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';

export async function GET() {
  try {
    await connectDB();
    const data = await Blog.find().sort({ createdAt: -1 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const body = await req.json();
    
//     // Generate slug if not provided
//     if (!body.slug) {
//       body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
//     }
    
//     const data = await Blog.create(body);
//     return NextResponse.json(data, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
//   }
// }


export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    
    console.log('Creating blog post:', body.title);
    
    // Validate required fields
    if (!body.content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }
    
    // Ensure dates are proper Date objects
    const postData = {
      ...body,
      date: body.date ? new Date(body.date) : new Date(),
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      // Auto-truncate metaTitle if needed
      metaTitle: body.metaTitle ? 
        (body.metaTitle.length > 60 ? body.metaTitle.substring(0, 57) + '...' : body.metaTitle) 
        : (body.title ? body.title.substring(0, 57) + '...' : ''),
      // Auto-truncate metaDescription if needed
      metaDescription: body.metaDescription ? 
        (body.metaDescription.length > 160 ? body.metaDescription.substring(0, 157) + '...' : body.metaDescription)
        : (body.excerpt ? body.excerpt.substring(0, 157) + '...' : ''),
    };
    
    const blog = await Blog.create(postData);
    
    return NextResponse.json(blog, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    
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
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'A blog post with this slug already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create blog post', message: error.message },
      { status: 500 }
    );
  }
}