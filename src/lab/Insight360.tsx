import { useEffect, useMemo, useState } from 'react'
import { asset } from '../lib/storage'
import { byCohort, downloadText, parseLearnerCSV, qualityChecks, summarize, toCSV, type Learner } from '../lib/analytics'
import { BarChart } from './Charts'

type Load = { state: 'loading' } | { state: 'error'; msg: string } | { state: 'ready'; rows: Learner[] }

function Sel({ label, value, set, list }: { label: string; value: string; set: (v: string) => void; list: string[] }) {
  return (
    <label className="text-sm font-medium">{label}
      <select className="mt-1 block rounded-md border border-warm-400 bg-white px-3 py-2" value={value} onChange={(e) => set(e.target.value)}>
        {list.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  )
}

export function Insight360() {
  const [load, setLoad] = useState<Load>({ state: 'loading' })
  const [program, setProgram] = useState('All')
  const [cohort, setCohort] = useState('All')
  const [mode, setMode] = useState('All')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let live = true
    setLoad({ state: 'loading' })
    fetch(asset('downloads/insight360-synthetic-learners.csv'))
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text() })
      .then((t) => live && setLoad({ state: 'ready', rows: parseLearnerCSV(t) }))
      .catch((e: Error) => live && setLoad({ state: 'error', msg: e.message }))
    return () => { live = false }
  }, [attempt])

  const all = load.state === 'ready' ? load.rows : []
  const opts = (k: keyof Learner) => ['All', ...[...new Set(all.map((r) => String(r[k])))].sort()]
  const rows = useMemo(() => all.filter((r) => (program === 'All' || r.program === program) && (cohort === 'All' || r.cohort === cohort) && (mode === 'All' || r.delivery_mode === mode)), [all, program, cohort, mode])
  const s = summarize(rows)
  const cohorts = byCohort(rows)
  const issues = qualityChecks(all)

  if (load.state === 'loading') return <p role="status" className="card">Loading synthetic dataset…</p>
  if (load.state === 'error') return (
    <div role="alert" className="card border-[#9a3b2e]">
      <p className="font-semibold">The dataset could not be loaded ({load.msg}).</p>
      <button type="button" className="btn btn-primary mt-3" onClick={() => setAttempt((a) => a + 1)}>Try again</button>
    </div>
  )

  const reset = () => { setProgram('All'); setCohort('All'); setMode('All') }
  const stat = (label: string, v: string) => (
    <div className="card"><p className="text-xs uppercase tracking-wider text-warm-600">{label}</p><p className="mt-1 font-serif text-3xl text-sage-900">{v}</p></div>
  )

  return (
    <div className="space-y-6">
      <p className="sim-badge">SYNTHETIC DATA — {all.length} fictional learner records. Not real people or results.</p>
      <div className="flex flex-wrap items-end gap-4" role="group" aria-label="Dashboard filters">
        <Sel label="Program" value={program} set={setProgram} list={opts('program')} />
        <Sel label="Cohort" value={cohort} set={setCohort} list={opts('cohort')} />
        <Sel label="Delivery mode" value={mode} set={setMode} list={opts('delivery_mode')} />
        <button type="button" className="btn btn-ghost" onClick={reset}>Clear filters</button>
        <button type="button" className="btn btn-primary" disabled={!rows.length} onClick={() => downloadText('insight360-filtered.csv', toCSV(rows as unknown as Record<string, unknown>[]))}>Download filtered CSV</button>
      </div>
      <p role="status" className="text-sm text-warm-600">Showing {rows.length} of {all.length} records.</p>

      {rows.length === 0 ? (
        <div className="card"><p>No records match these filters. <button type="button" className="underline text-sage-700" onClick={reset}>Clear filters</button></p></div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stat('Enrolled', String(s.enrolled))}
            {stat('Completion', `${s.completionRate}%`)}
            {stat('Avg participation', `${s.avgParticipation}%`)}
            {stat('Satisfaction', `${s.avgSatisfaction}/5`)}
            {stat('Avg pre score', String(s.avgPre))}
            {stat('Avg post score', String(s.avgPost))}
            {stat('Avg gain', `${s.avgGain >= 0 ? '+' : ''}${s.avgGain}`)}
            {stat('Observed application', `${s.applicationRate}%`)}
          </div>
          <p className="text-sm text-warm-600">Pre/post uses the {s.pairedN} records with both scores. Participation excludes values over 100%. Application rate is among completers with a manager observation.</p>
          <div className="grid gap-6 md:grid-cols-2">
            <BarChart title="Completion rate by cohort (%)" data={cohorts.map((c) => ({ label: c.cohort, value: c.completionRate }))} max={100} unit="%" />
            <BarChart title="Average participation by cohort (%)" data={cohorts.map((c) => ({ label: c.cohort, value: c.avgParticipation }))} max={100} unit="%" />
            <BarChart title="Average score gain by cohort (points)" data={cohorts.map((c) => ({ label: c.cohort, value: Math.max(0, c.avgGain) }))} max={40} unit="" />
            <div className="card">
              <h3 className="font-serif text-lg">Pre/post comparison by cohort</h3>
              <div className="table-wrap mt-3"><table><thead><tr><th>Cohort</th><th>n</th><th>Pre</th><th>Post</th><th>Gain</th></tr></thead>
                <tbody>{cohorts.map((c) => <tr key={c.cohort}><td>{c.cohort}</td><td>{c.pairedN}</td><td>{c.avgPre}</td><td>{c.avgPost}</td><td>{c.avgGain}</td></tr>)}</tbody></table></div>
            </div>
          </div>
        </>
      )}

      <section className="card" aria-labelledby="dq">
        <h3 id="dq" className="text-xl">Data quality checks</h3>
        <p className="mt-1 text-sm text-warm-600">Run on the full dataset. These issues were injected deliberately to show the process.</p>
        {issues.length === 0 ? <p className="mt-3">No issues found.</p> : (
          <ul className="prose-l mt-3">{issues.map((i, n) => <li key={n}><strong>{i.id}:</strong> {i.issue}</li>)}</ul>
        )}
        <p className="mt-2 text-sm">Handling: duplicates are queried with the source system; out-of-range values are excluded from averages; missing post scores are excluded from pre/post pairs.</p>
      </section>

      <section className="card" aria-labelledby="caution">
        <h3 id="caution" className="text-xl">How to read this responsibly</h3>
        <ul className="prose-l mt-3">
          <li><strong>Learning metrics ≠ business outcomes.</strong> Completion, scores, and satisfaction do not show impact on productivity or retention.</li>
          <li><strong>No causal claim.</strong> A score gain does not prove the program caused it without a comparison group.</li>
          <li><strong>Small groups.</strong> Cohort differences with few records may be noise; real reporting would suppress small cells.</li>
        </ul>
        <a className="btn btn-ghost mt-2" href={asset('downloads/insight360-executive-summary.md')} download>Download one-page executive summary</a>{' '}
        <a className="btn btn-ghost mt-2" href={asset('downloads/insight360-synthetic-learners.csv')} download>Download full synthetic CSV</a>
      </section>
    </div>
  )
}
