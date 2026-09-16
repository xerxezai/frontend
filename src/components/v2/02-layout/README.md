# 02-layout

Page chrome — the header, footer, and the shell that wraps every `/v2/*` page.

- `XerxezHeader.tsx` — top nav bar, desktop mega-menu (Services), mobile menu
  trigger. Also exports `remap`, the `/v2/*` route-mapping helper used by nav
  links.
- `XerxezFooter.tsx` — site footer.
- `XerxezShell.tsx` — wraps `<XerxezHeader>` + page content + `<XerxezFooter>`
  + the mobile menu modal. Every `/v2/*` page component renders its content
  inside `<XerxezShell>`.
- `XerxezMobileMenu.tsx` / `XerxezMobileMenuModal.tsx` — the mobile nav drawer,
  used only by `XerxezShell`.

Import `XerxezShell`, `XerxezHeader`, `XerxezFooter`, and `remap` from the
top-level barrel (`src/components/v2/index.ts`).
