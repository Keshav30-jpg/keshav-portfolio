import { createFileRoute } from "@tanstack/react-router";
import { DOCUMENT_ORIGINS } from "@/lib/document-service";
import { isFileSlot, MAX_PDF_BYTES } from "@/lib/file-rules";

function cors(request: Request) {
  const origin = request.headers.get("Origin");
  const headers = new Headers({ "Cache-Control": "no-store", Vary: "Origin" });
  if (origin && DOCUMENT_ORIGINS.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
  }
  return headers;
}

export const Route = createFileRoute("/api/public/document-service")({
  server: { handlers: {
    OPTIONS: ({ request }) => new Response(null, { status: 204, headers: cors(request) }),
    GET: async ({ request }) => {
      const headers = cors(request);
      try {
        const { documentStatus } = await import("@/lib/files.server");
        return Response.json(await documentStatus(), { headers });
      } catch {
        return Response.json({ error: "Document service unavailable. Please try again." }, { status: 503, headers });
      }
    },
    POST: async ({ request }) => {
      const headers = cors(request);
      const origin = request.headers.get("Origin");
      if (origin && !DOCUMENT_ORIGINS.includes(origin)) {
        return Response.json({ error: "Website not permitted" }, { status: 403, headers });
      }
      const length = Number(request.headers.get("Content-Length"));
      if (length > MAX_PDF_BYTES + 64 * 1024) {
        return Response.json({ error: "File too large (max 10 MB)" }, { status: 413, headers });
      }
      try {
        const body = await request.formData();
        const password = body.get("password");
        const slot = body.get("slot");
        const action = body.get("action");
        if (!isFileSlot(slot)) throw new Error("Invalid slot");
        if (action !== "upload" && action !== "reset") throw new Error("Invalid action");
        if (typeof password !== "string") throw new Error("Wrong password");
        const { checkUploadPassword, saveDocument, removeDocument } = await import("@/lib/files.server");
        checkUploadPassword(password, process.env["UPLOAD_PASSWORD"]);
        if (action === "reset") await removeDocument(slot);
        else {
          const file = body.get("file");
          if (!file || typeof file === "string") throw new Error("Only PDF files are allowed");
          if (file.size > MAX_PDF_BYTES) throw new Error("File too large (max 10 MB)");
          await saveDocument(slot, new Uint8Array(await file.arrayBuffer()));
        }
        return Response.json({ ok: true }, { headers });
      } catch (error) {
        const message = error instanceof Error ? error.message : "";
        const safeErrors = ["Wrong password", "Invalid slot", "Invalid action", "Only PDF files are allowed", "File too large (max 10 MB)", "Upload failed. Please try again.", "Reset failed. Please try again."];
        return Response.json({ error: safeErrors.includes(message) ? message : "Document update failed. Please try again." }, {
          status: message === "Wrong password" ? 401 : 400, headers,
        });
      }
    },
  } },
});