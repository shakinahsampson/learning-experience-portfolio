// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ActivityView } from './Activities'
import type { BranchActivity, ChoiceActivity } from './types'

afterEach(cleanup)

const choice: ChoiceActivity = { kind: 'choice', prompt: 'What now?', options: [
  { text: 'Escalate early with options', quality: 'best', feedback: 'Early and specific.', consequence: 'Maya adjusts the plan.' },
  { text: 'Wait and see', quality: 'poor', feedback: 'Delay hides risk.' },
] }

const branch: BranchActivity = { kind: 'branch', title: 'Talk', start: 'a', nodes: [
  { id: 'a', prompt: 'Open how?', choices: [
    { text: 'Lead with a specific example', next: 'good', quality: 'best', reply: 'Okay, I remember that call.', coach: 'Observable behavior lowers defensiveness.' },
    { text: 'Say they have an attitude problem', next: 'bad', quality: 'poor', reply: 'That’s not fair.', coach: 'A judgment, not an observation.' },
  ] },
  { id: 'good', end: { title: 'Constructive path', summary: 'They engaged.' } },
  { id: 'bad', end: { title: 'Defensive path', summary: 'They shut down.' } },
] }

describe('knowledge-check feedback and retry', () => {
  it('gives explanatory feedback and consequence, reports the score, and allows a retry in practice', async () => {
    const u = userEvent.setup(); const onAttempt = vi.fn()
    render(<ActivityView activity={choice} mode="guided" onAttempt={onAttempt} resolved={false} />)
    await u.click(screen.getByRole('button', { name: 'Wait and see' }))
    expect(screen.getByText('Delay hides risk.')).toBeTruthy()
    expect(onAttempt).toHaveBeenLastCalledWith(0)
    await u.click(screen.getByRole('button', { name: 'Try a different choice' }))
    await u.click(screen.getByRole('button', { name: 'Escalate early with options' }))
    expect(screen.getByText('Maya adjusts the plan.')).toBeTruthy()
    expect(onAttempt).toHaveBeenLastCalledWith(1)
  })
  it('does not offer retries or hints in an assessment', async () => {
    const u = userEvent.setup()
    render(<ActivityView activity={{ ...choice, hints: ['h'] }} mode="assessment" onAttempt={() => {}} resolved={false} />)
    expect(screen.queryByRole('button', { name: /hint/i })).toBeNull()
    await u.click(screen.getByRole('button', { name: 'Wait and see' }))
    expect(screen.queryByRole('button', { name: 'Try a different choice' })).toBeNull()
  })
})

describe('branching scenarios', () => {
  it('produces different replies, coaching and endings for different choices', async () => {
    const u = userEvent.setup()
    const { unmount } = render(<ActivityView activity={branch} mode="guided" onAttempt={() => {}} resolved={false} />)
    await u.click(screen.getByRole('button', { name: 'Lead with a specific example' }))
    expect(screen.getByText(/Observable behavior lowers defensiveness/)).toBeTruthy()
    await u.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText('Constructive path')).toBeTruthy()
    unmount()
    const onAttempt = vi.fn()
    render(<ActivityView activity={branch} mode="guided" onAttempt={onAttempt} resolved={false} />)
    await u.click(screen.getByRole('button', { name: 'Say they have an attitude problem' }))
    expect(screen.getByText('That’s not fair.')).toBeTruthy()
    await u.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText('Defensive path')).toBeTruthy()
    expect(onAttempt).toHaveBeenLastCalledWith(0)
    await u.click(screen.getByRole('button', { name: /Retry this scenario/ }))
    expect(screen.getByText('Open how?')).toBeTruthy()
  })
})
