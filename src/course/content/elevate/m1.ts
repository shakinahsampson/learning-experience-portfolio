import type { Module } from '../../types'

export const m1: Module = {
  id: 'm1',
  title: 'Module 1 · Your first 90 days',
  minutes: 20,
  summary: 'Make sense of a welcome email, a six-phase roadmap and a first manager check-in, then draft a measurable 30-day goal.',
  objectives: [
    'Identify orientation priorities from a welcome email and roadmap.',
    'Prepare focused questions for a first manager check-in.',
    'Write a measurable 30-day development goal.',
  ],
  steps: [
    {
      id: 'm1-scenario', kind: 'scenario', title: 'Monday, 7:42 a.m.: the welcome email',
      characters: ['Jordan', 'Priya', 'Maya'],
      narrative: [
        'Jordan accepted an offer at Meridian Strategy Group last month. This morning, before day one has even started, there is a welcome email from Priya in the inbox, a calendar full of unfamiliar invitations, and a login that does not work yet.',
        'Jordan has a decision to make: read everything and try to do it all, or work out what matters most in week one. Maya, Jordan’s engagement manager, is travelling to a client site on Wednesday and has only one open slot for a first check-in on Tuesday afternoon.',
      ],
      blocks: [{
        t: 'doc', kind: 'email', title: 'Welcome to Meridian: your first week',
        meta: [['From', 'Priya Nair, People & Learning Partner'], ['To', 'Jordan'], ['Sent', 'Friday 4:58 p.m.']],
        lines: [
          'Hi Jordan, we are delighted you are joining us on Monday.',
          'Day 1: Orientation 9:00–12:30 (laptop and access set-up first). Lunch with your onboarding buddy, Alex.',
          'Day 2: Complete the three required compliance modules (about 90 minutes in total). 3:00 p.m. first check-in with Maya.',
          'Days 3–5: Shadow the Harbor Retail team and read the project brief in the shared workspace.',
          'By end of Week 1: Finish your access request form and bring one draft development goal to your 30-day review.',
          'Your 90-day roadmap is attached. Please skim it before Monday.',
        ],
      }],
      stakes: 'First impressions shape confidence. If Jordan misses the compliance deadline or arrives at Tuesday’s check-in with no questions, Maya cannot calibrate expectations, and Jordan spends weeks guessing what “good” looks like.',
    },
    {
      id: 'm1-instruction', kind: 'instruction', title: 'Read the roadmap: six phases, one direction',
      blocks: [
        { t: 'p', text: 'Good onboarding is a sequence, not a pile of tasks. Each phase builds the capability the next one needs. Select a phase to see what it asks of you and what a manager will look for.' },
        {
          t: 'timeline', title: 'Meridian’s six-phase, 90-day roadmap (fictional)',
          items: [
            { when: 'Before day 1', label: 'Pre-boarding', detail: 'Access, paperwork and welcome contact. Your job: respond quickly to requests and read the first-week plan.' },
            { when: 'Week 1', label: 'Orientation', detail: 'Tools, people, policies and compliance. Your job: complete required items and learn who to ask for what.' },
            { when: 'Days 8–30', label: 'Foundations', detail: 'Shadow a live engagement and learn the firm’s templates. Your job: ask questions early and write your first development goal.' },
            { when: 'Days 31–60', label: 'Contribution', detail: 'Own a defined piece of work. Your job: communicate progress and flag risks before they grow.' },
            { when: 'Days 61–80', label: 'Independence', detail: 'Handle tasks with lighter supervision. Your job: show judgment and seek feedback proactively.' },
            { when: 'Days 81–90', label: 'Review & plan', detail: 'Readiness review with your manager. Your job: reflect with evidence and agree on the next 90-day goals.' },
          ],
        },
        { t: 'callout', title: 'Prioritizing in week one', tone: 'tip', text: 'Sort tasks by deadline and by consequence of missing them. Required, dated items (compliance, access) come first. Relationship-building and reading come next. Nice-to-have exploring is last.' },
        { t: 'p', text: 'A development goal is measurable when someone else could tell whether you achieved it. Use this pattern: Action + Evidence + Timeframe. For example: “By day 30, I will independently complete a project status update using the firm’s template and receive no corrections on structure.”' },
        { t: 'table', caption: 'Weak and strong development goals', head: ['Weak goal', 'Why it is weak', 'Stronger version'], rows: [
          ['Get better at communication', 'No evidence, no date', 'By day 30, send two weekly status summaries to Maya that she accepts without structural edits.'],
          ['Learn the tools', 'Vague, cannot be observed', 'By day 20, complete the workspace tutorial and build one task plan without help.'],
        ] },
      ],
    },
    {
      id: 'm1-worked', kind: 'worked', title: 'Worked example: Sam prepares for a first check-in',
      situation: 'Sam, a different new consultant at Meridian, has a 20-minute first check-in with a manager tomorrow. Watch the reasoning an experienced employee uses to prepare.',
      steps: [
        { thought: 'Twenty minutes is short. If I ask everything, I will learn nothing deeply. I should work out what is blocking me and what I most need to know.', action: 'Sam lists everything unclear: access issues, who owns what, what “good” looks like, and dress code.' },
        { thought: 'Some of these are answerable without my manager (dress code, access form). Her time should go to things only she can tell me.', action: 'Sam removes the two questions HR documents already answer and keeps three: priorities, what success looks like at 30 days, and how she prefers updates.' },
        { thought: 'A question like “Any advice?” invites a vague answer. A specific question invites a useful one.', action: 'Sam rewrites: “What is the one thing you would want me to have done well by day 30?”' },
        { thought: 'My manager is more likely to help if I show I have already tried.', action: 'Sam brings a one-line draft goal and asks whether it fits expectations.' },
      ],
      takeaway: 'Prepare for a check-in by filtering, not by listing: ask only what your manager is uniquely placed to answer, make questions specific, and bring a draft to react to.',
    },
    {
      id: 'm1-guided', kind: 'guided', title: 'Guided practice: choose Jordan’s questions',
      intro: 'Jordan has about 20 minutes with Maya tomorrow. Use the filtering approach you just saw. Hints are available if you want coaching.',
      activity: {
        kind: 'sort', prompt: 'Sort each possible question: should Jordan bring it to Maya, find the answer elsewhere, or skip it for now?',
        buckets: ['Ask Maya', 'Find the answer elsewhere', 'Not needed yet'],
        items: [
          { text: 'What would “a strong first 30 days” look like to you?', bucket: 0, why: 'Only Maya can define expectations for her own engagement.' },
          { text: 'How do you prefer to receive progress updates: email, chat or a standing meeting?', bucket: 0, why: 'Working preferences are personal to a manager and affect every future interaction.' },
          { text: 'Where is the expense policy?', bucket: 1, why: 'Policy documents answer this; Maya’s time should not.' },
          { text: 'How do I reset my workspace password?', bucket: 1, why: 'IT support or the onboarding guide covers this; it is a quick self-service lookup.' },
          { text: 'What will my promotion path look like in three years?', bucket: 2, why: 'A sensible topic later, but week one is for building foundations.' },
        ],
        hints: ['Ask: could a document or helpdesk answer this in two minutes?', 'Which questions shape how Jordan works every day?'],
      },
    },
    {
      id: 'm1-independent', kind: 'independent', title: 'Independent practice: a measurable 30-day goal',
      intro: 'Now it is your turn, without step-by-step help. Maya has asked Jordan to bring one draft development goal. Based on the welcome email, Jordan knows week-one priorities and that the 30-day review is coming.',
      activity: {
        kind: 'draft', prompt: 'Write one measurable 30-day development goal for Jordan (2–4 sentences).', minWords: 20,
        placeholder: 'By day 30, I will…',
        criteria: [
          { label: 'Names a specific action or skill', anyOf: ['complete', 'build', 'deliver', 'draft', 'lead', 'write', 'present', 'send', 'prepare', 'independently'], coaching: 'Start with an observable action (for example, draft, deliver, complete).' },
          { label: 'Includes evidence or a measure', anyOf: ['receive', 'accepted', 'without', 'feedback', 'two', 'three', 'weekly', 'template', '\\d+', 'confirm'], coaching: 'Add how someone would know it worked: a count, a standard, or confirmation from Maya.' },
          { label: 'Includes a timeframe', anyOf: ['day 30', '30 days', 'by day', 'by the end', 'weekly', 'within'], coaching: 'State when. Without a date, a goal is just an intention.' },
        ],
        model: 'By day 30, I will independently draft and send two weekly status updates to Maya using the firm’s template. I will aim for no structural edits and will ask for feedback on clarity after each one.',
      },
    },
    {
      id: 'm1-check', kind: 'check', title: 'Knowledge check: which goal is measurable?',
      activity: {
        kind: 'choice', prompt: 'Maya asks Jordan which of these draft goals is most useful at the 30-day review. Which one gives both of them the clearest way to tell whether it was achieved?',
        options: [
          { text: 'Become more confident presenting to clients.', quality: 'poor', feedback: 'Confidence matters, but nobody can observe it reliably. Without a date or a standard, there is nothing to review.', consequence: 'At day 30 the conversation drifts: “How do you feel it is going?” and Jordan leaves without clear direction.' },
          { text: 'By day 30, shadow two client calls and write a one-page summary of each, reviewed by Alex.', quality: 'best', feedback: 'Observable actions, a quantity, a deadline and a reviewer. At the review, Maya and Jordan can see whether it happened.', consequence: 'Jordan arrives with two summaries and specific questions, and Maya adjusts the next goal using real evidence.' },
          { text: 'Attend as many client meetings as possible during the first month.', quality: 'ok', feedback: 'It names an action and a timeframe, but “as many as possible” is not a standard, and attendance does not show learning.', consequence: 'Jordan is busy but cannot show what was learned, so the review stays general.' },
          { text: 'Learn everything about Meridian’s methodology by the end of the quarter.', quality: 'poor', feedback: '“Everything” cannot be verified, and “quarter” is later than the 30-day review. It is neither specific nor timely.', consequence: 'The goal feels overwhelming and is quietly dropped by week three.' },
        ],
      },
    },
    {
      id: 'm1-consequence', kind: 'consequence', title: 'What happened, and why it matters',
      text: [
        'At the Tuesday check-in, Maya noticed that Jordan’s questions were specific and that a draft goal was already on the table. She spent the 20 minutes calibrating expectations instead of explaining basics, and she shared her preferred update rhythm: a short written update every Friday.',
        'When new hires arrive with vague questions or no goal, managers tend to fill the silence with general advice. Specific preparation shifts the conversation from telling to coaching, and it gives the manager evidence to support later.',
        'Review your decisions below. Retry anything you would do differently; retrying is how practice becomes judgment.',
      ],
    },
    {
      id: 'm1-reinforce', kind: 'reinforce', title: 'Make it stick: your own first-week plan',
      reflection: 'Think about a time you started something new. What would you have wanted to ask in the first week, and who was best placed to answer?',
      checklist: [
        'List every week-one task and mark which have fixed deadlines.',
        'Write three questions that only your manager can answer.',
        'Draft one 30-day goal using Action + Evidence + Timeframe.',
        'Ask your manager how and how often they prefer updates.',
      ],
      application: 'Before your next kickoff, new role or new project, write your first three questions and one measurable 30-day goal, and share them with whoever sets expectations.',
      resource: { label: 'ELEVATE new-hire onboarding toolkit (PDF)', file: 'downloads/elevate-onboarding-toolkit.pdf' },
    },
  ],
}
