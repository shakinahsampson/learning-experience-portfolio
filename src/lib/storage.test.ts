// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { clearAllProgress, loadJSON, saveJSON } from './storage'

afterEach(() => localStorage.clear())

describe('local progress storage', () => {
  it('round-trips values under the portfolio prefix', () => {
    saveJSON('k', { a: 1 })
    expect(localStorage.getItem('ss-portfolio:k')).toBe('{"a":1}')
    expect(loadJSON('k', null)).toEqual({ a: 1 })
  })
  it('falls back when nothing is stored or the value is corrupt', () => {
    expect(loadJSON('missing', 'x')).toBe('x')
    localStorage.setItem('ss-portfolio:bad', '{oops')
    expect(loadJSON('bad', 'fallback')).toBe('fallback')
  })
  it('clears only portfolio keys', () => {
    saveJSON('a', 1)
    localStorage.setItem('other', '1')
    clearAllProgress()
    expect(localStorage.getItem('ss-portfolio:a')).toBeNull()
    expect(localStorage.getItem('other')).toBe('1')
  })
})
