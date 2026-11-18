import { describe, expect, it } from 'vitest'
import { courseProgress, evaluateDraft, moduleScore, recordResult, scoreChoice, scoreOrder, scoreSort, wordCount } from './scoring'
import { emptyState, type ChoiceActivity, type DraftActivity, type OrderActivity, type SortActivity } from './types'
import { elevate } from './content/elevate'

const choice: ChoiceActivity = { kind: 'choice', prompt: 'p', options: [{ text: 'a', quality: 'best', feedback: 'f' }, { text: 'b', quality: 'ok', feedback: 'f' }, { text: 'c', quality: 'poor', feedback: 'f' }] }
const order: OrderActivity = { kind: 'order', prompt: 'p', items: ['a', 'b', 'c', 'd'] } as OrderActivity
const sort: SortActivity = { kind: 'sort', prompt: 'p', buckets: ['X', 'Y'], items: [{ text: 'i1', bucket: 0, why: '' }, { text: 'i2', bucket: 1, why: '' }] }
const draft: DraftActivity = { kind: 'draft', prompt: 'p', minWords: 5, criteria: [{ label: 'a', anyOf: ['alpha', 'one'], coaching: '' }, { label: 'b', anyOf: ['beta'], coaching: '' }], model: '' }

describe('assessment scoring', () => {
  it('scores choices best 1, ok 0.5, poor 0', () => {
    expect([0, 1, 2].map((i) => scoreChoice(choice, i))).toEqual([1, 0.5, 0])
  })
  it('scores ordering by correct positions and rejects wrong lengths', () => {
    expect(scoreOrder(order, ['a', 'b', 'c', 'd'])).toBe(1)
    expect(scoreOrder(order, ['b', 'a', 'c', 'd'])).toBe(0.5)
    expect(scoreOrder(order, ['a'])).toBe(0)
  })
  it('scores sorting and treats unassigned items as wrong', () => {
    expect(scoreSort(sort, { i1: 0, i2: 1 })).toBe(1)
    expect(scoreSort(sort, { i1: 0 })).toBe(0.5)
    expect(scoreSort(sort, { i1: 1, i2: 0 })).toBe(0)
  })
  it('evaluates drafts by rubric, case-insensitively, and halves the score when too short', () => {
    expect(evaluateDraft(draft, 'Alpha and BETA are both present here today').score).toBe(1)
    expect(evaluateDraft(draft, 'alpha only in this sentence of words').met).toEqual([true, false])
    expect(evaluateDraft(draft, 'alpha beta').score).toBe(0.5)
    expect(wordCount('  two words ')).toBe(2)
    expect(wordCount('')).toBe(0)
  })
})

describe('results, retries and progress', () => {
  it('keeps the first-attempt score and the best score across retries', () => {
    const a = recordResult(undefined, 0.5, 1)
    const b = recordResult(a, 1, 1)
    expect(b).toEqual({ score: 1, max: 1, attempts: 2, firstScore: 0.5 })
    expect(recordResult(b, 0, 1).score).toBe(1)
  })
  it('computes course progress including the final assessment', () => {
    const total = elevate.modules.reduce((n, m) => n + m.steps.length, 0) + 1
    const s = emptyState()
    expect(courseProgress(elevate, s)).toEqual({ total, done: 0, pct: 0 })
    s.visited = elevate.modules[0].steps.map((x) => x.id)
    expect(courseProgress(elevate, s).done).toBe(elevate.modules[0].steps.length)
    s.visited = elevate.modules.flatMap((m) => m.steps.map((x) => x.id))
    s.final = { score: 5, max: 6, attempts: 1, best: 5 }
    expect(courseProgress(elevate, s).pct).toBe(100)
  })
  it('computes module scores from first attempts', () => {
    const s = emptyState()
    const m = elevate.modules[0]
    s.results[m.steps[3].id] = { score: 1, max: 1, attempts: 2, firstScore: 0.5 }
    expect(moduleScore(elevate, s, m.id)).toMatchObject({ first: 0.5, max: 1, pct: 50 })
  })
})
