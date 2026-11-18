import { useState } from 'react'
import { asset } from '../lib/storage'
import { Branching, type Node } from './Branching'
import { Quiz, type Question } from './Quiz'

const nodes: Node[] = [
  {
    id: 'c1',
    context: 'Fictional scenario. Jordan, a consultant on your team, has interrupted a client twice in meetings this week. You are a new manager meeting 1:1.',
    prompt: 'How do you open the conversation?',
    choices: [
      { text: '“We need to talk about your attitude in meetings.”', next: 'c2-defensive', quality: 'poor', reply: 'Jordan stiffens. “My attitude? What did I do wrong?”', coach: '“Attitude” is a label, not a behavior. It invites defensiveness. State the purpose and a specific situation.' },
      { text: '“I’d like to talk about Tuesday’s client meeting. I want to support you — can I share what I observed?”', next: 'c2-open', quality: 'best', reply: 'Jordan nods. “Sure. I wondered how it went.”', coach: 'Stating purpose, positive intent, and asking permission builds safety.' },
      { text: '“Some people have mentioned you’re a bit much in meetings.”', next: 'c2-defensive', quality: 'poor', reply: 'Jordan looks hurt. “Who said that?”', coach: 'Vague second-hand feedback is hard to act on and erodes trust.' },
    ],
  },
  {
    id: 'c2-open',
    prompt: 'You describe the behavior. Which statement do you choose?',
    choices: [
      { text: '“You interrupted the client twice, and it made it hard for them to finish their point.”', next: 'c3', quality: 'best', reply: 'Jordan pauses. “I didn’t realize. I was excited about the idea.”', coach: 'Behavior plus impact (S-B-I) is specific and factual.' },
      { text: '“You were rude to the client.”', next: 'c3', quality: 'poor', reply: 'Jordan: “I didn’t mean to be rude!”', coach: '“Rude” is a judgment. Describe what you saw instead.' },
      { text: '“It’s probably nothing, but you might want to wait a bit longer before talking.”', next: 'c3', quality: 'okay', reply: 'Jordan: “Okay… was it a problem?”', coach: 'Softening too much hides the impact. Be kind and clear.' },
    ],
  },
  {
    id: 'c2-defensive',
    context: 'Jordan is now defensive. You can still recover.',
    prompt: 'What do you do next?',
    choices: [
      { text: 'Pause, acknowledge, and restart: “That came out vague. Let me be specific about Tuesday.”', next: 'c3', quality: 'best', reply: 'Jordan relaxes slightly. “Okay, go ahead.”', coach: 'Repairing the conversation models accountability.' },
      { text: 'Insist: “You know what I mean.”', next: 'c3', quality: 'poor', reply: 'Jordan folds arms: “Actually, I don’t.”', coach: 'Insisting increases defensiveness. Reset with specifics.' },
      { text: 'Drop it and change the subject.', next: 'c3', quality: 'poor', reply: 'Jordan looks relieved. The behavior continues.', coach: 'Avoidance leaves the issue unresolved.' },
    ],
  },
  {
    id: 'c3',
    prompt: 'Now you want to understand Jordan’s perspective. What do you say?',
    choices: [
      { text: '“What was happening for you in that moment?”', next: 'c4', quality: 'best', reply: '“I was worried the client would move on before I made my point.”', coach: 'Open questions surface context and help you coach, not just correct.' },
      { text: '“Next time just let others finish.”', next: 'c4', quality: 'okay', reply: 'Jordan: “Okay.” You don’t learn why it happened.', coach: 'Directing without asking misses root causes.' },
      { text: '“Why did you do that?”', next: 'c4', quality: 'poor', reply: 'Jordan: “I don’t know…”', coach: '“Why” questions can feel accusing. Try “what” or “how”.' },
    ],
  },
  {
    id: 'c4',
    prompt: 'How do you close the conversation?',
    choices: [
      { text: '“Let’s agree on one thing: next client meeting, jot down your point and wait for a pause. Let’s debrief Thursday.”', next: 'end', quality: 'best', reply: 'Jordan: “I can do that. Thanks for telling me directly.”', coach: 'One specific action with a follow-up date makes change likely.' },
      { text: '“Just try to do better.”', next: 'end', quality: 'poor', reply: 'Jordan: “Okay, I’ll try.” Neither of you knows what “better” means.', coach: 'Vague endings produce vague results.' },
      { text: '“Here are five things to work on this month.”', next: 'end', quality: 'okay', reply: 'Jordan looks overwhelmed.', coach: 'Focus on one or two priorities.' },
    ],
  },
  { id: 'end', prompt: '', end: { title: 'Conversation complete', summary: 'Effective feedback opens with purpose, states specific behavior and impact, asks for perspective, and ends with one agreed action. Retry to compare paths.' } },
]

const qs: Question[] = [
  { q: 'Which statement describes behavior rather than judgment?', options: ['You were unprofessional.', 'You arrived 15 minutes after the meeting started.', 'You seem uninterested.'], correct: 1, explain: ['A label.', 'Correct — observable and factual.', 'An inference about feelings.'] },
  { q: 'What does the “I” in S-B-I-A stand for?', options: ['Intention', 'Impact', 'Idea'], correct: 1, explain: ['The framework focuses on impact, not intent.', 'Correct — the effect the behavior had.', 'Not part of the model.'] },
  { q: 'After describing the behavior, you should…', options: ['Immediately tell them what to do', 'Ask for their perspective', 'End the conversation'], correct: 1, explain: ['Asking first leads to better solutions and buy-in.', 'Correct.', 'You still need to agree next steps.'] },
]

export function CoachForward() {
  const [note, setNote] = useState(() => { try { return localStorage.getItem('ss-portfolio:coach:reflection') ?? '' } catch { return '' } })
  const [saved, setSaved] = useState(false)
  const save = () => { try { localStorage.setItem('ss-portfolio:coach:reflection', note); setSaved(true) } catch { setSaved(false) } }
  return (
    <div className="space-y-8">
      <p className="text-sm text-warm-600">A fictional, scenario-based practice for first-time managers. Not a program that has been delivered in a company.</p>
      <Branching nodes={nodes} start="c1" title="Feedback conversation" />
      <Quiz id="coach-assess" title="Knowledge assessment" questions={qs} passMark={0.67} />
      <section className="card" aria-labelledby="refl">
        <h3 id="refl" className="text-xl">Learner reflection</h3>
        <label htmlFor="reflection" className="mt-2 block text-sm">What is one feedback conversation you’ve been avoiding, and what will you do using S-B-I-A?</label>
        <textarea id="reflection" className="mt-2 block w-full rounded-md border border-warm-400 bg-white p-3" rows={4} value={note} onChange={(e) => { setNote(e.target.value); setSaved(false) }} />
        <p className="mt-2 text-xs text-warm-600">Stored only in this browser (localStorage). Never sent anywhere.</p>
        <div className="mt-3 flex gap-3 items-center">
          <button type="button" className="btn btn-primary" onClick={save}>Save reflection</button>
          {saved && <span role="status" className="text-sm">✓ Saved on this device</span>}
          <a className="btn btn-ghost" href={asset('downloads/coachforward-feedback-job-aid.md')} download>Download job aid</a>
        </div>
      </section>
    </div>
  )
}
