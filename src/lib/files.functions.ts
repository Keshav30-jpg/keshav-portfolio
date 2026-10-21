import { createServerFn } from "@tanstack/react-start";
import { createHash, timingSafeEqual } from "node:crypto";

const ALLOWED = ["resume.pdf", "certificate.pdf"] as const;
type Slot = (typeof ALLOWED)[number];
const MAX_BYTES = 10 * 1024 * 1024;

function passwordMatches(input: string, expected: string) {
  return timingSafeEqual(createHash("sha256").update(input).digest(), createHash("sha256").update(expected).digest());
}

export const getFileStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.storage.from("site-files").list("", { limit: 20 });
  const names = new Set((data ?? []).map((f) => f.name));
  return { resume: names.has("resume.pdf"), certificate: names.has("certificate.pdf") };
});

export const uploadSiteFile = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string; slot: string; base64: string }) => {
    if (!d || !ALLOWED.includes(d.slot as Slot)) throw new Error("Invalid slot");
    if (typeof d.password !== "string") throw new Error("Wrong password");
    if (typeof d.base64 !== "string") throw new Error("Invalid PDF data");
    if (d.base64.length > Math.ceil(MAX_BYTES / 3) * 4) throw new Error("File too large (max 10 MB)");
    if (!d.base64.length || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(d.base64)) throw new Error("Invalid PDF data");
    return d as { password: string; slot: Slot; base64: string };
  })
  .handler(async ({ data }) => {
    const expected = process.env["UPLOAD_PASSWORD"];
    if (!expected || !passwordMatches(data.password, expected)) throw new Error("Wrong password");
    const bin = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    if (bin.byteLength > MAX_BYTES) throw new Error("File too large (max 10 MB)");
    if (String.fromCharCode(...bin.slice(0, 4)) !== "%PDF") throw new Error("Only PDF files are allowed");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.storage
      .from("site-files")
      .upload(data.slot, bin, { contentType: "application/pdf", upsert: true });
    if (error) throw new Error("Upload failed. Please try again.");
    return { ok: true };
  });

export const resetSiteFile = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string; slot: string }) => {
    if (!d || !ALLOWED.includes(d.slot as Slot)) throw new Error("Invalid slot");
    if (typeof d.password !== "string") throw new Error("Wrong password");
    return { password: d.password, slot: d.slot as Slot };
  })
  .handler(async ({ data }) => {
    const expected = process.env["UPLOAD_PASSWORD"];
    if (!expected || !passwordMatches(data.password, expected)) throw new Error("Wrong password");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.storage.from("site-files").remove([data.slot]);
    if (error) throw new Error("Reset failed. Please try again.");
    return { ok: true };
  });
