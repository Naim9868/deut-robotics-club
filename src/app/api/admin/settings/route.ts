import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { isAuthenticated } from '@/lib/utils/auth';
import SiteSettings from '@/lib/models/SiteSettings';

async function requireAdmin(req: NextRequest) {
  const authed = await isAuthenticated(req);
  if (!authed) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return null;
}

export async function GET(req: NextRequest) {
  await connectDB();
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error('[SiteSettings] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await connectDB();
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const body = await req.json();
    const { adminName, adminEmail, replySubjectTemplate, replyBodyTemplate } = body;

    if (!adminName || !adminName.trim()) {
      return NextResponse.json({ error: 'Admin name is required' }, { status: 400 });
    }
    if (!adminEmail || !adminEmail.trim()) {
      return NextResponse.json({ error: 'Admin email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminEmail.trim())) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({
        adminName: adminName.trim(),
        adminEmail: adminEmail.trim().toLowerCase(),
        replySubjectTemplate: replySubjectTemplate?.trim() || 'Re: {subject}',
        replyBodyTemplate: replyBodyTemplate || 'Hi {name},\n\n',
      });
    } else {
      settings.adminName = adminName.trim();
      settings.adminEmail = adminEmail.trim().toLowerCase();
      if (replySubjectTemplate !== undefined) settings.replySubjectTemplate = replySubjectTemplate.trim() || 'Re: {subject}';
      if (replyBodyTemplate !== undefined) settings.replyBodyTemplate = replyBodyTemplate || 'Hi {name},\n\n';
      await settings.save();
    }

    return NextResponse.json({ message: 'Settings updated successfully', data: settings });
  } catch (error) {
    console.error('[SiteSettings] PUT error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
