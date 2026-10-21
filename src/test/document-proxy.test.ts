// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
vi.mock("@tanstack/react-router", () => ({ createFileRoute: () => (options: unknown) => options }));
import { Route } from "@/routes/api/public/files.$name";
const get = (Route as unknown as { server: { handlers: { GET: (args: { request: Request; params: { name: string } }) => Promise<Response> } } }).server.handlers.GET;
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
it("serves unchanged shared PDF bytes on Vercel without an administrative key", async () => {
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
  const bytes = new TextEncoder().encode("%PDF-1.7\nunchanged link annotations\n%%EOF");
  const fetcher = vi.fn().mockResolvedValue(new Response(bytes, { headers: { "Content-Type": "application/pdf", "Content-Disposition": "attachment; filename=Keshav_S_Resume.pdf" } }));
  vi.stubGlobal("fetch", fetcher);
  const response = await get({ request: new Request("https://keshav-portfolio-amber.vercel.app/api/public/files/resume.pdf?download=1"), params: { name: "resume.pdf" } });
  expect(new Uint8Array(await response.arrayBuffer())).toEqual(bytes);
  expect(String(fetcher.mock.calls[0]?.[0])).toBe("https://keshavs-portfolio.lovable.app/api/public/files/resume.pdf?download=1");
  expect(response.headers.get("Content-Disposition")).toContain("attachment");
});
it("does not proxy unknown files", async () => {
  const fetcher = vi.fn(); vi.stubGlobal("fetch", fetcher);
  expect((await get({ request: new Request("https://keshav-portfolio-amber.vercel.app/api/public/files/private.pdf"), params: { name: "private.pdf" } })).status).toBe(404);
  expect(fetcher).not.toHaveBeenCalled();
});