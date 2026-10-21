export const FILE_SLOTS = ["resume.pdf", "certificate.pdf"] as const;
export type FileSlot = (typeof FILE_SLOTS)[number];
export const MAX_PDF_BYTES = 10 * 1024 * 1024;
export function isFileSlot(slot: unknown): slot is FileSlot {
  return slot === "resume.pdf" || slot === "certificate.pdf";
}