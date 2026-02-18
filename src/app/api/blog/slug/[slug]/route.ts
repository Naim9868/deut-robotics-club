// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import Blog from '@/lib/models/Blog';

// export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
//   try {
//     const { slug } = await params;
//     await connectDB();
//     const data = await Blog.findOne({ slug: slug, isActive: true });
//     if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
//   }
// }


// app/api/blog/slug/[slug]/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import Blog from '@/lib/models/Blog';

// export async function GET(
//   request: NextRequest,
//   { params }: { params: Promise<{ slug: string }> }
// ) {
//   try {
//     const { slug } = await params;
    
//     await connectDB();
    
//     // console.log('Fetching blog with slug:', slug);
    
//     // Try to find by slug first
//     let post = await Blog.findOne({ slug });
    
//     // If not found, try to find by title (for backward compatibility)
//     if (!post) {
//       const titleFromSlug = slug.split('-').map(word => 
//         word.charAt(0).toUpperCase() + word.slice(1)
//       ).join(' ');
      
//       post = await Blog.findOne({ title: titleFromSlug });
//     }
    
//     if (!post) {
//     //   console.log('Post not found for slug:', slug);
//       return NextResponse.json(
//         { error: 'Post not found' },
//         { status: 404 }
//       );
//     }

//     // Increment view count
//     post.views = (post.views || 0) + 1;
//     await post.save();

//     // console.log('Post found:', post.title);
//     return NextResponse.json(post);
    
//   } catch (error) {
//     console.error('Error fetching blog post:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch post' },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // console.log('API: Fetching blog with slug:', slug);
    
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

    // Increment view count (do this separately to avoid validation)
    try {
      await Blog.findByIdAndUpdate(post._id, { 
        $inc: { views: 1 } 
      });
    } catch (viewError) {
      console.error('Error incrementing views:', viewError);
      // Continue even if view increment fails
    }

    // console.log('Post found:', post.title);
    return NextResponse.json(post);
    
  } catch (error: any) {
    console.error('Error fetching blog post:', error);
    
    // Handle validation errors specially
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