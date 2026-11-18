import { describe, expect, it } from 'vitest'
import type { Activity, Course } from '../types'
import { evaluateDraft } from '../scoring'
import { elevate } from './elevate'
import { launchpad } from './launchpad'
import { coachforward } from './coachforward'

const courses: Course[] = [elevate, launchpad, coachforward]

function activities(c: Course): { id: string; a: Activity }[] {
  const out: { id: string; a: Activity }[] = []
  for (const m of c.modules) for (const s of m.steps) if ('activity' in s) out.push({ id: s.id, a: s.activity })
  for (const f of c.finalAssessment.items) out.push({ id: f.id, a: f.activity })
  return out
}

describe.each(courses.map((c) => [c.id, c] as const))('%s content integrity', (_id, c) => {
  it('has unique ids and known characters', () => {
    const ids = c.modules.flatMap((m) => m.steps.map((s) => s.id)).concat(c.finalAssessment.items.map((f) => f.id))
    expect(new Set(ids).size).toBe(ids.length)
    const names = c.characters.map((x) => x.name)
    for (const m of c.modules) for (const s of m.steps) if (s.kind === 'scenario') for (const n of s.characters ?? []) expect(names).toContain(n)
  })
  it('follows the eight-step sequence in every module', () => {
    const order = ['scenario', 'instruction', 'worked', 'guided', 'independent', 'check', 'consequence', 'reinforce']
    for (const m of c.modules) expect(m.steps.map((s) => s.kind)).toEqual(order)
  })
  it('choices have exactly one best answer and feedback on every option', () => {
    for (const { id, a } of activities(c)) if (a.kind === 'choice') {
      expect(a.options.filter((o) => o.quality === 'best'), id).toHaveLength(1)
      for (const o of a.options) expect(o.feedback.length, id).toBeGreaterThan(15)
    }
  })
  it('branch graphs are valid and every node is reachable', () => {
    for (const { id, a } of activities(c)) if (a.kind === 'branch') {
      const map = new Map(a.nodes.map((n) => [n.id, n]))
      expect(map.has(a.start), id).toBe(true)
      const seen = new Set<string>(); const q = [a.start]
      while (q.length) { const n = map.get(q.pop()!)!; if (seen.has(n.id)) continue; seen.add(n.id)
        for (const ch of n.choices ?? []) { expect(map.has(ch.next), `${id}:${ch.next}`).toBe(true); q.push(ch.next) } }
      expect([...map.keys()].filter((k) => !seen.has(k)), id).toEqual([])
      expect(a.nodes.some((n) => n.end), id).toBe(true)
    }
  })
  it('order and sort activities are well formed', () => {
    for (const { id, a } of activities(c)) {
      if (a.kind === 'order') expect(a.items.length, id).toBeGreaterThanOrEqual(3)
      if (a.kind === 'sort') for (const it of a.items) expect(it.bucket, id).toBeLessThan(a.buckets.length)
    }
  })
  it('every model answer satisfies its own rubric', () => {
    for (const { id, a } of activities(c)) if (a.kind === 'draft') {
      const r = evaluateDraft(a, a.model)
      expect(r.met.every(Boolean), `${id}: ${r.met}`).toBe(true)
    }
  })
  it('final assessment items are not reused from practice', () => {
    const practice = new Set(c.modules.flatMap((m) => m.steps.map((s) => s.id)))
    for (const f of c.finalAssessment.items) expect(practice.has(f.id)).toBe(false)
  })
})
