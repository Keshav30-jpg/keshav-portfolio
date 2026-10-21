// @vitest-environment node
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { documentServiceFor, DOCUMENT_SERVICE_ORIGIN } from "@/lib/document-service";
const storage = vi.hoisted(() => ({ upload: vi.fn(), remove: vi.fn(), from: vi.fn(), list: vi.fn() }));
vi.mock("@tanstack/react-router", () => ({ createFileRoute: () => (options: unknown) => options }));
vi.mock("@/integrations/supabase/client.server", () => ({ supabaseAdmin: { storage: { from: storage.from } } }));
import { Route } from "@/routes/api/public/document-service";
const handlers = (Route as unknown as { server: { handlers: {
  POST: (args: { request: Request }) => Promise<Response>;
  GET: (args: { request: Request }) => Promise<Response>;
  OPTIONS: (args: { request: Request }) => Response;
} } }).server.handlers;

beforeEach(() => {
  vi.stubEnv("UPLOAD_PASSWORD", "test-password");
  storage.from.mockReset().mockReturnValue(storage);
  storage.upload.mockReset().mockResolvedValue({ error: null });
  storage.remove.mockReset().mockResolvedValue({ error: null });
  storage.list.mockReset().mockResolvedValue({ data: [{ name: "certificate.pdf" }], error: null });
});
afterEach(() => vi.unstubAllEnvs());

function request(action = "upload", password = "test-password", slot = "resume.pdf", contents = "%PDF-1.7\nTest\n%%EOF", origin = "https://keshav-portfolio-amber.vercel.app") {
  const body = new FormData();
  body.set("action", action); body.set("password", password); body.set("slot", slot);
  body.set("file", new File([contents], "document.pdf", { type: "application/pdf" }));
  return new Request("http://localhost:8080/api/public/document-service", { method: "POST", body, headers: { Origin: origin } });
}
it("sends Vercel uploads to the shared Lovable service", () => {
  expect(documentServiceFor("https://keshav-portfolio-amber.vercel.app")).toBe(DOCUMENT_SERVICE_ORIGIN);
  expect(documentServiceFor(DOCUMENT_SERVICE_ORIGIN)).toBe("");
});
it.each(["resume.pdf", "certificate.pdf"])("accepts password-protected multipart uploads for %s", async slot => {
  const response = await handlers.POST({ request: request("upload", "test-password", slot) });
  expect(response.status).toBe(200);
  expect(response.headers.get("Access-Control-Allow-Origin")).toBe("https://keshav-portfolio-amber.vercel.app");
  expect(storage.upload).toHaveBeenCalledWith(slot, expect.any(Uint8Array), { contentType: "application/pdf", upsert: true });
});
it("blocks incorrect passwords before storage access", async () => {
  const response = await handlers.POST({ request: request("upload", "wrong") });
  expect(response.status).toBe(401); expect(storage.from).not.toHaveBeenCalled();
});
it("blocks reset without the password", async () => {
  const response = await handlers.POST({ request: request("reset", "wrong") });
  expect(response.status).toBe(401); expect(storage.remove).not.toHaveBeenCalled();
});
it.each(["resume.pdf", "certificate.pdf"])("resets only %s", async slot => {
  expect((await handlers.POST({ request: request("reset", "test-password", slot) })).status).toBe(200);
  expect(storage.remove).toHaveBeenCalledExactlyOnceWith([slot]);
});
it("rejects an unapproved website", async () => {
  expect((await handlers.POST({ request: request("upload", "test-password", "resume.pdf", "%PDF", "https://untrusted.example") })).status).toBe(403);
  expect(storage.from).not.toHaveBeenCalled();
});
it("does not expose other storage slots", async () => {
  expect((await handlers.POST({ request: request("upload", "test-password", "attendance.png") })).status).toBe(400);
  expect(storage.from).not.toHaveBeenCalled();
});
it("rejects non-PDF contents", async () => {
  expect((await handlers.POST({ request: request("upload", "test-password", "resume.pdf", "not a PDF") })).status).toBe(400);
  expect(storage.upload).not.toHaveBeenCalled();
});
it("enforces the 10 MB file limit", async () => {
  expect((await handlers.POST({ request: request("upload", "test-password", "resume.pdf", "%PDF" + "a".repeat(10 * 1024 * 1024)) })).status).toBe(400);
  expect(storage.upload).not.toHaveBeenCalled();
});
it("reports shared completion certificate availability", async () => {
  const response = await handlers.GET({ request: new Request("http://localhost:8080/api/public/document-service") });
  expect(await response.json()).toEqual({ resume: false, certificate: true });
});
it("sanitizes storage failures", async () => {
  storage.upload.mockRejectedValue(new Error("private provider details"));
  const response = await handlers.POST({ request: request() });
  expect(await response.json()).toEqual({ error: "Document update failed. Please try again." });
});