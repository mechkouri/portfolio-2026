# Said Mechkouri — Portfolio 2026

React + TypeScript + Vite implementation of the Google Stitch "Precision Engineering" design (`stitch/`).

## Commands

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build
npm run images    # re-optimize assets-src/ into public/images/
npm run capture   # re-screenshot live sites listed in scripts/capture-urls.json, full page down to the footer (uses local Chrome/Edge)
```

## Structure

```
src/
  data/content.ts          all copy, projects, experience — edit content here.
                           `sections` is the page outline: reorder it to reorder the page,
                           section numbers, and nav links together.
  lib/accents.ts           per-accent Tailwind class sets (indigo / sky / emerald / amber)
  hooks/                   device capabilities, active section, lazy GSAP ScrollTrigger
  components/
    ui/                    Reveal / Stagger / SplitHeading animations, shared primitives
    layout/                Header, Footer
    hero/                  Hero section + 3D-tilt portrait card
    three/                 R3F "automation pipeline" scene + static SVG fallback
  sections/                Experience, Work, Services, Automation, About, Skills, Education, Contact
```

## Performance & accessibility notes

- The WebGL scene loads only on desktop-class devices (fine pointer, ≥1024px, ≥4 cores/4 GB, hardware GPU,
  no reduced motion), after the browser is idle. It stops rendering when scrolled off-screen and drops its
  pixel ratio if frame rate falls. Everyone else gets a static SVG.
- The page background is a bundle of thin optical fibres drawn on a 2D canvas (`components/three/FlowFibers.tsx`). It starts
  as a single point in the gap between the hero and the first section, fans out into strands that cross and interweave,
  snakes down the page behind the content in one smooth wave (right in one section, left in the next), and spreads apart
  and fades out in the last section before the footer. It is drawn as you scroll, led by a soft light, with small lights
  travelling along it. Only the visible slice is drawn; with reduced motion the path is static. It is fixed behind
  everything (`pointer-events: none`), so it never affects layout.
- GSAP + ScrollTrigger are dynamically imported and skipped for `prefers-reduced-motion`.
- Pointer-driven effects use Motion values, so mouse movement never re-renders React.
- Fonts are self-hosted (Fontsource); images are WebP with explicit dimensions and lazy loading.
- Skip link, labelled sections, keyboard-operable tabs (arrow keys), visible focus rings, and live-region form feedback.

## Deploying

The site is live at https://mechkouri.netlify.app (Netlify project `mechkouri`), deployed from this repository:
every push to `main` on GitHub builds and publishes it (`netlify.toml`: `npm run build`, publish `dist`, Node 22,
functions in `netlify/functions`).

- **Contact form:** the form posts to `/api/contact` (`netlify/functions/contact.mjs`), which emails a branded HTML
  message through [Resend](https://resend.com) (preview: `docs/email-preview.png`). If the function is unavailable,
  the form falls back to Netlify Forms, so no message is lost.
  - Needs the `RESEND_API_KEY` environment variable in Netlify (Project configuration > Environment variables).
    Optional: `CONTACT_TO` (recipient, default saidmechkouri@gmail.com) and `CONTACT_FROM` (default
    `Portfolio <onboarding@resend.dev>`, which Resend only lets you use to write to your own Resend address; verify
    a domain in Resend to send from it).
- **Manual deploy (no Git):** `npm run deploy:zip`, then upload `deploy-dist.zip` on the project's Deploys page.
  Netlify Drop does not deploy functions, so the form then uses the Netlify Forms fallback.

## Keeping it fresh

- **Project screenshots:** add the live site to `scripts/capture-urls.json` (the key must match the file name in
  `assets-src/screenshots/`), then `npm run capture && npm run images`. Captures run down to the footer, because the
  project cards scroll their screenshot to the bottom on hover. If screenshots change, bump `IMAGE_VERSION` in
  `src/components/work/ProjectCard.tsx` (images are cached for a week).
- **Copy:** English lives in `src/data/content.ts`, French in `src/i18n/content.ts` (project cards by position) and
  `src/i18n/ui.ts` (interface text).
- **CV:** edit `cv/cv.html`, then `npm run cv` to regenerate the PDF (it reports if it no longer fits one page).
