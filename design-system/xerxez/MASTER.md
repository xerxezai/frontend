# XERXEZ Design System — MASTER
> Global Source of Truth. All pages inherit these rules.  
> Page-specific overrides live in `pages/[page].md`.  
> **Hero section is the canonical design reference. Do not redesign it.**  
> SCSS implementation: `src/styles/scss/_xerxez-ds.scss`

---

## Brand Identity
- **Name**: XERXEZ Solutions  
- **Positioning**: Enterprise AI / ERP / DevSecOps / Cloud  
- **Tone**: Authoritative, precise, trustworthy — warm not cold  
- **Style DNA**: Editorial Serif + Warm Minimalism + Dark data cards

---

## 1. Colours

| Token (CSS var) | Hex | Usage |
|---|---|---|
| `--xz-purple` | `#6c57d2` | Brand accent · CTAs · icons · hovers |
| `--xz-purple-light` | `rgba(108,87,210,0.10)` | Icon bg · badge bg |
| `--xz-purple-mid` | `rgba(108,87,210,0.18)` | Hover icon bg |
| `--xz-purple-glow` | `rgba(108,87,210,0.30)` | Live dot · focus rings |
| `--xz-purple-dark` | `#5242b0` | Purple button :hover |
| `--xz-cream` | `#F2EFE9` | Page background |
| `--xz-cream-deep` | `#EAE7E0` | Alternate section bg |
| `--xz-cream-border` | `#DDDAD4` | All light-mode borders |
| `--xz-white` | `#ffffff` | Card backgrounds |
| `--xz-dark` | `#1C1C1E` | Dark card bg |
| `--xz-dark-2` | `#1A1A1A` | Headings · primary btn · dark sections |
| `--xz-ink` | `#1A1A1A` | All headings |
| `--xz-muted` | `#4A4A4A` | Body text |
| `--xz-subtle` | `#9A9A9A` | Labels · captions |

**Rules:**
- Purple is the **only** brand accent. No orange, teal, or red on marketing pages.
- `--xz-cream` is the default page background on all cream sections.
- Dark sections use `--xz-dark-2` minimum.
- Never use pure `#000` or `#fff` as page backgrounds.

---

## 2. Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Hero headline | Playfair Display | 900 | `clamp(40px, 6vw, 88px)` |
| Section title | Playfair Display | 900 | `clamp(28px, 3.5vw, 44px)` |
| Card heading h3 | DM Sans | 700 | `18px` |
| Body | DM Sans | 400 | `16px` · lh `1.75` |
| Label / eyebrow | DM Sans | 600 | `11px` · uppercase · ls `0.18em` |
| Caption | DM Sans | 500 | `13px` |
| Micro | DM Sans | 500 | `10px` · uppercase · ls `0.12em` |

**Rules:**
- Playfair Display **only** for section + hero headlines.
- DM Sans for everything else.
- Every section headline must have one italic purple `<span>` accent word.
- Max line length: `60ch` for body paragraphs.
- Minimum `16px` body on mobile.

---

## 3. Spacing — 8-pt Grid

```
8 · 16 · 24 · 32 · 40 · 48 · 56 · 64 · 80 · 96 · 120
```

| Token | Value | Usage |
|---|---|---|
| `--xz-section-sm` | `64px` | Trust bars, tight bands |
| `--xz-section-md` | `100px` | Standard section `padding: 100px 0` |
| `--xz-section-lg` | `120px` | Hero, major landing sections |

---

## 4. Border Radius

| Token | Value | Usage |
|---|---|---|
| `--xz-r-sm` | `6px` | Tags · small inputs |
| `--xz-r-md` | `12px` | Icon containers · small cards |
| `--xz-r-lg` | `16px` | Feature cards |
| `--xz-r-xl` | `20px` | Contact / info cards |
| `--xz-r-card` | `18px` | Dark cards · tally card |
| `--xz-r-pill` | `100px` | All buttons · badges |

---

## 5. Shadows

| Token | Value | Usage |
|---|---|---|
| `--xz-shadow-card` | `0 4px 25px rgba(0,0,0,0.06)` | Default white cards |
| `--xz-shadow-md` | `0 8px 32px rgba(0,0,0,0.08)` | Lifted cards |
| `--xz-shadow-lg` | `0 16px 48px rgba(0,0,0,0.10)` | Hover state shadow |
| `--xz-shadow-purple` | `0 8px 24px rgba(108,87,210,0.25)` | Purple button :hover |
| `--xz-shadow-dark` | `-20px 20px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12)` | Dark / tally cards |

---

## 6. Buttons

| Class | Appearance | When to Use |
|---|---|---|
| `.xz-btn.xz-btn--primary` | Black pill + cream circle arrow | Primary CTA on cream sections |
| `.xz-btn.xz-btn--purple` | Filled purple pill | Primary CTA on dark sections |
| `.xz-btn.xz-btn--ghost` | Transparent, dark text | Secondary link on cream |
| `.xz-btn.xz-btn--ghost-light` | Transparent, white border | Secondary link on dark |

All buttons: `border-radius: 100px` · `font: DM Sans 600` · `padding: 13px 24px` · `transition: 250ms`.

---

## 7. Cards

| Class | Background | Border | When to Use |
|---|---|---|---|
| `.xz-card` | `#fff` | `1px solid #DDDAD4` | Cream sections |
| `.xz-card--dark` | `#1C1C1E` | `rgba(255,255,255,0.07)` | Dark bg sections |
| `.xz-card--feature` | `#fff` | `#DDDAD4` + purple :hover | Service / feature grids |
| `.xz-card--glass` | `rgba(255,255,255,0.08)` | `rgba(255,255,255,0.14)` | Purple gradient sections |
| `.xz-card--tally` | `#1C1C1E` | None | Hero metrics card only |

---

## 8. Icon Containers

```html
<div class="xz-icon xz-icon--md xz-icon--purple">
  <i class="fas fa-brain"></i>
</div>
```

Sizes: `sm (36px)` · `md (48px)` · `lg (56px)` · `xl (64px)`  
Schemes: `--purple` · `--purple-solid` · `--dark` · `--cream`

---

## 9. Hover Animations

| Class | Effect | Duration |
|---|---|---|
| `.xz-hover-lift` | `translateY(-6px)` + shadow | `400ms ease` |
| `.xz-hover-glow` | `translateY(-6px)` + purple shadow + border | `400ms ease` |
| `.xz-hover-3d` | `perspective(900px) rotateX(2deg) rotateY(-2deg) translateY(-8px)` | `400ms ease` |
| `.xz-hover-arrow` | gap `6px → 12px` | `250ms ease` |
| `.xz-hover-underline` | underline grows left → right | `250ms ease` |

**Rules:**
- `transform` + `opacity` only. Never animate `width/height/padding/margin`.
- All animated elements have `will-change: transform`.
- 3D tilt disabled at `max-width: 991px`.

---

## 10. Scroll Animations

- Use AOS: `data-aos="fade-up"` (primary), `"fade-right"`, `"fade-left"`.
- Default attrs: `data-aos-duration="900"` · `data-aos-easing="ease-out-cubic"` · `data-aos-once="true"`.
- Stagger: `data-aos-delay={index * 100}` (max `400ms`).

---

## 11. Section Background Pattern

```
Hero             → Cream        #F2EFE9
Services         → Cream Deep   #EAE7E0
About / Feature  → Cream        #F2EFE9
CTA              → Purple grad  linear-gradient(135deg, #5a47c0, #6c57d2, #8b73ff)
Projects         → Cream Deep   #EAE7E0
Testimonials     → Dark         #1A1A1A
Footer           → Dark         #111111
Breadcrumbs      → Dark         #1A1A1A  (white text)
```

---

## 12. Grid System

- Bootstrap 12-col `.container` (max-width `1320px`) for all page content.
- Gutters: `g-4` (24px) on card grids.
- Responsive pattern: `col-xl-3 col-lg-4 col-md-6` for 4-card grids.
- Prose / article max-width: `840px` (`.xz-container--sm`).

---

## 13. Z-Index Scale

```
base: 1  ·  card: 10  ·  sticky: 20  ·  modal: 50  ·  nav: 9999
```

---

## 14. Accessibility

- Minimum contrast: 4.5:1 normal text, 3:1 large text (WCAG AA).
- Touch targets: minimum 44×44px.
- All interactive elements have `:focus-visible` purple ring (2px, 3px offset).
- `cursor: pointer` on all clickable non-button elements.
- `prefers-reduced-motion`: all transitions collapse to `0.01ms`.

---

## 15. Anti-Patterns

- ❌ No orange accent (`#ff792e`) on non-product pages
- ❌ No pure `#000000` / `#ffffff` page backgrounds
- ❌ No old template colours: `#0e1445`, `#44455e`, `#1d2250`
- ❌ No emoji as icons — use Font Awesome (`fas`, `far`, `fab`)
- ❌ No animating `width / height / margin / padding`
- ❌ No hardcoded fonts outside DM Sans + Playfair Display
- ❌ No 3D perspective transforms on mobile (< 992px)
- ❌ No `!important` in component inline styles (only in `_xerxez-ds.scss`)

---

## Pre-Delivery Checklist

- [ ] All colours reference `--xz-*` CSS variables
- [ ] Section backgrounds follow the alternating pattern above
- [ ] Headings use Playfair Display 900 with italic purple accent span
- [ ] Body text uses DM Sans 16px / lh 1.75 / max 60ch
- [ ] Buttons use `.xz-btn` + variant class
- [ ] Cards use `.xz-card` + variant class
- [ ] Icons use `.xz-icon` + size + scheme class
- [ ] Hover animations use `.xz-hover-*` classes (not inline styles)
- [ ] AOS attrs: `duration="900"` `easing="ease-out-cubic"` `once="true"`
- [ ] No 3D on mobile, reduced-motion respected
- [ ] `:focus-visible` purple ring on all interactive elements
- [ ] `cursor: pointer` on all clickable non-button elements
- [ ] Build passes: `npm run build` with zero TypeScript errors
