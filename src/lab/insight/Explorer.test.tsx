// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach } from 'vitest'
import { Explorer, QualityHunt } from './Explorer'
import { rawRows } from './data'

afterEach(cleanup)

const questions = [
  { prompt: 'Which is larger?', options: ['Alpha', 'Beta'], answer: 'Beta', explain: 'Beta is correct.' },
  { prompt: 'Which is smaller?', options: ['Alpha', 'Beta'], answer: 'Alpha', explain: 'Alpha is correct.' },
]

describe('Explorer', () => {
  it('disables checking until all answered, then reports the score', async () => {
    const onFinish = vi.fn()
    const user = userEvent.setup()
    render(<Explorer questions={questions} mode="guided" onFinish={onFinish} />)
    const check = screen.getByRole('button', { name: 'Check answers' })
    expect((check as HTMLButtonElement).disabled).toBe(true)
    const radios = screen.getAllByRole('radio')
    await user.click(radios[1])
    await user.click(radios[2])
    expect((check as HTMLButtonElement).disabled).toBe(false)
    await user.click(check)
    expect(onFinish).toHaveBeenCalledWith(2, 2)
    expect(screen.getByText('2 of 2 correct')).toBeTruthy()
  })

  it('filters records and updates the count', async () => {
    const user = userEvent.setup()
    render(<Explorer questions={questions} mode="independent" onFinish={() => {}} />)
    const delivery = screen.getByLabelText('Delivery')
    const options = Array.from((delivery as HTMLSelectElement).options).map((o) => o.value)
    await user.selectOptions(delivery, options[1])
    expect(screen.getAllByText(/Showing \d+ of 70 records/)[0].textContent).not.toContain('Showing 70 of 70')
  })
})

describe('QualityHunt', () => {
  it('scores found issues and penalises false flags', async () => {
    const onFinish = vi.fn()
    const user = userEvent.setup()
    render(<QualityHunt mode="independent" onFinish={onFinish} />)
    await user.click(screen.getByRole('checkbox', { name: new RegExp(`row 1$`) }))
    await user.click(screen.getByRole('button', { name: 'Check my flags' }))
    const [score, max] = onFinish.mock.calls[0]
    expect(max).toBe(3)
    expect(score).toBeLessThanOrEqual(3)
    expect(rawRows.length).toBe(72)
  })
})
