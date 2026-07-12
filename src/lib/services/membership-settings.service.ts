/**
 * MembershipSettings Service Layer
 * Contains all business logic for membership settings operations.
 * Singleton pattern — only one settings document exists.
 */

import MembershipSettings from '@/lib/models/MembershipSettings';
import type { IMembershipSettings } from '@/lib/types/membership';

const DEFAULT_SETTINGS = {
  registrationOpen: false,
  registrationFee: 500,
  paymentMethods: [
    { name: 'bKash', enabled: true, details: 'Send to: 01XXXXXXXXX' },
    { name: 'Nagad', enabled: true, details: 'Send to: 01XXXXXXXXX' },
    { name: 'Rocket', enabled: false, details: '' },
    { name: 'Bank Transfer', enabled: false, details: '' },
  ],
  registrationInstructions: 'Complete your registration by submitting the form and making the payment.',
  maxMembers: 100,
  membershipDurationMonths: 12,
};

/**
 * Get or create the singleton settings document.
 */
async function getOrCreateSettings() {
  let settings = await MembershipSettings.findOne();
  if (!settings) {
    settings = await MembershipSettings.create(DEFAULT_SETTINGS);
  }
  return settings;
}

// ─── Read ──────────────────────────────────────────────────────

/**
 * Get the singleton settings document.
 * Creates default settings if none exist.
 */
export async function getSettings(): Promise<IMembershipSettings> {
  const settings = await getOrCreateSettings();
  return settings.toObject() as IMembershipSettings;
}

/**
 * Check if registration is currently open.
 */
export async function isRegistrationOpen(): Promise<boolean> {
  const settings = await getOrCreateSettings();
  return settings.registrationOpen;
}

// ─── Update ────────────────────────────────────────────────────

/**
 * Update membership settings.
 * Only updates fields that are provided.
 */
export async function updateSettings(
  data: Partial<{
    registrationOpen: boolean;
    registrationFee: number;
    paymentMethods: { name: string; enabled: boolean; details: string }[];
    registrationInstructions: string;
    maxMembers: number;
    membershipDurationMonths: number;
  }>
): Promise<IMembershipSettings> {
  const settings = await getOrCreateSettings();

  if (data.registrationOpen !== undefined) {
    settings.registrationOpen = data.registrationOpen;
  }
  if (data.registrationFee !== undefined) {
    settings.registrationFee = data.registrationFee;
  }
  if (data.paymentMethods !== undefined) {
    settings.paymentMethods = data.paymentMethods;
  }
  if (data.registrationInstructions !== undefined) {
    settings.registrationInstructions = data.registrationInstructions;
  }
  if (data.maxMembers !== undefined) {
    settings.maxMembers = data.maxMembers;
  }
  if (data.membershipDurationMonths !== undefined) {
    settings.membershipDurationMonths = data.membershipDurationMonths;
  }

  await settings.save();
  return settings.toObject() as IMembershipSettings;
}
