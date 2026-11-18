import { Link } from 'react-router-dom'
import { PROJECTS, SIMULATION_NOTICE } from '../data/projects'

export function SimBadge({ children }: { children?: React.ReactNode }) {
  return <span className="sim-badge">◆ {children ?? 'Simulated project'}</span>
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

export function ProjectCard({ slug }: { slug: string }) {
  const p = PROJECTS.find((x) => x.slug === slug)!
  return (
    <article className="card flex flex-col transition hover:-translate-y-1 hover:shadow-md">
      <SimBadge />
      <h3 className="mt-3 text-2xl"><span className="tracking-wide">{p.name}</span></h3>
      <p className="mt-1 font-serif text-sage-700">{p.title}</p>
      <p className="mt-3 flex-1 text-sm text-warm-600">{p.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">{p.categories.map((c) => <span key={c} className="tag">{c}</span>)}</div>
      <div className="mt-5 flex gap-4 text-sm font-semibold">
        <Link to={`/projects/${p.slug}`} className="text-sage-700 underline" aria-label={`Read the ${p.name} case study`}>Case study →</Link>
        <Link to={`/lab?demo=${p.labId}`} className="text-sage-700 underline" aria-label={`Try the ${p.name} interactive demo`}>Try the demo →</Link>
      </div>
    </article>
  )
}

export function SimNotice() {
  return <p className="rounded-lg border border-gold-soft bg-[#f6ecd0] p-4 text-sm text-[#4a3a0d]"><strong>Please note: </strong>{SIMULATION_NOTICE}</p>
}
