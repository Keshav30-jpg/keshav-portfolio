import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

const storage = vi.hoisted(() => ({ remove: vi.fn(), from: vi.fn() }));

vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => ({
    inputValidator(validator: (data: unknown) => unknown) {
      return { handler: (handler: (args: { data: unknown }) => unknown) =>
        (args: { data: unknown }) => handler({ data: validator(args.data) }) };
    },
    handler: (handler: unknown) => handler,
  }),
}));
vi.mock("@/integrations/supabase/client.server", () => ({
  supabaseAdmin: { storage: { from: storage.from } },
}));

import { resetSiteFile } from "@/lib/files.functions";

describe("document reset", () => {
  beforeEach(() => {
    vi.stubEnv("UPLOAD_PASSWORD", "test-only-password");
    storage.from.mockReset().mockReturnValue({ remove: storage.remove });
    storage.remove.mockReset().mockResolvedValue({ error: null });
  });
  afterEach(() => vi.unstubAllEnvs());

  it.each(["resume.pdf", "certificate.pdf"])("removes only the selected %s", async (slot) => {
    await resetSiteFile({ data: { password: "test-only-password", slot } });
    expect(storage.from).toHaveBeenCalledWith("site-files");
    expect(storage.remove).toHaveBeenCalledExactlyOnceWith([slot]);
  });

  it("rejects a wrong password without touching storage", async () => {
    await expect(resetSiteFile({ data: { password: "wrong", slot: "resume.pdf" } })).rejects.toThrow("Wrong password");
    expect(storage.from).not.toHaveBeenCalled();
  });

  it("rejects reset when no password is configured", async () => {
    vi.stubEnv("UPLOAD_PASSWORD", "");
    await expect(resetSiteFile({ data: { password: "", slot: "certificate.pdf" } })).rejects.toThrow("Wrong password");
    expect(storage.remove).not.toHaveBeenCalled();
  });

  it("rejects any file other than the two upload slots", () => {
    expect(() => resetSiteFile({ data: { password: "test-only-password", slot: "attendance.png" } })).toThrow("Invalid slot");
    expect(storage.remove).not.toHaveBeenCalled();
  });

  it("does not report success when storage deletion fails", async () => {
    storage.remove.mockResolvedValue({ error: { message: "Unavailable" } });
    await expect(resetSiteFile({ data: { password: "test-only-password", slot: "resume.pdf" } })).rejects.toThrow("Reset failed");
  });
});