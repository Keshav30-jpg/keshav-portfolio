/** Only ordinary web and email destinations may be opened from a PDF. */
export function safePdfLink(url: unknown): string | undefined {
  if (typeof url !== "string") return;
  try {
    const parsed = new URL(url);
    if (["https:", "http:", "mailto:"].includes(parsed.protocol)) return parsed.href;
  } catch { /* Missing or invalid PDF destination. */ }
}

export function pdfLinkBounds(rect: number[], width: number, height: number) {
  const [x1, y1, x2, y2] = rect;
  if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined || width <= 0 || height <= 0) return;
  return {
    left: `${Math.min(x1, x2) * 100 / width}%`,
    top: `${Math.min(y1, y2) * 100 / height}%`,
    width: `${Math.abs(x2 - x1) * 100 / width}%`,
    height: `${Math.abs(y2 - y1) * 100 / height}%`,
  };
}