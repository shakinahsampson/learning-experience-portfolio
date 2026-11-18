import { useState } from 'react'
import { CATEGORIES, PROJECTS, type Category } from '../data/projects'
import { Container, PageHeader, ProjectCard, SimNotice } from '../components/ui'

export default function Projects() {
  const [filter, setFilter] = useState<Category | 'All'>('All')
  const shown = PROJECTS.filter((p) => filter === 'All' || p.categories.includes(filter))
  return (
    <>
      <PageHeader eyebrow="Projects" title="Case-study gallery" lead="Four independent fictional simulations, each with a business challenge, audience, deliverables and a working interactive demo. Filter by category." />
      <Container className="pb-4">
        <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
          {(['All', ...CATEGORIES] as const).map((c) => (
            <button key={c} type="button" aria-pressed={filter === c} onClick={() => setFilter(c)} className={`btn ${filter === c ? 'btn-primary' : 'btn-ghost'} !py-1.5 !text-sm`}>{c}</button>
          ))}
        </div>
        <p role="status" className="mt-4 text-sm text-warm-600">{shown.length} project{shown.length === 1 ? '' : 's'} shown{filter !== 'All' ? ` in “${filter}”` : ''}.</p>
        {shown.length === 0 ? (
          <p className="card mt-6">No projects in this category yet. <button className="underline" onClick={() => setFilter('All')}>Show all</button></p>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2">{shown.map((p) => <ProjectCard key={p.slug} slug={p.slug} detailed />)}</div>
        )}
        <div className="mt-8"><SimNotice /></div>
      </Container>
    </>
  )
}
