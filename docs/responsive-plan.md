# Responsive & mobile plan — hk39.dev personal-site

Handoff doc for implementing mobile-friendly layouts without breaking the desktop OS experience.

**Repo:** `personal-site` (Next.js static export, `src/components/Desktop.tsx` is the live UI)  
**Skills to apply:** `responsive-frontend`, `unslopify-frontend` (type/color at each breakpoint)  
**Breakpoint:** `768px` — below = mobile layout, at/above = current desktop OS

---

## Goal

Make https://hk39.dev usable on phones and tablets without pinch-zoom, horizontal scroll, or clipped chrome — while **preserving** the draggable-window desktop metaphor on wide screens.

Success = pass the checklist in [Testing](#testing) at 375px, 768px, and 1280px.

---

## Current state (audit)

| Area | Problem |
|------|---------|
| **Paradigm** | macOS-style OS: absolute positioning, drag/resize, fixed px window widths (480–860px) |
| **Menubar** | Logo + 4 nav + 2 icons + CTA in one row — overflows ~375px |
| **Desktop icons** | `position: absolute; width: 400px; left: 16px` — overlaps windows on narrow viewports |
| **DraggableWindow** | Mouse-only (`mousedown` / `mousemove`); resize handles ~8px; close button 11×11px |
| **Footer** | Long email + github links — will wrap/overflow on mobile |
| **Viewport** | Next.js `metadata` in `layout.tsx` — confirm `viewport` export (no explicit meta in file today) |
| **Type** | Tokenized (17px base) — mostly OK; prose `ch` widths are desktop-tuned |

**Do not** try to “shrink” the desktop OS in place. Branch layouts at 768px.

---

## Strategy

```
≥ 768px  →  Desktop OS (unchanged behavior)
< 768px  →  Scrollable mobile page (cards + sheet), no drag/resize
```

Implementation: `useIsMobile()` (or CSS-only where possible) in `Desktop.tsx` to render either the existing tree or a new `MobileLayout`.

Reuse existing content components — do **not** duplicate MDX rendering logic:

- `AboutWindow`, `WorkWindow`, `ProjectsWindow`, `ResearchWindow`, `SkillsWindow`
- `ExperienceContent`, `ProjectContent`, `ResearchContent`
- `Terminal` (trimmed preview on mobile)

---

## Breakpoints (reference)

| Tier | Width | Mobile layout behavior |
|------|-------|------------------------|
| Mobile | ≤ 767px | Single column, hamburger nav, full-width cards, bottom sheet for item detail |
| Tablet | 768–1024px | Keep desktop OS; optional touch-drag polish |
| Desktop | ≥ 1280px | Current experience |

Use **mobile-first CSS** for new mobile-only styles; desktop keeps existing rules behind `min-width: 768px` or the JS branch.

---

## Phase 1 — Foundation

### Tasks

1. **Viewport** — In `src/app/layout.tsx`, add Next.js viewport export if missing:
   ```ts
   export const viewport = { width: "device-width", initialScale: 1 };
   ```
2. **Overflow** — In `src/app/globals.css`:
   ```css
   body { overflow-x: hidden; }
   ```
3. **Hook** — Create `src/hooks/useIsMobile.ts`:
   - `matchMedia('(max-width: 767px)')`
   - SSR-safe default (`false` until mounted, or `undefined` + skeleton)
   - Listen to `resize` / `change` on `MediaQueryList`

### Files

| File | Action |
|------|--------|
| `src/app/layout.tsx` | Add `viewport` export |
| `src/app/globals.css` | `overflow-x: hidden` |
| `src/hooks/useIsMobile.ts` | **New** |

### Acceptance

- [ ] No horizontal scroll on empty page at 375px
- [ ] Hook returns correct value after mount when resizing DevTools

---

## Phase 2 — Menubar (mobile chrome)

### Tasks

1. Extract menubar markup from `Desktop.tsx` into shared pieces or add mobile variants.
2. **&lt; 768px:**
   - Show: logo (opens terminal / home), **hamburger** (44×44px), **Get in touch** (44px min height)
   - Hide: inline Work / Projects / Research / Skills nav
   - Hamburger opens panel/dropdown: full-width nav rows ≥ 48px tall, `aria-expanded`, focus trap or clear dismiss (Esc / tap outside)
3. **Status sub-bar:** hide or reduce to one line (`● available for work` only); hide location on very narrow screens if needed.
4. **Footer:** stack or truncate — hide duplicate email if CTA exists in header; keep GitHub as tappable link (44px hit area via padding).

### Files

| File | Action |
|------|--------|
| `src/components/Desktop.tsx` | Mobile menubar branch or subcomponent |
| `src/app/globals.css` | `.nav-mobile-menu`, `.menubar-icon-link` min 44px touch targets |

### Acceptance

- [ ] Menubar fits 375px without overflow
- [ ] All nav destinations reachable without horizontal scroll
- [ ] Touch targets ≥ 44×44px (WCAG 2.5.5)
- [ ] Keyboard: hamburger focusable, Esc closes menu

---

## Phase 3 — Mobile layout shell

### Tasks

1. Create `src/components/MobileLayout.tsx` — props mirror `Desktop` content props (`experience`, `projects`, `research`).
2. Structure:
   ```
   MobileLayout
   ├── MobileHeader (or reuse Phase 2 menubar)
   ├── TerminalPreview (non-draggable; optional collapse)
   ├── main (scrollable)
   │   ├── AboutSection
   │   ├── WorkSection
   │   ├── ProjectsSection
   │   ├── ResearchSection
   │   └── SkillsSection
   └── MobileFooter
   ```
3. Each section = full-width card (`width: 100%`, `padding`, `max-width` none on shell — use `padding-inline: clamp(1rem, 4vw, 1.5rem)`).
4. In `Desktop.tsx`:
   ```tsx
   const isMobile = useIsMobile();
   if (isMobile) return <MobileLayout ... />;
   return ( /* existing desktop tree */ );
   ```

### Files

| File | Action |
|------|--------|
| `src/components/MobileLayout.tsx` | **New** |
| `src/components/Desktop.tsx` | Branch at top |

### Acceptance

- [ ] Mobile view scrolls vertically through all sections
- [ ] No `DraggableWindow` rendered below 768px
- [ ] Desktop view unchanged at 1280px

---

## Phase 4 — Section content (wire existing windows)

### Tasks

1. Wrap each window body in a card shell (border, titlebar-style heading, no drag):
   - About → `<AboutWindow />`
   - Work → `<WorkWindow experience={...} />` + list of jobs as tappable rows (not desktop icons)
   - Projects / Research / Skills → same pattern
2. Work/Projects/Research item rows: min-height 48px, full width, no 172px icon grid.
3. Terminal on mobile: static card with shortened height (`max-height: 40vh`) or “collapsed” with expand — avoid auto-typing eating scroll on first paint (optional: pause animation until in view).

### Files

| File | Action |
|------|--------|
| `src/components/MobileLayout.tsx` | Wire sections |
| `src/components/Terminal.tsx` | Optional `compact` prop |

### Acceptance

- [ ] All MDX content reachable on mobile without desktop icons
- [ ] Body text ≥ 16px; no pinch-zoom required
- [ ] Section order: terminal preview → about → work → projects → research → skills (adjust if UX testing says otherwise)

---

## Phase 5 — Item detail (bottom sheet)

### Tasks

1. Create `src/components/MobileSheet.tsx`:
   - `position: fixed; inset: 0; z-index: high`
   - Backdrop + panel (full screen or bottom sheet)
   - Close control ≥ 44×44px
   - `overflow-y: auto` body
2. State in `MobileLayout`: `openItem: { type, slug, title } | null`
3. Reuse:
   - `ExperienceContent`, `ProjectContent`, `ResearchContent`
4. No `openItem` absolute x/y positioning on mobile.

### Files

| File | Action |
|------|--------|
| `src/components/MobileSheet.tsx` | **New** |
| `src/components/MobileLayout.tsx` | Sheet state + render |

### Acceptance

- [ ] Tap job/project/research row → sheet opens with correct content
- [ ] Close/back returns to section list
- [ ] Sheet scrolls independently; no body scroll lock bugs

---

## Phase 6 — Desktop / tablet touch polish (optional, ≥ 768px)

### Tasks

1. `DraggableWindow.tsx`: mirror drag/resize with `touchstart` / `touchmove` / `touchend` (use `e.touches[0]`).
2. Clamp position so windows cannot drag fully off-screen.
3. Pad close button hit area to 44px (visual stays 11px) via CSS pseudo or wrapper — helps tablet.
4. Hide resize handles below 768px (irrelevant if Phase 3 done correctly).

### Files

| File | Action |
|------|--------|
| `src/components/DraggableWindow.tsx` | Touch handlers + clamp |
| `src/app/globals.css` | Close button touch padding |

### Acceptance

- [ ] iPad-width drag works without mouse
- [ ] Desktop mouse behavior unchanged

---

## Phase 7 — CSS tokens & overflow hardening

### Tasks

1. Grep audit:
   ```bash
   rg "width:\s*\d+px|w-\[\d|style=\{\{.*width" src/
   ```
2. Mobile sections: `min-width: 0` on flex children (mono/code blocks).
3. Images in MDX content:
   ```css
   img, video { max-width: 100%; height: auto; }
   ```
4. Avoid changing desktop `WIN_WIDTHS` / `ITEM_WIN_WIDTHS` for mobile — mobile path should not use them.

### Acceptance

- [ ] No horizontal scroll at 375px with all sections + one sheet open
- [ ] Long filenames / code lines wrap or scroll inside card, not page

---

## Implementation order

| Step | Phase | Rationale |
|------|-------|-----------|
| 1 | Phase 1 | Foundation; no visual regressions |
| 2 | Phase 2 | Fixes most obvious mobile breakage (menubar) |
| 3 | Phase 3 | Mobile shell; proves branch works |
| 4 | Phase 4 | Content parity |
| 5 | Phase 5 | Item detail parity |
| 6 | Phase 7 | Overflow pass |
| 7 | Phase 6 | Tablet polish (can defer) |

---

## Testing

Run in Chrome DevTools device mode and one real phone if possible.

| Width | Checks |
|-------|--------|
| **375px** | No horizontal scroll; menubar usable; all sections scroll; sheet open/close; 44px taps |
| **768px** | Desktop OS appears; windows draggable (mouse) |
| **1280px** | Unchanged from current production behavior |

### Checklist (from `responsive-frontend` skill)

- [ ] Viewport meta / export present
- [ ] No horizontal scroll at 375px
- [ ] Layout adapts mobile / tablet / desktop
- [ ] Touch targets ≥ 44×44px
- [ ] Nav usable on mobile
- [ ] Text readable ≥ 16px body
- [ ] Images scale in containers
- [ ] Interactive states work without hover-only flows
- [ ] `prefers-reduced-motion` respected (terminal animation)
- [ ] Primary CTA (“Get in touch”) reachable

### Commands

```bash
npm run build   # static export must still pass
npm run dev     # manual DevTools testing
```

---

## Out of scope (unless user asks)

- Separate URL for mobile (`m.hk39.dev`)
- Rewriting content / MDX
- PWA / install prompt
- Hamburger animation polish beyond functional
- Container queries (optional later)
- Changing desktop window default positions or widths

---

## Key file reference

| Path | Role |
|------|------|
| `src/components/Desktop.tsx` | Main shell; branch point |
| `src/components/DraggableWindow.tsx` | Window chrome; desktop only |
| `src/components/Terminal.tsx` | Entry animation |
| `src/components/windows/*` | Reusable content |
| `src/app/globals.css` | Tokens, nav, resize styles |
| `src/app/layout.tsx` | Fonts, metadata, viewport |

### Desktop window widths (do not use on mobile path)

```ts
// Desktop.tsx
WIN_WIDTHS: terminal 480, about 520, work 780, projects 860, research 760, skills 680
ITEM_WIN_WIDTHS: default 580, project 700
```

---

## Notes for implementing agent

1. **Minimize scope** — one phase per PR/commit if possible.
2. **Reuse components** — mobile is a layout swap, not a rewrite.
3. **No `transition: all`** — prefer `transform` / `opacity` for sheet animations.
4. **Pair with unslopify** — keep `--text` for body on dark cards; don’t grey mobile copy.
5. **Do not commit** unless user asks.
6. **Read** `~/.cursor/skills/responsive-frontend/SKILL.md` and `reference.md` for Figma-aligned defaults.

---

## Figma references (if needed)

- [Responsive website design](https://www.figma.com/resource-library/responsive-website-design/)
- [Mobile-first design](https://www.figma.com/resource-library/mobile-first-design/)
- [Mobile website design](https://www.figma.com/resource-library/mobile-website-design/)
- [Button states / touch targets](https://www.figma.com/resource-library/button-states/)
