# 04-features

Page-specific blocks — grids, forms, cards used by exactly one or two
`/v2/*` pages, grouped into subfolders by feature area:

- `services/` — `XerxezServicesGrid.tsx` (homepage services teaser grid),
  `XerxezServiceDeepGrid.tsx` (full grid on `/v2/services`), and
  `XerxezServiceTemplate.tsx` (the shared template rendered by the single
  dynamic `/v2/services/:slug` route — Hero, About, Overview, Features,
  Industries, FAQ, Technologies, Why XERXEZ, CTA).
- `portfolio/` — `XerxezPortfolio.tsx` (project grid on `/v2/portfolio`) and
  `XerxezProductsShowcase.tsx` (homepage products showcase).
- `training/` — `XerxezCourses.tsx` (course grid) and
  `XerxezTrainingCard.tsx` (next-cohort card).
- `contact/` — `XerxezContactForm.tsx`, the `/v2/contact` enquiry form.
- `careers/` — `XerxezCareersForm.tsx`, the `/v2/careers` application form
  (exports the `Position` type).

Import from the top-level barrel (`src/components/v2/index.ts`), not directly
from these subfolders.
