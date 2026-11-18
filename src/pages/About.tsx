import { Link } from 'react-router-dom'
import { Container, PageHeader } from '../components/ui'

const translations = [
  ['Teaching English & classroom facilitation', 'Facilitating workshops and live/virtual sessions; managing engagement, questions, and diverse learner needs.'],
  ['Curriculum development', 'Needs analysis, objectives, assessment alignment, and iteration — the core of instructional design.'],
  ['Supporting colleague onboarding and learning technologies', 'Helping colleagues get started with tools and routines; the foundation of digital adoption and onboarding support.'],
  ['Analyzing learning outcomes', 'Using assessment and engagement data to improve instruction; maps to learning analytics and Kirkpatrick evaluation.'],
  ['Master of Arts in Teaching', 'Grounding in learning science, differentiation, assessment, and reflective practice.'],
  ['PSPO I certification', 'Working in iterations, prioritizing by value, and managing a backlog of learning products.'],
]

export default function About() {
  return (
    <>
      <PageHeader eyebrow="About" title="From classroom to corporate learning" lead="An authentic path, honestly described." />
      <Container className="pb-8">
        <div className="prose-l text-lg">
          <p>I started as a teacher. Teaching English meant planning with the end in mind: what should a learner be able to do, how will I know, and what practice will get them there? Designing curriculum taught me to answer those questions in writing, test them with real learners, and revise.</p>
          <p>Along the way, I facilitated learning for groups with very different needs, supported colleagues with onboarding and learning technologies, and analyzed learning outcomes to decide what to change. My Master of Arts in Teaching gave me the theory behind that practice.</p>
          <p>Corporate learning asks similar questions in a different setting: adults, time pressure, and business goals. This portfolio is my way of showing how my skills transfer. The case studies are <strong>simulated</strong> — I built them independently to demonstrate process and craft. I have not held a corporate HR or L&amp;D role, and I won’t pretend otherwise.</p>
        </div>
      </Container>
      <Container className="py-10">
        <h2 className="text-3xl">How my experience translates</h2>
        <div className="table-wrap mt-6"><table><thead><tr><th scope="col">Experience / credential</th><th scope="col">Corporate L&amp;D capability</th></tr></thead>
          <tbody>{translations.map(([a, b]) => <tr key={a}><th scope="row" className="font-semibold">{a}</th><td>{b}</td></tr>)}</tbody></table></div>
      </Container>
      <Container className="py-10">
        <h2 className="text-3xl">Evidence-based practices I use</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {[
            ['Backward design', 'Define the observable performance first, then the evidence, then the activities. Every course here maps objectives to assessments.'],
            ['Worked examples, then practice', 'Show expert reasoning, support the first attempt, then remove the support. This is the eight-step lesson sequence in the Learning Lab.'],
            ['Retrieval and feedback', 'Knowledge checks explain why an answer works, and learners can retry. Feedback targets the decision, not just the score.'],
            ['Kirkpatrick-aligned evaluation', 'Reaction, learning, behavior, and results are kept separate so that a completion rate is never presented as impact.'],
          ].map(([t, d]) => <section key={t} className="card"><h3 className="text-lg">{t}</h3><p className="mt-2 text-sm text-warm-600">{d}</p></section>)}
        </div>
      </Container>
      <Container className="py-10">
        <h2 className="text-3xl">Credentials, and what this portfolio does not claim</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <section className="card"><h3 className="text-lg">Verified credentials</h3><ul className="prose-l mt-3"><li>Master of Arts in Teaching (MAT)</li><li>Professional Scrum Product Owner I (PSPO I)</li></ul></section>
          <section className="card"><h3 className="text-lg">Boundaries</h3><ul className="prose-l mt-3"><li>The four projects are fictional simulations; no program was delivered to real corporate employees.</li><li>All data are synthetic and all outcomes are illustrative.</li><li>My teaching and colleague-support experience is educational, not corporate HR employment.</li></ul></section>
        </div>
      </Container>
      <Container className="py-10">
        <h2 className="text-3xl">How I design</h2>
        <ul className="prose-l mt-4 text-lg">
          <li><strong>Start with performance.</strong> What must people do differently, and what evidence will show it?</li>
          <li><strong>Practice over presentation.</strong> Adults learn by deciding and getting feedback, not by reading slides.</li>
          <li><strong>Respect time and context.</strong> Short, relevant, and usable at the moment of need.</li>
          <li><strong>Measure honestly.</strong> Separate learning metrics from business results.</li>
          <li><strong>Design for everyone.</strong> Keyboard, screen reader, captions, and plain language from the start.</li>
        </ul>
        <Link to="/projects" className="btn btn-primary mt-4">See the case studies</Link>
      </Container>
    </>
  )
}
