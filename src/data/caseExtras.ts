export interface CaseExtras {
  challenge: string
  gap: string
  skills: string[]
  deliverables: string[]
  needs: string[]
  strategy: { decision: string; why: string; framework: string }[]
  assessment: string[]
  implementation: { phase: string; activity: string }[]
  evaluation: { level: string; question: string; method: string; status: 'Built into the demo' | 'Proposed' }[]
  completed: string[]
  proposed: string[]
  limitations: string[]
  reflection: string[]
  future: string[]
}

export const EXTRAS: Record<string, CaseExtras> = {
  elevate: {
    challenge: 'Meridian Strategy Group (fictional) onboards consultants inconsistently: expectations vary by manager, learning resources are scattered, and no one can see whether a new hire is ready to own client work.',
    gap: 'New consultants take different amounts of time to contribute, communicate project risks late, and receive feedback that is not tied to observable expectations.',
    skills: ['Needs analysis', 'Backward design', 'Scenario-based learning', 'Onboarding program design', 'Learning operations', 'Kirkpatrick evaluation'],
    deliverables: ['Five-module interactive course (Jordan’s first 90 days)', 'ELEVATE onboarding toolkit (PDF) and editable templates (DOCX)', '90-day plan, RACI, communications calendar, checklists', 'Evaluation plan and synthetic completion report', 'L&D project management workbook (XLSX)'],
    needs: ['Interview themes are fictional but modeled on common onboarding problems: unclear expectations, tool-access delays, and uneven manager support.', 'The analysis separates what training can fix (judgment practice, knowledge of methods) from what it cannot (tool provisioning, manager workload).', 'Success is defined as observable behaviors at day 90, not course completion.'],
    strategy: [
      { decision: 'One connected story across five modules', why: 'Recurring characters (Jordan, Maya, Alex, Priya) let decisions in one module carry consequences into the next, which supports transfer to real engagements.', framework: 'Scenario-based learning' },
      { decision: 'Eight-step lesson sequence with a worked example before practice', why: 'Novices benefit from seeing expert reasoning before applying it. Guided practice offers hints; independent practice removes them.', framework: 'Cognitive load / worked-example effect' },
      { decision: 'Separate final assessment from practice', why: 'Practice should be safe to fail in. The final measures whether the learner can decide without support.', framework: 'Backward design' },
      { decision: 'Drafting tasks (30-day goal, escalation message)', why: 'Writing a real work product is closer to the job than recognising a correct option.', framework: 'Adult learning: relevance and problem-centred' },
      { decision: 'Job aids and manager guides alongside the course', why: 'Most behaviour change happens at the point of work, so the course points to tools used after it ends.', framework: 'Performance support' },
    ],
    assessment: ['Scenario decisions in every module with explanatory feedback and consequences', 'Rubric-based draft self-checks for goals and escalation (keyword self-checks, not an automated grader)', 'Six-item final readiness challenge combining communication, prioritisation, escalation and feedback', 'Pass mark 75%; the final can be retaken and the best score is stored on the learner’s own device'],
    implementation: [
      { phase: 'Analyze', activity: 'Confirm onboarding pain points with managers and recent hires.' },
      { phase: 'Design', activity: 'Agree day-90 performance expectations and readiness evidence.' },
      { phase: 'Develop', activity: 'Build modules and toolkit; review with subject-matter experts.' },
      { phase: 'Implement', activity: 'Pilot with one cohort; brief managers; run the Day-1 orientation.' },
      { phase: 'Evaluate', activity: 'Collect Level 1–3 data at days 30, 60 and 90; report trends.' },
    ],
    evaluation: [
      { level: 'Level 1 · Reaction', question: 'Was it relevant and clear?', method: 'Pulse survey after each phase', status: 'Proposed' },
      { level: 'Level 2 · Learning', question: 'Can learners decide and draft correctly?', method: 'Embedded scenario checks and final challenge', status: 'Built into the demo' },
      { level: 'Level 3 · Behavior', question: 'Do they use the methods on engagements?', method: 'Manager observation checklist at day 90', status: 'Proposed' },
      { level: 'Level 4 · Results', question: 'Is time to productivity improving?', method: 'Manager-rated readiness trend across cohorts', status: 'Proposed' },
    ],
    completed: ['Interactive course with five modules and a final assessment', 'Toolkit PDF, editable templates, workbook and design documentation', 'Case study and design rationale'],
    proposed: ['Pilot with real new hires', 'Manager training on check-ins', 'Levels 1, 3 and 4 data collection', 'Integration with an LMS'],
    limitations: ['No real learners have used the program; no outcomes are claimed.', 'Draft rubrics are keyword self-checks, not expert review.', 'Progress is stored only in the learner’s browser; there is no LMS reporting.'],
    reflection: ['The hardest design choice was keeping modules short while still letting consequences carry forward.', 'Writing the model answers first made rubric criteria much clearer.'],
    future: ['Add manager-facing scenarios', 'Add an xAPI export for reporting', 'Test with real users and revise from observed difficulty'],
  },
  launchpad: {
    challenge: 'A fictional company is moving client projects into FlowBoard (a fictional work-management platform). Early adoption is uneven, and updates, blockers and risks are being reported in email instead of the tool.',
    gap: 'Team members know how to click through the software but not when and how to use it to surface blockers and escalate risks in time.',
    skills: ['Digital adoption', 'Software simulation design', 'Change enablement', 'Job aid design', 'Microlearning'],
    deliverables: ['FlowBoard software simulation with dashboard, tasks, dependencies and risks', 'Guided project and an independent challenge on a different project', 'Two-page quick-reference PDF', 'Final performance assessment'],
    needs: ['The gap is behavioural (using the tool to communicate risk), not purely procedural.', 'Learners need to practise in a safe copy of the tool, then do the task unaided.', 'A two-page job aid supports use after training.'],
    strategy: [
      { decision: 'Realistic dashboard, not forms', why: 'Practice in a lifelike interface transfers better than describing clicks.', framework: 'Simulation-based learning' },
      { decision: 'Guided project then a different independent project', why: 'Changing the context shows whether the learner understood the principle, not the screen.', framework: 'Transfer of learning' },
      { decision: 'Contextual help and goal checks', why: 'Immediate coaching ties feedback to the learner’s own action.', framework: 'Feedback and guided practice' },
      { decision: 'Quick reference with an escalation matrix', why: 'Decisions about when to escalate need a quick reference at the point of work.', framework: 'Performance support' },
    ],
    assessment: ['Six goal checks per project (status, blocker, owner and date, dependency, escalation, update)', 'Independent challenge on a different project with no hints', 'Five-item final assessment on decisions and interpretation'],
    implementation: [
      { phase: 'Analyze', activity: 'Review adoption data and support tickets.' },
      { phase: 'Design', activity: 'Agree the behaviours to change and the escalation rules.' },
      { phase: 'Develop', activity: 'Build the simulation and quick reference.' },
      { phase: 'Implement', activity: 'Launch with team leads first; champions answer questions.' },
      { phase: 'Evaluate', activity: 'Track blocker and risk entries in the real tool.' },
    ],
    evaluation: [
      { level: 'Level 1 · Reaction', question: 'Was the practice useful?', method: 'Short survey', status: 'Proposed' },
      { level: 'Level 2 · Learning', question: 'Can learners complete the six tasks?', method: 'Goal checks and final assessment', status: 'Built into the demo' },
      { level: 'Level 3 · Behavior', question: 'Are blockers and risks logged in the tool?', method: 'Adoption metrics from the real platform', status: 'Proposed' },
      { level: 'Level 4 · Results', question: 'Are delivery dates more reliable?', method: 'On-time milestone rate', status: 'Proposed' },
    ],
    completed: ['Interactive simulation, two scenarios, assessment', 'Quick-reference PDF', 'Case study'],
    proposed: ['Rollout, champions network and real adoption metrics'],
    limitations: ['FlowBoard is fictional and simplified; real tools are more complex.', 'No real users or adoption data.', 'The simulation checks outcomes, not every possible route.'],
    reflection: ['Making the simulation feel realistic meant resisting extra features that did not support a learning goal.'],
    future: ['Add a third scenario with a conflicting priority', 'Provide a facilitator version for live workshops'],
  },
  coachforward: {
    challenge: 'First-time managers in a fictional company avoid difficult conversations or give vague feedback, so performance and communication problems persist.',
    gap: 'Managers mix assumptions with observations, move to advice too quickly, and rarely document commitments or follow up.',
    skills: ['Leadership development', 'Branching scenario design', 'Feedback frameworks', 'Job aid design', 'Reflection design'],
    deliverables: ['Branching conversation simulations (Riley and Jamal)', 'Three modules and a final assessment', 'Manager toolkit PDF and editable worksheet', 'Conversation planning worksheet and reflection prompts'],
    needs: ['Managers need practice with the emotional side of conversations, not only the model.', 'Each choice should plausibly work for some people, so learners must reason rather than spot the obvious answer.'],
    strategy: [
      { decision: 'Situation–Behavior–Impact–Ask/Agree', why: 'A simple structure managers can recall in the moment.', framework: 'SBI-A feedback model' },
      { decision: 'Branching dialogue with different consequences', why: 'The employee responds differently to each approach, showing cause and effect.', framework: 'Scenario-based learning' },
      { decision: 'Coaching feedback on each path', why: 'Feedback explains the effect on trust and next steps, not only right or wrong.', framework: 'Deliberate practice' },
      { decision: 'Commitment log and follow-up script', why: 'Behaviour change depends on follow-through after the conversation.', framework: 'Performance support' },
    ],
    assessment: ['Branch outcomes with coaching feedback', 'Observation-versus-assumption sorting', 'Five-item final assessment', 'Self-check on a written opening statement'],
    implementation: [
      { phase: 'Analyze', activity: 'Interview managers about conversations they avoid.' },
      { phase: 'Design', activity: 'Write dialogues with HR input.' },
      { phase: 'Develop', activity: 'Build branching paths and the toolkit.' },
      { phase: 'Implement', activity: 'Run alongside a manager cohort with peer practice.' },
      { phase: 'Evaluate', activity: 'Collect direct-report pulse feedback after 60 days.' },
    ],
    evaluation: [
      { level: 'Level 1 · Reaction', question: 'Did it feel realistic?', method: 'Survey', status: 'Proposed' },
      { level: 'Level 2 · Learning', question: 'Can managers separate behaviour from assumption?', method: 'Sorting and scenario assessment', status: 'Built into the demo' },
      { level: 'Level 3 · Behavior', question: 'Are conversations held and documented?', method: 'Direct-report pulse; commitments log', status: 'Proposed' },
      { level: 'Level 4 · Results', question: 'Is regretted turnover or rework reduced?', method: 'HR metrics', status: 'Proposed' },
    ],
    completed: ['Branching simulation, assessment, toolkit and worksheet', 'Case study'],
    proposed: ['Live practice sessions', 'Pulse surveys and HR metrics'],
    limitations: ['Dialogues are scripted; real conversations are less predictable.', 'No real managers have used it.', 'Cultural differences in feedback norms are not covered.'],
    reflection: ['Writing plausible but flawed options was harder than writing correct ones.'],
    future: ['Add a scenario about feedback upward to a leader', 'Pair with live role-play'],
  },
  insight360: {
    challenge: 'A fictional organization runs several training programs but reports averages without context, so leaders cannot tell what the data supports.',
    gap: 'Analysts and program managers need to interpret completion and assessment data with attention to sample size, data quality and causation.',
    skills: ['Learning analytics', 'Data quality checks', 'Evaluation design', 'Executive communication', 'Data storytelling'],
    deliverables: ['Interactive analytics exercise with filters, tables and charts', 'Synthetic datasets (72 learners, 66 feedback themes)', 'Executive reporting pack (PDF)', 'Data definitions and limitations'],
    needs: ['Learners must practise judgment, not tool operation: what can this chart support?', 'Data-quality problems are built in so that learners meet them in a safe setting.'],
    strategy: [
      { decision: 'Questions answered by exploring the data', why: 'Active work with data builds interpretation skill that reading about it does not.', framework: 'Active learning' },
      { decision: 'Deliberate quality issues in the raw file', why: 'Finding a duplicate and an impossible value is more memorable than being told to check.', framework: 'Problem-based learning' },
      { decision: 'Claim-sorting activity', why: 'Separating supported from unsupported claims targets the typical executive-report error.', framework: 'Kirkpatrick levels' },
      { decision: 'All figures computed from the dataset', why: 'Consistency and credibility; no hardcoded results.', framework: 'Data integrity' },
    ],
    assessment: ['Computed-answer questions on trends', 'Data-quality hunt scored against the raw rows', 'Draft executive summary self-check with a model answer', 'Five-item final assessment'],
    implementation: [
      { phase: 'Analyze', activity: 'Gather reporting needs from L&D leaders.' },
      { phase: 'Design', activity: 'Agree metric definitions.' },
      { phase: 'Develop', activity: 'Build exercise and reporting templates.' },
      { phase: 'Implement', activity: 'Use as a workshop with L&D analysts.' },
      { phase: 'Evaluate', activity: 'Review quality of subsequent real reports.' },
    ],
    evaluation: [
      { level: 'Level 1 · Reaction', question: 'Was it useful?', method: 'Survey', status: 'Proposed' },
      { level: 'Level 2 · Learning', question: 'Can learners judge claims and data quality?', method: 'Exercise and final assessment', status: 'Built into the demo' },
      { level: 'Level 3 · Behavior', question: 'Do reports include limits and data notes?', method: 'Report review checklist', status: 'Proposed' },
      { level: 'Level 4 · Results', question: 'Do leaders make better-informed decisions?', method: 'Stakeholder feedback', status: 'Proposed' },
    ],
    completed: ['Exercise, synthetic data, reporting pack, case study'],
    proposed: ['Workshop delivery and review of real reports'],
    limitations: ['Synthetic data: nothing represents a real organisation.', 'The dataset is small, which is itself a teaching point.', 'Keyword self-checks cannot judge writing quality.'],
    reflection: ['Making the data small enough to explore but rich enough to support lessons was the main challenge.'],
    future: ['Add a longitudinal dataset', 'Add a dashboard-critique activity'],
  },
}
