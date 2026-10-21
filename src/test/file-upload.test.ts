import { afterEach, beforeEach, expect, it, vi } from "vitest";

const storage = vi.hoisted(() => ({ upload: vi.fn(), from: vi.fn() }));
vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => ({
    inputValidator: (validate: (data: unknown) => unknown) => ({
      handler: (handler: (args: { data: unknown }) => unknown) => (args: { data: unknown }) => handler({ data: validate(args.data) }),
    }),
    handler: (handler: unknown) => handler,
  }),
}));
vi.mock("@/integrations/supabase/client.server", () => ({ supabaseAdmin: { storage: { from: storage.from } } }));
import { uploadSiteFile } from "@/lib/files.functions";

const pdf = btoa("%PDF-1.7\nTest document\n%%EOF");
const input = { password: "test-password", slot: "resume.pdf", base64: pdf };
beforeEach(() => {
  vi.stubEnv("UPLOAD_PASSWORD", "test-password");
  storage.from.mockReset().mockReturnValue({ upload: storage.upload });
  storage.upload.mockReset().mockResolvedValue({ error: null });
});
afterEach(() => vi.unstubAllEnvs());
it.each(["resume.pdf", "certificate.pdf"])("uploads %s to its fixed private slot", async (slot) => {
  await uploadSiteFile({ data: { ...input, slot } });
  expect(storage.from).toHaveBeenCalledWith("site-files");
  expect(storage.upload).toHaveBeenCalledWith(slot, Uint8Array.from(atob(pdf), c => c.charCodeAt(0)), { contentType: "application/pdf", upsert: true });
});
it.each(["wrong", ""])("rejects an incorrect password before accessing storage", async (password) => {
  await expect(uploadSiteFile({ data: { ...input, password } })).rejects.toThrow("Wrong password");
  expect(storage.from).not.toHaveBeenCalled();
});
it("rejects uploads when no password is configured", async () => {
  vi.stubEnv("UPLOAD_PASSWORD", "");
  await expect(uploadSiteFile({ data: input })).rejects.toThrow("Wrong password");
  expect(storage.from).not.toHaveBeenCalled();
});
it("blocks unknown slots", () => {
  expect(() => uploadSiteFile({ data: { ...input, slot: "attendance.png" } })).toThrow("Invalid slot");
  expect(storage.from).not.toHaveBeenCalled();
});
it.each(["", "%%%", "AAAA=", "YW Jj"])("blocks malformed base64", (base64) => {
  expect(() => uploadSiteFile({ data: { ...input, base64 } })).toThrow("Invalid PDF data");
  expect(storage.from).not.toHaveBeenCalled();
});
it("blocks non-PDF bytes", async () => {
  await expect(uploadSiteFile({ data: { ...input, base64: btoa("not a PDF") } })).rejects.toThrow("Only PDF");
  expect(storage.from).not.toHaveBeenCalled();
});
it("enforces the 10 MB decoded limit", async () => {
  const bytes = "%PDF" + "a".repeat(10 * 1024 * 1024 - 3);
  await expect(uploadSiteFile({ data: { ...input, base64: btoa(bytes) } })).rejects.toThrow("File too large");
  expect(storage.from).not.toHaveBeenCalled();
});
it("does not claim success on a storage failure", async () => {
  storage.upload.mockResolvedValue({ error: { message: "private provider details" } });
  await expect(uploadSiteFile({ data: input })).rejects.toThrow("Upload failed. Please try again.");
});