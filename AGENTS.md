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
- Owner documents (resume.pdf, certificate.pdf) live in the private `site-files` bucket and are served only via `/api/public/files/$name`; uploads go through a password-checked server function (`UPLOAD_PASSWORD` secret) on the unlinked `/upload` page. Why: keeps uploads hidden and storage private.
- The bundled `public/files/Keshav_S_Resume.pdf` is a phone-redacted fallback used until a resume is uploaded. Why: the phone number must never be public.
- Render document previews with browser-loaded PDF.js and open documents through `/documents/$name`; download via fetched blobs. Why: native PDF navigation and plugins can be blocked inside the editor preview while same-origin document fetches work.
- Overlay PDF.js link annotations with proportional hit areas and safe web/email destinations; keep downloaded PDF bytes unchanged. Why: canvas rendering alone loses clickable links, while original PDF annotations must survive downloads.
- Keep the attendance image in a dedicated image-dialog component, separate from uploaded completion PDFs. Why: participation evidence must not be confused with course completion or inherit PDF download controls.
