import type { ChoiceActivity, Course, CourseState, DraftActivity, OrderActivity, SortActivity, StepResult } from './types'

export const QUALITY_POINTS = { best: 1, ok: 0.5, poor: 0 } as const

export const scoreChoice = (a: ChoiceActivity, index: number) => QUALITY_POINTS[a.options[index].quality]

/** Fraction of items placed in the correct position. */
export function scoreOrder(a: OrderActivity, attempt: string[]): number {
  if (attempt.length !== a.items.length) return 0
  return attempt.filter((x, i) => x === a.items[i]).length / a.items.length
}

/** assignment: item text -> bucket index. Unassigned items count as wrong. */
export function scoreSort(a: SortActivity, assignment: Record<string, number>): number {
  return a.items.filter((i) => assignment[i.text] === i.bucket).length / a.items.length
}

export const wordCount = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0)

export interface DraftEval { met: boolean[]; enoughWords: boolean; score: number }
/** Rubric self-check: keyword presence only. It cannot judge quality; the UI says so. */
export function evaluateDraft(a: DraftActivity, text: string): DraftEval {
  const met = a.criteria.map((c) => c.anyOf.some((k) => new RegExp(k, 'i').test(text)))
  const enoughWords = wordCount(text) >= a.minWords
  const base = met.filter(Boolean).length / a.criteria.length
  return { met, enoughWords, score: enoughWords ? base : base * 0.5 }
}

/** Records first attempt separately so retries support learning without inflating the first-attempt score. */
export function recordResult(prev: StepResult | undefined, score: number, max: number): StepResult {
  return prev
    ? { score: Math.max(prev.score, score), max, attempts: prev.attempts + 1, firstScore: prev.firstScore }
    : { score, max, attempts: 1, firstScore: score }
}

export interface Progress { total: number; done: number; pct: number }
export function courseProgress(course: Course, state: CourseState): Progress {
  const ids = course.modules.flatMap((m) => m.steps.map((s) => s.id))
  const done = ids.filter((id) => state.visited.includes(id)).length + (state.final ? 1 : 0)
  const total = ids.length + 1
  return { total, done, pct: Math.round((done / total) * 100) }
}

export function moduleScore(course: Course, state: CourseState, moduleId: string) {
  const m = course.modules.find((x) => x.id === moduleId)!
  const rs = m.steps.map((s) => state.results[s.id]).filter(Boolean)
  const max = rs.reduce((a, r) => a + r.max, 0)
  const first = rs.reduce((a, r) => a + r.firstScore, 0)
  return { first, max, pct: max ? Math.round((first / max) * 100) : 0 }
}
