# QA Checklist

Automated: `npm test`, `npm run build` (typecheck), `npm run qa:links`.

## Functional
- [ ] Navigation (desktop and mobile menu) reaches all six pages; deep link `#/projects/elevate` works on refresh.
- [ ] Projects filter: each category shows the right projects; "All" resets; counts announce.
- [ ] ELEVATE: lessons expand, knowledge checks score and give per-option feedback, retry works, progress bar updates and persists after reload, Reset clears it.
- [ ] ELEVATE: scenario shows reaction + coaching, reaches end screen, retry restarts; final assessment target 80%.
- [ ] ELEVATE dashboard: labeled synthetic; "View as table" opens for each chart.
- [ ] LAUNCHPAD: each of the four tasks rejects wrong input with guidance and accepts right input; hints toggle; troubleshooting branches; job aid downloads.
- [ ] COACHFORWARD: both opening branches reachable; retry; assessment; reflection saves and reloads.
- [ ] INSIGHT360: loads CSV (loading state), filters update metrics/charts, empty state when no match, "Clear filters", filtered CSV downloads, data-quality list shows 3 issues. Stop the server/rename the CSV to confirm the error state and "Try again".
- [ ] Toolkit: every download opens/saves.

## Content integrity
- [ ] Every case study, demo, and the footer label fictional organizations/data as simulated.
- [ ] No claim of corporate HR experience, clients, awards, or real results.
- [ ] Learning metrics are not presented as business outcomes or causation.

## Accessibility
- [ ] Keyboard-only: all controls reachable, logical order, visible focus.
- [ ] Skip link works; one `h1` per page; landmarks present.
- [ ] Text contrast ≥ 4.5:1 (spot-check with browser devtools).
- [ ] 200% zoom and 320px width: no horizontal page scroll (tables scroll inside their container).
- [ ] `prefers-reduced-motion: reduce`: animations effectively off.
- [ ] Screen reader: quiz feedback and status messages announce (role=status).

## Deployment
- [ ] Pages source set to GitHub Actions; workflow green; site loads under the repo sub-path; `/legacy/` still works.
