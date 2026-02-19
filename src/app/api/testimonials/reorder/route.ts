import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Testimonial from '@/lib/models/Testimonial';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { updates } = await req.json();
    
    // Perform bulk write operations
    const bulkOps = updates.map((update: any) => ({
      updateOne: {
        filter: { _id: update.updateOne.filter._id },
        update: update.updateOne.update
      }
    }));
    
    await Testimonial.bulkWrite(bulkOps);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Reorder Error:', error);
    return NextResponse.json(
      { error: 'Failed to reorder', message: error.message },
      { status: 500 }
    );
  }
}