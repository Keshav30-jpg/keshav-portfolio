import { createServerFn } from "@tanstack/react-start";

const ALLOWED = ["resume.pdf", "certificate.pdf"] as const;
type Slot = (typeof ALLOWED)[number];

export const getFileStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.storage.from("site-files").list("", { limit: 20 });
  const names = new Set((data ?? []).map((f) => f.name));
  return { resume: names.has("resume.pdf"), certificate: names.has("certificate.pdf") };
});

export const uploadSiteFile = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string; slot: string; base64: string }) => {
    if (!ALLOWED.includes(d.slot as Slot)) throw new Error("Invalid slot");
    if (typeof d.base64 !== "string" || d.base64.length > 14_000_000) throw new Error("File too large (max 10 MB)");
    return d as { password: string; slot: Slot; base64: string };
  })
  .handler(async ({ data }) => {
    const expected = process.env["UPLOAD_PASSWORD"];
    if (!expected || data.password !== expected) throw new Error("Wrong password");
    const bin = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    if (String.fromCharCode(...bin.slice(0, 4)) !== "%PDF") throw new Error("Only PDF files are allowed");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.storage
      .from("site-files")
      .upload(data.slot, bin, { contentType: "application/pdf", upsert: true });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
