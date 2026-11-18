import { useEffect, useMemo, useState } from 'react'
import type { Activity, BranchActivity, BranchNode, ChoiceActivity, DraftActivity, OrderActivity, SortActivity } from './types'
import { evaluateDraft, QUALITY_POINTS, scoreChoice, scoreOrder, scoreSort, wordCount } from './scoring'

export interface ActivityProps {
  activity: Activity
  /** Practice steps may show hints and allow retries; assessment items are single-attempt. */
  mode: 'guided' | 'independent' | 'assessment'
  onAttempt: (score01: number) => void
  resolved: boolean
}

const qLabel = { best: 'Effective choice', ok: 'Partly effective', poor: 'Less effective' } as const
const qIcon = { best: '✓', ok: '◐', poor: '✗' } as const

function Hints({ hints, enabled }: { hints?: string[]; enabled: boolean }) {
  const [n, setN] = useState(0)
  if (!enabled || !hints?.length) return null
  return (
    <div className="mt-3">
      <button type="button" className="btn btn-ghost !py-1.5 !text-sm" disabled={n >= hints.length} onClick={() => setN(n + 1)}>
        {n === 0 ? 'Need a hint?' : n < hints.length ? 'Another hint' : 'No more hints'}
      </button>
      {n > 0 && <ul className="mt-2 space-y-1 rounded-lg bg-sage-50 p-3 text-sm" role="status">{hints.slice(0, n).map((h, i) => <li key={i}><strong>Hint {i + 1}:</strong> {h}</li>)}</ul>}
    </div>
  )
}

function Choice({ a, mode, onAttempt }: { a: ChoiceActivity; mode: ActivityProps['mode']; onAttempt: ActivityProps['onAttempt'] }) {
  const [pick, setPick] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)
  const o = pick !== null ? a.options[pick] : null
  return (
    <div>
      {a.context && <p className="mb-2 text-sm text-warm-600">{a.context}</p>}
      <p className="font-serif text-lg text-sage-900">{a.prompt}</p>
      <div className="mt-3 space-y-2" role="group" aria-label="Choose one response">
        {a.options.map((opt, i) => (
          <button key={i} type="button" aria-pressed={pick === i} disabled={pick !== null}
            className={`choice ${pick === i ? (opt.quality === 'best' ? 'correct' : opt.quality === 'poor' ? 'wrong' : '') : ''}`}
            onClick={() => { setPick(i); onAttempt(scoreChoice(a, i)) }}>{opt.text}</button>
        ))}
      </div>
      <Hints hints={a.hints} enabled={mode === 'guided' && pick === null} />
      {o && (
        <div className="mt-4 rounded-lg bg-sage-50 p-4 fade-in" role="status">
          <p className="font-semibold">{qIcon[o.quality]} {qLabel[o.quality]}</p>
          <p className="mt-1 text-sm">{o.feedback}</p>
          {o.consequence && <p className="mt-2 text-sm"><strong>What happens next:</strong> {o.consequence}</p>}
          <div className="mt-3 flex flex-wrap gap-3">
            {mode !== 'assessment' && <button type="button" className="btn btn-ghost !py-1.5 !text-sm" onClick={() => { setPick(null); setShowAll(false) }}>Try a different choice</button>}
            <button type="button" className="btn btn-ghost !py-1.5 !text-sm" aria-expanded={showAll} onClick={() => setShowAll(!showAll)}>{showAll ? 'Hide' : 'Why each option works or doesn’t'}</button>
          </div>
          {showAll && <ul className="mt-3 space-y-2 text-sm">{a.options.map((x, i) => <li key={i}><strong>{qIcon[x.quality]} “{x.text}”</strong> — {x.feedback}</li>)}</ul>}
        </div>
      )}
    </div>
  )
}

const stableShuffle = (items: string[]) => {
  const h = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)
  const out = [...items].sort((x, y) => h(x) - h(y))
  return out.every((x, i) => x === items[i]) ? out.reverse() : out
}

function Order({ a, mode, onAttempt }: { a: OrderActivity; mode: ActivityProps['mode']; onAttempt: ActivityProps['onAttempt'] }) {
  const [items, setItems] = useState(() => stableShuffle(a.items))
  const [checked, setChecked] = useState<number | null>(null)
  const [announce, setAnnounce] = useState('')
  const move = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= items.length || checked !== null) return
    const next = [...items]; [next[i], next[j]] = [next[j], next[i]]
    setItems(next); setAnnounce(`${next[j]} moved to position ${j + 1} of ${next.length}`)
  }
  return (
    <div>
      <p className="font-serif text-lg text-sage-900">{a.prompt}</p>
      <p id="order-help" className="mt-1 text-sm text-warm-600">Use the Up and Down buttons to arrange the items, then select Check order.</p>
      <ol className="mt-3 space-y-2" aria-describedby="order-help">
        {items.map((it, i) => (
          <li key={it} className={`flex items-center gap-3 rounded-lg border p-3 ${checked !== null ? (it === a.items[i] ? 'border-[#2f6b45] bg-[#e3f1e7]' : 'border-[#9a3b2e] bg-[#f9e7e3]') : 'border-warm-200 bg-white'}`}>
            <span className="font-bold text-sage-700">{i + 1}</span><span className="flex-1 text-sm">{it}</span>
            <button type="button" className="btn btn-ghost !px-3 !py-1" disabled={i === 0 || checked !== null} aria-label={`Move “${it}” up`} onClick={() => move(i, -1)}>↑</button>
            <button type="button" className="btn btn-ghost !px-3 !py-1" disabled={i === items.length - 1 || checked !== null} aria-label={`Move “${it}” down`} onClick={() => move(i, 1)}>↓</button>
          </li>
        ))}
      </ol>
      <p className="sr-only" role="status">{announce}</p>
      <Hints hints={a.hints} enabled={mode === 'guided' && checked === null} />
      <div className="mt-4 flex flex-wrap gap-3">
        {checked === null
          ? <button type="button" className="btn btn-primary" onClick={() => { const s = scoreOrder(a, items); setChecked(s); onAttempt(s) }}>Check order</button>
          : mode !== 'assessment' && <button type="button" className="btn btn-ghost" onClick={() => setChecked(null)}>Try again</button>}
      </div>
      {checked !== null && <div className="mt-4 rounded-lg bg-sage-50 p-4 text-sm fade-in" role="status"><p className="font-semibold">{Math.round(checked * a.items.length)} of {a.items.length} in the right position.</p><p className="mt-1">{a.explanation}</p></div>}
    </div>
  )
}

function Sort({ a, mode, onAttempt }: { a: SortActivity; mode: ActivityProps['mode']; onAttempt: ActivityProps['onAttempt'] }) {
  const [asg, setAsg] = useState<Record<string, number>>({})
  const [done, setDone] = useState(false)
  const complete = a.items.every((i) => asg[i.text] !== undefined)
  return (
    <div>
      <p className="font-serif text-lg text-sage-900">{a.prompt}</p>
      <div className="mt-3 space-y-3">
        {a.items.map((it, n) => {
          const ok = done && asg[it.text] === it.bucket
          return (
            <fieldset key={it.text} className={`rounded-lg border p-3 ${done ? (ok ? 'border-[#2f6b45] bg-[#e3f1e7]' : 'border-[#9a3b2e] bg-[#f9e7e3]') : 'border-warm-200 bg-white'}`}>
              <legend className="px-1 text-sm font-semibold">{n + 1}. {it.text}</legend>
              <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1">
                {a.buckets.map((b, bi) => (
                  <label key={b} className="flex items-center gap-2 text-sm"><input type="radio" name={`sort-${n}`} disabled={done} checked={asg[it.text] === bi} onChange={() => setAsg({ ...asg, [it.text]: bi })} />{b}</label>
                ))}
              </div>
              {done && <p className="mt-2 text-sm" role="status">{ok ? '✓ ' : `✗ Best fit: ${a.buckets[it.bucket]}. `}{it.why}</p>}
            </fieldset>
          )
        })}
      </div>
      <Hints hints={a.hints} enabled={mode === 'guided' && !done} />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!done ? <button type="button" className="btn btn-primary" disabled={!complete} onClick={() => { setDone(true); onAttempt(scoreSort(a, asg)) }}>Check sorting</button>
          : mode !== 'assessment' && <button type="button" className="btn btn-ghost" onClick={() => { setDone(false); setAsg({}) }}>Try again</button>}
        {!complete && !done && <span className="text-sm text-warm-600">Assign every item to continue.</span>}
      </div>
    </div>
  )
}

function Draft({ a, mode, onAttempt }: { a: DraftActivity; mode: ActivityProps['mode']; onAttempt: ActivityProps['onAttempt'] }) {
  const [text, setText] = useState('')
  const [res, setRes] = useState<ReturnType<typeof evaluateDraft> | null>(null)
  const [model, setModel] = useState(false)
  const id = useMemo(() => `draft-${Math.random().toString(36).slice(2, 8)}`, [])
  const wc = wordCount(text)
  return (
    <div>
      {a.context && <p className="mb-2 text-sm text-warm-600">{a.context}</p>}
      <label htmlFor={id} className="font-serif text-lg text-sage-900">{a.prompt}</label>
      <textarea id={id} rows={7} className="mt-3 block w-full rounded-md border border-warm-400 bg-white p-3 text-sm" aria-describedby={`${id}-h`} value={text}
        placeholder={a.placeholder} onChange={(e) => { setText(e.target.value); if (res) setRes(null) }} />
      <p id={`${id}-h`} className="mt-1 text-xs text-warm-600">{wc} words · aim for at least {a.minWords}. Your writing stays in this browser and is not sent anywhere.</p>
      <Hints hints={a.hints} enabled={mode === 'guided' && !res} />
      <div className="mt-3 flex flex-wrap gap-3">
        <button type="button" className="btn btn-primary" disabled={!text.trim()} onClick={() => { const r = evaluateDraft(a, text); setRes(r); onAttempt(r.score) }}>Check against checklist</button>
        {res && mode !== 'assessment' && <button type="button" className="btn btn-ghost" onClick={() => setModel(!model)} aria-expanded={model}>{model ? 'Hide' : 'Compare with'} a model response</button>}
      </div>
      {res && (
        <div className="mt-4 rounded-lg bg-sage-50 p-4 text-sm fade-in" role="status">
          <p className="font-semibold">Checklist: {res.met.filter(Boolean).length} of {a.criteria.length} elements found{res.enoughWords ? '' : ` · add more detail (${a.minWords}+ words)`}</p>
          <ul className="mt-2 space-y-1">{a.criteria.map((c, i) => <li key={i}>{res.met[i] ? '✓' : '○'} <strong>{c.label}</strong>{!res.met[i] && <> — {c.coaching}</>}</li>)}</ul>
          <p className="mt-3 text-xs text-warm-600">This is a keyword-based self-check, not a grader. It can confirm elements are present, not that your writing is good. Compare with the model and judge for yourself.</p>
        </div>
      )}
      {model && <blockquote className="mt-3 whitespace-pre-line rounded-lg border-l-4 border-gold bg-white p-4 text-sm">{a.model}</blockquote>}
    </div>
  )
}

function Branch({ a, mode, onAttempt }: { a: BranchActivity; mode: ActivityProps['mode']; onAttempt: ActivityProps['onAttempt'] }) {
  const [cur, setCur] = useState(a.start)
  const [picked, setPicked] = useState<BranchNode_Choice | null>(null)
  const [hist, setHist] = useState<{ text: string; q: 'best' | 'ok' | 'poor' }[]>([])
  const node = a.nodes.find((n) => n.id === cur)!
  const pts = hist.reduce((s, h) => s + QUALITY_POINTS[h.q], 0)
  const reported = node.end && !picked
  if (reported) return <BranchEnd a={a} node={node} hist={hist} pts={pts} mode={mode} onAttempt={onAttempt} restart={() => { setCur(a.start); setHist([]); setPicked(null) }} />
  return (
    <div className="fade-in">
      <p className="eyebrow">{a.title} · decision {hist.length + (picked ? 0 : 1)}</p>
      {node.context && <p className="mt-2 text-sm text-warm-600">{node.context}</p>}
      {node.say && <p className="mt-3 rounded-lg bg-white p-3 text-sm shadow-sm"><strong>{node.speaker}:</strong> “{node.say}”</p>}
      {node.prompt && <p className="mt-3 font-serif text-lg text-sage-900">{node.prompt}</p>}
      <div className="mt-3 space-y-2" role="group" aria-label="Your options">
        {node.choices?.map((c, i) => (
          <button key={i} type="button" aria-pressed={picked === c} disabled={!!picked} className={`choice ${picked === c ? (c.quality === 'best' ? 'correct' : c.quality === 'poor' ? 'wrong' : '') : ''}`}
            onClick={() => { setPicked(c); setHist([...hist, { text: c.text, q: c.quality }]) }}>{c.text}</button>
        ))}
      </div>
      <Hints hints={a.hints} enabled={mode === 'guided' && !picked} />
      {picked && (
        <div className="mt-4 rounded-lg bg-sage-50 p-4 fade-in" role="status">
          <p className="font-semibold">{qIcon[picked.quality]} {qLabel[picked.quality]}</p>
          <p className="mt-1 text-sm italic">{picked.reply}</p>
          <p className="mt-2 text-sm"><strong>Coaching:</strong> {picked.coach}</p>
          {picked.consequence && <p className="mt-2 text-sm"><strong>Consequence:</strong> {picked.consequence}</p>}
          <button type="button" className="btn btn-primary mt-3" onClick={() => { setCur(picked.next); setPicked(null) }}>Continue</button>
        </div>
      )}
    </div>
  )
}
type BranchNode_Choice = NonNullable<BranchNode["choices"]>[number]

function BranchEnd({ a, node, hist, pts, mode, onAttempt, restart }: { a: BranchActivity; node: BranchActivity['nodes'][number]; hist: { text: string; q: 'best' | 'ok' | 'poor' }[]; pts: number; mode: ActivityProps['mode']; onAttempt: ActivityProps['onAttempt']; restart: () => void }) {
  useEffect(() => { onAttempt(hist.length ? pts / hist.length : 0) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="fade-in" role="status">
      <h4 className="font-serif text-xl text-sage-900">{node.end!.title}</h4>
      <p className="mt-2 text-sm">{node.end!.summary}</p>
      <p className="mt-3 font-semibold">Decision quality: {pts}/{hist.length} points</p>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">{hist.map((h, i) => <li key={i}>{qIcon[h.q]} {qLabel[h.q]}: “{h.text}”</li>)}</ol>
      {mode !== 'assessment' && <button type="button" className="btn btn-ghost mt-4" onClick={restart}>Retry this scenario with different choices</button>}
    </div>
  )
}

export function ActivityView({ activity, mode, onAttempt, resolved }: ActivityProps) {
  switch (activity.kind) {
    case 'choice': return <Choice a={activity} mode={mode} onAttempt={onAttempt} />
    case 'order': return <Order a={activity} mode={mode} onAttempt={onAttempt} />
    case 'sort': return <Sort a={activity} mode={mode} onAttempt={onAttempt} />
    case 'draft': return <Draft a={activity} mode={mode} onAttempt={onAttempt} />
    case 'branch': return <Branch a={activity} mode={mode} onAttempt={onAttempt} />
    case 'custom': return <div>{activity.prompt && <p className="mb-3 font-serif text-lg text-sage-900">{activity.prompt}</p>}{activity.render({ resolved, resolve: (s, m) => onAttempt(m ? s / m : 0) })}</div>
  }
}
