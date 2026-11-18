import { Link } from 'react-router-dom'
import { Container, ProjectCard, SimNotice } from '../components/ui'

const capabilities = [
  { t: 'Learning experience design', d: 'Objectives with observable verbs, backward design, and scenario-based practice that mirrors real decisions.' },
  { t: 'Facilitation & training support', d: 'Experience facilitating learning and supporting colleagues with onboarding and learning technologies.' },
  { t: 'Curriculum development', d: 'Years of designing and refining curriculum for diverse learners, translated into workplace learning.' },
  { t: 'Learning analytics', d: 'Analyzing learning outcomes to improve instruction; here applied to program evaluation using Kirkpatrick’s levels.' },
  { t: 'Onboarding & enablement', d: 'Structured journeys, manager guides, job aids, and communications that make new hires effective sooner.' },
  { t: 'Agile & product thinking', d: 'PSPO I certified: prioritizing by value, iterating from feedback, and keeping a clear backlog.' },
]

const highlights = [
  { t: 'Learning Design', d: 'Scenario-based courses built backward from the workplace behavior that must change.' },
  { t: 'Learning Operations', d: 'Onboarding plans, RACI matrices, communications calendars, and workbooks that make programs run.' },
  { t: 'Performance Measurement', d: 'Kirkpatrick-aligned evaluation and analytics that separate learning evidence from business results.' },
]

export default function Home() {
  return (
    <>
      <section className="bg-gradient-to-b from-sage-50 to-ivory">
        <Container className="pt-14 pb-10">
          <p className="eyebrow">Learning &amp; Development Portfolio</p>
          <h1 className="mt-4 max-w-4xl text-5xl md:text-6xl">I design learning that improves how people perform at work.</h1>
          <p className="mt-5 max-w-2xl text-xl text-warm-600">
            I’m <strong className="text-sage-900">Shakinah Sampson</strong>: Learning Experience Designer | Learning &amp; Development | Employee Enablement.
            A Master of Arts in Teaching, curriculum design, and facilitation experience, applied to onboarding, digital adoption, manager development, and learning analytics.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/projects" className="btn btn-primary">Explore Projects</Link>
            <Link to="/lab" className="btn btn-ghost">Experience a Course</Link>
            <Link to="/toolkit" className="btn btn-ghost">Download Resources</Link>
          </div>
          <ul className="mt-9 grid gap-4 md:grid-cols-3" aria-label="Capability highlights">
            {highlights.map((h) => (
              <li key={h.t} className="border-l-2 border-gold-soft pl-4">
                <h2 className="text-lg">{h.t}</h2>
                <p className="mt-1 text-sm text-warm-600">{h.d}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container className="py-10">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-1">
            <p className="eyebrow">Professional summary</p>
            <h2 className="mt-3 text-3xl">Educator by training. Enablement by design.</h2>
          </div>
          <div className="md:col-span-2 prose-l text-lg">
            <p>I have taught English, designed curriculum, facilitated learning, supported colleagues with onboarding and learning technologies, and analyzed learning outcomes. I translate that practice into corporate L&amp;D: clear objectives, realistic practice, useful feedback, and evidence of what works.</p>
            <p>The projects below are <strong>independent, fictional portfolio simulations</strong>. They show how I think and build; they are not client work, and I do not claim corporate HR experience.</p>
          </div>
        </div>
      </Container>

      <Container className="py-8">
        <p className="eyebrow">Featured projects</p>
        <h2 className="mt-3 text-3xl">Four independent fictional case studies, each with a working course</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2"><ProjectCard slug="elevate" /><ProjectCard slug="launchpad" /><ProjectCard slug="coachforward" /><ProjectCard slug="insight360" /></div>
        <div className="mt-8"><SimNotice /></div>
      </Container>

      <Container className="py-16">
        <p className="eyebrow">Capabilities</p>
        <h2 className="mt-3 text-3xl">What I bring to a learning team</h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {capabilities.map((c) => <li key={c.t} className="card"><h3 className="text-lg">{c.t}</h3><p className="mt-2 text-sm text-warm-600">{c.d}</p></li>)}
        </ul>
      </Container>

      <Container className="py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <section className="card" aria-labelledby="cred">
            <p className="eyebrow">Credentials</p>
            <h2 id="cred" className="mt-2 text-2xl">Education &amp; certification</h2>
            <ul className="prose-l mt-4"><li>Master of Arts in Teaching</li><li>Professional Scrum Product Owner I (PSPO I)</li></ul>
          </section>
          <section className="card bg-sage-900 text-sage-100" aria-labelledby="contact">
            <p className="eyebrow">Contact</p>
            <h2 id="contact" className="mt-2 text-2xl !text-white">Let’s talk about your learning needs</h2>
            <p className="mt-3 text-sm">Open to Instructional Designer, Learning Experience Designer, L&amp;D, onboarding, training, and digital adoption roles.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a className="btn bg-gold-soft text-sage-900" href="mailto:kinah93sampson@gmail.com">Email me</a>
              <Link className="btn border-sage-300 text-white" to="/contact">All contact options</Link>
            </div>
          </section>
        </div>
      </Container>
    </>
  )
}
