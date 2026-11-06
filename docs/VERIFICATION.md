# Portfolio verification

Verified locally on 2026-11-06 against the implemented TanStack Start application.

## Build and source checks

- `npx tsc --noEmit` — passed.
- `npm run build` — passed for the existing client, SSR, and Cloudflare-module build.
- `git diff --check` — passed.
- Supplied portrait and résumé SHA-256 comparisons — both workspace copies match the originals byte for byte.
- All four user-supplied public product URLs returned HTTP 200 when product screenshots were captured.

An existing type error in the retained, unused lanyard component was resolved by specifying its single-texture input type. No lanyard behavior was changed.

## Browser checks

33 checks passed in Chromium using Playwright tooling outside the application's dependencies:

- Home response, identity/role heading, and four project cards.
- Exact LinkedIn and international WhatsApp destinations.
- Actual React Three Fiber canvas rendering.
- AI category filtering, QLoRA details, global skill search, and all 16 expanded categories.
- Project workflow switching and stage explanations.
- Clipboard copying of the correct email address.
- Manual animation pause and the operating system's reduced-motion preference.
- All four case-study routes and their live-demo destinations.
- A genuine PDF response for the résumé and a not-found state for an invalid project.
- No horizontal page overflow at 360, 390, 768, 1024, 1440, or 1920 pixels.
- Mobile menu expansion and closing after selecting a section.
- No uncaught browser errors or unexpected console errors in the final run.

Desktop/mobile hero and skills previews, plus the browser-check log, are saved under `design-exploration/implemented-portfolio/`.

## Practical limits

- The Three.js/Fiber visualization is the largest optional client chunk (about 234 KB gzip in the verified build). It is loaded on entering the artwork viewport, rather than bundled into the initial page entry. Rendering pauses when inactive and has a CSS fallback.
- The build retains existing framework notices about tsconfig-path support and Nitro's code-splitting options. They did not prevent a successful build.
- Repository links remain private as supplied; cards and case studies say so. Public demo links are available to visitors.
- These checks verify the local implementation and build. No public deployment, commit, push, or Git history rewrite was performed.
