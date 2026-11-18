import type { Course, Module } from '../types'
import { Explorer, QualityHunt, type Question } from '../../lab/insight/Explorer'
import { clean, cleanSummary, corr, extreme, groups, rawRows, rawSummary, themeTotals, virtualTech } from '../../lab/insight/data'

const names = (k: Parameters<typeof groups>[0]) => groups(k).map((g) => g.group)
const q = (prompt: string, key: Parameters<typeof groups>[0], metric: Parameters<typeof extreme>[1], dir: 'max' | 'min', label: string): Question => {
  const e = extreme(key, metric, dir)
  return { prompt, options: names(key), answer: e.group, explain: `${e.group} (${label}: ${e.value}, n = ${e.n}). Always check the group size before treating a difference as meaningful.` }
}
const s = cleanSummary
const lowCohort = extreme('cohort', 'completionRate', 'min')
const topTheme = themeTotals[0]
const techShare = Math.round((virtualTech.inVirtual / Math.max(1, virtualTech.total)) * 100)
const virt = groups('delivery_mode').find((g) => g.group === 'Virtual')!
const r2 = corr.r

const m1: Module = {
  id: 'i1', title: 'Module 1 · Read the dashboard and spot meaningful trends', minutes: 30,
  summary: 'Learn the metrics, then use filters and tables to answer real analytical questions from the synthetic dataset.',
  objectives: ['Explain what each metric means and how it is calculated.', 'Use filters and group tables to identify trends.', 'Interpret completion and assessment results with sample size in mind.'],
  steps: [
    { id: 'i1-scenario', kind: 'scenario', title: 'Elise wants a one-page report by Friday', characters: ['Nia', 'Omar', 'Elise'],
      narrative: ['Nia is an L&D analyst at Northfield Group (fictional). A year of leadership, onboarding and platform-adoption programs has produced one spreadsheet of learner records. Elise, the VP of Operations, has asked for a one-page executive report by Friday: “Is this training working, and what should we do next?”', 'Omar, the L&D program manager, warns Nia that last year’s report was criticised for quoting averages without explaining them. Nia has to decide what the data can and cannot say.'],
      blocks: [{ t: 'doc', kind: 'chat', title: 'Message from Elise', lines: ['Nia, I need to know whether to fund these programs again. Give me the headline, the risks, and what you recommend. Don’t bury me in charts.'] }],
      stakes: 'A confident but misleading report could redirect real budget. Nia’s credibility depends on reporting what the data supports, no more.' },
    { id: 'i1-instruction', kind: 'instruction', title: 'Metrics and what they mean',
      blocks: [
        { t: 'table', caption: 'Data definitions used in this exercise', head: ['Metric', 'Definition', 'Caution'], rows: [
          ['Completion rate', 'Learners marked completed ÷ learners enrolled', 'Says nothing about learning.'],
          ['Participation %', 'Share of scheduled activity the learner took part in', 'Values above 100% are invalid.'],
          ['Pre / post score', 'Assessment results before and after the program', 'Only learners with both scores are paired.'],
          ['Average gain', 'Average post − average pre, paired learners only', 'Not proof the program caused the gain.'],
          ['Satisfaction', 'Self-rated 1–5 at the end', 'Measures reaction, not performance.'],
          ['Observed application', 'Manager saw the skill used on the job (among completers with an observation)', 'Small and subjective; Kirkpatrick Level 3 evidence.'],
        ] },
        { t: 'flow', title: 'Reading a dashboard in four moves', steps: [
          { label: 'Headline', detail: 'What do the overall figures say?' }, { label: 'Compare', detail: 'Which groups differ, and by how much?' }, { label: 'Size check', detail: 'How many learners are in each group?' }, { label: 'So what', detail: 'What question does this raise, not answer?' },
        ] },
        { t: 'callout', tone: 'warn', title: 'Small groups', text: `Each cohort here has only 11–12 cleaned records, so a single learner moves a cohort’s completion rate by about 9 percentage points. ${lowCohort.group} shows ${lowCohort.value}% completion (n = ${lowCohort.n}), the lowest cohort, yet that is a one- or two-person difference.` },
      ] },
    { id: 'i1-worked', kind: 'worked', title: 'Worked example: reading one number',
      situation: 'An analyst on another team sees “Cohort C completion: 70%”. Here is how an experienced analyst reads it.',
      steps: [
        { thought: 'Seventy percent of what? A rate without a count is incomplete.', action: 'She checks: 7 of 10 learners.' },
        { thought: 'With ten learners, one person is ten points. It might be noise.', action: 'She compares it with other cohorts and last quarter, not just the overall average.' },
        { thought: 'The reason matters more than the number.', action: 'She checks whether the three non-completers share a date, manager or delivery mode.' },
        { thought: 'I should say what I know and what I do not.', action: 'She reports: “Cohort C completed 7 of 10; too few to conclude a trend, but all three non-completers were virtual; worth checking.”' },
      ],
      takeaway: 'Pair every rate with its count, compare against a baseline, and report patterns as questions to explore, not conclusions.' },
    { id: 'i1-guided', kind: 'guided', title: 'Guided practice: answer questions from the dashboard',
      intro: 'Use the filters and cohort table. The data are the cleaned synthetic records.',
      activity: { kind: 'custom', render: ({ resolve }) => <Explorer mode="guided" onFinish={resolve} guideHints={['Set Program and Delivery to All; the cohort table lists every cohort.', 'For delivery mode, set the Delivery filter one mode at a time and read the completion card.', 'Satisfaction is shown per cohort in the table.']} questions={[
        q('Which cohort has the lowest completion rate?', 'cohort', 'completionRate', 'min', 'completion %'),
        q('Which delivery mode has the highest completion rate?', 'delivery_mode', 'completionRate', 'max', 'completion %'),
        q('Which cohort reports the highest average satisfaction?', 'cohort', 'avgSatisfaction', 'max', 'satisfaction'),
      ]} /> } },
    { id: 'i1-independent', kind: 'independent', title: 'Independent practice: three new questions',
      intro: 'No hints. Work out where to look, and remember to weigh group sizes.',
      activity: { kind: 'custom', render: ({ resolve }) => <Explorer mode="independent" onFinish={resolve} questions={[
        q('Which delivery mode shows the largest average score gain?', 'delivery_mode', 'avgGain', 'max', 'average gain'),
        q('Which program has the lowest average satisfaction?', 'program', 'avgSatisfaction', 'min', 'satisfaction'),
        q('Which cohort has the highest observed-application rate?', 'cohort', 'applicationRate', 'max', 'observed application %'),
      ]} /> } },
    { id: 'i1-check', kind: 'check', title: 'Knowledge check: interpret a result',
      activity: { kind: 'choice', prompt: `Elise asks: “${lowCohort.group} has the lowest completion (${lowCohort.value}%). Should we cancel that cohort’s delivery model?”`, options: [
        { text: 'Yes. It is the worst performer.', quality: 'poor', feedback: `The cohort has only ${lowCohort.n} records; one or two learners explain the gap.`, consequence: 'A delivery model is changed on thin evidence, and next quarter’s result is no different.' },
        { text: `Not on this evidence. With n = ${lowCohort.n} it is a one- or two-learner difference; check why those learners did not finish before acting.`, quality: 'best', feedback: 'You separated a signal worth investigating from a conclusion worth acting on.', consequence: 'Omar finds that the non-completers shared a scheduling clash, which is easy to fix.' },
        { text: 'No. The overall completion rate is high, so ignore it.', quality: 'ok', feedback: 'Right not to overreact, but ignoring it misses a chance to learn why learners dropped.', consequence: 'The scheduling clash recurs next quarter.' },
      ] } },
    { id: 'i1-consequence', kind: 'consequence', title: 'What happened, and why it matters',
      text: [`Nia reported overall completion of ${s.completionRate}% and noted the lowest cohort with its sample size and a follow-up question. Elise appreciated the caveat: it told her what not to conclude.`, 'Dashboards invite quick conclusions. The analyst’s job is to slow the conclusion down to the strength of the evidence.'] },
    { id: 'i1-reinforce', kind: 'reinforce', title: 'Make it stick: a dashboard-reading routine',
      reflection: 'Think of a chart you have seen recently. What was the sample size, and would you have noticed if it were small?',
      checklist: ['Pair every rate with its count.', 'Compare with a baseline, not only the average.', 'Define each metric in a sentence.', 'State what the data cannot tell you.'],
      application: 'Add a definitions and sample-size note to your next report.',
      resource: { label: 'INSIGHT360 executive reporting pack (PDF)', file: 'downloads/insight360-executive-reporting.pdf' } },
  ],
}

const m2: Module = {
  id: 'i2', title: 'Module 2 · Trust the data: quality, correlation and causation', minutes: 30,
  summary: 'Find data-quality problems before analysis and judge which claims the data can support.',
  objectives: ['Detect common data-quality problems.', 'Explain how cleaning changes the results.', 'Distinguish correlation from causation.'],
  steps: [
    { id: 'i2-scenario', kind: 'scenario', title: 'The numbers don’t quite add up', characters: ['Nia', 'Omar'],
      narrative: ['Nia notices that enrolment totals do not match the registration system. Omar says, “Just use the spreadsheet as it is; we’re out of time.”', `The raw file has ${rawRows.length} records and reports ${rawSummary.completionRate}% completion. Nia has a feeling that something is off.`],
      stakes: 'A duplicate or an impossible value can quietly distort an average. If Nia does not check, the executive report could include numbers that cannot be right.' },
    { id: 'i2-instruction', kind: 'instruction', title: 'Quality checks and causal reasoning',
      blocks: [
        { t: 'table', caption: 'Common data-quality problems', head: ['Problem', 'How to spot it', 'Typical handling'], rows: [
          ['Duplicate IDs', 'The same learner_id appears twice', 'Query the source; keep one record; document it.'],
          ['Out-of-range values', 'Participation above 100% or negative scores', 'Exclude from the affected metric; flag to the data owner.'],
          ['Missing values', 'Completed = Yes but no post score', 'Exclude from paired analysis; do not impute silently.'],
        ] },
        { t: 'callout', tone: 'info', title: 'Correlation is not causation', text: `In the cleaned data, participation and score gain are positively related (r = ${r2}, n = ${corr.n}), a weak-to-moderate relationship. That does not show participation caused larger gains: motivated learners may both participate more and improve more.` },
        { t: 'table', caption: 'Which claims does the data support?', head: ['Claim', 'Supported?', 'Why'], rows: [
          [`Average post score (${s.avgPost}) is higher than pre (${s.avgPre}).`, 'Yes', 'A direct comparison of paired learners.'],
          ['The program caused the gain.', 'No', 'No comparison group; other factors are possible.'],
          [`Learners who participate more tend to gain more (r = ${r2}).`, 'Partly', 'A tendency, not a cause, and not strong.'],
        ] },
      ] },
    { id: 'i2-worked', kind: 'worked', title: 'Worked example: a suspicious average',
      situation: 'An analyst finds an average participation of 96%, higher than expected.',
      steps: [
        { thought: 'High is plausible, but unexpectedly high deserves a look at the distribution.', action: 'She sorts by participation and sees one value of 400%.' },
        { thought: 'A value above 100% is impossible, so it is an entry error, not a super-participant.', action: 'She flags it to the data owner and recalculates without it: the average drops to 84%.' },
        { thought: 'I must document what I changed.', action: 'She adds a note: “1 record excluded (participation 400%); to be corrected at source.”' },
      ],
      takeaway: 'Scan for impossible values before computing averages, correct what you can, and document every change.' },
    { id: 'i2-guided', kind: 'guided', title: 'Guided practice: find the problems in the raw file',
      intro: `Scan the ${rawRows.length} raw records. Hints reveal what to look for.`,
      activity: { kind: 'custom', render: ({ resolve }) => <QualityHunt mode="guided" onFinish={resolve} /> } },
    { id: 'i2-independent', kind: 'independent', title: 'Independent practice: which claims are supported?',
      intro: 'Sort each statement an executive might make into what the data can and cannot support.',
      activity: { kind: 'sort', prompt: 'Is each claim supported by this dataset?', buckets: ['Supported', 'Not supported'], items: [
        { text: `Learners’ average assessment score rose from ${s.avgPre} to ${s.avgPost} (paired learners).`, bucket: 0, why: 'A direct comparison of the data.' },
        { text: 'The training caused a 26-point improvement in job performance.', bucket: 1, why: 'Assessment gains are not job performance, and there is no comparison group.' },
        { text: `${s.completionRate}% of enrolled learners completed.`, bucket: 0, why: 'A straightforward calculation on cleaned records.' },
        { text: 'Virtual delivery is less effective because its satisfaction is lower.', bucket: 1, why: `Virtual satisfaction is ${virt.avgSatisfaction}, not lower than other modes, and satisfaction does not measure effectiveness.` },
      ] } },
    { id: 'i2-check', kind: 'check', title: 'Knowledge check: the duplicate record',
      activity: { kind: 'choice', prompt: 'You find learner SYN-055 appears twice with slightly different scores. Omar says to average the two records. What should Nia do?', options: [
        { text: 'Average them; it is fast and fair.', quality: 'poor', feedback: 'Averaging invents a score that no assessment produced.', consequence: 'The invented score slightly inflates the average and cannot be traced to a source.' },
        { text: 'Keep one record (documented), ask the data owner which is correct, and note the exclusion.', quality: 'best', feedback: 'Documented, traceable and honest about uncertainty.', consequence: 'The data owner confirms the first record; the audit trail is clean.' },
        { text: 'Delete both to be safe.', quality: 'ok', feedback: 'Cautious, but you lose a valid learner and reduce n unnecessarily.', consequence: 'The cohort now looks smaller and one real learner disappears from the report.' },
      ] } },
    { id: 'i2-consequence', kind: 'consequence', title: 'What happened, and why it matters',
      text: [`After cleaning, enrolled fell from ${rawSummary.enrolled} to ${s.enrolled} and completion moved from ${rawSummary.completionRate}% to ${s.completionRate}%. The difference is small, but the audit trail meant Nia could say exactly what changed and why.`, 'Small corrections rarely change a headline, but unexplained ones change trust.'] },
    { id: 'i2-reinforce', kind: 'reinforce', title: 'Make it stick: a data-quality checklist',
      reflection: 'What is one report you rely on that you have never checked for duplicates or impossible values?',
      checklist: ['Check for duplicate IDs.', 'Scan ranges for impossible values.', 'Identify missing values that affect paired analysis.', 'Document every exclusion.'],
      application: 'Before your next analysis, spend ten minutes on the checklist and add a “changes made” note to your report.',
      resource: { label: 'INSIGHT360 executive reporting pack (PDF)', file: 'downloads/insight360-executive-reporting.pdf' } },
  ],
}

const m3: Module = {
  id: 'i3', title: 'Module 3 · Recommend and report', minutes: 30,
  summary: 'Turn analysis into practical recommendations and an executive-ready summary.',
  objectives: ['Link a finding to a practical recommendation.', 'Write an executive summary that includes evidence, limits and next steps.'],
  steps: [
    { id: 'i3-scenario', kind: 'scenario', title: 'Friday, 9 a.m.: the report is due', characters: ['Nia', 'Elise', 'Omar'],
      narrative: ['Nia has cleaned the data, checked the claims and learned what the numbers can say. Elise wants the headline, the risks, and a recommendation.', `Nia’s findings: completion ${s.completionRate}% (${s.completed} of ${s.enrolled}); average gain +${s.avgGain} (${s.pairedN} paired learners); satisfaction ${s.avgSatisfaction}/5; observed on-the-job application ${s.applicationRate}%. Feedback comments most often mention “${topTheme.theme}” (${topTheme.count} comments) and technical difficulties (${virtualTech.total}, of which ${virtualTech.inVirtual} came from virtual learners).`],
      stakes: 'A report that is too cautious gives Elise nothing to decide; one that is too confident risks misdirecting budget.' },
    { id: 'i3-instruction', kind: 'instruction', title: 'Turn findings into recommendations',
      blocks: [
        { t: 'flow', title: 'Finding → Evidence → Recommendation', steps: [
          { label: 'Finding', detail: 'A specific, checkable statement.' }, { label: 'Evidence', detail: 'The figure and its sample size.' }, { label: 'Recommendation', detail: 'A practical action, an owner and a way to know it worked.' },
        ] },
        { t: 'annotated', title: 'Annotated executive summary', lines: [
          `Headline: ${s.completionRate}% of ${s.enrolled} learners completed, and paired assessment scores rose from ${s.avgPre} to ${s.avgPost}.`,
          `Caution: the gain is not proof of impact; there is no comparison group, and observed on-the-job application is ${s.applicationRate}%.`,
          `Data quality: one duplicate and one out-of-range record were excluded.`,
          `Recommendation: investigate technical difficulties in virtual sessions, add practice time, and gather manager observations for every completer.`,
        ], notes: [
          { line: 0, label: 'Lead with the answer', body: 'Elise reads the first line most carefully.' }, { line: 1, label: 'State the limit', body: 'This is what protects Nia’s credibility.' }, { line: 2, label: 'Show your cleaning', body: 'One line is enough; details go in the appendix.' }, { line: 3, label: 'Specific actions', body: 'Each links to evidence in the data.' },
        ] },
        { t: 'callout', tone: 'tip', title: 'Kirkpatrick in one line', text: 'Reaction (satisfaction), Learning (pre/post), Behavior (observed application), Results (business outcomes). This dataset supports levels 1–3 in a limited way and says nothing about level 4.' },
      ] },
    { id: 'i3-worked', kind: 'worked', title: 'Worked example: from theme to recommendation',
      situation: 'An analyst sees that 30% of comments mention “not enough practice”.',
      steps: [
        { thought: 'A theme is a lead, not a verdict. How many people, and are they a particular group?', action: 'She checks the count and compares with satisfaction and gain.' },
        { thought: 'What is the cheapest action that tests the idea?', action: 'She proposes adding 20 minutes of practice to one cohort and comparing next time.' },
        { thought: 'How will we know?', action: 'She defines a measure: higher post scores and fewer “more practice” comments.' },
      ],
      takeaway: 'Recommend a small, testable action with an owner and a measure.' },
    { id: 'i3-guided', kind: 'guided', title: 'Guided practice: choose the best recommendation',
      activity: { kind: 'choice', prompt: `${virtualTech.total} comments mention technical difficulties, and ${virtualTech.inVirtual} of them (${techShare}%) are from virtual learners, who make up ${virt.enrolled} of ${s.enrolled} learners. Which recommendation best follows from this evidence?`, hints: ['Which option names a specific, testable action?', 'Avoid options that go beyond what the data shows.'], options: [
        { text: 'Cancel virtual delivery.', quality: 'poor', feedback: 'Virtual learners’ completion and gains are comparable; the evidence points to a technical fix, not cancellation.', consequence: 'The firm loses flexible delivery for no measured benefit.' },
        { text: 'Run a platform check before each virtual session, offer a tech-support contact, and compare technical-difficulty comments next quarter.', quality: 'best', feedback: 'Targets the cause the data points to, defines an action and a measure.', consequence: 'Technical comments fall next quarter; the team can show it.' },
        { text: 'Do nothing; satisfaction is 4.0 overall.', quality: 'poor', feedback: 'An average hides a recurring, fixable problem.', consequence: 'The same complaints repeat.' },
        { text: 'Survey every learner again about technology.', quality: 'ok', feedback: 'More data is not a bad idea, but it delays a fix the existing evidence already supports.', consequence: 'Another quarter passes with the same problem.' },
      ] } },
    { id: 'i3-independent', kind: 'independent', title: 'Independent practice: write the executive summary',
      intro: 'Write the summary for Elise from Nia’s findings in the scenario. Include the headline, a limit, a data-quality note and a recommendation.',
      activity: { kind: 'draft', prompt: 'Write an executive summary (80–140 words).', minWords: 50, placeholder: 'Headline: …',
        criteria: [
          { label: 'Reports the completion rate', anyOf: [`${Math.round(s.completionRate)}`], coaching: `State the completion rate (about ${Math.round(s.completionRate)}%).` },
          { label: 'Reports the assessment gain', anyOf: [`${Math.round(s.avgGain)}`, `${Math.round(s.avgPre)}`, `${Math.round(s.avgPost)}`], coaching: 'Include the pre/post change.' },
          { label: 'States a limitation (no causal claim)', anyOf: ['not proof', 'cannot show', 'does not show', 'not prove', 'no comparison', 'correlat', 'cause', 'caution', 'limit'], coaching: 'Say what the data cannot show, such as causation.' },
          { label: 'Mentions data quality', anyOf: ['duplicate', 'excluded', 'cleaned', 'quality', 'out-of-range'], coaching: 'Note briefly how data were cleaned.' },
          { label: 'Makes a recommendation', anyOf: ['recommend', 'should', 'propose', 'suggest', 'next'], coaching: 'End with a specific recommendation.' },
        ],
        model: `${s.completionRate}% of ${s.enrolled} learners completed, and paired assessment scores rose from ${s.avgPre} to ${s.avgPost} (+${s.avgGain}, n = ${s.pairedN}). This is a learning gain and not proof of workplace impact: there is no comparison group, and manager-observed application is ${s.applicationRate}%. We excluded one duplicate and one out-of-range record. We recommend (1) a technology check before virtual sessions, (2) more practice time, and (3) manager observations for every completer so we can assess behavior next quarter.` } },
    { id: 'i3-check', kind: 'check', title: 'Knowledge check: the headline',
      activity: { kind: 'choice', prompt: 'Which headline should lead Nia’s report?', options: [
        { text: `“Training improved performance by ${Math.round(s.avgGain)} points.”`, quality: 'poor', feedback: 'Overclaims: scores are not performance, and the gain is not shown to be caused by training.', consequence: 'Elise repeats the claim to the board; a finance leader asks for the evidence.' },
        { text: `“${Math.round(s.completionRate)}% completed, and paired scores rose from ${s.avgPre} to ${s.avgPost}; on-the-job application is observed for ${s.applicationRate}% of completers, so impact is not yet established.”`, quality: 'best', feedback: 'Accurate, balanced and points to the next question.', consequence: 'Elise funds a follow-up observation study.' },
        { text: '“The data is inconclusive.”', quality: 'ok', feedback: 'Honest but unhelpful; the data does support some conclusions.', consequence: 'Elise asks Nia to try again with more detail.' },
      ] } },
    { id: 'i3-consequence', kind: 'consequence', title: 'What happened, and why it matters',
      text: ['Elise approved the technical fix and asked for observations on every completer next quarter. She said the limitations paragraph was what made her trust the rest.', 'Good analysis changes decisions. Honest analysis protects the next one.'] },
    { id: 'i3-reinforce', kind: 'reinforce', title: 'Make it stick: your report template',
      reflection: 'What is one claim you have made at work that the evidence could not fully support? How would you phrase it now?',
      checklist: ['Lead with the answer.', 'Pair findings with counts.', 'State limits and data-quality changes.', 'Recommend a testable action with a measure.'],
      application: 'Use the executive summary template for your next report.',
      resource: { label: 'INSIGHT360 executive reporting pack (PDF)', file: 'downloads/insight360-executive-reporting.pdf' } },
  ],
}

export const insight360: Course = {
  id: 'insight360',
  title: 'INSIGHT360 · Learning Analytics & Program Evaluation',
  subtitle: 'Prepare an executive report from a synthetic training dataset.',
  org: 'Northfield Group (fictional)',
  audience: 'L&D specialists, learning analysts and program managers',
  minutes: 90,
  overview: ['You are Nia, an L&D analyst. Elise, a VP, wants to know whether a set of training programs is working. You will explore a synthetic dataset, find and fix data-quality problems, separate correlation from causation, and write an executive summary.', `All figures are computed from the ${rawRows.length} synthetic records (${clean.length} after cleaning) and a coded-feedback table. Nothing in this exercise is real learner data.`],
  objectives: ['Identify meaningful trends with sample size in mind.', 'Detect data-quality problems.', 'Distinguish correlation from causation.', 'Interpret completion and assessment results.', 'Recommend practical improvements.', 'Prepare an executive-ready summary.'],
  characters: [
    { name: 'Nia', role: 'L&D analyst (you)', blurb: 'Careful with data and trying to be useful.', initials: 'N', tone: 'sage' },
    { name: 'Omar', role: 'L&D program manager', blurb: 'Wants it done fast; respects good evidence.', initials: 'O', tone: 'gold' },
    { name: 'Elise', role: 'VP Operations', blurb: 'Decides whether to fund the programs.', initials: 'E', tone: 'charcoal' },
  ],
  modules: [m1, m2, m3],
  finalAssessment: {
    title: 'INSIGHT360 final assessment', intro: 'Five analytical tasks. All numbers are computed from the synthetic data. No hints and no retries within a run.', passMark: 0.75,
    items: [
      { id: 'if1', objective: 'Interpret a result with sample size', activity: { kind: 'choice', prompt: `A cohort of ${lowCohort.n} shows completion of ${lowCohort.value}%. What is the best statement?`, options: [
        { text: 'This cohort is failing.', quality: 'poor', feedback: 'Too strong for a group this small.' },
        { text: `${lowCohort.value}% is lowest, but with n = ${lowCohort.n} it may be one or two learners; investigate before concluding.`, quality: 'best', feedback: 'Balances signal and uncertainty.' },
        { text: 'Sample size is irrelevant for percentages.', quality: 'poor', feedback: 'Small groups make percentages volatile.' },
      ] } },
      { id: 'if2', objective: 'Detect a data-quality problem', activity: { kind: 'choice', prompt: 'A record shows participation of 130%. What should you do?', options: [
        { text: 'Cap it at 100%.', quality: 'ok', feedback: 'Defensible but it hides an error; document and confirm first.' },
        { text: 'Exclude it from participation averages, flag it to the data owner, and document the exclusion.', quality: 'best', feedback: 'Transparent and traceable.' },
        { text: 'Leave it in; averages hide small errors.', quality: 'poor', feedback: 'An impossible value distorts the metric and your credibility.' },
      ] } },
      { id: 'if3', objective: 'Separate correlation from causation', activity: { kind: 'choice', prompt: `Participation and gain are correlated (r = ${r2}). Which statement is safest?`, options: [
        { text: 'More participation causes bigger gains.', quality: 'poor', feedback: 'Correlation does not establish cause.' },
        { text: 'Higher participation tends to go with bigger gains, but the data cannot show it causes them.', quality: 'best', feedback: 'Describes the relationship without claiming cause.' },
        { text: 'There is no relationship.', quality: 'poor', feedback: `There is a modest positive relationship (r = ${r2}).` },
      ] } },
      { id: 'if4', objective: 'Interpret learning and application evidence', activity: { kind: 'choice', prompt: `Average scores rose by ${s.avgGain} points and manager-observed application is ${s.applicationRate}%. What does this show?`, options: [
        { text: 'Strong evidence of business impact.', quality: 'poor', feedback: 'Business results (level 4) are not measured here.' },
        { text: 'Evidence of learning and some on-the-job use; impact on business results is not established.', quality: 'best', feedback: 'Maps evidence to the right Kirkpatrick levels.' },
        { text: 'Nothing, because scores are unreliable.', quality: 'poor', feedback: 'Scores are useful evidence of learning, within limits.' },
      ] } },
      { id: 'if5', objective: 'Recommend and report', activity: { kind: 'draft', prompt: 'Write a two-sentence recommendation that follows from the technical-difficulty feedback theme, and say how you would measure whether it worked.', minWords: 20, criteria: [
        { label: 'Names an action', anyOf: ['check', 'support', 'test', 'rehearsal', 'platform', 'technical'], coaching: 'Name a specific action.' },
        { label: 'Defines a measure', anyOf: ['compare', 'measure', 'track', 'fewer', 'next quarter', 'comments'], coaching: 'Say how you will know it worked.' },
        { label: 'Links to evidence', anyOf: ['comment', 'feedback', 'virtual', 'theme'], coaching: 'Tie it to the feedback evidence.' },
      ], model: 'Run a platform check and provide a technical-support contact before each virtual session, based on the technical-difficulty feedback theme. Compare the number of technical comments next quarter to measure whether it worked.' } },
    ],
  },
  resources: [
    { label: 'INSIGHT360 executive reporting pack (PDF)', file: 'downloads/insight360-executive-reporting.pdf', note: 'Executive summary, dashboard definitions, recommendations and limitations' },
    { label: 'Synthetic learner dataset (CSV)', file: 'downloads/insight360-synthetic-learners.csv', note: 'The 72 fictional records, including three deliberate quality issues' },
    { label: 'Synthetic feedback themes (CSV)', file: 'downloads/insight360-feedback-themes.csv', note: 'Coded themes keyed to the synthetic learner IDs' },
  ],
  disclosure: 'INSIGHT360 is an independent, fictional portfolio simulation. All learner records and feedback are synthetic, generated with a fixed seed. No real learners, programs or results are represented.',
}
