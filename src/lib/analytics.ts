export interface Learner {
  learner_id: string
  program: string
  cohort: string
  role: string
  delivery_mode: string
  enrolled: string
  completed: 'Yes' | 'No'
  participation_pct: number
  pre_score: number
  post_score: number | null
  satisfaction_1_5: number | null
  manager_observed_application: string
}

export interface Summary {
  enrolled: number
  completed: number
  completionRate: number
  avgParticipation: number
  avgPre: number
  avgPost: number
  avgGain: number
  avgSatisfaction: number
  applicationRate: number
  pairedN: number
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0)
const round1 = (n: number) => Math.round(n * 10) / 10

export interface QualityIssue {
  id: string
  issue: string
}

/** Records with invalid values are flagged; paired pre/post analysis only uses records with both scores. */
export function qualityChecks(rows: Learner[]): QualityIssue[] {
  const issues: QualityIssue[] = []
  const seen = new Set<string>()
  for (const r of rows) {
    if (seen.has(r.learner_id)) issues.push({ id: r.learner_id, issue: 'Duplicate learner ID' })
    seen.add(r.learner_id)
    if (r.participation_pct < 0 || r.participation_pct > 100) issues.push({ id: r.learner_id, issue: `Participation out of range (${r.participation_pct}%)` })
    if (r.completed === 'Yes' && r.post_score === null) issues.push({ id: r.learner_id, issue: 'Marked completed but missing post-assessment score' })
  }
  return issues
}

export function summarize(rows: Learner[]): Summary {
  const valid = rows.filter((r) => r.participation_pct <= 100)
  const completers = rows.filter((r) => r.completed === 'Yes')
  const paired = rows.filter((r) => r.post_score !== null)
  const sat = rows.filter((r) => r.satisfaction_1_5 !== null).map((r) => r.satisfaction_1_5 as number)
  const observed = completers.filter((r) => r.manager_observed_application)
  const pre = avg(paired.map((r) => r.pre_score))
  const post = avg(paired.map((r) => r.post_score as number))
  return {
    enrolled: rows.length,
    completed: completers.length,
    completionRate: rows.length ? round1((completers.length / rows.length) * 100) : 0,
    avgParticipation: round1(avg(valid.map((r) => r.participation_pct))),
    avgPre: round1(pre),
    avgPost: round1(post),
    avgGain: round1(post - pre),
    avgSatisfaction: round1(avg(sat)),
    applicationRate: observed.length ? round1((observed.filter((r) => r.manager_observed_application === 'Yes').length / observed.length) * 100) : 0,
    pairedN: paired.length,
  }
}

export function byCohort(rows: Learner[]) {
  const cohorts = [...new Set(rows.map((r) => r.cohort))].sort()
  return cohorts.map((c) => ({ cohort: c, ...summarize(rows.filter((r) => r.cohort === c)) }))
}

export function toCSV(rows: Record<string, unknown>[]): string {
  if (!rows.length) return ''
  const cols = Object.keys(rows[0])
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n') + '\n'
}

export function downloadText(filename: string, text: string, type = 'text/csv') {
  const url = URL.createObjectURL(new Blob([text], { type: `${type};charset=utf-8` }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/** Parses the simple (no embedded commas) synthetic learner CSV into typed records. */
export function parseLearnerCSV(text: string): Learner[] {
  const [head, ...lines] = text.trim().split(/\r?\n/)
  const cols = head.split(',')
  return lines.filter(Boolean).map((line) => {
    const v = line.split(',')
    const o: Record<string, string> = {}
    cols.forEach((c, i) => (o[c] = v[i] ?? ''))
    return {
      ...o,
      participation_pct: Number(o.participation_pct),
      pre_score: Number(o.pre_score),
      post_score: o.post_score === '' ? null : Number(o.post_score),
      satisfaction_1_5: o.satisfaction_1_5 === '' ? null : Number(o.satisfaction_1_5),
    } as unknown as Learner
  })
}

export function pearson(xs: number[], ys: number[]): number {
  const n = xs.length
  if (n < 3) return 0
  const mx = avg(xs), my = avg(ys)
  let num = 0, dx = 0, dy = 0
  for (let i = 0; i < n; i++) { num += (xs[i] - mx) * (ys[i] - my); dx += (xs[i] - mx) ** 2; dy += (ys[i] - my) ** 2 }
  return dx && dy ? Math.round((num / Math.sqrt(dx * dy)) * 100) / 100 : 0
}

/** Correlation between participation and score gain, using clean paired records only. */
export function participationGainCorrelation(rows: Learner[]): { r: number; n: number } {
  const clean = rows.filter((x) => x.post_score !== null && x.participation_pct <= 100)
  return { r: pearson(clean.map((x) => x.participation_pct), clean.map((x) => (x.post_score as number) - x.pre_score)), n: clean.length }
}

export function groupSummary(rows: Learner[], key: 'delivery_mode' | 'program' | 'role' | 'cohort') {
  return [...new Set(rows.map((r) => r[key]))].sort().map((g) => ({ group: g, ...summarize(rows.filter((r) => r[key] === g)) }))
}

export function satisfactionDistribution(rows: Learner[]): { score: number; count: number }[] {
  return [1, 2, 3, 4, 5].map((s) => ({ score: s, count: rows.filter((r) => r.satisfaction_1_5 === s).length }))
}

export function themeCounts(rows: Learner[], themes: { learner_id: string; theme: string }[]) {
  const ids = new Set(rows.map((r) => r.learner_id))
  const m = new Map<string, number>()
  for (const t of themes) if (ids.has(t.learner_id)) m.set(t.theme, (m.get(t.theme) ?? 0) + 1)
  return [...m.entries()].map(([theme, count]) => ({ theme, count })).sort((a, b) => b.count - a.count)
}

/** De-duplicates by learner_id (first record wins) and drops out-of-range participation, as a documented cleaning step. */
export function cleanRows(rows: Learner[]): Learner[] {
  const seen = new Set<string>()
  return rows.filter((r) => { if (seen.has(r.learner_id)) return false; seen.add(r.learner_id); return r.participation_pct <= 100 })
}
