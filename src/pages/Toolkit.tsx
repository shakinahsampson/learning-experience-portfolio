import { PROJECTS } from '../data/projects'
import { asset } from '../lib/storage'
import { Container, PageHeader } from '../components/ui'

const generic = [
  { label: 'Learning needs analysis template', file: 'downloads/learning-needs-analysis-template.md', type: 'Template', desc: 'Prompts for business problem, root cause, audience, constraints, and success measures.' },
  { label: 'Project plan template (ADDIE)', file: 'downloads/project-plan-template.csv', type: 'Project planning', desc: '12-week plan with milestones, owners, and deliverables.' },
  { label: 'Kirkpatrick evaluation plan template', file: 'downloads/kirkpatrick-evaluation-plan-template.csv', type: 'Template', desc: 'Levels 1–4 with questions, measures, methods, timing, and owners.' },
]
const fromProjects = PROJECTS.flatMap((p) => p.resources.filter((r) => !generic.some((g) => g.file === r.file)).map((r) => ({ ...r, type: r.file.includes('guide') ? 'Facilitator / manager guide' : r.file.includes('job-aid') ? 'Job aid' : r.file.includes('checklist') || r.file.includes('raci') ? 'Checklist / matrix' : r.file.includes('csv') ? 'Data' : 'Template', desc: `From ${p.name} (simulated project)` })))
const items = [...fromProjects, ...generic]

export default function Toolkit() {
  return (
    <>
      <PageHeader eyebrow="Toolkit" title="Free sample templates and job aids" lead="Download and adapt. All content uses fictional examples. Files are plain Markdown or CSV, so they open anywhere." />
      <Container className="pb-8">
        <ul className="grid gap-5 md:grid-cols-2">
          {items.map((r) => (
            <li key={r.file} className="card flex flex-col">
              <span className="tag self-start">{r.type}</span>
              <h2 className="mt-3 text-lg">{r.label}</h2>
              <p className="mt-1 flex-1 text-sm text-warm-600">{r.desc}</p>
              <a className="btn btn-ghost mt-4 self-start" href={asset(r.file)} download>Download {r.file.split('.').pop()?.toUpperCase()}</a>
            </li>
          ))}
        </ul>
      </Container>
    </>
  )
}
