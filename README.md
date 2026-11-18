# Shakinah Sampson — Learning & Development Portfolio

Interactive portfolio for **Learning Experience Designer | Learning & Development | Employee Enablement** roles. Built with React, TypeScript, Vite, and Tailwind CSS. Static site: no backend, no paid APIs, no accounts, no API keys.

> **Notice:** All fictional organizations (e.g., *Meridian Strategy Group*), employees, datasets, and simulated outcomes are illustrative. The four case studies are independent portfolio projects — not client or employer work. No corporate HR experience, clients, awards, or real results are claimed.

## What's inside

| Section | Content |
|---|---|
| Home | Hero, summary, featured projects, capabilities, credentials, contact |
| About | Career narrative translating teaching, curriculum, facilitation, onboarding/tech support, and learning analytics into L&D capabilities |
| Projects | Filterable gallery by category + four full case studies |
| Learning Lab | Working demos: ELEVATE module and synthetic dashboard, LAUNCHPAD simulation, COACHFORWARD branching scenario, INSIGHT360 analytics dashboard |
| Toolkit | Downloadable templates, checklists, guides, job aids, CSV data |
| Contact | Email and portfolio links |

Case studies: **ELEVATE** (90-day onboarding), **LAUNCHPAD** (digital adoption), **COACHFORWARD** (manager feedback), **INSIGHT360** (learning analytics, 72 synthetic learner records).

## Run locally

Requires Node 20+.

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests (analytics logic + dataset checks)
npm run build      # typecheck + production build to dist/
npm run preview    # serve dist/ locally
npm run qa:links   # verify every referenced download exists (run after build)
npm run gen:data   # regenerate the synthetic dataset (deterministic seed)
```

## Deploy to GitHub Pages

1. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions** (one-time).
2. Merge to `main`. `.github/workflows/deploy.yml` runs tests, builds, checks links, and publishes `dist/`.
3. Site URL: `https://shakinahsampson.github.io/learning-experience-portfolio/`.

`vite.config.ts` uses `base: './'` and the app uses `HashRouter`, so deep links and downloads work under the repo sub-path without server rewrites. The original prototype is preserved at `/legacy/` (`public/legacy/`).

## Project structure

```
.github/workflows/deploy.yml   Pages deployment (test → build → link QA → deploy)
public/downloads/              Toolkit resources and the synthetic CSV (served as-is)
public/legacy/                 Original "From Knowledge to Action" prototype, unchanged
scripts/generate-data.mjs      Seeded generator for synthetic INSIGHT360 data
scripts/check-links.mjs        QA: referenced downloads exist in public/ and dist/
src/data/projects.ts           Case-study content (all four projects)
src/data/learners.json         Synthetic dataset (JSON copy used by tests)
src/lib/                       storage (localStorage), analytics (metrics, CSV), tests
src/lab/                       Quiz, Branching engine, Charts, and the four demos
src/pages/, src/components/    Routes and shared UI
QA.md                          Manual QA checklist
```

## Data, privacy, and accessibility

- **Synthetic data:** `public/downloads/insight360-synthetic-learners.csv` (72 records, fixed seed). Three data-quality issues are injected deliberately and disclosed.
- **Local progress:** lesson completion, quiz best scores, and one reflection are stored in `localStorage` only, never transmitted. The footer has "Clear saved progress"; each demo has Reset.
- **Accessibility:** skip link, semantic landmarks, visible focus ring, keyboard-operable controls, labelled form fields, chart data tables, `prefers-reduced-motion` support. See `QA.md`.

## Content integrity

Verified facts used on the site: Master of Arts in Teaching; teaching English, curriculum design, facilitation, colleague onboarding/learning-technology support, learning-outcome analysis; PSPO I. Anything else is clearly labeled as a simulation.
