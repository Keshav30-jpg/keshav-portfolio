import { createFileRoute } from "@tanstack/react-router";
import { DOCUMENT_SERVICE_ORIGIN } from "@/lib/document-service";

// Serves the owner-uploaded resume/certificate from private storage.
// Only two fixed public documents are exposed; nothing else is readable.
export const Route = createFileRoute("/api/public/files/$name")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const name = params.name;
        if (name !== "resume.pdf" && name !== "certificate.pdf") {
          return new Response("Not found", { status: 404 });
        }
        // External deployments never need Lovable's administrative credential.
        if (!process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
          try {
            const source = new URL(`/api/public/files/${name}`, DOCUMENT_SERVICE_ORIGIN);
            source.search = new URL(request.url).search;
            if (new URL(request.url).origin === source.origin) return new Response("Document service unavailable", { status: 503 });
            const response = await fetch(source, { cache: "no-store" });
            return new Response(response.body, { status: response.status, headers: {
              "Content-Type": response.headers.get("Content-Type") ?? "application/pdf",
              "Content-Disposition": response.headers.get("Content-Disposition") ?? "inline",
              "Cache-Control": "no-store",
            } });
          } catch { return new Response("Document service unavailable", { status: 503 }); }
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data } = await supabaseAdmin.storage.from("site-files").download(name);
        if (!data) {
          if (name === "resume.pdf") {
            return Response.redirect(new URL("/files/Keshav_S_Resume.pdf", request.url), 302);
          }
          return new Response("Not found", { status: 404 });
        }
        const dl = new URL(request.url).searchParams.has("download");
        const fname = name === "resume.pdf" ? "Keshav_S_Resume.pdf" : "Keshav_S_Certificate.pdf";
        return new Response(data, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `${dl ? "attachment" : "inline"}; filename="${fname}"`,
            "Cache-Control": "no-cache",
          },
        });
      },
    },
  },
});
