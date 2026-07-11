import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SectionVisibility from '@/lib/models/SectionVisibility';

const DEFAULT_SECTIONS = {
  hero: true,
  about: true,
  events: true,
  stats: true,
  focusAreas: true,
  research: true,
  blog: true,
  projects: true,
  gallery: true,
  timeline: true,
  committee: true,
  testimonials: true,
  faq: true,
  sponsors: true,
  footer: true,
};

export async function GET() {
  try {
    await connectDB();
    let data = await SectionVisibility.findOne();
    if (!data) {
      data = await SectionVisibility.create({ sections: DEFAULT_SECTIONS });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    let data = await SectionVisibility.findOne();
    if (!data) {
      data = await SectionVisibility.create({ sections: body.sections });
    } else {
      data.sections = body.sections;
      await data.save();
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
