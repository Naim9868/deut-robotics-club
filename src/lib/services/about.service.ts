/**
 * About Service Layer
 * Singleton pattern — only one About document exists.
 * All item operations use native MongoDB operators for reliability.
 */

import mongoose from 'mongoose';
import About from '@/lib/models/About';

// ─── Constants ────────────────────────────────────────────────

const ITEM_SECTIONS = [
  'coreValues', 'objectives', 'journeyTimeline', 'achievements',
  'statistics', 'whyJoin', 'facultyAdvisors', 'facilities',
  'laboratories', 'sponsorsPartners', 'gallery', 'faqs',
] as const;

const ALL_SECTIONS = [
  'hero', 'introduction', 'story', 'mission', 'vision',
  ...ITEM_SECTIONS,
  'promotionalVideo', 'callToAction',
] as const;

// ─── Helpers ──────────────────────────────────────────────────

async function fetchRaw(): Promise<Record<string, unknown> | null> {
  return About.findOne({ _singleton: 'main' }).lean() as Promise<Record<string, unknown> | null>;
}

async function ensureDocument(): Promise<void> {
  const exists = await About.findOne({ _singleton: 'main' }).lean();
  if (!exists) {
    await About.create({ _singleton: 'main' });
  }
}

function isValidSection(key: string): boolean {
  return (ALL_SECTIONS as readonly string[]).includes(key);
}

function isValidItemSection(key: string): boolean {
  return (ITEM_SECTIONS as readonly string[]).includes(key);
}

// ─── Get ──────────────────────────────────────────────────────

export async function getAbout(): Promise<Record<string, unknown>> {
  await ensureDocument();
  const raw = await fetchRaw();
  return raw || {};
}

export async function getPublicAbout(): Promise<Record<string, unknown>> {
  const about = await getAbout();
  const result: Record<string, unknown> = {};

  for (const key of ALL_SECTIONS) {
    const section = about[key] as Record<string, unknown> | undefined;
    if (!section || !section.isEnabled) continue;

    if (Array.isArray(section.items)) {
      const publishedItems = section.items
        .filter((item: Record<string, unknown>) => item.isPublished !== false)
        .sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
          ((a.displayOrder as number) || 0) - ((b.displayOrder as number) || 0)
        );
      if (publishedItems.length === 0 && !section.content && !section.bannerImage) continue;
      result[key] = { ...section, items: publishedItems };
    } else {
      result[key] = section;
    }
  }

  return result;
}

// ─── Update Section Fields ────────────────────────────────────

/**
 * Flatten nested section data into dot-notation $set operations.
 * e.g. { coreValues: { isEnabled: true } } → { "coreValues.isEnabled": true }
 * This prevents replacing the entire section object and destroying saved data.
 */
function flattenForSet(data: Record<string, unknown>, prefix = ''): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      Object.assign(result, flattenForSet(value as Record<string, unknown>, path));
    } else {
      result[path] = value;
    }
  }
  return result;
}

export async function updateAbout(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  await ensureDocument();
  const filtered: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (ALL_SECTIONS.includes(key as typeof ALL_SECTIONS[number])) {
      filtered[key] = value;
    }
  }
  if (Object.keys(filtered).length > 0) {
    const flatUpdates = flattenForSet(filtered);
    await About.updateOne(
      { _singleton: 'main' },
      { $set: flatUpdates },
      { upsert: true }
    );
  }
  return (await fetchRaw()) || {};
}

export async function toggleSection(sectionKey: string, isEnabled: boolean): Promise<Record<string, unknown>> {
  if (!isValidSection(sectionKey)) throw new Error(`Invalid section key: ${sectionKey}`);
  await About.updateOne(
    { _singleton: 'main' },
    { $set: { [`${sectionKey}.isEnabled`]: isEnabled } },
    { upsert: true }
  );
  return (await fetchRaw()) || {};
}

export async function updateSectionContent(
  sectionKey: string,
  content: Record<string, unknown>
): Promise<Record<string, unknown>> {
  if (!isValidSection(sectionKey)) throw new Error(`Invalid section key: ${sectionKey}`);

  const updates: Record<string, unknown> = {};
  for (const [field, value] of Object.entries(content)) {
    if (field !== 'items' && field !== 'isEnabled' && field !== 'displayOrder') {
      updates[`${sectionKey}.${field}`] = value;
    }
  }

  if (Object.keys(updates).length > 0) {
    await About.updateOne(
      { _singleton: 'main' },
      { $set: updates },
      { upsert: true }
    );
  }
  return (await fetchRaw()) || {};
}

// ─── Item CRUD (native MongoDB operators) ─────────────────────

export async function addItem(
  sectionKey: string,
  item: Record<string, unknown>
): Promise<Record<string, unknown>> {
  if (!isValidItemSection(sectionKey)) throw new Error(`Section "${sectionKey}" does not support items.`);

  await ensureDocument();

  const newItem = {
    ...item,
    _id: new mongoose.Types.ObjectId(),
    displayOrder: item.displayOrder || 0,
    isPublished: item.isPublished !== false,
  };

  await About.updateOne(
    { _singleton: 'main' },
    { $push: { [`${sectionKey}.items`]: newItem } }
  );

  return (await fetchRaw()) || {};
}

export async function updateItem(
  sectionKey: string,
  itemId: string,
  updates: Record<string, unknown>
): Promise<Record<string, unknown>> {
  if (!isValidItemSection(sectionKey)) throw new Error(`Section "${sectionKey}" does not support items.`);

  const setOps: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(updates)) {
    if (key !== '_id') {
      setOps[`${sectionKey}.items.$.${key}`] = value;
    }
  }

  if (Object.keys(setOps).length > 0) {
    await About.updateOne(
      { _singleton: 'main', [`${sectionKey}.items._id`]: new mongoose.Types.ObjectId(itemId) },
      { $set: setOps }
    );
  }

  return (await fetchRaw()) || {};
}

export async function deleteItem(
  sectionKey: string,
  itemId: string
): Promise<Record<string, unknown>> {
  if (!isValidItemSection(sectionKey)) throw new Error(`Section "${sectionKey}" does not support items.`);

  await About.updateOne(
    { _singleton: 'main' },
    { $pull: { [`${sectionKey}.items`]: { _id: new mongoose.Types.ObjectId(itemId) } } }
  );

  return (await fetchRaw()) || {};
}

export async function reorderItems(
  sectionKey: string,
  orderedIds: string[]
): Promise<Record<string, unknown>> {
  if (!isValidItemSection(sectionKey)) throw new Error(`Section "${sectionKey}" does not support items.`);

  const about = await About.findOne({ _singleton: 'main' });
  if (!about) throw new Error('About document not found');

  const items = (about.get(`${sectionKey}.items`) as (Record<string, unknown> & { _id?: mongoose.Types.ObjectId })[]) || [];
  const reordered: Record<string, unknown>[] = [];

  for (let i = 0; i < orderedIds.length; i++) {
    const item = items.find(it => String(it._id) === orderedIds[i]);
    if (item) {
      reordered.push({ ...item, displayOrder: i + 1 });
    }
  }

  about.set(`${sectionKey}.items`, reordered);
  about.markModified(`${sectionKey}`);
  await about.save();

  return (await fetchRaw()) || {};
}

// ─── Stats ────────────────────────────────────────────────────

export async function getAboutStats(): Promise<Record<string, unknown>> {
  const about = await getAbout();
  const sections: Record<string, { isEnabled: boolean; itemCount: number }> = {};

  for (const key of ALL_SECTIONS) {
    const section = about[key] as Record<string, unknown> | undefined;
    if (section) {
      sections[key] = {
        isEnabled: section.isEnabled === true,
        itemCount: Array.isArray(section.items) ? section.items.length : 0,
      };
    }
  }

  const totalEnabled = Object.values(sections).filter(s => s.isEnabled).length;
  const totalItems = Object.values(sections).reduce((sum, s) => sum + s.itemCount, 0);

  return { sections, totalEnabled, totalItems, totalSections: ALL_SECTIONS.length };
}
