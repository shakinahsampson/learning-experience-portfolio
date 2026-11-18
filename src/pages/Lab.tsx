import { useSearchParams } from 'react-router-dom'
import { Container, PageHeader, SimNotice } from '../components/ui'
import { CoursePlayer } from '../course/CoursePlayer'
import { elevate } from '../course/content/elevate'
import { LaunchpadSim } from '../lab/LaunchpadSim'
import { CoachForward } from '../lab/CoachForward'
import { Insight360 } from '../lab/Insight360'

const demos = [
  { id: 'elevate', label: 'ELEVATE', desc: 'Five-module guided course: scenarios, worked examples, practice, final assessment', C: () => <CoursePlayer course={elevate} /> },
  { id: 'launchpad', label: 'LAUNCHPAD', desc: 'Platform workflow simulation and troubleshooting', C: LaunchpadSim },
  { id: 'coachforward', label: 'COACHFORWARD', desc: 'Branching feedback-conversation scenario', C: CoachForward },
  { id: 'insight360', label: 'INSIGHT360', desc: 'Learning analytics dashboard with filters', C: Insight360 },
] as const

export default function Lab() {
  const [params, setParams] = useSearchParams()
  const id = params.get('demo') ?? 'elevate'
  const active = demos.find((d) => d.id === id) ?? demos[0]
  const Active = active.C
  return (
    <>
      <PageHeader eyebrow="Learning Lab" title="Working demonstrations" lead="Interactive e-learning built for this portfolio. Progress and reflections save only in this browser." />
      <Container className="pb-8">
        <div role="tablist" aria-label="Demonstrations" className="flex flex-wrap gap-2">
          {demos.map((d) => (
            <button key={d.id} id={`tab-${d.id}`} role="tab" type="button" aria-selected={active.id === d.id} aria-controls="demo-panel" className={`btn ${active.id === d.id ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setParams({ demo: d.id })}>{d.label}</button>
          ))}
        </div>
        <p className="mt-3 text-sm text-warm-600">{active.desc}</p>
        <div className="mt-4"><SimNotice /></div>
        <div id="demo-panel" role="tabpanel" aria-labelledby={`tab-${active.id}`} className="mt-8" key={active.id}><Active /></div>
      </Container>
    </>
  )
}
