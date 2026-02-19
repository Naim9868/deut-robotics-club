import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Sponsor from '@/lib/models/Sponsor';

export async function GET() {
  try {
    await connectDB();
    const data = await Sponsor.find()
      .sort({ category: 1, order: 1, name: 1 })
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
    
    console.log('Creating sponsor:', body.name);
    
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
    
    // Ensure logo object exists
    if (!body.logo) {
      body.logo = { 
        url: `https://ui-avatars.com/api/?name=${encodeURIComponent(body.name)}&background=1e1e1e&color=e63946&size=200`,
        alt: body.name
      };
    }
    
    const sponsor = await Sponsor.create(body);
    
    return NextResponse.json(sponsor, { status: 201 });
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
    
    return NextResponse.json(
      { error: 'Failed to create', message: error.message },
      { status: 500 }
    );
  }
}