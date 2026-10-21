// Public service location only; never put storage credentials in browser code.
export const DOCUMENT_SERVICE_ORIGIN = "https://keshavs-portfolio.lovable.app";
export const DOCUMENT_ORIGINS = [
  DOCUMENT_SERVICE_ORIGIN,
  "https://keshav-portfolio-amber.vercel.app",
  "https://id-preview--f7cc10af-07e5-4f85-954c-abb4acc473bb.lovable.app",
  "http://localhost:8080",
];

export function documentServiceFor(origin: string) {
  return origin === DOCUMENT_SERVICE_ORIGIN || origin === DOCUMENT_ORIGINS[2] || origin === "http://localhost:8080"
    ? "" : DOCUMENT_SERVICE_ORIGIN;
}

export async function changeDocument(action: "upload" | "reset", password: string, slot: string, file?: File) {
  const body = new FormData();
  body.set("action", action);
  body.set("password", password);
  body.set("slot", slot);
  if (file) body.set("file", file);
  const response = await fetch(`${documentServiceFor(window.location.origin)}/api/public/document-service`, {
    method: "POST", body, credentials: "omit",
  });
  const result = await response.json() as { ok?: boolean; error?: string };
  if (!response.ok || !result.ok) throw new Error(result.error || "Document update failed. Please try again.");
}