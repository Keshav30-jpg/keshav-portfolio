<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Owner documents live in private `site-files` storage on Lovable; external deployments proxy `/api/public/files/$name` to the fixed Lovable origin, and `/upload` submits multipart requests directly to the password-checked `/api/public/document-service` there. Why: both sites share documents without exporting administrative credentials or hitting Vercel's request-size limit.
- Keep the document-service origin and explicit allowed website origins in one browser-safe module; mutations authorize with UPLOAD_PASSWORD on the hosting service, and return only sanitized errors. Why: cross-origin browser uploads need CORS, but CORS is not authorization.
- Resolve attendance asset pointers against the fixed Lovable origin. Why: the relative Lovable asset infrastructure path does not exist on Vercel.
- The bundled `public/files/Keshav_S_Resume.pdf` is a phone-redacted fallback used until a resume is uploaded. Why: the phone number must never be public.
- Render document previews with browser-loaded PDF.js and open documents through `/documents/$name`; download via fetched blobs. Why: native PDF navigation and plugins can be blocked inside the editor preview while same-origin document fetches work.
- Overlay PDF.js link annotations with proportional hit areas and safe web/email destinations; keep downloaded PDF bytes unchanged. Why: canvas rendering alone loses clickable links, while original PDF annotations must survive downloads.
- Keep the attendance image in a dedicated image-dialog component, separate from uploaded completion PDFs. Why: participation evidence must not be confused with course completion or inherit PDF download controls.
