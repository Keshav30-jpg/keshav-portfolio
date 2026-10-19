import { useEffect, useRef, useState } from "react";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

export function PdfViewer({ url }: { url: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [state, setState] = useState("Loading document…");

  useEffect(() => {
    const host = container.current;
    if (!host) return;
    let stopped = false;
    let dispose: (() => void) | undefined;
    const controller = new AbortController();
    async function render() {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
        const response = await fetch(url, { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error("Document unavailable");
        const task = pdfjs.getDocument({ data: await response.arrayBuffer() });
        dispose = () => { void task.destroy(); };
        const pdf = await task.promise;
        if (stopped || !host) return;
        host.replaceChildren();
        for (let n = 1; n <= pdf.numPages; n++) {
          if (stopped) return;
          const page = await pdf.getPage(n);
          const base = page.getViewport({ scale: 1 });
          const scale = Math.min(Math.max(host.clientWidth - 32, 240), 1000) / base.width;
          const ratio = Math.min(window.devicePixelRatio || 1, 2);
          const viewport = page.getViewport({ scale: scale * ratio });
          const canvas = document.createElement("canvas");
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          canvas.className = "mx-auto mb-4 block h-auto max-w-full";
          canvas.setAttribute("aria-label", `Document page ${n}`);
          canvas.setAttribute("role", "img");
          host.appendChild(canvas);
          const canvasContext = canvas.getContext("2d");
          if (!canvasContext) throw new Error("Document rendering unavailable");
          await page.render({ canvasContext, viewport }).promise;
        }
        if (!stopped) setState("");
      } catch {
        if (!stopped) setState("Unable to load this document. Please try again or download it.");
      }
    }
    void render();
    return () => { stopped = true; controller.abort(); dispose?.(); };
  }, [url]);

  return <div className="h-[75vh] min-h-[420px] overflow-auto bg-muted p-4" aria-label="PDF document">
    {state && <p role="status" className="py-8 text-center text-muted-foreground">{state}</p>}
    <div ref={container} />
  </div>;
}