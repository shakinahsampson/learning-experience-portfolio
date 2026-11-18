import learners from '../../data/learners.json'
import themeData from '../../data/feedback-themes.json'
import { cleanRows, groupSummary, participationGainCorrelation, summarize, themeCounts, type Learner } from '../../lib/analytics'

export const rawRows = learners.records as Learner[]
export const clean = cleanRows(rawRows)
export const themes = themeData.records
export const cleanSummary = summarize(clean)
export const rawSummary = summarize(rawRows)
export const corr = participationGainCorrelation(clean)
export const themeTotals = themeCounts(clean, themes)

export type GroupKey = 'cohort' | 'delivery_mode' | 'program' | 'role'
export const groups = (key: GroupKey) => groupSummary(clean, key)

type Metric = 'completionRate' | 'avgGain' | 'avgSatisfaction' | 'applicationRate' | 'avgParticipation'
export function extreme(key: GroupKey, metric: Metric, dir: 'max' | 'min') {
  const g = groups(key)
  const best = g.reduce((a, b) => ((dir === 'max' ? b[metric] > a[metric] : b[metric] < a[metric]) ? b : a))
  return { group: best.group, value: best[metric], n: best.enrolled }
}

export const virtualTech = (() => {
  const virt = new Set(clean.filter((r) => r.delivery_mode === 'Virtual').map((r) => r.learner_id))
  const t = themes.filter((x) => x.theme === 'Technical difficulties' && clean.some((r) => r.learner_id === x.learner_id))
  const inVirtual = t.filter((x) => virt.has(x.learner_id)).length
  return { total: t.length, inVirtual }
})()
