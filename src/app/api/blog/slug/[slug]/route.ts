import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    await connectDB();
    
    // Try to find by slug first
    let post = await Blog.findOne({ slug }).lean();
    
    // If not found, try to find by title (for backward compatibility)
    if (!post) {
      const titleFromSlug = slug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      console.log('Trying title lookup:', titleFromSlug);
      post = await Blog.findOne({ title: titleFromSlug }).lean();
    }
    
    if (!post) {
      console.log('Post not found for slug:', slug);
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // // Increment view count
    // try {
    //   await Blog.findByIdAndUpdate(post._id, { 
    //     $inc: { views: 1 } 
    //   });
    //   // Update the local post object with new view count
    //   post.views = (post.views || 0) + 1;
    // } catch (viewError) {
    //   console.error('Error incrementing views:', viewError);
    // }

    return NextResponse.json(post);
    
  } catch (error: any) {
    console.error('Error fetching blog post:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          error: 'Blog post exists but has validation issues',
          details: error.errors 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { action } = await request.json();
    
    await connectDB();
    
    // Find the post first
    let post = await Blog.findOne({ slug });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Handle different actions
    if (action === 'like') {
      post.likes = (post.likes || 0) + 1;
      await post.save();
      
      return NextResponse.json({ 
        success: true, 
        likes: post.likes 
      });
    }
    
    if (action === 'unlike') {
      post.likes = Math.max((post.likes || 0) - 1, 0);
      await post.save();
      
      return NextResponse.json({ 
        success: true, 
        likes: post.likes 
      });
    }

    if (action === 'view') {
      post.views = (post.views || 0) + 1;
      await post.save();
      
      return NextResponse.json({ 
        success: true, 
        views: post.views 
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
    
  } catch (error: any) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}