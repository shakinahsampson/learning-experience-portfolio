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
