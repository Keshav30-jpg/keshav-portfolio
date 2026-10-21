import { createHash, timingSafeEqual } from "node:crypto";
import { MAX_PDF_BYTES, type FileSlot } from "./file-rules";

export function checkUploadPassword(input: string, expected: string | undefined) {
  if (!expected || !timingSafeEqual(createHash("sha256").update(input).digest(), createHash("sha256").update(expected).digest())) {
    throw new Error("Wrong password");
  }
}

export async function saveDocument(slot: FileSlot, bytes: Uint8Array) {
  if (bytes.byteLength > MAX_PDF_BYTES) throw new Error("File too large (max 10 MB)");
  if (String.fromCharCode(...bytes.slice(0, 4)) !== "%PDF") throw new Error("Only PDF files are allowed");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.storage.from("site-files")
    .upload(slot, bytes, { contentType: "application/pdf", upsert: true });
  if (error) throw new Error("Upload failed. Please try again.");
}

export async function removeDocument(slot: FileSlot) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.storage.from("site-files").remove([slot]);
  if (error) throw new Error("Reset failed. Please try again.");
}

export async function documentStatus() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.storage.from("site-files").list("", { limit: 20 });
  if (error) throw new Error("Document status unavailable");
  const names = new Set((data ?? []).map(f => f.name));
  return { resume: names.has("resume.pdf"), certificate: names.has("certificate.pdf") };
}