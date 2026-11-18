import { PROJECTS } from '../data/projects'
import { asset } from '../lib/storage'
import { Container, PageHeader } from '../components/ui'

const generic = [
  { label: 'Learning needs analysis template', file: 'downloads/learning-needs-analysis-template.md', type: 'Template', desc: 'Prompts for business problem, root cause, audience, constraints, and success measures.' },
  { label: 'Project plan template (ADDIE)', file: 'downloads/project-plan-template.csv', type: 'Project planning', desc: '12-week plan with milestones, owners, and deliverables.' },
  { label: 'Kirkpatrick evaluation plan template', file: 'downloads/kirkpatrick-evaluation-plan-template.csv', type: 'Template', desc: 'Levels 1–4 with questions, measures, methods, timing, and owners.' },
]
const featured = [
  { label: 'LAUNCHPAD quick reference', type: 'Job aid · 2-page PDF', desc: 'FlowBoard workflow, status indicators, troubleshooting and an escalation decision matrix.', files: ['downloads/launchpad-quick-reference.pdf'] },
  { label: 'COACHFORWARD manager toolkit', type: 'Manager toolkit', desc: 'SBI-A framework, example conversation, planning questions and follow-up actions, plus an editable worksheet.', files: ['downloads/coachforward-manager-toolkit.pdf', 'downloads/coachforward-worksheet.docx'] },
  { label: 'ELEVATE onboarding toolkit', type: 'Onboarding toolkit', desc: 'Orientation agenda, 90-day plan, check-in guide, RACI, communications, checklists, review calendar, FAQ and evaluation plan.', files: ['downloads/elevate-onboarding-toolkit.pdf', 'downloads/elevate-onboarding-templates.docx'] },
  { label: 'L&D project management workbook', type: 'Workbook · Excel', desc: 'ADDIE tasks, owners, milestones, planned/actual dates, dependencies, risk register, formulas and summary (synthetic sample data).', files: ['downloads/ld-project-management-workbook.xlsx'] },
  { label: 'Instructional design documentation', type: 'Design documentation', desc: 'Needs analysis, design summary, objectives matrix, storyboard, facilitator guide, evaluation plan and assessment blueprint.', files: ['downloads/instructional-design-documentation.pdf', 'downloads/instructional-design-templates.docx'] },
  { label: 'INSIGHT360 executive reporting pack', type: 'Executive reporting', desc: 'Executive summary, dashboard definitions, recommendations and limitations, with figures computed from the synthetic dataset.', files: ['downloads/insight360-executive-reporting.pdf'] },
]
const fromProjects = PROJECTS.flatMap((p) => p.resources.filter((r) => !generic.some((g) => g.file === r.file)).map((r) => ({ ...r, type: r.file.includes('guide') ? 'Facilitator / manager guide' : r.file.includes('job-aid') ? 'Job aid' : r.file.includes('checklist') || r.file.includes('raci') ? 'Checklist / matrix' : r.file.includes('csv') ? 'Data' : 'Template', desc: `From ${p.name} (simulated project)` })))
const items = [...fromProjects, ...generic]

export default function Toolkit() {
  return (
    <>
      <PageHeader eyebrow="Toolkit" title="Free sample templates and job aids" lead="Download and adapt. All content uses fictional examples. Polished resources are PDF, Word and Excel; simple templates remain Markdown or CSV so they open anywhere." />
      <Container className="pb-8">
        <h2 className="mb-4 text-2xl">Polished resources</h2>
        <ul className="mb-12 grid gap-5 md:grid-cols-2">
          {featured.map((r) => (
            <li key={r.label} className="card flex flex-col">
              <span className="tag self-start">{r.type}</span>
              <h3 className="mt-3 text-lg">{r.label}</h3>
              <p className="mt-1 flex-1 text-sm text-warm-600">{r.desc}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {r.files.map((f) => (
                  <a key={f} className="btn btn-ghost" href={asset(f)} download aria-label={`Download ${r.label} as ${f.split('.').pop()?.toUpperCase()}`}>{f.endsWith('.pdf') ? 'PDF' : f.endsWith('.docx') ? 'Editable DOCX' : 'XLSX'}</a>
                ))}
              </div>
            </li>
          ))}
        </ul>
        <h2 className="mb-4 text-2xl">Plain-text templates and data</h2>
        <ul className="grid gap-5 md:grid-cols-2">
          {items.map((r) => (
            <li key={r.file} className="card flex flex-col">
              <span className="tag self-start">{r.type}</span>
              <h3 className="mt-3 text-lg">{r.label}</h3>
              <p className="mt-1 flex-1 text-sm text-warm-600">{r.desc}</p>
              <a className="btn btn-ghost mt-4 self-start" href={asset(r.file)} download>Download {r.file.split('.').pop()?.toUpperCase()}</a>
            </li>
          ))}
        </ul>
      </Container>
    </>
  )
}
