import { useEffect, useMemo, useRef, useState } from 'react'
import type { ActivityStep, Course, CourseState, Step } from './types'
import { emptyState } from './types'
import { usePersisted, asset } from '../lib/storage'
import { courseProgress, moduleScore, recordResult } from './scoring'
import { ActivityView } from './Activities'
import { Blocks } from './Blocks'

type Pos = { v: 'overview' } | { v: 'step'; m: number; s: number } | { v: 'final' } | { v: 'summary' }

const kindLabel: Record<Step['kind'], string> = {
  scenario: 'The situation', instruction: 'Learn the skill', worked: 'Worked example', guided: 'Guided practice',
  independent: 'Independent practice', check: 'Knowledge check', consequence: 'Feedback & consequences', reinforce: 'Apply it',
}
const isActivity = (s: Step): s is ActivityStep => s.kind === 'guided' || s.kind === 'independent' || s.kind === 'check'
const tone = { sage: 'bg-sage-700 text-white', gold: 'bg-gold text-white', charcoal: 'bg-charcoal text-white', warm: 'bg-warm-600 text-white' }

export function CoursePlayer({ course }: { course: Course }) {
  const [state, setState] = usePersisted<CourseState>(`course:${course.id}`, emptyState())
  const [pos, setPos] = usePersisted<Pos>(`course:${course.id}:pos`, { v: 'overview' })
  const [announce, setAnnounce] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)
  const head = useRef<HTMLHeadingElement>(null)
  const prog = courseProgress(course, state)

  const flat = useMemo(() => course.modules.flatMap((m, mi) => m.steps.map((s, si) => ({ m: mi, s: si, step: s }))), [course])
  const safePos: Pos = pos.v === 'step' && !course.modules[pos.m]?.steps[pos.s] ? { v: 'overview' } : pos

  useEffect(() => { head.current?.focus({ preventScroll: false }) }, [safePos.v, safePos.v === 'step' ? safePos.m : 0, safePos.v === 'step' ? safePos.s : 0])

  const go = (p: Pos, msg?: string) => { setPos(p); if (msg) setAnnounce(msg) }
  const markVisited = (id: string) => setState((st) => (st.visited.includes(id) ? st : { ...st, visited: [...st.visited, id] }))
  const reset = () => { setState(emptyState()); setPos({ v: 'overview' }); setConfirmReset(false); setAnnounce('Progress reset on this device.') }

  const stepIndex = safePos.v === 'step' ? flat.findIndex((f) => f.m === safePos.m && f.s === safePos.s) : -1
  const next = () => {
    if (safePos.v !== 'step') return
    markVisited(course.modules[safePos.m].steps[safePos.s].id)
    const nx = flat[stepIndex + 1]
    if (nx) go({ v: 'step', m: nx.m, s: nx.s }, `Module ${nx.m + 1}, step ${nx.s + 1}: ${nx.step.title}`)
    else go({ v: 'final' }, 'Final assessment')
  }
  const back = () => {
    const pv = flat[stepIndex - 1]
    pv ? go({ v: 'step', m: pv.m, s: pv.s }) : go({ v: 'overview' })
  }
  const jumpToStep = (id: string) => { const f = flat.find((x) => x.step.id === id); if (f) go({ v: 'step', m: f.m, s: f.s }) }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside aria-label="Course navigation" className="lg:sticky lg:top-24 lg:self-start">
        <div className="card !p-4">
          <p className="eyebrow">Course progress</p>
          <div className="mt-2 h-2 rounded bg-warm-200" role="progressbar" aria-label="Course progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={prog.pct}>
            <div className="h-2 rounded bg-sage-600 transition-all" style={{ width: `${prog.pct}%` }} />
          </div>
          <p className="mt-1 text-xs text-warm-600">{prog.pct}% · {prog.done} of {prog.total} parts</p>
          <nav aria-label="Modules" className="mt-4">
            <ul className="space-y-1 text-sm">
              <li><button type="button" className={`navbtn ${safePos.v === 'overview' ? 'on' : ''}`} onClick={() => go({ v: 'overview' })}>Course overview</button></li>
              {course.modules.map((m, mi) => {
                const doneCount = m.steps.filter((s) => state.visited.includes(s.id)).length
                const active = safePos.v === 'step' && safePos.m === mi
                return (
                  <li key={m.id}>
                    <button type="button" className={`navbtn ${active ? 'on' : ''}`} aria-current={active ? 'step' : undefined} onClick={() => go({ v: 'step', m: mi, s: Math.min(doneCount, m.steps.length - 1) })}>
                      <span className="block font-semibold">{doneCount === m.steps.length ? '✓ ' : ''}{m.title}</span>
                      <span className="text-xs text-warm-600">{doneCount}/{m.steps.length} steps · ~{m.minutes} min</span>
                    </button>
                  </li>
                )
              })}
              <li><button type="button" className={`navbtn ${safePos.v === 'final' ? 'on' : ''}`} onClick={() => go({ v: 'final' })}>{state.final ? '✓ ' : ''}Final assessment</button></li>
              <li><button type="button" className={`navbtn ${safePos.v === 'summary' ? 'on' : ''}`} onClick={() => go({ v: 'summary' })}>Completion summary</button></li>
            </ul>
          </nav>
          <div className="mt-4 border-t border-warm-200 pt-3 text-xs text-warm-600">
            <p>Progress is saved <strong>only on this device</strong> in your browser (localStorage). Nothing is sent anywhere.</p>
            {!confirmReset ? <button type="button" className="mt-2 underline" onClick={() => setConfirmReset(true)}>Reset my progress</button>
              : <p className="mt-2" role="alert">Erase all saved progress for this course? <button type="button" className="underline font-semibold" onClick={reset}>Yes, reset</button> · <button type="button" className="underline" onClick={() => setConfirmReset(false)}>Cancel</button></p>}
          </div>
        </div>
      </aside>

      <section aria-label={course.title} className="min-w-0">
        <p className="sr-only" role="status" aria-live="polite">{announce}</p>
        {safePos.v === 'overview' && <Overview course={course} head={head} state={state} start={() => go({ v: 'step', m: 0, s: 0 })} resume={() => { const f = flat.find((x) => !state.visited.includes(x.step.id)); f ? go({ v: 'step', m: f.m, s: f.s }) : go({ v: 'final' }) }} />}
        {safePos.v === 'step' && (
          <StepView course={course} m={safePos.m} s={safePos.s} head={head} state={state} setState={setState}
            onNext={next} onBack={back} jump={jumpToStep} />
        )}
        {safePos.v === 'final' && <Final course={course} head={head} state={state} setState={setState} toSummary={() => go({ v: 'summary' })} toStep={(m) => go({ v: 'step', m, s: 0 })} />}
        {safePos.v === 'summary' && <Summary course={course} head={head} state={state} go={go} />}
      </section>
    </div>
  )
}

function Overview({ course, head, state, start, resume }: { course: Course; head: React.RefObject<HTMLHeadingElement | null>; state: CourseState; start: () => void; resume: () => void }) {
  const started = state.visited.length > 0
  return (
    <div className="card fade-in">
      <p className="eyebrow">Course overview</p>
      <h2 ref={head} tabIndex={-1} className="mt-2 text-3xl outline-none">{course.title}</h2>
      <p className="mt-1 font-serif text-lg text-sage-700">{course.subtitle}</p>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <div><dt className="font-semibold">Duration</dt><dd>About {course.minutes} minutes (self-paced; stop and resume anytime)</dd></div>
        <div><dt className="font-semibold">Audience</dt><dd>{course.audience}</dd></div>
        <div><dt className="font-semibold">Fictional organization</dt><dd>{course.org}</dd></div>
      </dl>
      <div className="mt-5 space-y-3 prose-l">{course.overview.map((p, i) => <p key={i}>{p}</p>)}</div>
      <h3 className="mt-5 text-xl">By the end you will be able to</h3>
      <ul className="prose-l mt-2">{course.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
      <h3 className="mt-5 text-xl">Meet the people in the story</h3>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {course.characters.map((c) => (
          <li key={c.name} className="flex gap-3 rounded-lg border border-warm-200 bg-white p-3">
            <span aria-hidden className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${tone[c.tone]}`}>{c.initials}</span>
            <span className="text-sm"><strong>{c.name}</strong> · {c.role}<br /><span className="text-warm-600">{c.blurb}</span></span>
          </li>
        ))}
      </ul>
      <p className="mt-5 rounded-lg border border-warm-200 bg-ivory p-3 text-sm"><strong>Disclosure:</strong> {course.disclosure}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" className="btn btn-primary" onClick={started ? resume : start}>{started ? 'Resume where I left off' : 'Start the course'}</button>
        {started && <button type="button" className="btn btn-ghost" onClick={start}>Start from the beginning</button>}
      </div>
    </div>
  )
}

function StepView({ course, m, s, head, state, setState, onNext, onBack, jump }: {
  course: Course; m: number; s: number; head: React.RefObject<HTMLHeadingElement | null>; state: CourseState
  setState: (f: (st: CourseState) => CourseState) => void; onNext: () => void; onBack: () => void; jump: (id: string) => void
}) {
  const mod = course.modules[m]; const step = mod.steps[s]
  const result = state.results[step.id]
  const needsResult = isActivity(step)
  const canNext = !needsResult || !!result
  const retryKey = useRef(0)
  const attempt = (score01: number) => {
    setState((st) => ({ ...st, results: { ...st.results, [step.id]: recordResult(st.results[step.id], score01 * ((step as ActivityStep).points ?? 1), (step as ActivityStep).points ?? 1) } }))
  }
  const chars = step.kind === 'scenario' ? (step.characters ?? []).map((n) => course.characters.find((c) => c.name === n)).filter(Boolean) : []
  const isLast = m === course.modules.length - 1 && s === mod.steps.length - 1

  return (
    <article className="card fade-in" key={`${step.id}-${retryKey.current}`}>
      <p className="eyebrow">{mod.title} · step {s + 1} of {mod.steps.length}</p>
      <ol className="mt-2 flex gap-1" aria-hidden>{mod.steps.map((x, i) => <li key={x.id} className={`h-1.5 flex-1 rounded ${i === s ? 'bg-gold' : state.visited.includes(x.id) ? 'bg-sage-600' : 'bg-warm-200'}`} />)}</ol>
      <p className="mt-4 text-sm font-semibold text-sage-700">{kindLabel[step.kind]}{step.kind === 'guided' ? ' — hints available' : step.kind === 'independent' ? ' — no hints, no step-by-step guidance' : ''}</p>
      <h2 ref={head} tabIndex={-1} className="mt-1 text-2xl outline-none md:text-3xl">{step.title}</h2>

      <div className="mt-4 space-y-4">
        {step.kind === 'scenario' && (
          <>
            {chars.length > 0 && <ul className="flex flex-wrap gap-2">{chars.map((c) => c && <li key={c.name} className="flex items-center gap-2 rounded-full border border-warm-200 bg-white py-1 pl-1 pr-3 text-xs"><span aria-hidden className={`flex h-6 w-6 items-center justify-center rounded-full font-bold ${tone[c.tone]}`}>{c.initials}</span>{c.name} · {c.role}</li>)}</ul>}
            {step.narrative.map((p, i) => <p key={i} className="max-w-prose">{p}</p>)}
            <Blocks blocks={step.blocks} />
            <div className="rounded-lg border-l-4 border-gold bg-[#f8f3e4] p-4 text-sm"><strong>What’s at stake:</strong> {step.stakes}</div>
          </>
        )}
        {step.kind === 'instruction' && <Blocks blocks={step.blocks} />}
        {step.kind === 'worked' && <Worked step={step} />}
        {isActivity(step) && (
          <>
            {step.intro && <p className="max-w-prose">{step.intro}</p>}
            <Blocks blocks={step.blocks} />
            <div className="rounded-lg border border-warm-200 bg-ivory p-4">
              <ActivityView key={retryKey.current} activity={step.activity} mode={step.kind === 'guided' ? 'guided' : 'independent'} onAttempt={attempt} resolved={!!result} />
            </div>
            {result && <p className="text-xs text-warm-600" role="status">Recorded: {Math.round((result.firstScore / result.max) * 100)}% on your first attempt{result.attempts > 1 ? ` · ${result.attempts} attempts` : ''}. Retries help you learn; first-attempt scores are what the summary reports.</p>}
          </>
        )}
        {step.kind === 'consequence' && <Consequence course={course} m={m} state={state} step={step} jump={jump} />}
        {step.kind === 'reinforce' && <Reinforce step={step} state={state} setState={setState} />}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-warm-200 pt-4">
        <button type="button" className="btn btn-ghost" onClick={onBack}>← Back</button>
        <div className="flex items-center gap-3">
          {!canNext && <span className="text-sm text-warm-600" id="gate">Complete the activity to continue.</span>}
          <button type="button" className="btn btn-primary" disabled={!canNext} aria-describedby={!canNext ? 'gate' : undefined} onClick={onNext}>{isLast ? 'Go to final assessment →' : s === mod.steps.length - 1 ? 'Next module →' : 'Continue →'}</button>
        </div>
      </div>
    </article>
  )
}

function Worked({ step }: { step: Extract<Step, { kind: 'worked' }> }) {
  const [n, setN] = useState(1)
  return (
    <>
      <p className="max-w-prose">{step.situation}</p>
      <Blocks blocks={step.blocks} />
      <ol className="space-y-3">
        {step.steps.slice(0, n).map((x, i) => (
          <li key={i} className="fade-in rounded-lg border border-warm-200 bg-white p-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-warm-600">What an experienced colleague thinks</p>
            <p className="mt-1 italic">{x.thought}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-sage-700">What they do</p>
            <p className="mt-1">{x.action}</p>
          </li>
        ))}
      </ol>
      {n < step.steps.length
        ? <button type="button" className="btn btn-ghost" onClick={() => setN(n + 1)}>Show next move ({n} of {step.steps.length})</button>
        : <div className="rounded-lg bg-sage-50 p-4 text-sm fade-in" role="status"><strong>Takeaway:</strong> {step.takeaway}</div>}
    </>
  )
}

function Consequence({ course, m, state, step, jump }: { course: Course; m: number; state: CourseState; step: Extract<Step, { kind: 'consequence' }>; jump: (id: string) => void }) {
  const items = course.modules[m].steps.filter(isActivity)
  return (
    <>
      <div className="space-y-3">{step.text.map((t, i) => <p key={i} className="max-w-prose">{t}</p>)}</div>
      <div className="table-wrap"><table><caption className="sr-only">Your decisions in this module</caption>
        <thead><tr><th scope="col">Activity</th><th scope="col">First attempt</th><th scope="col">Attempts</th><th scope="col"><span className="sr-only">Action</span></th></tr></thead>
        <tbody>{items.map((a) => { const r = state.results[a.id]; const pct = r ? Math.round((r.firstScore / r.max) * 100) : null
          return <tr key={a.id}><th scope="row" className="p-3 text-left font-normal">{a.title}</th><td>{pct === null ? 'Not attempted' : `${pct}% ${pct >= 80 ? '✓' : pct >= 50 ? '◐' : '✗'}`}</td><td>{r?.attempts ?? 0}</td>
            <td><button type="button" className="underline text-sage-700" onClick={() => jump(a.id)}>{pct !== null && pct < 100 ? 'Retry' : 'Review'}</button></td></tr> })}</tbody></table></div>
    </>
  )
}

function Reinforce({ step, state, setState }: { step: Extract<Step, { kind: 'reinforce' }>; state: CourseState; setState: (f: (st: CourseState) => CourseState) => void }) {
  const checked = state.checklists[step.id] ?? []
  const [saved, setSaved] = useState(false)
  return (
    <>
      <div><label htmlFor={`r-${step.id}`} className="font-serif text-lg text-sage-900">{step.reflection}</label>
        <textarea id={`r-${step.id}`} rows={4} className="mt-2 block w-full rounded-md border border-warm-400 bg-white p-3 text-sm" value={state.reflections[step.id] ?? ''}
          onChange={(e) => { setSaved(false); setState((st) => ({ ...st, reflections: { ...st.reflections, [step.id]: e.target.value } })) }} aria-describedby={`r-${step.id}-h`} />
        <p id={`r-${step.id}-h`} className="mt-1 text-xs text-warm-600">Saved automatically on this device only. Optional.</p>
        {saved && <p role="status" className="text-xs">Saved.</p>}</div>
      <fieldset><legend className="font-semibold">Transfer checklist</legend>
        <ul className="mt-2 space-y-2">{step.checklist.map((c, i) => (
          <li key={i}><label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1" checked={checked.includes(i)}
            onChange={() => setState((st) => ({ ...st, checklists: { ...st.checklists, [step.id]: checked.includes(i) ? checked.filter((x) => x !== i) : [...checked, i] } }))} />{c}</label></li>))}</ul></fieldset>
      <p className="rounded-lg bg-sage-50 p-4 text-sm"><strong>Try this in real work:</strong> {step.application}</p>
      {step.resource && <a className="btn btn-ghost" href={asset(step.resource.file)} download>Download: {step.resource.label}</a>}
    </>
  )
}

function Final({ course, head, state, setState, toSummary, toStep }: { course: Course; head: React.RefObject<HTMLHeadingElement | null>; state: CourseState; setState: (f: (st: CourseState) => CourseState) => void; toSummary: () => void; toStep: (m: number) => void }) {
  const fa = course.finalAssessment
  const [phase, setPhase] = useState<'intro' | 'run' | 'done'>('intro')
  const [i, setI] = useState(0)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [run, setRun] = useState(0)
  const item = fa.items[i]
  const answered = scores[item?.id] !== undefined
  const total = fa.items.reduce((a, x) => a + (scores[x.id] ?? 0), 0)
  const finish = () => {
    setPhase('done')
    setState((st) => ({ ...st, final: { score: total, max: fa.items.length, attempts: (st.final?.attempts ?? 0) + 1, best: Math.max(st.final?.best ?? 0, total) } }))
  }
  const pass = total / fa.items.length >= fa.passMark
  if (phase === 'intro') return (
    <div className="card fade-in"><p className="eyebrow">Final assessment</p>
      <h2 ref={head} tabIndex={-1} className="mt-2 text-3xl outline-none">{fa.title}</h2>
      <p className="mt-3 max-w-prose">{fa.intro}</p>
      <ul className="prose-l mt-3"><li>{fa.items.length} scenario-based tasks, separate from the practice activities.</li><li>One attempt per task per run: no hints and no retry inside a run. You may retake the whole assessment afterward.</li><li>Target to demonstrate readiness: {Math.round(fa.passMark * 100)}%. This is a portfolio demonstration, not a certification.</li></ul>
      {state.final && <p className="mt-3 text-sm">Your best saved score on this device: {state.final.best.toFixed(1)}/{state.final.max} ({state.final.attempts} run{state.final.attempts > 1 ? 's' : ''}).</p>}
      <button type="button" className="btn btn-primary mt-5" onClick={() => { setPhase('run'); setI(0); setScores({}); setRun(run + 1) }}>Begin assessment</button></div>
  )
  if (phase === 'done') return (
    <div className="card fade-in"><p className="eyebrow">Assessment complete</p>
      <h2 ref={head} tabIndex={-1} className="mt-2 text-3xl outline-none">{pass ? 'Target met' : 'Not yet at target'} — {total.toFixed(1)} of {fa.items.length}</h2>
      <p className="mt-2" role="status">{pass ? 'You demonstrated the target level across the objectives below.' : 'Review the objectives below, revisit the related module, and retake when ready.'}</p>
      <div className="table-wrap mt-4"><table><caption className="sr-only">Results by objective</caption><thead><tr><th scope="col">Objective assessed</th><th scope="col">Result</th></tr></thead>
        <tbody>{fa.items.map((x) => <tr key={x.id}><th scope="row" className="p-3 text-left font-normal">{x.objective}</th><td>{Math.round((scores[x.id] ?? 0) * 100)}% {(scores[x.id] ?? 0) >= 0.8 ? '✓' : '— review'}</td></tr>)}</tbody></table></div>
      <div className="mt-5 flex flex-wrap gap-3"><button type="button" className="btn btn-primary" onClick={toSummary}>View completion summary</button>
        <button type="button" className="btn btn-ghost" onClick={() => { setPhase('intro') }}>Retake assessment</button>
        <button type="button" className="btn btn-ghost" onClick={() => toStep(0)}>Review module 1</button></div></div>
  )
  return (
    <div className="card fade-in" key={`${run}-${i}`}>
      <p className="eyebrow">Final assessment · task {i + 1} of {fa.items.length}</p>
      <h2 ref={head} tabIndex={-1} className="mt-2 text-2xl outline-none">{item.objective}</h2>
      <div className="mt-4 rounded-lg border border-warm-200 bg-ivory p-4">
        <ActivityView activity={item.activity} mode="assessment" resolved={answered} onAttempt={(sc) => setScores((p) => ({ ...p, [item.id]: sc }))} />
      </div>
      <div className="mt-6 flex justify-end">
        {i < fa.items.length - 1 ? <button type="button" className="btn btn-primary" disabled={!answered} onClick={() => setI(i + 1)}>Next task →</button>
          : <button type="button" className="btn btn-primary" disabled={!answered} onClick={finish}>Finish assessment</button>}
      </div>
    </div>
  )
}

function Summary({ course, head, state, go }: { course: Course; head: React.RefObject<HTMLHeadingElement | null>; state: CourseState; go: (p: Pos) => void }) {
  const prog = courseProgress(course, state)
  return (
    <div className="card fade-in"><p className="eyebrow">Completion summary</p>
      <h2 ref={head} tabIndex={-1} className="mt-2 text-3xl outline-none">{prog.pct === 100 ? 'Course complete' : `You’re ${prog.pct}% through`}</h2>
      <p className="mt-2 max-w-prose text-sm text-warm-600">This summary is generated from activity results saved in your browser. It is not a certificate or a measure of real workplace competence.</p>
      <div className="table-wrap mt-4"><table><caption className="sr-only">Results by module</caption><thead><tr><th scope="col">Module</th><th scope="col">Steps visited</th><th scope="col">First-attempt practice score</th></tr></thead>
        <tbody>{course.modules.map((m, mi) => { const sc = moduleScore(course, state, m.id); const v = m.steps.filter((s) => state.visited.includes(s.id)).length
          return <tr key={m.id}><th scope="row" className="p-3 text-left font-normal"><button type="button" className="underline text-sage-700" onClick={() => go({ v: 'step', m: mi, s: 0 })}>{m.title}</button></th><td>{v}/{m.steps.length}</td><td>{sc.max ? `${sc.pct}%` : '—'}</td></tr> })}
          <tr><th scope="row" className="p-3 text-left font-semibold">Final assessment</th><td colSpan={2}>{state.final ? `Best ${state.final.best.toFixed(1)}/${state.final.max} across ${state.final.attempts} run(s) (latest ${state.final.score.toFixed(1)})` : 'Not yet taken'}</td></tr></tbody></table></div>
      <h3 className="mt-6 text-xl">Learning objectives</h3>
      <ul className="prose-l mt-2">{course.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
      <h3 className="mt-6 text-xl">Performance-support resources</h3>
      <ul className="mt-2 space-y-2">{course.resources.map((r) => <li key={r.file}><a className="underline text-sage-700" href={asset(r.file)} download>{r.label}</a>{r.note && <span className="text-sm text-warm-600"> — {r.note}</span>}</li>)}</ul>
      <div className="mt-6 flex gap-3"><button type="button" className="btn btn-ghost" onClick={() => go({ v: 'overview' })}>Back to overview</button><button type="button" className="btn btn-primary" onClick={() => go({ v: 'final' })}>Final assessment</button></div>
    </div>
  )
}
