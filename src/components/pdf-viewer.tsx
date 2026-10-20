import { useEffect, useRef, useState } from "react";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { pdfLinkBounds, safePdfLink } from "@/lib/pdf-links";

export function PdfViewer({ url }: { url: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [state, setState] = useState("Loading document…");

  useEffect(() => {
    const host = container.current;
    if (!host) return;
    setState("Loading document…");
    host.replaceChildren();
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
          const scale = 1000 / base.width;
          const ratio = Math.min(window.devicePixelRatio || 1, 2);
          const viewport = page.getViewport({ scale: scale * ratio });
          const canvas = document.createElement("canvas");
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          canvas.className = "block h-auto w-full";
          canvas.setAttribute("aria-label", `Document page ${n}`);
          canvas.setAttribute("role", "img");
          const pageHost = document.createElement("div");
          pageHost.className = "relative mx-auto mb-4 w-full max-w-[1000px]";
          pageHost.dataset.pdfPage = String(n);
          pageHost.appendChild(canvas);
          host.appendChild(pageHost);
          const canvasContext = canvas.getContext("2d");
          if (!canvasContext) throw new Error("Document rendering unavailable");
          await page.render({ canvasContext, viewport }).promise;
          const annotations = await page.getAnnotations({ intent: "display" });
          if (stopped) return;
          for (const annotation of annotations) {
            if (annotation.subtype !== "Link") continue;
            const href = safePdfLink(annotation.url);
            const bounds = pdfLinkBounds(base.convertToViewportRectangle(annotation.rect), base.width, base.height);
            if (!bounds || (!href && !annotation.dest)) continue;
            const link = document.createElement("a");
            link.className = "absolute block cursor-pointer rounded-sm hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-primary";
            Object.assign(link.style, bounds);
            if (href) {
              link.href = href;
              link.target = "_blank";
              link.rel = "noopener noreferrer";
              link.setAttribute("aria-label", `Open ${href}`);
              link.title = href;
            } else {
              link.href = "#";
              link.setAttribute("aria-label", "Go to linked document page");
              link.onclick = (event) => {
                event.preventDefault();
                void (async () => {
                  try {
                    const destination = typeof annotation.dest === "string" ? await pdf.getDestination(annotation.dest) : annotation.dest;
                    const ref = destination?.[0];
                    if (ref === undefined || stopped) return;
                    const index = typeof ref === "number" ? ref : await pdf.getPageIndex(ref);
                    host.querySelector(`[data-pdf-page="${index + 1}"]`)?.scrollIntoView({ block: "start" });
                  } catch { /* Invalid destinations must not disrupt the viewer. */ }
                })();
              };
            }
            pageHost.appendChild(link);
          }
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