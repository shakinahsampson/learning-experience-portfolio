import { useMemo, useState } from 'react'
import { BarChart } from '../Charts'
import { clean, rawRows, themes } from './data'
import { qualityChecks, satisfactionDistribution, summarize, themeCounts, type Learner } from '../../lib/analytics'

export interface Question { prompt: string; options: string[]; answer: string; explain: string }

const Sel = ({ label, value, set, list }: { label: string; value: string; set: (v: string) => void; list: string[] }) => (
  <label className="text-sm font-medium">{label}
    <select className="mt-1 block rounded-md border border-warm-400 bg-white px-2 py-1.5" value={value} onChange={(e) => set(e.target.value)}>{list.map((o) => <option key={o}>{o}</option>)}</select></label>
)

/** Dashboard on the cleaned synthetic dataset plus a question set the learner answers by using the filters. */
export function Explorer({ questions, mode, onFinish, guideHints }: { questions: Question[]; mode: 'guided' | 'independent'; onFinish: (s: number, m: number) => void; guideHints?: string[] }) {
  const [program, setProgram] = useState('All'); const [cohort, setCohort] = useState('All'); const [dm, setDm] = useState('All')
  const [ans, setAns] = useState<string[]>(questions.map(() => ''))
  const [shown, setShown] = useState(false)
  const [hint, setHint] = useState(0)
  const opts = (k: keyof Learner) => ['All', ...[...new Set(clean.map((r) => String(r[k])))].sort()]
  const rows = useMemo(() => clean.filter((r) => (program === 'All' || r.program === program) && (cohort === 'All' || r.cohort === cohort) && (dm === 'All' || r.delivery_mode === dm)), [program, cohort, dm])
  const s = summarize(rows)
  const cohorts = [...new Set(rows.map((r) => r.cohort))].sort().map((c) => ({ cohort: c, ...summarize(rows.filter((r) => r.cohort === c)) }))
  const dist = satisfactionDistribution(rows)
  const tc = themeCounts(rows, themes)
  const score = questions.filter((q, i) => ans[i] === q.answer).length
  const stat = (l: string, v: string) => <div className="rounded-lg border border-warm-200 bg-white p-3"><p className="text-xs uppercase tracking-wider text-warm-600">{l}</p><p className="font-serif text-2xl text-sage-900">{v}</p></div>

  return (
    <div className="space-y-5">
      <p className="sim-badge">SYNTHETIC DATA · {clean.length} cleaned fictional learner records</p>
      <div className="flex flex-wrap items-end gap-3" role="group" aria-label="Dashboard filters">
        <Sel label="Program" value={program} set={setProgram} list={opts('program')} />
        <Sel label="Cohort" value={cohort} set={setCohort} list={opts('cohort')} />
        <Sel label="Delivery" value={dm} set={setDm} list={opts('delivery_mode')} />
        <button type="button" className="btn btn-ghost !py-1.5" onClick={() => { setProgram('All'); setCohort('All'); setDm('All') }}>Clear</button>
      </div>
      <p role="status" className="text-sm text-warm-600">Showing {rows.length} of {clean.length} records.{rows.length > 0 && rows.length < 10 ? ' Small group: treat differences cautiously.' : ''}</p>
      {rows.length === 0 ? <p className="card">No records match these filters.</p> : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {stat('Enrolled', String(s.enrolled))}{stat('Completion', `${s.completionRate}%`)}{stat('Avg gain', `${s.avgGain >= 0 ? '+' : ''}${s.avgGain}`)}{stat('Satisfaction', `${s.avgSatisfaction}/5`)}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <BarChart title="Completion rate by cohort (%)" data={cohorts.map((c) => ({ label: c.cohort, value: c.completionRate }))} max={100} unit="%" />
            <BarChart title="Satisfaction ratings (count)" data={dist.map((d) => ({ label: `${d.score} of 5`, value: d.count }))} max={Math.max(1, ...dist.map((d) => d.count))} unit="" />
          </div>
          <div className="table-wrap"><table><caption className="sr-only">Results by cohort</caption>
            <thead><tr><th scope="col">Cohort</th><th scope="col">n</th><th scope="col">Completion %</th><th scope="col">Pre</th><th scope="col">Post</th><th scope="col">Gain</th><th scope="col">Satisfaction</th><th scope="col">Observed application %</th></tr></thead>
            <tbody>{cohorts.map((c) => <tr key={c.cohort}><th scope="row" className="p-3 text-left font-normal">{c.cohort}</th><td>{c.enrolled}</td><td>{c.completionRate}</td><td>{c.avgPre}</td><td>{c.avgPost}</td><td>{c.avgGain}</td><td>{c.avgSatisfaction}</td><td>{c.applicationRate}</td></tr>)}</tbody></table></div>
          <BarChart title="Feedback themes (count of coded comments)" data={tc.map((t) => ({ label: t.theme, value: t.count }))} max={Math.max(1, ...tc.map((t) => t.count))} unit="" />
        </>
      )}

      <div className="rounded-xl border border-warm-200 bg-ivory p-4">
        <h4 className="font-serif text-lg">Questions for Nia {mode === 'guided' && <span className="text-sm text-warm-600">(hints available)</span>}</h4>
        <p className="text-sm text-warm-600">Use the filters and tables above, always on the full cleaned dataset (set filters back to All for group comparisons).</p>
        <ol className="mt-3 space-y-4">{questions.map((q, i) => (
          <li key={i} className="rounded-lg bg-white p-3"><fieldset><legend className="text-sm font-semibold">{i + 1}. {q.prompt}</legend>
            <div className="mt-2 flex flex-wrap gap-2">{q.options.map((o) => <label key={o} className="choice !py-1.5 text-sm"><input type="radio" name={`q${i}-${q.prompt.length}`} className="mr-2" checked={ans[i] === o} onChange={() => { setShown(false); setAns(ans.map((a, j) => (j === i ? o : a))) }} />{o}</label>)}</div></fieldset>
            {shown && <p className={`mt-2 text-sm ${ans[i] === q.answer ? 'text-sage-700' : 'text-[#8a2a1a]'}`}>{ans[i] === q.answer ? '✓ ' : '✗ '}{ans[i] === q.answer ? q.explain : `Not quite. ${mode === 'guided' ? q.explain : 'Check the table again and consider group sizes.'}`}</p>}
          </li>))}</ol>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn-primary" disabled={ans.some((a) => !a)} onClick={() => { setShown(true); onFinish(score, questions.length) }}>Check answers</button>
          {mode === 'guided' && guideHints && hint < guideHints.length && <button type="button" className="btn btn-ghost" onClick={() => setHint(hint + 1)}>Show a hint</button>}
          {shown && <span role="status" className="text-sm">{score} of {questions.length} correct</span>}
        </div>
        {mode === 'guided' && guideHints && hint > 0 && <ul className="mt-2 list-disc pl-5 text-sm text-warm-600">{guideHints.slice(0, hint).map((h) => <li key={h}>{h}</li>)}</ul>}
      </div>
    </div>
  )
}

/** The learner inspects raw records and flags suspected data-quality problems. */
export function QualityHunt({ mode, onFinish }: { mode: 'guided' | 'independent'; onFinish: (s: number, m: number) => void }) {
  const truth = new Set(qualityChecks(rawRows).map((i) => i.id))
  const [flags, setFlags] = useState<Record<number, boolean>>({})
  const [shown, setShown] = useState(false)
  const [hint, setHint] = useState(0)
  const hints = ['Look for any participation above 100%.', 'Look for a learner marked “Yes” for completed but with no post score.', 'Look for an ID that appears more than once.']
  const flaggedIds = new Set(Object.entries(flags).filter(([, v]) => v).map(([k]) => rawRows[Number(k)].learner_id))
  const found = [...truth].filter((t) => flaggedIds.has(t)).length
  const falsePos = [...flaggedIds].filter((f) => !truth.has(f)).length
  const score = Math.max(0, found - falsePos)
  return (
    <div className="space-y-3">
      <p className="text-sm">Tick the rows you believe have a data-quality problem. There are {truth.size} distinct problems to find ({rawRows.length} raw records). False flags reduce your score.</p>
      <div className="table-wrap max-h-[26rem] overflow-y-auto"><table><caption className="sr-only">Raw synthetic learner records</caption>
        <thead className="sticky top-0 bg-paper"><tr><th scope="col">Flag</th><th scope="col">ID</th><th scope="col">Cohort</th><th scope="col">Completed</th><th scope="col">Participation %</th><th scope="col">Pre</th><th scope="col">Post</th></tr></thead>
        <tbody>{rawRows.map((r, i) => (
          <tr key={i} className={flags[i] ? 'bg-sage-50' : ''}><td><input type="checkbox" aria-label={`Flag record ${r.learner_id}, row ${i + 1}`} checked={!!flags[i]} onChange={() => { setShown(false); setFlags({ ...flags, [i]: !flags[i] }) }} /></td>
            <th scope="row" className="p-2 text-left font-normal">{r.learner_id}</th><td>{r.cohort}</td><td>{r.completed}</td><td>{r.participation_pct}</td><td>{r.pre_score}</td><td>{r.post_score ?? '—'}</td></tr>))}</tbody></table></div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-primary" onClick={() => { setShown(true); onFinish(score, truth.size) }}>Check my flags</button>
        {mode === 'guided' && hint < hints.length && <button type="button" className="btn btn-ghost" onClick={() => setHint(hint + 1)}>Show a hint</button>}
      </div>
      {mode === 'guided' && hint > 0 && <ul className="list-disc pl-5 text-sm text-warm-600">{hints.slice(0, hint).map((h) => <li key={h}>{h}</li>)}</ul>}
      {shown && (
        <div role="status" className="rounded-lg bg-sage-50 p-3 text-sm">
          <p><strong>{found} of {truth.size}</strong> real problems found{falsePos ? `, ${falsePos} false flag${falsePos > 1 ? 's' : ''}` : ''}.</p>
          {score < truth.size && <p className="mt-1">{mode === 'guided' ? 'Keep looking, then try again.' : 'Some problems were missed or flagged incorrectly. Re-scan and recheck.'}</p>}
          {score === truth.size && <ul className="mt-1 list-disc pl-5">{qualityChecks(rawRows).map((q, i) => <li key={i}><strong>{q.id}:</strong> {q.issue}. Impact if ignored: it skews completion, average gain or counts.</li>)}</ul>}
        </div>
      )}
    </div>
  )
}
