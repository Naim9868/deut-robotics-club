/**
 * MembershipSettings Controller Layer
 * Handles HTTP request/response mapping for membership settings endpoints.
 * Delegates business logic to the Service layer.
 */

import { NextRequest, NextResponse } from 'next/server';
import * as membershipSettingsService from '@/lib/services/membership-settings.service';
import { updateMembershipSettingsSchema } from '@/lib/validations/membership';

/** Helper: format ZodError into a user-friendly error response */
function zodErrorResponse(error: import('zod').ZodError) {
  const details: Record<string, string> = {};
  error.issues.forEach((issue) => {
    const field = issue.path.join('.');
    details[field] = issue.message;
  });
  return NextResponse.json(
    { error: 'Validation failed', details },
    { status: 400 }
  );
}

// ═══════════════════════════════════════════════════════════════════
// ADMIN ENDPOINTS
// ═══════════════════════════════════════════════════════════════════

/**
 * Get membership settings.
 */
export async function handleGetSettings() {
  try {
    const settings = await membershipSettingsService.getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('[MembershipSettings] Get error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

/**
 * Update membership settings.
 */
export async function handleUpdateSettings(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = updateMembershipSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const settings = await membershipSettingsService.updateSettings(parsed.data);
    return NextResponse.json({
      message: 'Settings updated successfully',
      data: settings,
    });
  } catch (error) {
    console.error('[MembershipSettings] Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
