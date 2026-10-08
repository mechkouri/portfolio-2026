# Said Mechkouri — Portfolio 2026

React + TypeScript + Vite implementation of the Google Stitch "Precision Engineering" design (`stitch/`).

## Commands

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build
npm run images    # re-optimize assets-src/ into public/images/
npm run capture   # re-screenshot live sites listed in scripts/capture-urls.json (uses local Chrome/Edge)
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
- The page background is a thin bundle of light fibres drawn on a 2D canvas (`components/three/FlowFibers.tsx`). It snakes
  down the page behind the content in one smooth wave, swinging right in one section and left in the next. It is drawn as
  you scroll: the fibres grow downward, led by a soft light, with small lights travelling along them. Only the visible
  slice is drawn; with reduced motion the path is static. It is fixed behind everything (`pointer-events: none`), so it
  never affects layout.
- GSAP + ScrollTrigger are dynamically imported and skipped for `prefers-reduced-motion`.
- Pointer-driven effects use Motion values, so mouse movement never re-renders React.
- Fonts are self-hosted (Fontsource); images are WebP with explicit dimensions and lazy loading.
- Skip link, labelled sections, keyboard-operable tabs (arrow keys), visible focus rings, and live-region form feedback.

## Before going live

- **Sharper project screenshots:** Varimart, Normes HACCP and Maya Beauty House are captured from the live sites at
  1600px. The rest still use small screenshots, so they look soft. Add each live site to `scripts/capture-urls.json`
  (the key must match the file name in `assets-src/screenshots/`, e.g. `"cavelle": "https://..."`), then run
  `npm run capture && npm run images`. The capture script closes pop-ups and hides fixed bars; check each result by eye.
- Add your public email in `site.email` (src/data/content.ts). The Contact section shows a mailto button once it is set.
- Set the real LinkedIn URL in `site.linkedin`, and real `url`s on projects if they should link out.
- The contact form posts to Netlify Forms, so it works once the site is deployed on Netlify.
