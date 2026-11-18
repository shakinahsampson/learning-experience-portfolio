# Shakinah Sampson — Learning & Development Portfolio

Interactive portfolio for **Learning Experience Designer | Learning & Development | Employee Enablement** roles. Built with React, TypeScript, Vite, and Tailwind CSS. Static site: no backend, no paid APIs, no accounts, no API keys.

> **Notice:** All fictional organizations (e.g., *Meridian Strategy Group*), employees, datasets, and simulated outcomes are illustrative. The four case studies are independent portfolio projects — not client or employer work. No corporate HR experience, clients, awards, or real results are claimed.

## What's inside

| Section | Content |
|---|---|
| Home | Value-proposition hero, three capability highlights, four case-study previews, CTAs to projects, courses and downloads |
| About | Career narrative, transferable skills, evidence-based practice, verified credentials (MAT, PSPO I) and stated boundaries |
| Projects | Category filter, preview cards, and four full case studies (challenge, gap, needs, objectives, strategy, rationale, tools, assessment, implementation, evaluation, completed vs. proposed, limitations, future) |
| Learning Lab | Four multi-screen course players (below) |
| Toolkit | Polished PDF/DOCX/XLSX resources plus plain-text and CSV files |
| Contact | Email and portfolio links |

### Courses (all independent fictional simulations)

Each lesson follows: scenario, instruction, worked example, guided practice (hints), independent practice, scenario knowledge check, consequence feedback with retry, and reinforcement/job aid. Each course has a separate final assessment (pass mark 75%) and a completion summary. Progress is saved only in the browser (`localStorage`), with a reset control.

- **ELEVATE**: 90-day consulting onboarding at the fictional Meridian Strategy Group (Jordan, Maya, Alex, Priya); five modules including an integrated readiness capstone.
- **LAUNCHPAD**: FlowBoard (fictional software) simulation covering status, blockers, ownership, dependencies, risk escalation and status updates; guided and independent projects.
- **COACHFORWARD**: branching manager conversations using Situation-Behavior-Impact-Ask/Agree.
- **INSIGHT360**: analytics reasoning on the synthetic dataset; every figure is computed from the data.

Rubric checks for written drafts are keyword self-checks, not a real grader; the UI says so.

## Regenerating downloadable resources

`scripts/build-resources.py` builds the branded PDFs (reportlab), Word templates (python-docx) and the project-management workbook (openpyxl) into `public/downloads/`. Install with `pip install reportlab python-docx openpyxl pypdf`, run `python3 scripts/build-resources.py`, then `npm run qa:links`. The workbook has formulas, drop-downs and conditional formatting; its status date is the input cell `Summary!B3`. Generated files are committed.

## Run locally

Requires Node 20+.

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit and component tests (vitest, jsdom)
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
src/course/                    Course player, activities, scoring; content/ holds the four courses
src/lab/                       FlowBoard simulation, INSIGHT360 explorer, charts (older demo files remain, unused)
src/data/caseExtras.ts         Extended case-study sections
scripts/build-resources.py     Generates PDFs, DOCX, XLSX
src/pages/, src/components/    Routes and shared UI
QA.md                          Manual QA checklist
```

## Data, privacy, and accessibility

- **Synthetic data:** `public/downloads/insight360-synthetic-learners.csv` (72 records, fixed seed). Three data-quality issues are injected deliberately and disclosed.
- **Local progress:** lesson completion, quiz best scores, and one reflection are stored in `localStorage` only, never transmitted. The footer has "Clear saved progress"; each demo has Reset.
- **Accessibility:** skip link, semantic landmarks, visible focus ring, keyboard-operable controls, labelled form fields, chart data tables, `prefers-reduced-motion` support. See `QA.md`.

## Content integrity

Verified facts used on the site: Master of Arts in Teaching; teaching English, curriculum design, facilitation, colleague onboarding/learning-technology support, learning-outcome analysis; PSPO I. Anything else is clearly labeled as a simulation.
