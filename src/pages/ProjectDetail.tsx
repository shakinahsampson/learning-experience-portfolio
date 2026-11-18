import { Link, useParams } from 'react-router-dom'
import { getProject, type Section } from '../data/projects'
import { EXTRAS } from '../data/caseExtras'
import { asset } from '../lib/storage'
import { Container, SimBadge, SimNotice } from '../components/ui'

export default function ProjectDetail() {
  const { slug } = useParams()
  const p = slug ? getProject(slug) : undefined
  if (!p) {
    return (
      <Container className="py-20"><h1 className="text-3xl">Project not found</h1>
        <p className="mt-3">That case study doesn’t exist. <Link className="underline" to="/projects">Back to projects</Link></p></Container>
    )
  }
  const x = EXTRAS[p.slug]
  const head: Section[] = [
    { id: 'cs-overview', heading: 'Overview, challenge and performance gap', paragraphs: [p.summary, `Business challenge: ${x.challenge}`, `Performance gap: ${x.gap}`], bullets: [`Target audience: ${p.audience}`, 'Development tools: React, TypeScript, Vite and Tailwind CSS for the interactive course; Python (reportlab, openpyxl, python-docx) for the downloadable documents', `Skills demonstrated: ${x.skills.join(', ')}`] },
    { id: 'cs-needs', heading: 'Needs analysis', paragraphs: ['This is a fictional needs analysis written for the simulation; it models the process rather than reporting real interviews.'], bullets: x.needs },
    { id: 'cs-status', heading: 'Completed artifacts and proposed implementation', paragraphs: ['Completed items exist in this portfolio. Proposed items describe what would happen in a real organization and have not been carried out.'], tables: [{ caption: 'Completed versus proposed', head: ['Completed portfolio artifacts', 'Proposed organizational implementation'], rows: Array.from({ length: Math.max(x.completed.length, x.proposed.length) }, (_, i) => [x.completed[i] ?? '', x.proposed[i] ?? '']) }] },
    { id: 'cs-rationale', heading: 'Instructional strategy and design rationale', tables: [{ caption: 'Design decisions and why they were made', head: ['Decision', 'Why', 'Framework'], rows: x.strategy.map((d) => [d.decision, d.why, d.framework]) }] },
    { id: 'cs-assessment', heading: 'Assessment approach', bullets: x.assessment },
    { id: 'cs-implementation', heading: 'Implementation plan (proposed, ADDIE)', tables: [{ caption: 'Proposed implementation by ADDIE phase', head: ['Phase', 'Activity'], rows: x.implementation.map((i) => [i.phase, i.activity]) }] },
    { id: 'cs-evaluation', heading: 'Evaluation strategy (Kirkpatrick)', tables: [{ caption: 'Evaluation by Kirkpatrick level', head: ['Level', 'Question', 'Method', 'Status'], rows: x.evaluation.map((e) => [e.level, e.question, e.method, e.status]) }] },
  ]
  const tail: Section[] = [
    { id: 'cs-limits', heading: 'Limitations', bullets: x.limitations },
    { id: 'cs-reflection', heading: 'Reflection and future improvements', paragraphs: x.reflection, bullets: x.future },
  ]
  const sections = [...head, ...p.sections, ...tail]
  return (
    <Container className="py-14">
      <Link to="/projects" className="text-sm text-sage-700 underline">← All projects</Link>
      <div className="mt-4"><SimBadge /></div>
      <p className="eyebrow mt-4">{p.name}</p>
      <h1 className="mt-2 max-w-4xl text-4xl md:text-5xl">{p.title}</h1>
      <p className="mt-4 max-w-3xl text-lg text-warm-600">{p.summary}</p>
      <div className="mt-6 max-w-3xl"><SimNotice /></div>

      <dl className="mt-8 grid gap-4 md:grid-cols-3">
        {[['Fictional context', p.org], ['Audience', p.audience], ['Approach', p.tools]].map(([k, v]) => (
          <div key={k} className="card"><dt className="eyebrow">{k}</dt><dd className="mt-2 text-sm">{v}</dd></div>
        ))}
      </dl>
      <div className="mt-6"><Link to={`/lab?demo=${p.labId}`} className="btn btn-primary">Open the interactive demo</Link></div>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start text-sm">
          <p className="eyebrow mb-2">On this page</p>
          <ul className="space-y-1">
            <li><a className="underline text-sage-700" href="#objectives">Learning objectives</a></li>
            {sections.map((s) => <li key={s.id}><a className="underline text-sage-700" href={`#${s.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView(); document.getElementById(s.id)?.focus() }}>{s.heading}</a></li>)}
            <li><a className="underline text-sage-700" href="#resources" onClick={(e) => { e.preventDefault(); document.getElementById('resources')?.scrollIntoView() }}>Downloads</a></li>
          </ul>
        </nav>
        <article className="min-w-0">
          <section id="objectives" tabIndex={-1} className="mb-12 scroll-mt-24">
            <h2 className="text-2xl">Measurable learning objectives</h2>
            <ul className="prose-l mt-3">{p.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
          </section>
          {sections.map((s) => (
            <section key={s.id} id={s.id} tabIndex={-1} className="mb-12 scroll-mt-24 outline-none">
              <h2 className="text-2xl">{s.heading}</h2>
              <div className="prose-l mt-3">
                {s.paragraphs?.map((t, i) => <p key={i}>{t}</p>)}
                {s.bullets && <ul>{s.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>}
              </div>
              {s.tables?.map((t) => (
                <div key={t.caption} className="table-wrap mt-4">
                  <table><caption className="sr-only">{t.caption}</caption>
                    <thead><tr>{t.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
                    <tbody>{t.rows.map((r, i) => <tr key={i}>{r.map((c, j) => j === 0 ? <th key={j} scope="row" className="text-left font-semibold align-top p-3">{c}</th> : <td key={j}>{c}</td>)}</tr>)}</tbody>
                  </table>
                </div>
              ))}
              {s.faq && <div className="mt-3 space-y-2">{s.faq.map((f) => <details key={f.q} className="card !p-4"><summary className="cursor-pointer font-semibold">{f.q}</summary><p className="mt-2 text-sm">{f.a}</p></details>)}</div>}
            </section>
          ))}
          <section id="resources" tabIndex={-1} className="mb-8 scroll-mt-24">
            <h2 className="text-2xl">Downloads</h2>
            <ul className="mt-3 space-y-2">{p.resources.map((r) => <li key={r.file}><a className="underline text-sage-700" href={asset(r.file)} download>{r.label}</a></li>)}</ul>
          </section>
        </article>
      </div>
    </Container>
  )
}
