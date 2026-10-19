import { useState } from "react";
import type { ReactNode } from "react";

export function DocumentDownload({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  return <>
    <a href={href} className={className} aria-disabled={busy} onClick={async (event) => {
      event.preventDefault();
      if (busy) return;
      setBusy(true); setError(false);
      try {
        const response = await fetch(href, { cache: "no-store" });
        if (!response.ok) throw new Error("Download unavailable");
        const url = URL.createObjectURL(await response.blob());
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = href.includes("certificate") ? "Keshav_S_Certificate.pdf" : "Keshav_S_Resume.pdf";
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
      } catch { setError(true); }
      finally { setBusy(false); }
    }}>{busy ? "Downloading…" : children}</a>
    {error && <span role="alert" className="text-sm text-muted-foreground">Download failed. Please try again.</span>}
  </>;
}