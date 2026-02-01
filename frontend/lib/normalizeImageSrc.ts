export function normalizeImageSrc(src: string | null | undefined): string {
  const s = String(src ?? '').trim();
  if (!s) return '';

  // Already a valid URL-ish src for next/image
  if (s.startsWith('data:') || s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/')) return s;

  // Heuristic: raw base64 (common when admin pastes directly without data: prefix)
  // Keep strict enough to avoid rewriting normal text.
  const looksBase64 = s.length >= 128 && /^[A-Za-z0-9+/]+=*$/.test(s);
  if (!looksBase64) return s;

  // Guess mime from magic header
  const mime =
    s.startsWith('iVBOR') ? 'image/png' : s.startsWith('/9j/') || s.startsWith('2wCE') ? 'image/jpeg' : 'image/jpeg';

  return `data:${mime};base64,${s}`;
}

