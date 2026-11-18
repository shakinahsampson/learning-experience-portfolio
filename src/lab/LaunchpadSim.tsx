import { useState } from 'react'
import { usePersisted, asset } from '../lib/storage'
import { Branching, type Node } from './Branching'
import { Quiz, type Question } from './Quiz'

type Result = { ok: boolean; msg: string } | null

const people = ['Ana (Design lead)', 'Ben (Engineer)', 'Chidi (Vendor manager)', 'Dee (Project sponsor)']

function Task({ id, title, story, hint, children, check, done, onDone }: {
  id: string; title: string; story: string; hint: string; children: React.ReactNode
  check: () => Result; done: boolean; onDone: () => void
}) {
  const [res, setRes] = useState<Result>(null)
  const [showHint, setShowHint] = useState(false)
  return (
    <form
      aria-labelledby={`t-${id}`}
      className="card"
      onSubmit={(e) => { e.preventDefault(); const r = check(); setRes(r); if (r?.ok) onDone() }}
    >
      <h3 id={`t-${id}`} className="text-lg">{done ? '✓ ' : ''}{title}</h3>
      <p className="mt-1 text-sm text-warm-600">{story}</p>
      <div className="mt-4 rounded-lg border border-warm-200 bg-white p-4 space-y-3" aria-label="Simulated FlowBoard interface">
        <p className="text-xs font-semibold uppercase tracking-wider text-warm-600">FlowBoard (simulated)</p>
        {children}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 items-center">
        <button type="submit" className="btn btn-primary">Submit</button>
        <button type="button" className="btn btn-ghost" onClick={() => setShowHint((s) => !s)} aria-expanded={showHint}>{showHint ? 'Hide hint' : 'Show hint'}</button>
      </div>
      {showHint && <p className="mt-3 text-sm rounded bg-sage-50 p-3">Hint: {hint}</p>}
      {res && <p role="status" className={`mt-3 text-sm font-semibold ${res.ok ? 'text-sage-700' : 'text-[#9a3b2e]'}`}>{res.ok ? '✓ ' : '✗ '}{res.msg}</p>}
    </form>
  )
}

const field = 'mt-1 block w-full rounded-md border border-warm-400 bg-white px-3 py-2'

const troubleshoot: Node[] = [
  {
    id: 't1',
    context: 'You try to post a status update and the page shows “Something went wrong. Try again.”',
    prompt: 'What is your first move?',
    choices: [
      { text: 'Switch back to the old spreadsheet until it’s fixed.', next: 't2', quality: 'poor', reply: 'Your update now lives in two places and the team has conflicting information.', coach: 'Reverting to old tools fragments data. Try quick fixes first, then ask for help.' },
      { text: 'Refresh and retry once; if it still fails, check the support FAQ.', next: 't2', quality: 'best', reply: 'The refresh works. You post your update in under a minute.', coach: 'Quick, low-risk fixes first. Escalate only if they fail.' },
      { text: 'Email the whole department about the bug.', next: 't2', quality: 'poor', reply: 'You receive three “me too” replies and no fix.', coach: 'Use the dedicated support channel so the right people see it.' },
    ],
  },
  {
    id: 't2',
    context: 'A teammate says they cannot see the project you just updated.',
    prompt: 'What do you do?',
    choices: [
      { text: 'Check the project’s sharing settings and add the teammate as a viewer.', next: 't3', quality: 'best', reply: 'The teammate can see the project immediately.', coach: 'Permissions are a common cause. Check settings before escalating.' },
      { text: 'Tell them to wait until the admin fixes it.', next: 't3', quality: 'okay', reply: 'They wait a day, delaying their work.', coach: 'Waiting can be right if you lack permission to share, but check first.' },
      { text: 'Send screenshots by email instead.', next: 't3', quality: 'poor', reply: 'The workaround spreads outside the platform.', coach: 'Work-arounds undermine adoption. Fix access instead.' },
    ],
  },
  {
    id: 't3',
    context: 'The problem is a bug that blocks every status update for your team. It is Thursday and a client report is due Friday.',
    prompt: 'What is the best next step?',
    choices: [
      { text: 'Post in #flowboard-help with a screenshot, mark it urgent, and tell your lead about the Friday deadline.', next: 'tend', quality: 'best', reply: 'Support responds within the hour with a workaround for Friday.', coach: 'Include impact, deadline, and evidence so support can prioritize.' },
      { text: 'Wait for someone else to report it.', next: 'tend', quality: 'poor', reply: 'No one reports it. The deadline is at risk.', coach: 'Do not assume others have reported an issue.' },
      { text: 'Ask for exception: skip the platform for this report.', next: 'tend', quality: 'okay', reply: 'The report ships, but the bug is not reported.', coach: 'Meeting the deadline matters, but report the bug too.' },
    ],
  },
  { id: 'tend', prompt: '', end: { title: 'Troubleshooting complete', summary: 'Effective troubleshooting tries quick fixes first, uses the right channel, and communicates impact and deadlines. Retry to see how other choices play out.' } },
]

const checkQs: Question[] = [
  { q: 'How many accountable owners should a task have?', options: ['One', 'As many as needed', 'None until work starts'], correct: 0, explain: ['Correct — one owner avoids diffusion of responsibility; others can be collaborators.', 'Several owners make accountability unclear.', 'Unowned tasks tend to drift.'] },
  { q: 'A blocker has been unresolved for three days. What next?', options: ['Wait another day', 'Message the owner’s manager with the blocker link', 'Delete the task'], correct: 1, explain: ['Waiting lengthens the delay.', 'Correct — the job aid recommends escalating blockers unresolved more than 2 days.', 'Deleting loses the history and does not solve the problem.'] },
  { q: 'A good status summary includes…', options: ['Only “on track”', 'What changed and what is next', 'A long history of the project'], correct: 1, explain: ['Too little information.', 'Correct — it keeps updates short and useful.', 'Too long to be read.'] },
]

export function LaunchpadSim() {
  const [done, setDone] = usePersisted<string[]>('launchpad:done', [])
  const mark = (id: string) => setDone((d) => (d.includes(id) ? d : [...d, id]))
  const [status, setStatus] = useState('')
  const [summary, setSummary] = useState('')
  const [blocker, setBlocker] = useState('')
  const [tag, setTag] = useState('')
  const [owner, setOwner] = useState('')
  const [due, setDue] = useState('')
  const [path, setPath] = useState('')
  const total = 5
  const pct = Math.round((done.length / total) * 100)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-[200px] flex-1">
          <div className="flex justify-between text-sm"><span>Practice progress (4 tasks + troubleshooting)</span><span>{pct}%</span></div>
          <div className="h-2 rounded bg-warm-200" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Launchpad progress">
            <div className="h-2 rounded bg-sage-600 transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <a className="btn btn-ghost" href={asset('downloads/launchpad-quick-reference-job-aid.md')} download>Download job aid</a>
        <button type="button" className="btn btn-ghost" onClick={() => setDone([])}>Reset progress</button>
      </div>
      <p className="text-sm text-warm-600">Goal: complete four realistic tasks in a simulated work-management tool, then practice troubleshooting. About 20 minutes. “FlowBoard” is fictional.</p>

      <Task id="status" title="Task 1: Update project status" done={done.includes('status')} onDone={() => mark('status')}
        story="Project “Client Portal Redesign” is two weeks behind because vendor APIs are delayed. Update the status."
        hint="Choose the status that matches the situation and write one sentence on what changed and what is next."
        check={() => status !== 'At risk' ? { ok: false, msg: status ? 'The project is behind but still recoverable, so “At risk” is the best fit.' : 'Choose a status.' } : summary.trim().length < 20 ? { ok: false, msg: 'Add a summary of what changed and what is next (at least a sentence).' } : { ok: true, msg: 'Well done. “At risk” with a clear summary lets stakeholders respond early.' }}>
        <label className="block text-sm font-medium">Status
          <select className={field} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Select…</option><option>On track</option><option>At risk</option><option>Off track</option>
          </select>
        </label>
        <label className="block text-sm font-medium">Summary
          <textarea className={field} rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} />
        </label>
      </Task>

      <Task id="blocker" title="Task 2: Identify a blocker" done={done.includes('blocker')} onDone={() => mark('blocker')}
        story="The delay is caused by missing API credentials from the vendor. Flag it as a blocker."
        hint="Say what is blocked, since when, and what you need. Tag the person who can unblock it — the vendor relationship owner."
        check={() => blocker.trim().length < 20 ? { ok: false, msg: 'Describe what is blocked and what you need (at least a sentence).' } : tag !== 'Chidi (Vendor manager)' ? { ok: false, msg: tag ? 'That person cannot unblock vendor access. Choose the person who manages the vendor relationship.' : 'Tag someone who can help.' } : { ok: true, msg: 'Correct. A clear description and the right person make unblocking faster.' }}>
        <label className="block text-sm font-medium">Blocker description
          <textarea className={field} rows={2} value={blocker} onChange={(e) => setBlocker(e.target.value)} />
        </label>
        <label className="block text-sm font-medium">Tag
          <select className={field} value={tag} onChange={(e) => setTag(e.target.value)}>
            <option value="">Select a person…</option>{people.map((p) => <option key={p}>{p}</option>)}
          </select>
        </label>
      </Task>

      <Task id="owner" title="Task 3: Assign ownership" done={done.includes('owner')} onDone={() => mark('owner')}
        story="The task “Draft integration test plan” has no owner. Ben is the engineer who will do the work. It is needed in 5 days."
        hint="Assign one owner — the person doing the work — and set a due date."
        check={() => owner !== 'Ben (Engineer)' ? { ok: false, msg: owner ? 'The person doing the work should own it.' : 'Select an owner.' } : !due ? { ok: false, msg: 'Set a due date so the owner knows when it is needed.' } : { ok: true, msg: 'Right. One owner and a due date create clear accountability.' }}>
        <label className="block text-sm font-medium">Owner
          <select className={field} value={owner} onChange={(e) => setOwner(e.target.value)}>
            <option value="">Select an owner…</option>{people.map((p) => <option key={p}>{p}</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium">Due date
          <input type="date" className={field} value={due} onChange={(e) => setDue(e.target.value)} />
        </label>
      </Task>

      <Task id="escalate" title="Task 4: Escalate a risk" done={done.includes('escalate')} onDone={() => mark('escalate')}
        story="The vendor blocker has been unresolved for three days and the launch date is at risk."
        hint="The job aid says: a blocker unresolved for more than two days goes to the owner’s manager; if the delivery date is at risk, also notify the project lead."
        check={() => path === 'manager-lead' ? { ok: true, msg: 'Correct. Escalate with the blocker link and the delivery impact.' } : { ok: false, msg: path ? 'Not quite. After two days, escalate to the owner’s manager and notify the project lead since the date is at risk.' : 'Choose an escalation path.' }}>
        <fieldset>
          <legend className="text-sm font-medium">Escalation path</legend>
          {[['wait', 'Wait another week'], ['channel', 'Post in the general team channel'], ['manager-lead', 'Message the owner’s manager with the blocker link and notify the project lead']].map(([v, l]) => (
            <label key={v} className="mt-2 flex items-start gap-2 text-sm"><input type="radio" name="esc" value={v} checked={path === v} onChange={() => setPath(v)} className="mt-1" />{l}</label>
          ))}
        </fieldset>
      </Task>

      <div>
        <h3 className="mb-3 text-xl">Troubleshooting decisions</h3>
        <Branching nodes={troubleshoot} start="t1" title="Troubleshooting" />
        <button type="button" className="btn btn-ghost mt-3" onClick={() => mark('troubleshoot')}>Mark troubleshooting complete</button>
        {done.includes('troubleshoot') && <span className="ml-3 text-sm" role="status">✓ Saved</span>}
      </div>
      <Quiz id="launchpad-check" title="Knowledge check" questions={checkQs} passMark={0.67} />
    </div>
  )
}
