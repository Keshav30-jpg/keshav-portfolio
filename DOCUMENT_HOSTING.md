# Shared resume and certificate hosting

Both portfolios use the existing private Lovable Cloud `site-files` bucket. No new storage subscription or Vercel storage credential is required.

## Activate the changes

1. Publish the updated Lovable site first. This makes `/api/public/document-service` available on `https://keshavs-portfolio.lovable.app`.
2. Sync this code to GitHub and redeploy the Vercel project.
3. Open `/upload` on either website and use your existing upload password. Replacing or resetting a document updates both websites. Attendance evidence remains separate.

No administrative Cloud key and no upload password are needed in Vercel environment variables. The password is checked only by the Lovable service; it is never stored in browser code.

## Deployment behavior

- Vercel proxies document reads/downloads to the Lovable site when its server has no `SUPABASE_SERVICE_ROLE_KEY`.
- Browser uploads use multipart directly to the Lovable service, bypassing Vercel's request-body limit. The server validates the password, fixed filename, PDF header and 10 MB maximum.
- Completion-certificate status is fetched from the same service. Resetting the resume restores the phone-redacted bundled fallback; resetting completion evidence does not affect the attendance image.
- Attendance uses its existing asset pointer with an absolute Lovable origin, because the relative asset-serving path is not available on Vercel.
- The Lovable site must remain published and publicly accessible. This is shared hosting, not an independent migration away from Lovable Cloud.
- Cross-origin writes permit only the explicit sites in `src/lib/document-service.ts`. If the Vercel domain or Lovable domain changes, update that list and publish again; arbitrary Vercel preview domains are deliberately not permitted.

## Verification

Local real-password upload/download and restoration were tested for both document slots. Desktop, tablet and phone attendance viewing and PDF downloads were checked. Live Vercel verification must be repeated after both deployments are updated.