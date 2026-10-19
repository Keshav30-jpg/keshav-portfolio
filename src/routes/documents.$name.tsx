import { createFileRoute } from "@tanstack/react-router";
import { PdfViewer } from "@/components/pdf-viewer";
import { DocumentDownload } from "@/components/document-download";

export const Route = createFileRoute("/documents/$name")({
  head: ({ params }) => {
    const title = params.name === "certificate.pdf" ? "Certificate — Keshav S" : "Resume — Keshav S";
    const description = "View Keshav S’s uploaded professional document.";
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] };
  },
  component: DocumentPage,
});

function DocumentPage() {
  const { name } = Route.useParams();
  if (name !== "resume.pdf" && name !== "certificate.pdf") return <main className="p-8">Document not found.</main>;
  const url = `/api/public/files/${name}`;
  return <main className="min-h-screen bg-background p-4 text-foreground sm:p-8">
    <div className="mx-auto max-w-5xl">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Keshav S · {name === "resume.pdf" ? "Resume" : "Certificate"}</h1>
        <DocumentDownload href={`${url}?download=1`} className="btn btn-primary">Download PDF</DocumentDownload>
      </header>
      <PdfViewer url={url} />
    </div>
  </main>;
}