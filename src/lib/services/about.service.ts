/**
 * About Service Layer
 * Singleton pattern — only one About document exists.
 * All operations get/update the single document.
 */

import About from '@/lib/models/About';
import type { IAbout } from '@/lib/types/about';

// ─── Section Key Constants ────────────────────────────────────

const SECTION_KEYS = [
  'hero', 'introduction', 'story', 'mission', 'vision',
  'coreValues', 'objectives', 'journeyTimeline', 'achievements',
  'statistics', 'whyJoin', 'facultyAdvisors', 'facilities',
  'laboratories', 'sponsorsPartners', 'gallery', 'promotionalVideo',
  'faqs', 'callToAction',
] as const;

// ─── Helpers ──────────────────────────────────────────────────

/**
 * Get or create the singleton document.
 * Handles stale/mismatched docs from old schemas by deleting and recreating.
 */
async function getOrCreate(): Promise<IAbout> {
  try {
    let about = await About.findOne({ _singleton: 'main' }).lean();
    if (!about) {
      const doc = await About.create({ _singleton: 'main' });
      about = doc.toObject();
    }
    return about as unknown as IAbout;
  } catch {
    // Old document may not match new schema — delete and recreate
    await About.deleteOne({ _singleton: 'main' });
    const doc = await About.create({ _singleton: 'main' });
    return doc.toObject() as unknown as IAbout;
  }
}

/**
 * Save without upsert (avoids immutable _singleton error).
 */
async function saveSingleton(updates: Record<string, unknown>): Promise<IAbout> {
  const about = await About.findOne({ _singleton: 'main' });
  if (!about) {
    const doc = await About.create({ _singleton: 'main', ...updates });
    return doc.toObject() as unknown as IAbout;
  }
  Object.assign(about, updates);
  await about.save();
  return about.toObject() as unknown as IAbout;
}

// ─── Get Singleton Document ───────────────────────────────────

/**
 * Get the single About document.
 * Creates one with defaults if none exists.
 */
export async function getAbout(): Promise<IAbout> {
  return getOrCreate();
}

/**
 * Get the About document for public display.
 * Returns only enabled sections with published items.
 */
export async function getPublicAbout(): Promise<Record<string, unknown>> {
  const about = await getAbout();
  const result: Record<string, unknown> = {};

  for (const key of SECTION_KEYS) {
    const section = about[key as keyof IAbout] as unknown as Record<string, unknown>;
    if (!section || !section.isEnabled) continue;

    // For sections with items, filter to published only
    if (Array.isArray(section.items)) {
      const publishedItems = section.items
        .filter((item: Record<string, unknown>) => item.isPublished !== false)
        .sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
          ((a.displayOrder as number) || 0) - ((b.displayOrder as number) || 0)
        );

      // Skip empty sections
      if (publishedItems.length === 0 && !section.content && !section.bannerImage) continue;

      result[key] = { ...section, items: publishedItems };
    } else {
      result[key] = section;
    }
  }

  return result;
}

// ─── Update Entire About Document ─────────────────────────────

/**
 * Update the About document with partial data.
 * Merges incoming data with existing document.
 */
export async function updateAbout(data: Record<string, unknown>): Promise<IAbout> {
  return saveSingleton(data);
}

// ─── Section Toggle ───────────────────────────────────────────

/**
 * Toggle a section's isEnabled status.
 */
export async function toggleSection(
  sectionKey: string,
  isEnabled: boolean
): Promise<IAbout> {
  if (!SECTION_KEYS.includes(sectionKey as typeof SECTION_KEYS[number])) {
    throw new Error(`Invalid section key: ${sectionKey}`);
  }

  return saveSingleton({ [`${sectionKey}.isEnabled`]: isEnabled });
}

/**
 * Update a section's displayOrder.
 */
export async function reorderSection(
  sectionKey: string,
  displayOrder: number
): Promise<IAbout> {
  if (!SECTION_KEYS.includes(sectionKey as typeof SECTION_KEYS[number])) {
    throw new Error(`Invalid section key: ${sectionKey}`);
  }

  return saveSingleton({ [`${sectionKey}.displayOrder`]: displayOrder });
}

/**
 * Update a section's content (non-item fields).
 */
export async function updateSectionContent(
  sectionKey: string,
  content: Record<string, unknown>
): Promise<IAbout> {
  if (!SECTION_KEYS.includes(sectionKey as typeof SECTION_KEYS[number])) {
    throw new Error(`Invalid section key: ${sectionKey}`);
  }

  const updates: Record<string, unknown> = {};
  for (const [field, value] of Object.entries(content)) {
    if (field !== 'items' && field !== 'isEnabled' && field !== 'displayOrder') {
      updates[`${sectionKey}.${field}`] = value;
    }
  }

  return saveSingleton(updates);
}

// ─── Item Management (Sections with items[]) ──────────────────

const ITEM_SECTIONS = [
  'coreValues', 'objectives', 'journeyTimeline', 'achievements',
  'statistics', 'whyJoin', 'facultyAdvisors', 'facilities',
  'laboratories', 'sponsorsPartners', 'gallery', 'faqs',
] as const;

function isValidItemSection(key: string): boolean {
  return (ITEM_SECTIONS as readonly string[]).includes(key);
}

/**
 * Add an item to a section's items array.
 */
export async function addItem(
  sectionKey: string,
  item: Record<string, unknown>
): Promise<IAbout> {
  if (!isValidItemSection(sectionKey)) {
    throw new Error(`Section "${sectionKey}" does not support items.`);
  }

  const about = await About.findOne({ _singleton: 'main' });
  if (!about) throw new Error('About document not found');

  const section = about.get(sectionKey) as Record<string, unknown> | null;
  if (!section) throw new Error(`Section "${sectionKey}" not found`);

  const items = (section.items as Record<string, unknown>[]) || [];
  const maxOrder = items.reduce((max, i) => Math.max(max, (i.displayOrder as number) || 0), 0);
  items.push({ ...item, displayOrder: (item.displayOrder as number) || maxOrder + 1 });

  about.set(`${sectionKey}.items`, items);
  await about.save();
  return about.toObject() as unknown as IAbout;
}

/**
 * Update an item within a section's items array.
 */
export async function updateItem(
  sectionKey: string,
  itemId: string,
  updates: Record<string, unknown>
): Promise<IAbout> {
  if (!isValidItemSection(sectionKey)) {
    throw new Error(`Section "${sectionKey}" does not support items.`);
  }

  const about = await About.findOne({ _singleton: 'main' });
  if (!about) throw new Error('About document not found');

  const section = about.get(sectionKey) as Record<string, unknown> | null;
  if (!section) throw new Error(`Section "${sectionKey}" not found`);

  const items = (section.items as (Record<string, unknown> & { _id?: string })[]) || [];
  const idx = items.findIndex(i => String(i._id) === itemId);
  if (idx === -1) throw new Error(`Item not found in "${sectionKey}"`);

  items[idx] = { ...items[idx], ...updates };
  about.set(`${sectionKey}.items`, items);
  await about.save();
  return about.toObject() as unknown as IAbout;
}

/**
 * Delete an item from a section's items array.
 */
export async function deleteItem(
  sectionKey: string,
  itemId: string
): Promise<IAbout> {
  if (!isValidItemSection(sectionKey)) {
    throw new Error(`Section "${sectionKey}" does not support items.`);
  }

  const about = await About.findOne({ _singleton: 'main' });
  if (!about) throw new Error('About document not found');

  const section = about.get(sectionKey) as Record<string, unknown> | null;
  if (!section) throw new Error(`Section "${sectionKey}" not found`);

  const items = (section.items as (Record<string, unknown> & { _id?: string })[]) || [];
  const filtered = items.filter(i => String(i._id) !== itemId);
  if (filtered.length === items.length) throw new Error(`Item not found in "${sectionKey}"`);

  about.set(`${sectionKey}.items`, filtered);
  await about.save();
  return about.toObject() as unknown as IAbout;
}

/**
 * Reorder items within a section.
 */
export async function reorderItems(
  sectionKey: string,
  orderedIds: string[]
): Promise<IAbout> {
  if (!isValidItemSection(sectionKey)) {
    throw new Error(`Section "${sectionKey}" does not support items.`);
  }

  const about = await About.findOne({ _singleton: 'main' });
  if (!about) throw new Error('About document not found');

  const section = about.get(sectionKey) as Record<string, unknown> | null;
  if (!section) throw new Error(`Section "${sectionKey}" not found`);

  const items = (section.items as (Record<string, unknown> & { _id?: string })[]) || [];
  const reordered: Record<string, unknown>[] = [];

  for (let i = 0; i < orderedIds.length; i++) {
    const item = items.find(it => String(it._id) === orderedIds[i]);
    if (item) {
      reordered.push({ ...item, displayOrder: i + 1 });
    }
  }

  about.set(`${sectionKey}.items`, reordered);
  await about.save();
  return about.toObject() as unknown as IAbout;
}

// ─── Stats ────────────────────────────────────────────────────

/**
 * Get statistics about the About document.
 */
export async function getAboutStats(): Promise<Record<string, unknown>> {
  const about = await getAbout();
  const sections: Record<string, { isEnabled: boolean; itemCount: number }> = {};

  for (const key of SECTION_KEYS) {
    const section = about[key as keyof IAbout] as unknown as Record<string, unknown> | null;
    if (section) {
      sections[key] = {
        isEnabled: section.isEnabled === true,
        itemCount: Array.isArray(section.items) ? section.items.length : 0,
      };
    }
  }

  const totalEnabled = Object.values(sections).filter(s => s.isEnabled).length;
  const totalItems = Object.values(sections).reduce((sum, s) => sum + s.itemCount, 0);

  return { sections, totalEnabled, totalItems, totalSections: SECTION_KEYS.length };
}
