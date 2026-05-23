# Frontend Design Assistant

You are helping maintain and improve **Luxe Interiors** — a luxury interior design website for KL built with plain HTML, CSS, and vanilla JS (no build step). The visual brand is high-end: gold accents (`#c9a96e`), neutral off-whites, deep charcoals, and a dark-mode variant. Every change must look correct in both light and dark modes and across mobile / tablet / desktop.

---

## How to use this skill

Run `/design` with an optional description of the task, for example:

- `/design` — general design review of the current page
- `/design hero section feels cluttered` — focused fix
- `/design add a new FAQ section` — new component
- `/design the portfolio cards look misaligned on mobile` — responsive bug

If no argument is given, perform a full visual audit (Step 1 → Step 3).

---

## Step 1 — Read current state

Before touching anything, read the three source files to understand the current implementation:

- [index.html](../../index.html) — structure and content
- [style.css](../../style.css) — CSS custom properties (`:root` lines 6–38), dark-mode overrides (`html.dark` lines 40–49), and all component styles
- [script.js](../../script.js) — interactive behaviours

Identify the CSS variables relevant to the task (colours, spacing, typography, transitions).

---

## Step 2 — Plan the change

State in 2–3 sentences what you are going to change and why it improves the luxury feel, accessibility, or responsiveness. Get confirmation from the user if the change is non-trivial (new section, major layout shift, colour palette change).

Design principles to follow:
- **Gold** (`--gold: #c9a96e`, hover `--gold-dark: #b8935a`) is the only accent colour — use sparingly for CTAs and highlights
- **Typography**: headings use `var(--font-heading)` (Playfair Display), body uses `var(--font-body)` (Inter)
- **Spacing**: prefer multiples of 8 px; section padding is `var(--section-padding)`
- **Motion**: keep transitions at 0.3 s ease; scroll animations use `.fade-in` + `IntersectionObserver`
- **Dark mode**: every new colour or background must have a `html.dark` override in `:root` or the component block

---

## Step 3 — Implement and verify

1. Make the smallest edit that achieves the goal — edit existing rules before adding new ones
2. Add `html.dark` overrides for any new colour tokens
3. Add responsive breakpoints if the component has layout changes at mobile/tablet
4. Start a local server and use Playwright to visually verify:

```
# Start server (if not already running)
npx serve -p 8788 -s .
```

Then use Playwright to:
- Navigate to `http://localhost:8788`
- Scroll to the changed section
- Take a screenshot in light mode
- Toggle dark mode (click `#themeToggle`) and take a second screenshot
- Resize to 375 px wide and take a third screenshot for mobile

5. Show all three screenshots to the user and confirm the change looks correct before finishing.

---

## Step 4 — Report

List exactly what files were changed and what lines were added/modified. If any CSS variable was added to `:root`, note it. If a new section was added to `index.html`, note the element ID so it can be added to the nav if needed.
