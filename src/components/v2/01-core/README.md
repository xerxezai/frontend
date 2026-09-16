# 01-core

Design tokens and primitives shared by every other v2 folder. Nothing here renders
a full page section on its own — these are the building blocks other files compose.

- `v2theme.tsx` — the `T` design-token object (colors, fonts, spacing, `T.scrim(alpha)`),
  plus shared primitives: `Reveal`, `Eyebrow`, `SectionHeading`, `Btn`, `IconTile`,
  `DotGrid`, `LearnMore`, `ArrowRight`, `V2_HEADER_H`, `V2_API_BASE`, `sectionPad`,
  `prefersReducedMotion`.
- `v2form.tsx` — shared form primitives used by the contact/careers forms.
- `v2page.tsx` — shared page-level primitives: `V2PageHero`, `V2FeatureCard`,
  `V2StatStrip`.
- `icons.ts` — the single `ICON_KEY_MAP` / `getKeyFactIcon` lookup from a
  service's `keyFacts.iconKey` to a lucide icon. Any component that renders
  keyFacts imports from here instead of keeping its own copy.

Import everything from the top-level barrel (`src/components/v2/index.ts`), not
directly from these files.
