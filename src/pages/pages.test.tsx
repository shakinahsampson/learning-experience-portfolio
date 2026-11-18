// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Projects from './Projects'
import ProjectDetail from './ProjectDetail'
import Toolkit from './Toolkit'
import Home from './Home'
import { CATEGORIES, PROJECTS } from '../data/projects'

afterEach(cleanup)
const at = (path: string) => render(<MemoryRouter initialEntries={[path]}><Routes><Route path="/" element={<Home />} /><Route path="/projects" element={<Projects />} /><Route path="/projects/:slug" element={<ProjectDetail />} /><Route path="/toolkit" element={<Toolkit />} /></Routes></MemoryRouter>)

describe('Projects page', () => {
  it('shows all four projects and filters by category', async () => {
    const u = userEvent.setup()
    at('/projects')
    expect(screen.getAllByRole('article')).toHaveLength(4)
    const cat = CATEGORIES.find((c) => PROJECTS.filter((p) => p.categories.includes(c)).length < 4)!
    const expected = PROJECTS.filter((p) => p.categories.includes(cat)).length
    await u.click(screen.getByRole('button', { name: cat }))
    expect(screen.getAllByRole('article')).toHaveLength(expected)
    expect(screen.getByRole('button', { name: cat }).getAttribute('aria-pressed')).toBe('true')
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getAllByRole('article')).toHaveLength(4)
  })
  it('keeps a visible simulation disclosure and shows challenge, audience, skills and deliverables on each card', () => {
    at('/projects')
    expect(screen.getAllByText(/Independent fictional simulation/).length).toBe(4)
    expect(screen.getAllByText('Business challenge')).toHaveLength(4)
    expect(screen.getAllByText('Deliverables')).toHaveLength(4)
    expect(screen.getByText(/Simulation disclosure/)).toBeTruthy()
  })
})

describe('Case study routing', () => {
  it.each(PROJECTS.map((p) => p.slug))('renders every required case-study section for %s', (slug) => {
    at(`/projects/${slug}`)
    for (const h of ['Measurable learning objectives', 'Overview, challenge and performance gap', 'Needs analysis', 'Completed artifacts and proposed implementation', 'Instructional strategy and design rationale', 'Assessment approach', 'Implementation plan (proposed, ADDIE)', 'Evaluation strategy (Kirkpatrick)', 'Limitations', 'Reflection and future improvements', 'Downloads'])
      expect(screen.getByRole('heading', { name: h, level: 2 })).toBeTruthy()
    expect(screen.getByRole('link', { name: /Open the interactive demo/ }).getAttribute('href')).toContain(`/lab?demo=${slug}`)
  })
  it('shows a not-found message for unknown projects', () => {
    at('/projects/nope')
    expect(screen.getByText('Project not found')).toBeTruthy()
  })
})

describe('Home and Toolkit', () => {
  it('offers the three calls to action and three capability highlights', () => {
    at('/')
    expect(screen.getByRole('link', { name: 'Explore Projects' }).getAttribute('href')).toBe('/projects')
    expect(screen.getByRole('link', { name: 'Experience a Course' }).getAttribute('href')).toBe('/lab')
    expect(screen.getByRole('link', { name: 'Download Resources' }).getAttribute('href')).toBe('/toolkit')
    const hl = within(screen.getByRole('list', { name: 'Capability highlights' }))
    for (const t of ['Learning Design', 'Learning Operations', 'Performance Measurement']) expect(hl.getByText(t)).toBeTruthy()
  })
  it('links every toolkit download to a file that exists in public/', () => {
    at('/toolkit')
    const links = screen.getAllByRole('link').filter((a) => a.hasAttribute('download'))
    expect(links.length).toBeGreaterThan(15)
    for (const a of links) {
      const rel = a.getAttribute('href')!.replace(/^.*?(downloads\/)/, '$1')
      expect(existsSync(join('public', rel)), rel).toBe(true)
      expect(readFileSync(join('public', rel)).length, rel).toBeGreaterThan(200)
    }
  })
})
