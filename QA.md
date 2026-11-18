# QA Report

## Automated checks (executed)

| Check | Result |
|---|---|
| `npx tsc --noEmit` | Clean |
| `npm test` (vitest, 9 files) | 70 passed |
| `npx vite build` | Succeeds; `base: './'`, HashRouter |
| `npm run qa:links` | 23 download references exist |

Tests cover: scoring and pass mark, course navigation and gating, lesson progress, localStorage persistence, reset and cancel, knowledge-check feedback and retry, final-assessment mode, branching, INSIGHT360 explorer and data-quality hunt, FlowBoard goal checks, analytics calculations, project filtering, case-study sections, 404 routing, Home CTAs, and Toolkit file existence. Content-integrity tests check every course's structure.

## Browser checks (Playwright, Chromium, `vite preview`)

- Widths 1280, 768 and 390px on Home, About, Projects, four case studies, Lab, Toolkit, Contact: no horizontal overflow; one `h1` per page.
- ELEVATE and COACHFORWARD: an automated walker completed every step through the final assessment to the completion summary. It picks the first option, so scores were low; it proves flow, not content quality.
- INSIGHT360 and LAUNCHPAD custom activities (Explorer, QualityHunt, FlowBoard): covered by component and logic tests; **not** walked end to end in the browser.
- Console: no errors on the pages visited. Focus outline measured as 3px solid gold on the course start button.
- Contrast audit of text elements found gold eyebrow text at 3.27:1 and a gold avatar; both fixed. Other flagged items were false positives from background parsing.

## Generated documents

- PDFs were rendered to images and reviewed visually: consistent branding, no overlapping text. Page counts: LaunchPad 2, CoachForward 3, ELEVATE 3, Instructional Design 2, INSIGHT360 2. INSIGHT360 text shows 91.4% completion and pre/post 59.1 and 85.1 (n = 63), matching the dataset.
- DOCX and XLSX were generated and loaded programmatically only.
- **Workbook formulas were not recalculated** (no spreadsheet application available). Formulas, validations and conditional formatting were verified as present, not as computed.

## Accessibility findings

Implemented: skip link, landmarks, visible focus, labelled controls, live-region feedback, reduced-motion CSS, chart data tables, status shown in text as well as colour.

## Not verified / outstanding manual checks

- No screen-reader testing (NVDA, JAWS, VoiceOver); announcements are untested with assistive technology.
- No full WCAG 2.2 AA audit; contrast was spot-checked programmatically only.
- Reduced-motion was not exercised in the browser.
- Generated PDFs are not guaranteed to be tagged or fully accessible; DOCX alt text not checked.
- Full keyboard-only walkthrough of every course and the FlowBoard simulation.
- Live GitHub Pages site not checked; the deployment workflow is unchanged and was not run.
- Tablet and 390px checks were layout-overflow checks, not full usability tests on devices.
- Older `src/lab/ElevateModule.tsx` and `Insight360.tsx` remain in the repo but are not shown in the Lab.
