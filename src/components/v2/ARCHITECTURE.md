# v2 Architecture Standard

This file is the law for all future v2 work. Every new developer must read
this before adding, moving, or renaming anything under
`src/components/v2/` or `src/page/v2/`.

## Folder structure

```
src/components/v2/
├── 01-core/            design tokens + primitives (v2theme.tsx, v2form.tsx, v2page.tsx, icons.ts)
├── 02-layout/           page chrome (XerxezHeader.tsx, XerxezFooter.tsx, XerxezShell.tsx)
├── 03-sections/
│   ├── hero/            XerxezHero.tsx
│   ├── cta/              XerxezCtaBand.tsx
│   ├── about/           XerxezWhoWeAre.tsx, XerxezWhyChoose.tsx
│   ├── industries/      XerxezIndustries.tsx
│   ├── process/         XerxezProcess.tsx
│   └── trusted/         XerxezTrustedBy.tsx, XerxezTechStack.tsx
├── 04-features/
│   ├── services/        XerxezServicesGrid.tsx, XerxezServiceDeepGrid.tsx, XerxezServiceTemplate.tsx
│   ├── portfolio/        XerxezPortfolio.tsx, XerxezProductsShowcase.tsx
│   ├── training/         XerxezCourses.tsx, XerxezTrainingCard.tsx
│   ├── contact/          XerxezContactForm.tsx
│   └── careers/          XerxezCareersForm.tsx
└── index.ts             the single public entry point — every consumer imports from here

src/page/v2/              page files (routed by src/App.tsx)
```

## Naming convention

- **Components** use the `Xerxez` prefix — `XerxezHeader`, `XerxezFooter`,
  `XerxezHero`, etc.
- **Page files** (in `src/page/v2/`) use the `V2` suffix — `HomeV2.tsx`,
  `AboutV2.tsx`, `ServiceDetailPageV2.tsx`, etc. Pages are the route-level
  wrappers that compose components; the suffix keeps them visually distinct
  from the components they assemble.
- **One component per file.** No file exports more than one component
  (small private helper components used only within that file are fine and
  stay unexported).
- Shared design-token/primitive names (`T`, `Btn`, `Reveal`, `V2FeatureCard`,
  `V2PageHero`, `V2StatStrip`, `V2_HEADER_H`, etc., all living in `01-core/`)
  keep their existing names — they are not page sections, so the `Xerxez`
  prefix does not apply to them.

## Coding standards

- **Every file starts with a header comment**: `Purpose`, `Used in`, `Data
  source`. Purpose is one to three lines on what the file renders and why it
  exists as its own file. Used in lists the page(s)/component(s) that import
  it. Data source says exactly where its content comes from (a `src/data/*`
  module, a prop, or "static — no data source").
- **Comment only the non-obvious.** A line gets a comment when it encodes a
  decision a reader couldn't infer from the code itself (why this z-index, why
  this fallback, why this value matches another file). Do not narrate what the
  code obviously does.
- **No duplicate code.** If two components need the same visual block, logic,
  or lookup table, it belongs in `01-core/` (or the closest shared
  `03-sections/`/`04-features/` file) and both import it — never copy-paste.
- **Use `T.*` tokens, never hardcoded values.** Colors, spacing, and repeated
  rgba/scrim overlays go through the `T` object in `01-core/v2theme.tsx`
  (e.g. `T.navy`, `T.scrim(0.5)`) instead of literal hex/rgba strings
  scattered across files.
- Keep it minimal and clean — no speculative props, no unused exports, no
  abstractions for a single call site.

## Data rules

- All visible content comes from `src/data/index.ts` (or another real data
  module under `src/data/`, e.g. `erpIndustriesData.tsx`) — never hardcoded
  copy invented inside a component.
- A component may hold small, page-structural config that isn't "content" per
  se (e.g. which image file goes with which slug) — but titles, descriptions,
  feature text, FAQs, and industry data always come from `src/data/`.

## Routing rules

- Prefer **dynamic routes** over near-duplicate per-item pages. One template
  component + a small per-slug config table (see
  `04-features/services/XerxezServiceTemplate.tsx` +
  `src/page/v2/services/ServiceDetailPageV2.tsx`) beats ten copy-pasted page
  files.
- Top-level pages follow the `/v2/[page]` pattern (`/v2/about`,
  `/v2/services`, `/v2/contact`, ...).
- Detail/child pages follow the `/v2/[section]/:slug` pattern
  (`/v2/services/:slug`).
- A route with no matching data is a recoverable 404 (redirect + toast), never
  a thrown error.

## Non-negotiables

- Never touch v1 (non-`/v2`) files, components, or routes.
- Every new v2 component/page/section goes through this same structure —
  don't create ad-hoc folders.
- Update `src/components/v2/index.ts` (the barrel) whenever a file moves or a
  component is renamed — every consumer imports through it, never via a deep
  path into `01-core/`/`02-layout/`/`03-sections/`/`04-features/`.

## How to Add a New Service Page

The `/v2/services/:slug` route is dynamic — there is no per-service page
file. Adding a new service is a data change plus two small config edits.

### Step 1 — Add the service to `src/data/index.ts`

Add a new entry to the `services[]` array. Match the real shape used by
every existing entry (`faqs` uses `question`/`answer`, not `q`/`a`):

```ts
{
  slug: "new-service-slug",
  title: "New Service Name",
  description: "One line description shown on cards and in <title>/meta.",
  detailBody: "Full paragraph rendered in the page's Overview section.",
  highlights: ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5", "Feature 6"],
  keyFacts: [
    { icon: "far fa-icon", iconKey: "icon-key", title: "Fact 1", desc: "Description" },
    { icon: "far fa-icon", iconKey: "icon-key", title: "Fact 2", desc: "Description" },
    { icon: "far fa-icon", iconKey: "icon-key", title: "Fact 3", desc: "Description" },
    { icon: "far fa-icon", iconKey: "icon-key", title: "Fact 4", desc: "Description" },
  ],
  faqs: [
    { question: "Question 1?", answer: "Answer 1" },
    { question: "Question 2?", answer: "Answer 2" },
    { question: "Question 3?", answer: "Answer 3" },
    { question: "Question 4?", answer: "Answer 4" },
    { question: "Question 5?", answer: "Answer 5" },
  ],
}
```

`icon` (FontAwesome class) is still required — the pre-`/v2` service page
(`src/components/service/ServiceDetailSection.tsx`) reads it. `iconKey` is
what the `/v2` template reads (see Step 2b). If `iconKey` doesn't already
exist in `01-core/icons.ts`'s `ICON_KEY_MAP`, add it there too — an unmapped
key silently falls back to a generic check icon with a `console.warn`,
rather than breaking the page.

### Step 2 — Add the page config in `ServiceDetailPageV2.tsx`

In `src/page/v2/services/ServiceDetailPageV2.tsx`:

**a) Import the hero + illustration photos** (download real stock photos into
`src/assets/images/services/`, then import them at the top of the file):

```ts
import heroNewService from "../../../assets/images/services/new-service-slug.jpg";
import illNewService from "../../../assets/images/services/new-service-slug-illustration.jpg";
```

**b) Add one entry to `SERVICE_PAGE_CONFIG`**, keyed by the exact `slug` used
in Step 1:

```ts
"new-service-slug": {
  eyebrow: "New Service Category",
  heroImage: heroNewService,
  illustrationImage: illNewService,
},
```

That's it for the page itself — `getServiceDetail(slug)` (in
`XerxezServiceTemplate.tsx`) finds the Step 1 data automatically, and
`SERVICE_PAGE_CONFIG[slug]` supplies the eyebrow/photos. No new page file, no
new route: `/v2/services/:slug` already handles it.

### Step 3 — Add it to the header mega-menu

The mega-menu in `XerxezHeader.tsx` does **not** read a flat array of
`{icon, title, desc, to}` objects — its rows come from the existing site's
`menuData` (in `src/data/`), matched to icons and grouped by title. Three
edits, all in `src/components/v2/02-layout/XerxezHeader.tsx` unless noted:

**a)** Add a `title → icon` entry to `SERVICE_ICONS`:
```ts
"New Service Name": NewLucideIcon,   // import it from "lucide-react" above
```

**b)** Add the title string to one column's `items` list in
`SERVICE_COLUMNS` ("Build & Deliver" for delivery-type services, "Scale &
Advise" for infra/advisory-type services):
```ts
{ label: "Build & Deliver", items: [..., "New Service Name"] },
```

**c)** Add the legacy → `/v2` mapping to `V2_ROUTES`:
```ts
"/service/new-service-slug": "/v2/services/new-service-slug",
```

If the service is genuinely new (no existing v1 site nav entry for it), also
add a matching submenu item (`title`, `link: "/service/new-service-slug"`,
`desc`) to the underlying `menuData` in `src/data/` — the mega-menu row is
rendered from that entry, matched by title against `SERVICE_ICONS`.

### Why this stays consistent

- Every service page renders through the one shared
  `04-features/services/XerxezServiceTemplate.tsx` — layout, spacing, and
  section order are identical for all services automatically.
- Only the **data** changes per service (title, description, features,
  FAQs, photos) — colors, fonts, and spacing all inherit from
  `01-core/v2theme.tsx`.
- After adding a service, run `npx tsc -b --force` and `npm run build`, then
  get a code review before considering it done — same as any other v2 change.
