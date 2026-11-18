// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CoursePlayer } from './CoursePlayer'
import { elevate } from './content/elevate'
import { loadJSON } from '../lib/storage'
import type { CourseState } from './types'

afterEach(() => { cleanup(); localStorage.clear() })

const state = () => loadJSON<CourseState | null>(`course:${elevate.id}`, null)

describe('CoursePlayer', () => {
  it('shows the overview with objectives, duration, audience and storage disclosure', () => {
    render(<CoursePlayer course={elevate} />)
    expect(screen.getByRole('heading', { name: elevate.title })).toBeTruthy()
    expect(screen.getByText(/By the end you will be able to/)).toBeTruthy()
    expect(screen.getByText(/stored only on this device|only on your device|this device/i)).toBeTruthy()
  })

  it('starts the lesson, gates Continue until the step is complete, and saves progress locally', async () => {
    const u = userEvent.setup()
    render(<CoursePlayer course={elevate} />)
    await u.click(screen.getByRole('button', { name: 'Start the course' }))
    expect(screen.getByRole('heading', { name: elevate.modules[0].steps[0].title })).toBeTruthy()
    const next = screen.getByRole('button', { name: /Continue/ })
    expect(next).toBeTruthy()
    await u.click(next)
    expect(state()?.visited.length ?? 0).toBeGreaterThan(0)
  })

  it('restores saved progress after a remount and resets on confirmation', async () => {
    const u = userEvent.setup()
    const first = render(<CoursePlayer course={elevate} />)
    await u.click(screen.getByRole('button', { name: 'Start the course' }))
    await u.click(screen.getByRole('button', { name: /Continue/ }))
    first.unmount()
    render(<CoursePlayer course={elevate} />)
    expect(screen.getByRole('progressbar', { name: 'Course progress' }).getAttribute('aria-valuenow')).not.toBe('0')
    await u.click(screen.getByRole('button', { name: 'Reset my progress' }))
    const alert = screen.getByRole('alert')
    await u.click(within(alert).getByRole('button', { name: 'Yes, reset' }))
    expect(screen.getByRole('progressbar', { name: 'Course progress' }).getAttribute('aria-valuenow')).toBe('0')
    expect(state()?.visited).toEqual([])
    expect(screen.getByText('Progress reset on this device.')).toBeTruthy()
  })

  it('lets the learner cancel a reset without losing progress', async () => {
    const u = userEvent.setup()
    render(<CoursePlayer course={elevate} />)
    await u.click(screen.getByRole('button', { name: 'Start the course' }))
    await u.click(screen.getByRole('button', { name: /Continue/ }))
    await u.click(screen.getByRole('button', { name: 'Reset my progress' }))
    await u.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(state()?.visited.length).toBeGreaterThan(0)
  })
})
