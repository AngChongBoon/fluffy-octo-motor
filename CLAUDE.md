# CLAUDE.md

**Luxe Interiors** — static luxury interior design site for KL. Three files, no build step.

## Run
Open `index.html` in a browser.

## Files
- [index.html](index.html) — all sections (Hero, Services, Portfolio, Testimonials, Stats, Contact, Footer)
- [style.css](style.css) — CSS vars in `:root` (lines 6–38); dark mode overrides in `html.dark` (40–49)
- [script.js](script.js) — 10 IIFEs; theme IIFE runs before paint

## Key behaviours
- **Dark mode**: toggles `dark` on `<html>`, persisted in `localStorage` key `luxe-theme`
- **Portfolio filter**: `data-category` on cards, `data-filter` on buttons, toggles `.hidden`/`.filtering`
- **Carousel**: 1/2/3 cards at mobile/tablet/desktop; auto-advances 5s, pauses on hover, touch swipe
- **Contact form**: `fetch` POST to `https://formsubmit.co/ajax/ang.chongboon@gmail.com` (script.js:305)
- **Scroll animations**: `.fade-in` + `IntersectionObserver` (threshold 0.12); stats counter at 0.4

## Customisation
| What | Where |
|------|-------|
| WhatsApp number | index.html:20 |
| Contact form email | script.js:305 |
| Phone / email / address | index.html contact section + footer |
| Hero background | index.html:80 |
| Portfolio images | index.html portfolio section |
| Stats targets | `data-target` on `.stat-number` |
