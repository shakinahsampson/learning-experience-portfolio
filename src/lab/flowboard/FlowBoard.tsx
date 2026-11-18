import { useState } from 'react'
import { GOAL_ORDER, type FScenario, type FTask, type GoalId, type ProjectStatus, type TaskStatus } from './scenarios'

export interface BoardState {
  status: ProjectStatus
  tasks: FTask[]
  risk: { severity: string; to: string; note: string; sent: boolean }
  update: string
}
export const initialBoard = (sc: FScenario): BoardState => ({
  status: sc.status, tasks: sc.tasks.map((t) => ({ ...t })), risk: { severity: '', to: '', note: '', sent: false }, update: '',
})

/** Produces the state a learner would have after correctly completing the given goals (used to pre-seed later lessons). */
export function solvedBoard(sc: FScenario, goals: GoalId[]): BoardState {
  const b = initialBoard(sc); const e = sc.expect
  if (goals.includes('status')) b.status = e.status
  const find = (id: string) => b.tasks.find((t) => t.id === id)!
  if (goals.includes('blocker')) { const t = find(e.blockerTask); t.status = 'Blocked'; t.blocker = e.sampleBlocker }
  if (goals.includes('assign')) { const t = find(e.assignTask); t.owner = e.ownerOk[0]; t.due = e.dueMax }
  if (goals.includes('dependency')) find(e.dep[0]).dependsOn = e.dep[1]
  if (goals.includes('escalate')) b.risk = { severity: 'High', to: e.escalateTo, note: 'Vendor access delay threatens the milestone; need your help.', sent: true }
  return b
}

export interface GoalResult { ok: boolean; issues: string[] }
const has = (text: string, alts: string) => new RegExp(alts, 'i').test(text)
const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length

export function checkGoal(goal: GoalId, sc: FScenario, b: BoardState): GoalResult {
  const e = sc.expect; const issues: string[] = []
  const task = (id: string) => b.tasks.find((t) => t.id === id)!
  switch (goal) {
    case 'status':
      if (b.status !== e.status) issues.push(b.status === 'On track' ? 'The status still says “On track” even though a critical task is overdue and a milestone is approaching.' : b.status === 'Off track' ? '“Off track” suggests the delivery date is already lost. The evidence shows a risk to the date, not a certain miss.' : 'Choose a status that matches the evidence.')
      break
    case 'blocker': {
      const t = task(e.blockerTask)
      if (!t.blocker) { issues.push('No blocker has been added to the overdue task.'); break }
      if (t.status !== 'Blocked') issues.push('Set the task status to Blocked so it shows up on the dashboard.')
      const missing = e.blockerWords.filter((w) => !has(t.blocker!, w))
      if (words(t.blocker) < 12 || missing.length) issues.push('A strong blocker states what is blocked, why, what has been tried, and the impact on the milestone.')
      break
    }
    case 'assign': {
      const t = task(e.assignTask)
      if (!t.owner || !t.due) { issues.push('Both an owner and a due date are needed.'); break }
      if (!e.ownerOk.includes(t.owner)) issues.push(`${t.owner} is not a sensible owner for this task. Check each person’s role.`)
      if (t.due > e.dueMax) issues.push('The due date lands after the milestone that depends on this task.')
      if (t.due < sc.today) issues.push('The due date is in the past.')
      break
    }
    case 'dependency':
      if (task(e.dep[0]).dependsOn !== e.dep[1]) issues.push('The task that cannot start until the blocker clears has no dependency recorded.')
      break
    case 'escalate':
      if (!b.risk.sent) { issues.push('The risk has not been sent.'); break }
      if (b.risk.severity !== e.escalateSeverity) issues.push('A delay that threatens a milestone is a High severity risk.')
      if (b.risk.to !== e.escalateTo) issues.push('Escalate to the person who can act: the engagement manager.')
      if (words(b.risk.note) < 8) issues.push('Add a short note that explains the impact and what you need.')
      break
    case 'update': {
      if (!b.update.trim()) { issues.push('No update has been written.'); break }
      if (words(b.update) > e.updateMax) issues.push(`Keep it under ${e.updateMax} words; busy readers skim.`)
      const labels = ['state the status', 'name the blocker', 'say what it affects', 'state the decision or help you need']
      e.updateWords.forEach((alts, i) => { if (!alts.some((a) => has(b.update, a))) issues.push(`Your update should ${labels[i]}.`) })
      break
    }
  }
  return { ok: issues.length === 0, issues }
}

const pill: Record<string, string> = {
  'On track': 'bg-sage-100 text-sage-900', 'At risk': 'bg-[#f6ecc9] text-[#5c4510]', 'Off track': 'bg-[#f3d9d3] text-[#6b2216]',
  'Not started': 'bg-warm-200 text-charcoal', 'In progress': 'bg-sage-100 text-sage-900', Blocked: 'bg-[#f3d9d3] text-[#6b2216]', Done: 'bg-sage-300 text-sage-900',
}
const fmt = (d: string | null) => (d ? new Date(d + 'T00:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : '—')
const Pill = ({ v }: { v: string }) => <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${pill[v]}`}>{v === 'Blocked' ? '⛔ ' : v === 'At risk' ? '⚠ ' : v === 'Off track' ? '✕ ' : ''}{v}</span>

type Tab = 'tasks' | 'milestones' | 'risk' | 'update'

export function FlowBoard({ sc, goals, mode, initial, onFinish, resolved }: {
  sc: FScenario; goals: GoalId[]; mode: 'guided' | 'independent'; initial?: BoardState
  onFinish: (score: number, max: number) => void; resolved: boolean
}) {
  const [b, setB] = useState<BoardState>(() => initial ?? initialBoard(sc))
  const [tab, setTab] = useState<Tab>('tasks')
  const [sel, setSel] = useState<string | null>(null)
  const [help, setHelp] = useState(false)
  const [notes, setNotes] = useState(false)
  const [checked, setChecked] = useState<Partial<Record<GoalId, GoalResult>>>({})
  const [msg, setMsg] = useState('')
  const [done, setDone] = useState(false)
  void resolved
  const [blockerDraft, setBlockerDraft] = useState('')
  const guided = mode === 'guided'
  const order = GOAL_ORDER.filter((g) => goals.includes(g))
  const upd = (f: (x: BoardState) => BoardState) => { setB(f); setMsg('') }
  const setTask = (id: string, patch: Partial<FTask>) => upd((x) => ({ ...x, tasks: x.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }))
  const results = Object.fromEntries(order.map((g) => [g, checkGoal(g, sc, b)])) as Record<GoalId, GoalResult>
  const nDone = order.filter((g) => results[g].ok).length
  const task = sel ? b.tasks.find((t) => t.id === sel) : null
  const overdue = (t: FTask) => t.due && t.due < sc.today && t.status !== 'Done'

  const check = () => {
    const r: Partial<Record<GoalId, GoalResult>> = {}
    order.forEach((g) => (r[g] = results[g])); setChecked(r)
    setMsg(`${nDone} of ${order.length} tasks complete.`)
  }
  const finish = () => { check(); setDone(true); onFinish(nDone, order.length) }
  const tabs: [Tab, string][] = [['tasks', 'Tasks'], ['milestones', 'Milestones'], ['risk', 'Raise risk'], ['update', 'Post update']]

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-warm-400 bg-white shadow-sm" role="application" aria-label={`FlowBoard simulation: ${sc.name}`}>
        {/* app bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-xl bg-charcoal px-4 py-2 text-white">
          <span className="font-serif text-lg">FlowBoard <span className="text-xs font-sans text-warm-200">fictional software</span></span>
          <div className="flex gap-2">
            <button type="button" className="rounded px-2 py-1 text-sm hover:bg-white/15" aria-expanded={notes} onClick={() => setNotes(!notes)}>🔔 Notifications ({sc.notifications.length})</button>
            <button type="button" className="rounded px-2 py-1 text-sm hover:bg-white/15" aria-expanded={help} onClick={() => setHelp(!help)}>? Help</button>
          </div>
        </div>
        {notes && <ul className="border-b border-warm-200 bg-ivory p-3 text-sm" aria-label="Notifications">{sc.notifications.map((n, i) => <li key={i} className="py-1"><strong>{n.from}</strong> <span className="text-warm-600">· {n.when}</span><br />{n.text}</li>)}</ul>}
        {help && <div className="border-b border-warm-200 bg-sage-50 p-3 text-sm" role="note"><strong>Contextual help ({tab}).</strong>{' '}
          {tab === 'tasks' && 'Select a task to open its details. Owner, due date, status, dependencies and blockers are set there. Overdue dates show in red.'}
          {tab === 'milestones' && 'Milestones are the dates the client cares about. Tasks that feed a milestone are listed beneath it.'}
          {tab === 'risk' && 'Use Raise risk when something threatens a milestone and needs someone else’s decision. Pick the severity and the person who can act.'}
          {tab === 'update' && 'A project update should be scannable: status, what is blocked, impact, action taken, and the help you need.'}</div>}

        <div className="grid min-w-0 md:grid-cols-[200px_minmax(0,1fr)]">
          <nav aria-label="Projects" className="hidden border-r border-warm-200 bg-ivory p-3 text-sm md:block">
            <p className="eyebrow !text-[10px]">Projects</p>
            <ul className="mt-2 space-y-2">
              <li className="rounded-lg border border-sage-300 bg-white p-2"><strong className="block">{sc.name}</strong><Pill v={b.status} /></li>
              {sc.otherProject.map((p) => <li key={p.name} className="rounded-lg border border-warm-200 p-2 opacity-80"><span className="block">{p.name}</span><Pill v={p.status} /><span className="mt-1 block text-xs text-warm-600">{p.note}</span></li>)}
            </ul>
          </nav>
          <div className="min-w-0 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h3 className="text-xl">{sc.name}</h3><p className="text-xs text-warm-600">{sc.client} · Today {fmt(sc.today)} · Go-live {fmt(sc.goLive)}</p></div>
              <label className="text-sm">Project status<select className="ml-2 rounded border border-warm-400 bg-white px-2 py-1" value={b.status} onChange={(e) => upd((x) => ({ ...x, status: e.target.value as ProjectStatus }))}>
                {(['On track', 'At risk', 'Off track'] as ProjectStatus[]).map((s) => <option key={s}>{s}</option>)}</select></label>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3 text-sm">
              <div className="rounded-lg bg-ivory p-2">Tasks done<br /><strong>{b.tasks.filter((t) => t.status === 'Done').length}/{b.tasks.length}</strong></div>
              <div className="rounded-lg bg-ivory p-2">Overdue<br /><strong>{b.tasks.filter(overdue).length}</strong></div>
              <div className="rounded-lg bg-ivory p-2">Blockers<br /><strong>{b.tasks.filter((t) => t.blocker).length}</strong></div>
            </div>
            <div role="tablist" aria-label="Project sections" className="mt-4 flex flex-wrap gap-1 border-b border-warm-200">
              {tabs.map(([k, l]) => <button key={k} role="tab" type="button" aria-selected={tab === k} className={`rounded-t px-3 py-1.5 text-sm ${tab === k ? 'bg-sage-100 font-semibold' : 'hover:bg-sage-50'}`} onClick={() => setTab(k)}>{l}</button>)}
            </div>

            <div className="mt-3" role="tabpanel">
              {tab === 'tasks' && (
                <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
                  <div className="table-wrap"><table><caption className="sr-only">Project tasks</caption>
                    <thead><tr><th scope="col">Task</th><th scope="col">Owner</th><th scope="col">Due</th><th scope="col">Status</th></tr></thead>
                    <tbody>{b.tasks.map((t) => (
                      <tr key={t.id} className={sel === t.id ? 'bg-sage-50' : ''}>
                        <th scope="row" className="p-3 text-left font-normal"><button type="button" className="text-left underline decoration-dotted" onClick={() => { setSel(t.id); setBlockerDraft(t.blocker ?? '') }} aria-label={`Open task ${t.title}`}>{t.title}</button>
                          {t.dependsOn && <span className="block text-xs text-warm-600">⛓ Depends on: {b.tasks.find((x) => x.id === t.dependsOn)?.title}</span>}
                          {t.blocker && <span className="block text-xs text-[#6b2216]">Blocker: {t.blocker.slice(0, 60)}{t.blocker.length > 60 ? '…' : ''}</span>}</th>
                        <td>{t.owner ?? <em className="text-warm-600">Unassigned</em>}</td>
                        <td className={overdue(t) ? 'font-semibold text-[#8a2a1a]' : ''}>{fmt(t.due)}{overdue(t) ? ' (overdue)' : ''}</td>
                        <td><Pill v={t.status} /></td></tr>))}</tbody></table></div>
                  <div className="rounded-lg border border-warm-200 p-3 text-sm" aria-live="polite">
                    {!task ? <p className="text-warm-600">Select a task to see and edit its details.</p> : (
                      <div className="space-y-3">
                        <h4 className="font-serif text-lg">{task.title}</h4>
                        <label className="block">Owner<select className="mt-1 block w-full rounded border border-warm-400 bg-white p-1.5" value={task.owner ?? ''} onChange={(e) => setTask(task.id, { owner: e.target.value || null })}>
                          <option value="">Unassigned</option>{sc.people.map((p) => <option key={p.name} value={p.name}>{p.name} — {p.role}</option>)}</select></label>
                        <label className="block">Due date<input type="date" className="mt-1 block w-full rounded border border-warm-400 bg-white p-1.5" value={task.due ?? ''} onChange={(e) => setTask(task.id, { due: e.target.value || null })} /></label>
                        <label className="block">Status<select className="mt-1 block w-full rounded border border-warm-400 bg-white p-1.5" value={task.status} onChange={(e) => setTask(task.id, { status: e.target.value as TaskStatus })}>
                          {(['Not started', 'In progress', 'Blocked', 'Done'] as TaskStatus[]).map((s) => <option key={s}>{s}</option>)}</select></label>
                        <label className="block">Depends on<select className="mt-1 block w-full rounded border border-warm-400 bg-white p-1.5" value={task.dependsOn ?? ''} onChange={(e) => setTask(task.id, { dependsOn: e.target.value || null })}>
                          <option value="">No dependency</option>{b.tasks.filter((t) => t.id !== task.id).map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}</select></label>
                        <div>
                          <label htmlFor="blk" className="block">Blocker</label>
                          <textarea id="blk" rows={3} className="mt-1 block w-full rounded border border-warm-400 bg-white p-1.5" placeholder="What is blocked, why, what you have tried, and the impact." value={blockerDraft} onChange={(e) => setBlockerDraft(e.target.value)} />
                          <button type="button" className="btn btn-ghost mt-2 !py-1" onClick={() => setTask(task.id, { blocker: blockerDraft.trim() || null, status: blockerDraft.trim() ? 'Blocked' : task.status })}>Save blocker</button>
                          {task.blocker && <p className="mt-1 text-xs text-warm-600">Saved: {task.blocker}</p>}
                        </div>
                      </div>)}
                  </div>
                </div>)}
              {tab === 'milestones' && (
                <ol className="space-y-3">{sc.milestones.map((m) => (
                  <li key={m.name} className="rounded-lg border border-warm-200 p-3 text-sm"><strong>◆ {m.name}</strong> · {fmt(m.date)}
                    <ul className="mt-1 list-disc pl-5">{b.tasks.filter((t) => t.milestone === m.name).map((t) => <li key={t.id}>{t.title} <Pill v={t.status} />{overdue(t) ? <span className="ml-1 text-[#8a2a1a]">overdue</span> : null}</li>)}</ul></li>))}</ol>)}
              {tab === 'risk' && (
                <form className="max-w-lg space-y-3 text-sm" onSubmit={(e) => { e.preventDefault(); upd((x) => ({ ...x, risk: { ...x.risk, sent: true } })); setMsg('Risk sent.') }}>
                  <p>Raise a risk when a milestone is threatened and you need a decision from someone else.</p>
                  <label className="block">Severity<select className="mt-1 block w-full rounded border border-warm-400 bg-white p-1.5" value={b.risk.severity} onChange={(e) => upd((x) => ({ ...x, risk: { ...x.risk, severity: e.target.value, sent: false } }))}>
                    <option value="">Choose…</option><option>Low</option><option>Medium</option><option>High</option></select></label>
                  <label className="block">Send to<select className="mt-1 block w-full rounded border border-warm-400 bg-white p-1.5" value={b.risk.to} onChange={(e) => upd((x) => ({ ...x, risk: { ...x.risk, to: e.target.value, sent: false } }))}>
                    <option value="">Choose…</option>{sc.people.map((p) => <option key={p.name} value={p.name}>{p.name} — {p.role}</option>)}</select></label>
                  <label className="block">Note<textarea rows={3} className="mt-1 block w-full rounded border border-warm-400 bg-white p-1.5" value={b.risk.note} onChange={(e) => upd((x) => ({ ...x, risk: { ...x.risk, note: e.target.value, sent: false } }))} /></label>
                  <button type="submit" className="btn btn-primary" disabled={!b.risk.severity || !b.risk.to}>Send risk</button>
                  {b.risk.sent && <p role="status" className="text-sage-700">✓ Risk sent to {b.risk.to} as {b.risk.severity}.</p>}
                </form>)}
              {tab === 'update' && (
                <div className="max-w-lg space-y-2 text-sm"><label htmlFor="upd" className="block font-semibold">Project update ({words(b.update)} words)</label>
                  <textarea id="upd" rows={5} className="block w-full rounded border border-warm-400 bg-white p-2" value={b.update} onChange={(e) => upd((x) => ({ ...x, update: e.target.value }))} placeholder="Status · blocker · impact · action taken · help needed" /></div>)}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-warm-200 bg-ivory p-4" aria-label="Your tasks">
        <h4 className="font-serif text-lg">{guided ? 'Your mission, with coaching' : 'Your mission'} <span className="text-sm text-warm-600">({nDone}/{order.length})</span></h4>
        <p className="mt-1 text-sm">{sc.brief}</p>
        <ol className="mt-3 space-y-2 text-sm">
          {order.map((g, i) => (
            <li key={g} className="rounded-lg bg-white p-2"><span aria-hidden>{results[g].ok ? '✅' : '⬜'}</span> <strong>{i + 1}. {sc.goals[g].title}</strong><span className="sr-only">{results[g].ok ? ' (complete)' : ' (not complete)'}</span>
              {guided && !results[g].ok && <p className="mt-1 text-warm-600">Coach: {sc.goals[g].guide}</p>}
              {guided && results[g].ok && <p className="mt-1 text-sage-700">{sc.goals[g].done}</p>}
              {checked[g] && !checked[g]!.ok && <ul className="mt-1 list-disc pl-5 text-[#8a2a1a]">{checked[g]!.issues.map((x) => <li key={x}>{x}</li>)}</ul>}
              {!guided && done && results[g].ok && <p className="mt-1 text-sage-700">{sc.goals[g].done}</p>}
            </li>))}
        </ol>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn-ghost" onClick={check}>Check my work</button>
          <button type="button" className="btn btn-primary" disabled={guided && nDone < order.length} onClick={finish}>{guided ? 'Finish practice' : 'Submit for assessment'}</button>
          <span role="status" className="text-sm">{msg}</span>
        </div>
        {guided && nDone < order.length && <p className="mt-2 text-xs text-warm-600">Guided practice is finished when every task is complete.</p>}
        {done && <p className="mt-3 rounded bg-sage-50 p-3 text-sm" role="status">Recorded: {nDone} of {order.length} tasks completed correctly.{nDone < order.length ? ' Feedback above explains what to adjust; you can keep editing and retry.' : ''}</p>}
      </div>
    </div>
  )
}
