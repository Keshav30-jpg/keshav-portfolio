import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { uploadSiteFile } from "@/lib/files.functions";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload — Keshav S" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Private upload page." },
      { property: "og:title", content: "Upload" },
      { property: "og:description", content: "Private upload page." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: UploadPage,
});

function toBase64(file: File) {
  return new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(",")[1] ?? "");
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function UploadPage() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState("");

  async function upload(slot: "resume.pdf" | "certificate.pdf", file?: File) {
    if (!file) return;
    if (file.type !== "application/pdf") return setMsg((m) => ({ ...m, [slot]: "Please choose a PDF file." }));
    if (file.size > 10 * 1024 * 1024) return setMsg((m) => ({ ...m, [slot]: "File must be under 10 MB." }));
    setBusy(slot);
    try {
      await uploadSiteFile({ data: { password, slot, base64: await toBase64(file) } });
      setMsg((m) => ({ ...m, [slot]: "Uploaded! It's now live on your website." }));
    } catch (e) {
      setMsg((m) => ({ ...m, [slot]: (e as Error).message || "Upload failed" }));
    } finally {
      setBusy("");
    }
  }

  return (
    <main className="min-h-screen bg-background px-5 py-16">
      <div className="mx-auto max-w-lg">
        <p className="eyebrow">Private</p>
        <h1 className="mt-3 text-3xl font-extrabold">Update your documents</h1>
        <p className="mt-2 text-muted-foreground">Enter your upload password, then pick a PDF.</p>
        <label className="mt-8 block text-sm font-semibold">Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
        </label>
        {(["resume.pdf", "certificate.pdf"] as const).map((slot) => (
          <div key={slot} className="card mt-6 p-5">
            <h2 className="font-bold">{slot === "resume.pdf" ? "Resume" : "IIT Patna × Masai Certificate"}</h2>
            <input type="file" accept="application/pdf" disabled={!password || busy === slot}
              onChange={(e) => upload(slot, e.target.files?.[0])}
              className="mt-3 block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground" />
            {busy === slot && <p className="mt-2 text-sm text-muted-foreground">Uploading…</p>}
            {msg[slot] && <p className="mt-2 text-sm" role="status">{msg[slot]}</p>}
          </div>
        ))}
        <Link to="/" className="mt-8 inline-block text-sm font-semibold text-primary">← Back to site</Link>
      </div>
    </main>
  );
}
