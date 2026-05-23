# Publish to GitHub

Push this project to GitHub with a proper README, GitHub Pages, and updated repo metadata. Follow these steps in order.

---

## Step 1 — Secret scan

Before touching git, scan the working tree for accidental secrets. Search for patterns like API keys, tokens, passwords, and private credentials:

```
grep -rEi "(api[_-]?key|secret[_-]?key|password|bearer\s+[A-Za-z0-9]{20,}|[A-Za-z0-9]{32,}=)" --include="*.js" --include="*.html" --include="*.css" --include="*.json" --include="*.env" .
```

Also check for `.env` files or any file containing hardcoded email addresses used as credentials (not display emails). The formsubmit.co endpoint in `script.js` contains an email address — this is intentional and public-facing, so it is NOT a secret. Report what you find and stop if you discover actual secrets that should not be public. Do NOT proceed past this step if real secrets are found.

---

## Step 2 — Write README.md

Overwrite `README.md` with content that follows the structure and style of the ai-cms README (https://github.com/alfredang/ai-cms):

- Lead with a one-paragraph overview that bolds the key highlights
- **Tech Stack** section: bullet list, each item as `**Label**: description`
- **Features** section: subsections with bold headers, brief bullet points per feature group
- **Deployment** section: how to run locally and how GitHub Pages auto-deploys
- End with **Live Demo** linking to the GitHub Pages URL (`https://angchongboon.github.io/fluffy-octo-motor/`) and a **License** line (MIT)

Here is the content to write — adapt phrasing as needed but keep this structure and factual accuracy:

```markdown
# Luxe Interiors

A fully static luxury interior design website for Kuala Lumpur. Built without a build step — three files, deployed on GitHub Pages and ready to customise.

## Tech Stack

- **HTML5**: Semantic markup, OG meta tags, accessibility attributes
- **CSS3**: Custom properties for theming, dark-mode overrides, responsive grid and flex layouts
- **Vanilla JS**: Ten self-contained IIFEs — no framework, no bundler, no dependencies
- **GitHub Actions**: Automated deploy-to-Pages on every push to `main`

## Features

**Dark Mode**
- Toggles `dark` class on `<html>`, persisted via `localStorage`

**Portfolio Filter**
- `data-category` / `data-filter` attributes drive show/hide with `.hidden` and `.filtering` classes

**Testimonial Carousel**
- Responsive: 1 card on mobile, 2 on tablet, 3 on desktop
- Auto-advances every 5 s, pauses on hover, supports touch swipe

**Contact Form**
- Submits via `fetch` POST to FormSubmit (no backend required)

**Scroll Animations**
- `.fade-in` elements revealed by `IntersectionObserver` at 0.12 threshold
- Stats counter triggered at 0.4 threshold

## Deployment

**Local**: Open `index.html` directly in a browser — no server needed.

**GitHub Pages**: Push to `main`. The workflow at `.github/workflows/deploy.yml` uploads the repo root as a Pages artifact and deploys automatically.

## Live Demo

https://angchongboon.github.io/fluffy-octo-motor/

## License

MIT
```

---

## Step 3 — Verify GitHub Pages workflow

Confirm `.github/workflows/deploy.yml` exists and targets `branches: [main]` with `actions/deploy-pages`. If it is missing or misconfigured, create or fix it to match this canonical form:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - id: deployment
        uses: actions/deploy-pages@v4
```

---

## Step 4 — Stage, commit, and push

Run the following git operations:

1. `git add -A` — stage everything
2. Check `git status` and confirm no unexpected files (e.g. `.env`, secrets) are staged. If any are present, add them to `.gitignore` and unstage them before continuing.
3. Commit with a message like: `chore: update README and verify Pages workflow`
4. `git push origin main`

If the push is rejected (non-fast-forward), do NOT force-push. Report the conflict to the user and stop.

---

## Step 5 — Update GitHub repo metadata

Use the GitHub CLI (`gh`) to update the repository's About section:

```
gh repo edit AngChongBoon/fluffy-octo-motor \
  --description "Static luxury interior design website for KL — dark mode, portfolio filter, carousel, contact form. No build step." \
  --homepage "https://angchongboon.github.io/fluffy-octo-motor/" \
  --add-topic "interior-design" \
  --add-topic "static-site" \
  --add-topic "github-pages" \
  --add-topic "vanilla-js" \
  --add-topic "css-custom-properties"
```

If `gh` is not installed or not authenticated, skip this step and tell the user what command to run manually.

---

## Done

Report:
- What was pushed (commit hash and branch)
- Whether the Pages workflow was already correct or needed a fix
- Whether repo metadata was updated or needs to be done manually
- The live URL: https://angchongboon.github.io/fluffy-octo-motor/
