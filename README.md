# Zohaib Haider — Full-stack AI & Software Engineer

A portfolio built around cream, forest green, oversized editorial typography, the owner's supplied portrait, and four detailed engineering case studies.

The homepage includes an animated layered portrait hero, an about section with four sourced statistics, a searchable skills explorer, an on-demand React Three Fiber sculpture, 3D project previews and scroll-linked cards, an interactive architecture explorer, professional experience, education, résumé access, and direct contact links.

## Development

```bash
npm ci
npm run dev
```

Vite prints the available local port. To expose a development preview on the local network:

```bash
npm run dev -- --host 0.0.0.0
```

## Verification

```bash
npx tsc --noEmit
npm run build
git diff --check
```

The existing TanStack Start / Vite / Lovable build integration is retained. The build produces `.output/`; follow the existing connected hosting workflow for publication. No Git history rewrite is required.

## Content and assets

- `src/lib/projects.ts` — Trace Ops, HR Intelligence, DSP Marketplace, and RTA Marketing, including exact demo/repository URLs and case-study content.
- `src/lib/skills.ts` — the complete categorized skills inventory.
- `src/lib/socials.ts` — all contact, portrait, and résumé destinations.
- `public/images/zohaib-haider.png` — the exact supplied glasses portrait, without face or eye editing.
- `public/resume.pdf` — the exact supplied résumé.
- `public/projects/` — screenshots of the four real public demos.
- `public/fonts/` — self-hosted Manrope and Barlow Condensed, with their OFL licenses.

See [content provenance](docs/PORTFOLIO_CONTENT.md) for the résumé/repository sources and the distinctions between implemented capabilities, optional features, current deployments, and retained architecture paths.

## Interaction and motion

Skill categories, global skill search, the complete-stack view, and workflow stages are interactive. Each selected project opens a dedicated `/projects/<slug>` case study. Contact uses working email/social destinations, email copying, and résumé download; no unconfigured message-sending service is presented as functional.

The header and footer provide motion controls. The site follows the operating system's reduced-motion setting by default. The 3D sculpture loads when its artwork enters view and pauses when inactive; CSS artwork provides a visual fallback. On narrow screens, project cards flow vertically and navigation uses an expandable menu.
