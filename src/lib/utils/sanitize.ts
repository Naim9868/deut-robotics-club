/**
 * Input Sanitization Utilities
 * Lightweight XSS protection for user-supplied strings.
 * Strips HTML tags and dangerous characters before storage.
 */

/** Characters that are dangerous in HTML/JS contexts */
const DANGEROUS_CHARS = /[<>"'`]/g;

/**
 * Sanitize a plain-text string by stripping HTML tags and escaping
 * characters that could be used for XSS.
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    .replace(/<[^>]*>/g, '')   // Strip HTML tags
    .replace(DANGEROUS_CHARS, '') // Remove dangerous characters
    .trim();
}

/**
 * Sanitize an object's string values recursively.
 * Useful for sanitizing entire request bodies before processing.
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };

  for (const key of Object.keys(sanitized)) {
    const value = sanitized[key];
    if (typeof value === 'string') {
      (sanitized as Record<string, unknown>)[key] = sanitizeString(value);
    }
  }

  return sanitized;
}
