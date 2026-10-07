---
name: Precision Engineering
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464555'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006398'
  on-secondary: '#ffffff'
  secondary-container: '#5bb8fe'
  on-secondary-container: '#00476e'
  tertiary: '#00505f'
  on-tertiary: '#ffffff'
  tertiary-container: '#006a7c'
  on-tertiary-container: '#93e8ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#93ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-hero:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: '600'
    lineHeight: 72px
    letterSpacing: -0.035em
  display-hero-mobile:
    fontFamily: Geist
    fontSize: 38px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-mono-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: -0.01em
  label-mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 1.5rem
  margin-sm: 1rem
  margin-lg: 4rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies high-craft software engineering: rigorous, precise, modern, and understated. Drawing structural cues from Linear and visual polish from Stripe and contemporary Awwwards winners, it positions technical mastery through architectural clarity rather than decorative excess. 

The aesthetic is ultra-clean minimalism married to subtle micro-surfacing—utilizing optic whites, muted alabaster layers, structural hairline borders, and translucent frosted glass to construct deep spatial hierarchy. Dynamic tension is achieved through razor-sharp slate typography offset by hyper-focused electric indigo and cyan luminous accents, evoking automated pipelines, computational intelligence, and high-performance infrastructure.

The emotional impact must communicate elite engineering caliber, absolute operational reliability, and an uncompromising obsession with detail.

## Colors

The palette establishes an immaculate, luminous light canvas supported by strict semantic color hierarchies:

- **Canvas & Background Surfaces**: Pure white (`#FFFFFF`) serves as the base layer, stepped upward through alabaster tint (`#F8FAFC`) for cards and nested modules, and muted slate-50 (`#F1F5F9`) for interactive canvas wells and secondary containers.
- **Structural Outlines**: Borders utilize ultra-refined sub-pixel hairlines using `#E2E8F0` for resting cards, transitioning to `#CBD5E1` for structural separators or hovered boundaries.
- **Typographic Depth**: Text relies on pure slate hierarchy to avoid the optical harshness of pure black: `#0F172A` (Headlines / High-emphasis), `#1E293B` (Body lead), `#334155` (Standard body), and `#64748B` (Metadata, terminal prompts, labels).
- **Accents & Signals**: Electric Indigo (`#4F46E5`) commands primary CTAs and system anchors. Deep Cobalt (`#0284C7`) represents automation workflows and live integrations. Cyan (`#06B6D4`) acts as a precise telemetry spark for active metrics, live status pills, and glow highlights.

## Typography

The typographic system fuses the industrial, hyper-geometric legibility of **Geist** for headlines with the neutral, invisible utility of **Inter** for long-form case studies and technical documentation. **JetBrains Mono** injects purposeful terminal and engineering character into status badges, code metrics, schema keys, and architecture tags.

Tight negative letter-spacing on display and headline weights eliminates typographic float and establishes the signature Linear/Awwwards dense editorial cadence. Monospace elements enforce a tabular, code-native presence with subtle positive tracking to guarantee scanability in compact containers.

## Layout & Spacing

A 12-column responsive fluid grid pinned to a maximum container width of `1280px` defines the desktop workspace, maintaining structural rhythm and preventing technical diagrams or pipeline visualizers from stretching unnaturally.

- **Desktop (>= 1024px)**: 12 columns, 32px gutters (`gutter-lg`), 64px outer margins (`margin-lg`). Component cards align systematically to 4, 6, 8, or 12-column spans.
- **Tablet (768px - 1023px)**: 8 columns, 24px gutters (`gutter`), 32px outer margins. Multi-column metric dashboards reflow to 2x2 grids.
- **Mobile (< 768px)**: 4 columns, 16px gutters (`gutter-sm`), 16px outer margins (`margin-sm`). All multi-span containers collapse to single full-width stacks, preserving horizontal padding integrity.

Vertical rhythm relies strictly on a base-8 spacing cadence, utilizing `space-xl` (40px) between major functional modules, `space-md` (16px) for interior card padding, and `space-xs` (4px) / `space-sm` (8px) for badge and atomic chip assemblies.

## Elevation & Depth

Visual depth is achieved through ambient light refraction, multi-stop diffusion, and sub-pixel edge definition rather than traditional heavy drop shadows:

- **Sub-pixel Hairlines**: Every elevated card, module, or floating island is encased in a 1px solid border (`#E2E8F0` or `rgba(226, 232, 240, 0.8)`). This preserves surgical crispness against bright white backgrounds.
- **Glassmorphism Frosted Panels**: Navigation headers, docked toolbars, and contextual modals use translucent backing surfaces (`rgba(255, 255, 255, 0.75)`) combined with `backdrop-filter: blur(16px) saturate(180%)`. This allows underlying visual architecture to bleed through gently while preserving text contrast.
- **Luminous Ambient Shadows**:
  - *Resting Card Elevation*: `0 1px 3px rgba(15, 23, 42, 0.04), 0 10px 24px -4px rgba(15, 23, 42, 0.04)`.
  - *Active Hover Elevation*: Translates up by `-2px` with a combined soft indigo/slate bloom: `0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 20px 32px -6px rgba(79, 70, 229, 0.08)`.
  - *Accent Glows*: Interactive primary elements project subtle radial backlights: `0 0 20px rgba(79, 70, 229, 0.25)`.

## Shapes

The design system adopts a calibrated "Soft" geometry (`roundedness: 1`). Interactive elements, inputs, and small badges utilize `4px` corner radii (`0.25rem`), preserving an architectural, precision-machined look. Medium-to-large containers, code blocks, and case study cards scale to `8px` (`0.5rem`) and `12px` (`0.75rem`), avoiding playful, bulbous curves in favor of crisp enterprise maturity.

Exceptions exist strictly for telemetry badges, status indicators, and full-bleed action pills, which employ full capsule geometry (`border-radius: 9999px`) to visually separate metadata tokens from structural content boxes.

## Components

### Buttons
- **Primary**: Solid `#4F46E5` background with pure `#FFFFFF` label (`Inter 14px/w500`). Border: 1px solid `rgba(255, 255, 255, 0.12)`. Subtle inward inset highlight: `box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25)`. On hover: `#4338CA` with an ambient glow (`0 8px 16px -2px rgba(79, 70, 229, 0.3)`).
- **Secondary / Glass**: Background `rgba(255, 255, 255, 0.85)` with 1px border `#E2E8F0`. Text color `#1E293B`. On hover: `#F8FAFC` background with border `#CBD5E1`.
- **Tertiary (Ghost)**: Transparent background, text `#475569`, on hover text `#0F172A` with background `#F1F5F9`.

### Badges & Status Chips
- Height: 24px, pill-shaped (`9999px`), padding: `0 10px`. Font: `JetBrains Mono 11px/w500`.
- **Active Automation / Online**: Background `rgba(6, 182, 212, 0.08)`, border `1px solid rgba(6, 182, 212, 0.3)`, text `#0891B2`. Preceded by a 6px circular dot with a continuous 2-second pulse animation.
- **Production / Deployed**: Background `rgba(16, 185, 129, 0.08)`, border `1px solid rgba(16, 185, 129, 0.3)`, text `#059669`.
- **Neutral Tech Tag**: Background `#F1F5F9`, border `1px solid #E2E8F0`, text `#475569`.

### Cards & Project Showcases
- Surface: `#FFFFFF` (or frosted `#FFFFFF` at 80% opacity), border: `1px solid #E2E8F0`, border-radius: `8px`.
- Interior padding: 24px (`space-lg`).
- Interactive behavior: Subtle upward translation (`transform: translateY(-2px)`) on hover, paired with border color shift to `#CBD5E1` and the addition of a luminous ambient indigo bloom.

### Terminal & Code Blocks
- Background: `#F8FAFC`, border: `1px solid #E2E8F0`, border-radius: `8px`.
- Header bar: 36px tall with 1px bottom border `#E2E8F0`, displaying a monospaced file path or runner command in `#64748B`, flanked by macOS-styled neutral hardware indicator dots (`#CBD5E1`).
- Code lines: JetBrains Mono with syntax highlighting tuned to deep slate, electric indigo, and cyan.

### Form Inputs & Terminal Command Inputs
- Height: 40px, background `#FFFFFF`, border: `1px solid #CBD5E1`, border-radius: `4px`.
- Typography: Inter 14px, text `#0F172A`, placeholder `#94A3B8`.
- Focus state: Border transitions to `#4F46E5` with an outer ring: `box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15)`.

### Checkboxes & Segmented Controls
- Checkboxes: 16x16px, `2px` corner radius, border `1.5px solid #CBD5E1`. Checked state fills `#4F46E5` with a pure white geometric check mark.
- Segmented Pipeline Controls: Enclosed in a `#F1F5F9` track with `4px` padding. Active tab snaps with a floating white card surface (`#FFFFFF`), 1px hairline border (`#E2E8F0`), and shadow (`0 1px 3px rgba(0, 0, 0, 0.05)`).