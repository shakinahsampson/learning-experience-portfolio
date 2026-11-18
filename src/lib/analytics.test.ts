import { describe, expect, it } from 'vitest'
import data from '../data/learners.json'
import { byCohort, qualityChecks, summarize, toCSV, type Learner } from './analytics'

const rows = data.records as Learner[]

describe('synthetic dataset', () => {
  it('has at least 60 records and a disclosure notice', () => {
    expect(rows.length).toBeGreaterThanOrEqual(60)
    expect(data.notice).toMatch(/synthetic/i)
  })
  it('detects the three disclosed data-quality issues', () => {
    const kinds = qualityChecks(rows).map((i) => i.issue)
    expect(kinds.some((k) => k.startsWith('Duplicate'))).toBe(true)
    expect(kinds.some((k) => k.startsWith('Participation out of range'))).toBe(true)
    expect(kinds.some((k) => k.startsWith('Marked completed'))).toBe(true)
  })
})

describe('summarize', () => {
  it('computes rates that are bounded and consistent', () => {
    const s = summarize(rows)
    expect(s.enrolled).toBe(rows.length)
    expect(s.completionRate).toBeGreaterThan(0)
    expect(s.completionRate).toBeLessThanOrEqual(100)
    expect(s.avgGain).toBeCloseTo(s.avgPost - s.avgPre, 0)
  })
  it('handles empty input without NaN', () => {
    const s = summarize([])
    expect(s.completionRate).toBe(0)
    expect(s.avgPost).toBe(0)
  })
  it('groups by cohort', () => {
    expect(byCohort(rows).reduce((a, c) => a + c.enrolled, 0)).toBe(rows.length)
  })
})

describe('toCSV', () => {
  it('escapes commas and quotes', () => {
    expect(toCSV([{ a: 'x,y', b: 'say "hi"' }])).toBe('a,b\n"x,y","say ""hi"""\n')
  })
})

describe('parseLearnerCSV', () => {
  it('round-trips the generated dataset', async () => {
    const { readFileSync } = await import('node:fs')
    const { parseLearnerCSV } = await import('./analytics')
    const parsed = parseLearnerCSV(readFileSync('public/downloads/insight360-synthetic-learners.csv', 'utf8'))
    expect(parsed).toHaveLength(rows.length)
    expect(parsed[0].learner_id).toBe(rows[0].learner_id)
    expect(parsed[13].post_score).toBeNull()
  })
})
