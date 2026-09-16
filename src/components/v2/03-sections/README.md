# 03-sections

Reusable, full-width page sections — not page-specific, used across multiple
`/v2/*` pages. Grouped into subfolders by purpose:

- `hero/` — `XerxezHero.tsx`, the homepage hero (video background).
- `cta/` — `XerxezCtaBand.tsx`, the shared bottom-of-page call-to-action band
  used on nearly every `/v2/*` page.
- `about/` — `XerxezWhoWeAre.tsx` (company intro) and `XerxezWhyChoose.tsx`
  (differentiators band, also reused inside the service detail template).
- `industries/` — `XerxezIndustries.tsx`, the interactive "pick your
  industry" section on the homepage.
- `process/` — `XerxezProcess.tsx`, the delivery-process steps band.
- `trusted/` — `XerxezTrustedBy.tsx` (client/partner logos) and
  `XerxezTechStack.tsx` (exports `XerxezTechLogoStrip`, the floating
  tech-logo strip reused on the homepage and service detail pages).

Import from the top-level barrel (`src/components/v2/index.ts`), not directly
from these subfolders.
