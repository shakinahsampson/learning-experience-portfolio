import { Link } from 'react-router-dom'
import { PROJECTS, SIMULATION_NOTICE } from '../data/projects'
import { EXTRAS } from '../data/caseExtras'
import { Preview } from './Previews'

export function SimBadge({ children }: { children?: React.ReactNode }) {
  return <span className="sim-badge">{children ?? 'Independent fictional simulation'}</span>
}

export function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-6xl px-5 ${className}`}>{children}</div>
}

export function PageHeader({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <Container className="pt-16 pb-8">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-3 text-4xl md:text-5xl max-w-3xl">{title}</h1>
      {lead && <p className="mt-5 max-w-2xl text-lg text-warm-600">{lead}</p>}
    </Container>
  )
}

const ACCENT: Record<string, string> = { elevate: 'border-t-sage-700', launchpad: 'border-t-gold', coachforward: 'border-t-charcoal', insight360: 'border-t-sage-300' }

export function ProjectCard({ slug, detailed = false }: { slug: string; detailed?: boolean }) {
  const p = PROJECTS.find((x) => x.slug === slug)!
  const x = EXTRAS[slug]
  return (
    <article className={`card flex flex-col overflow-hidden !p-0 border-t-4 ${ACCENT[slug]} transition hover:-translate-y-1 hover:shadow-md`}>
      <div className="aspect-[32/15] w-full border-b border-warm-200"><Preview slug={slug} /></div>
      <div className="flex flex-1 flex-col p-6">
        <SimBadge />
        <h3 className="mt-3 text-2xl"><span className="tracking-wide">{p.name}</span></h3>
        <p className="mt-1 font-serif text-sage-700">{p.title}</p>
        <p className="mt-3 text-sm text-warm-600">{p.summary}</p>
        {detailed && (
          <dl className="mt-4 space-y-3 text-sm">
            <div><dt className="font-semibold text-sage-900">Business challenge</dt><dd className="text-warm-600">{x.challenge}</dd></div>
            <div><dt className="font-semibold text-sage-900">Target audience</dt><dd className="text-warm-600">{p.audience}</dd></div>
            <div><dt className="font-semibold text-sage-900">Skills demonstrated</dt><dd className="text-warm-600">{x.skills.join(' · ')}</dd></div>
            <div><dt className="font-semibold text-sage-900">Deliverables</dt><dd><ul className="list-disc pl-5 text-warm-600">{x.deliverables.map((d) => <li key={d}>{d}</li>)}</ul></dd></div>
            <div><dt className="font-semibold text-sage-900">Instructional strategy</dt><dd className="text-warm-600">{p.tools}</dd></div>
          </dl>
        )}
        <div className="mt-4 flex flex-wrap gap-2">{p.categories.map((c) => <span key={c} className="tag">{c}</span>)}</div>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          <Link to={`/projects/${p.slug}`} className="text-sage-700 underline" aria-label={`Read the ${p.name} case study`}>Case study →</Link>
          <Link to={`/lab?demo=${p.labId}`} className="text-sage-700 underline" aria-label={`Try the ${p.name} interactive demo`}>Interactive demo →</Link>
        </div>
      </div>
    </article>
  )
}

export function SimNotice() {
  return <p className="rounded-lg border border-warm-200 bg-paper p-4 text-sm text-warm-600"><strong className="text-sage-900">Simulation disclosure: </strong>{SIMULATION_NOTICE}</p>
}
