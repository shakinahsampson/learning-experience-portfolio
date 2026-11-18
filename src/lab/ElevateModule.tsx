import { useState } from 'react'
import { usePersisted } from '../lib/storage'
import { Quiz, type Question } from './Quiz'
import { Branching, type Node } from './Branching'
import { BarChart } from './Charts'

interface Lesson { id: string; title: string; minutes: number; body: string[]; tip: string; check: Question[] }

const lessons: Lesson[] = [
  {
    id: 'journey', title: 'Lesson 1 — Your 90-day journey', minutes: 8,
    body: [
      'Your first 90 days at Meridian (fictional) move through six phases: preboarding, day one, first week, first 30 days, days 31–60, and days 61–90. Each phase has a different purpose: first to get ready, then to understand, then to contribute, and finally to work independently.',
      'You will not be expected to know everything. You will be expected to ask for help early, act on feedback, and show steady progress against your 90-day plan.',
    ],
    tip: 'Try this week: open your 90-day plan and write the one thing you want to have done by day 30.',
    check: [
      { q: 'In which phase do you agree on role expectations with your manager?', options: ['Preboarding', 'First week', 'Days 61–90'], correct: 1, explain: ['Preboarding is for logistics and getting ready.', 'Correct — expectations are agreed in week one so everything after has a clear target.', 'Waiting until days 61–90 is far too late to clarify what “good” looks like.'] },
      { q: 'What is the main purpose of days 31–60?', options: ['Learn where the building is', 'Contribute to work and apply feedback', 'Complete the final review'], correct: 1, explain: ['That belongs to day one and week one.', 'Correct — you lead a work product, receive feedback, and apply it.', 'The review happens around day 88.'] },
    ],
  },
  {
    id: 'expectations', title: 'Lesson 2 — Expectations and evidence', minutes: 10,
    body: [
      'Performance expectations are only useful when they describe observable behavior and the evidence that shows it. “Communicates well” is vague. “Sends a clear summary within 24 hours of each client meeting” can be seen and checked.',
      'Ask your manager for examples of strong work. Then write down the evidence you will collect: client feedback, work product reviews, and peer input.',
    ],
    tip: 'Try this week: turn one vague expectation into an observable behavior.',
    check: [
      { q: 'Which is the best example of an observable expectation?', options: ['Shows leadership potential', 'Delivers a clear summary within 24 hours of every client meeting', 'Has a positive attitude'], correct: 1, explain: ['This is a judgment, not a behavior you can see.', 'Correct — it is specific, observable, and time-bound.', 'Attitude is hard to measure without behaviors.'] },
      { q: 'What should you do if an expectation is unclear?', options: ['Wait for the performance review', 'Ask your manager for an example and the evidence', 'Guess and revise later'], correct: 1, explain: ['Waiting leaves you without feedback for weeks.', 'Correct — examples and evidence make expectations concrete.', 'Guessing wastes effort and risks misalignment.'] },
    ],
  },
  {
    id: 'feedback', title: 'Lesson 3 — Asking for help and feedback', minutes: 8,
    body: [
      'Strong new hires ask for feedback early and specifically. “Any feedback?” rarely gets useful answers. “What is one thing I could do to make my client summary more useful?” does.',
      'Use your buddy for “how do things work here” questions, your manager for expectations and priorities, and your practice lead for career questions.',
    ],
    tip: 'Try this week: ask for specific feedback on one work product.',
    check: [
      { q: 'Which feedback request is most likely to get useful input?', options: ['Any feedback?', 'What is one thing I could do to make my summary more useful to the client?', 'I hope that went okay.'], correct: 1, explain: ['Too general to answer.', 'Correct — specific, focused, and actionable.', 'This is not a request.'] },
      { q: 'You don’t know how to book a conference room. Who is the best first contact?', options: ['Practice lead', 'Your buddy', 'The CEO'], correct: 1, explain: ['Better saved for career and strategy questions.', 'Correct — buddies help with how things work here.', 'Escalating this far would be inefficient.'] },
    ],
  },
]

const scenario: Node[] = [
  {
    id: 's1',
    context: 'Week 2. You are on a client team. The project lead asks you to “look into the retention numbers” by Friday. You are not sure what output she expects.',
    prompt: 'What do you do?',
    choices: [
      { text: 'Start analysis and hope Friday’s result is what she wants.', next: 's2', quality: 'poor', reply: 'Friday arrives. She says, “This is more detailed than I needed — I wanted a one-slide summary.”', coach: 'Starting without clarifying risks wasted effort. Ask what the output looks like and how it will be used.' },
      { text: 'Reply: “Happy to — could you share what format and decision this will inform?”', next: 's2', quality: 'best', reply: '“Great question. I need one slide with the three biggest drivers for the Thursday call.”', coach: 'Clarifying purpose and format saves time and shows maturity.' },
      { text: 'Ask a teammate to do it so you avoid getting it wrong.', next: 's2', quality: 'poor', reply: 'The teammate is annoyed and the project lead asks why you didn’t ask her.', coach: 'Delegating away learning moments limits growth and can strain relationships.' },
    ],
  },
  {
    id: 's2',
    context: 'Week 5. You receive feedback: “Your analysis was strong but the summary was hard to follow.”',
    prompt: 'How do you respond?',
    choices: [
      { text: 'Say thanks and move on.', next: 's3', quality: 'okay', reply: 'She nods, but you’re still unclear what to change.', coach: 'Gratitude is good, but follow up with a specific question to turn feedback into action.' },
      { text: 'Ask: “Could you show me an example of a summary that worked well, and what made it easy to follow?”', next: 's3', quality: 'best', reply: 'She shares an example and highlights its structure: conclusion first, three supporting points.', coach: 'Asking for an example turns vague feedback into a model you can follow.' },
      { text: 'Explain why the summary was hard to follow because the data were complex.', next: 's3', quality: 'poor', reply: 'The conversation turns defensive and the lead ends it quickly.', coach: 'Defending closes the door to feedback. Listen first, then ask for specifics.' },
    ],
  },
  {
    id: 's3',
    context: 'Day 44. Your mid-point conversation with your manager is tomorrow. You feel behind on one goal.',
    prompt: 'How do you prepare?',
    choices: [
      { text: 'Hope it doesn’t come up.', next: 'end', quality: 'poor', reply: 'It comes up. Your manager is surprised and asks why you didn’t mention it earlier.', coach: 'Surprises erode trust. Raise concerns early and bring a proposed plan.' },
      { text: 'Prepare progress evidence, name the gap, and propose two actions with support needed.', next: 'end', quality: 'best', reply: 'Your manager appreciates the openness and agrees on a plan and a check-in in two weeks.', coach: 'Evidence, honesty, and a proposed plan demonstrate ownership.' },
      { text: 'Ask to move the meeting to next week.', next: 'end', quality: 'okay', reply: 'She agrees, but it delays the support you need.', coach: 'Rescheduling postpones feedback. Use the meeting to get help sooner.' },
    ],
  },
  { id: 'end', prompt: '', end: { title: 'Scenario complete', summary: 'In this scenario, strong choices clarified expectations, turned feedback into action, and raised gaps early. Try again to explore other paths and compare the outcomes.' } },
]

const finalQs: Question[] = [
  { q: 'Which action best matches the “first week” phase?', options: ['Agree role expectations with your manager', 'Lead a client presentation alone', 'Complete the 90-day review'], correct: 0, explain: ['Correct — week one sets expectations.', 'Leading alone is later in the journey.', 'The review is around day 88.'] },
  { q: 'Which is an observable performance expectation?', options: ['Is a team player', 'Sends action items within 24 hours of each meeting', 'Shows enthusiasm'], correct: 1, explain: ['Not observable on its own.', 'Correct.', 'A feeling, not a behavior.'] },
  { q: 'Your lead gives vague feedback. What is the best next step?', options: ['Ask for a specific example of strong work', 'Ignore it', 'Argue the data were complex'], correct: 0, explain: ['Correct.', 'Ignoring prevents improvement.', 'Defensiveness shuts down feedback.'] },
  { q: 'You are falling behind on a 30-day goal. What should you do?', options: ['Wait for the performance review', 'Tell your manager early with a proposed plan', 'Quietly drop the goal'], correct: 1, explain: ['Too late to adjust.', 'Correct — early honesty with a plan builds trust.', 'Dropping goals without agreement breaks expectations.'] },
  { q: 'Who is the best first contact for how things work around here?', options: ['Buddy', 'Practice lead', 'CEO'], correct: 0, explain: ['Correct.', 'Better for career guidance.', 'Not a good use of their time.'] },
  { q: 'Which statement reflects a good 30-day SMART goal?', options: ['Learn the tools', 'By day 30, complete lessons 1–3 and draft one client summary reviewed by my buddy', 'Do well'], correct: 1, explain: ['Not measurable.', 'Correct — specific, measurable, time-bound.', 'Not specific.'] },
]

// SYNTHETIC pilot data for the dashboard demo — fictional.
const dash = {
  completion: [
    { label: 'Lesson 1', value: 96 }, { label: 'Lesson 2', value: 91 }, { label: 'Lesson 3', value: 84 },
    { label: 'Scenarios', value: 78 }, { label: 'Final assessment', value: 72 },
  ],
  participation: [
    { label: 'Orientation', value: 100 }, { label: '30-day pulse', value: 82 }, { label: 'Day-45 check-in', value: 67 }, { label: '90-day review', value: 58 },
  ],
  feedback: [
    { label: 'Relevant', value: 4.4 }, { label: 'Clear', value: 4.1 }, { label: 'Manager support', value: 3.5 }, { label: 'Resources easy to find', value: 3.2 },
  ],
  knowledge: [{ label: 'Pre', value: 54 }, { label: 'Post', value: 79 }],
}

export function ElevateModule() {
  const [done, setDone] = usePersisted<string[]>('elevate:done', [])
  const [tab, setTab] = useState<'learn' | 'scenario' | 'final' | 'dashboard'>('learn')
  const [open, setOpen] = useState(lessons[0].id)
  const mark = (id: string) => setDone((d) => (d.includes(id) ? d : [...d, id]))
  const totalSteps = lessons.length + 2
  const completeCount = done.length
  const pct = Math.round((completeCount / totalSteps) * 100)

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="flex justify-between text-sm"><span>Course progress</span><span>{pct}%</span></div>
          <div className="h-2 rounded bg-warm-200" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Course progress">
            <div className="h-2 rounded bg-sage-600 transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => setDone([])}>Reset progress</button>
      </div>
      <div role="tablist" aria-label="ELEVATE sections" className="mb-5 flex flex-wrap gap-2">
        {(['learn', 'scenario', 'final', 'dashboard'] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} type="button" className={`btn ${tab === t ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab(t)}>
            {{ learn: 'Lessons', scenario: 'Scenario decisions', final: 'Final assessment', dashboard: 'Pilot dashboard (synthetic)' }[t]}
          </button>
        ))}
      </div>

      {tab === 'learn' && (
        <div className="space-y-4">
          {lessons.map((l) => (
            <div key={l.id} className="card">
              <h3 className="text-xl">
                <button type="button" className="flex w-full items-center justify-between text-left" aria-expanded={open === l.id} onClick={() => setOpen(open === l.id ? '' : l.id)}>
                  <span>{done.includes(l.id) ? '✓ ' : ''}{l.title} <span className="text-sm font-sans text-warm-600">({l.minutes} min)</span></span>
                  <span aria-hidden>{open === l.id ? '–' : '+'}</span>
                </button>
              </h3>
              {open === l.id && (
                <div className="mt-4 fade-in">
                  {l.body.map((p, i) => <p key={i} className="mb-3 max-w-prose">{p}</p>)}
                  <p className="mb-5 rounded-lg bg-sage-50 p-3 text-sm"><strong>Action:</strong> {l.tip}</p>
                  <Quiz id={`elevate-${l.id}`} title="Knowledge check" questions={l.check} passMark={1} onComplete={(s) => s === l.check.length && mark(l.id)} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {tab === 'scenario' && (
        <div>
          <p className="mb-3 max-w-prose">Practice three first-month decisions. Each choice leads to a realistic response and coaching. You can retry as often as you like.</p>
          <Branching nodes={scenario} start="s1" title="First-month decisions" />
          <button type="button" className="btn btn-ghost mt-4" onClick={() => mark('scenario')}>Mark scenarios as complete</button>
          {done.includes('scenario') && <span className="ml-3 text-sm" role="status">✓ Saved</span>}
        </div>
      )}
      {tab === 'final' && <Quiz id="elevate-final" title="Final assessment" questions={finalQs} passMark={0.8} onComplete={(s) => s / finalQs.length >= 0.8 && mark('final')} />}
      {tab === 'dashboard' && (
        <div className="space-y-6">
          <p className="sim-badge">SYNTHETIC DATA — fictional pilot of 24 new hires; not real results</p>
          <div className="grid gap-6 md:grid-cols-2">
            <BarChart title="Completion rate by activity (%)" data={dash.completion} max={100} unit="%" />
            <BarChart title="Participation (%)" data={dash.participation} max={100} unit="%" />
            <BarChart title="Feedback ratings (1–5)" data={dash.feedback} max={5} unit="" />
            <BarChart title="Knowledge assessment average (%)" data={dash.knowledge} max={100} unit="%" />
          </div>
          <div className="card">
            <h3 className="text-xl">Suggested improvements (illustrative)</h3>
            <ul className="prose-l mt-3">
              <li><strong>Resources easy to find</strong> scores lowest (3.2): consolidate links into one hub and add search tips.</li>
              <li><strong>Manager support</strong> is uneven (3.5) and day-45 check-ins are at 67%: add calendar prompts and a manager briefing.</li>
              <li>Completion declines through the course: shorten the final assessment or split it.</li>
              <li>The pre/post gain (+25 points) is a learning measure, not proof of business impact.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
