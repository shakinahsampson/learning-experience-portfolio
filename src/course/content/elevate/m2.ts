import type { Module } from '../../types'

export const m2: Module = {
  id: 'm2',
  title: 'Module 2 · Your first client engagement',
  minutes: 25,
  summary: 'Interpret a client request, clarify ownership and communicate in a way that keeps the team aligned.',
  objectives: [
    'Interpret a client request and separate urgent from important work.',
    'Clarify ownership and deadlines with a team.',
    'Use concise, documented communication.',
  ],
  steps: [
    {
      id: 'm2-scenario', kind: 'scenario', title: 'Harbor Retail needs the numbers by Thursday',
      characters: ['Jordan', 'Maya', 'Alex'],
      narrative: [
        'In week three, Jordan joins the Harbor Retail engagement, a fictional client study of store-level stock shortages. Maya leads the engagement; Alex is the analyst who has been on the project since kickoff.',
        'On Monday morning a message arrives from the client sponsor. It is polite and short, and it contains at least three different requests. Alex is busy with a data pull, Maya is in client meetings until noon, and Jordan has to decide where to start.',
      ],
      blocks: [
        { t: 'doc', kind: 'chat', title: 'Message from Dana Whitfield (client sponsor)', meta: [['Received', 'Monday 8:15 a.m.']],
          lines: ['Hi team, quick one. Can we get the regional shortage figures by Thursday for our board pre-read? Also it would be great to see the store-by-store view if possible. And can someone check why the Northeast numbers looked odd last time? Thanks!'] },
        { t: 'table', caption: 'Project snapshot', head: ['Item', 'Detail'], rows: [
          ['Deliverable due', 'Regional shortage summary, Thursday 12:00'],
          ['Owner', 'Maya (accountable); Alex (data); Jordan (supporting)'],
          ['Known issue', 'Northeast data had a late file in the last cycle'],
          ['Client expectation', 'Board pre-read: accuracy over speed'],
        ] },
      ],
      stakes: 'If Jordan treats every request as equal, the Thursday deliverable slips. If Jordan starts work without checking scope, the team may spend a day on a store-level view the client only mentioned in passing.',
    },
    {
      id: 'm2-instruction', kind: 'instruction', title: 'Turn a request into a plan',
      blocks: [
        { t: 'p', text: 'Client messages often bundle several asks with different weights. Break them apart before acting, and confirm anything ambiguous with the person accountable.' },
        { t: 'flow', title: 'Interpret → confirm → document', steps: [
          { label: '1. Separate the asks', detail: 'List each distinct request. Mark which are firm (“by Thursday”) and which are soft (“if possible”).' },
          { label: '2. Rank by consequence and deadline', detail: 'Firm, dated, high-visibility items first. Soft requests are scoped after the firm ones are secure.' },
          { label: '3. Confirm ownership', detail: 'Ask your manager who owns each item and what you are expected to do. Do not assume.' },
          { label: '4. Document and share', detail: 'Write the agreed plan in the team channel so everyone sees the same version.' },
        ] },
        { t: 'callout', tone: 'info', title: 'RACI in one line', text: 'Responsible does the work, Accountable owns the outcome, Consulted gives input, Informed is kept up to date. Naming one Accountable person per item prevents duplicated effort and dropped tasks.' },
        { t: 'p', text: 'Good project updates are brief and structured: what is done, what is next, what is at risk, and what you need. Compare these two messages.' },
        { t: 'table', caption: 'Two ways to confirm a plan', head: ['Weaker', 'Stronger'], rows: [
          ['“I’ll get started on all of it.”', '“I read three asks. I’ll start the regional summary due Thursday and check the Northeast data first with Alex. Can you confirm the store-level view is optional?”'],
        ] },
      ],
    },
    {
      id: 'm2-worked', kind: 'worked', title: 'Worked example: Taylor clarifies a vague request',
      situation: 'A project coordinator, Taylor, receives a request: “Can you tidy up the project folder before the review?” Observe how an experienced colleague turns it into an actionable task.',
      steps: [
        { thought: '“Tidy up” could mean renaming files, removing duplicates, or restructuring everything. I could waste an afternoon guessing.', action: 'Taylor asks one clarifying question: “What would a tidy folder look like to you: naming, structure, or removing old drafts?”' },
        { thought: 'The answer will define done. I should write it down so we agree.', action: 'Taylor replies with the answer in writing: “Plan: rename files to the standard format, archive drafts older than 30 days. I will finish by 3 p.m. Tuesday.”' },
        { thought: 'If someone disagrees with this plan, better to learn now than after the work.', action: 'Taylor posts the plan in the team channel and waits for a thumbs-up before starting.' },
      ],
      takeaway: 'A quick clarifying question plus a written plan costs two minutes and saves hours. Ambiguity is cheaper to resolve before you start.',
    },
    {
      id: 'm2-guided', kind: 'guided', title: 'Guided practice: rank Jordan’s work',
      intro: 'Use the “rank by consequence and deadline” step. Hints are available.',
      activity: {
        kind: 'order', prompt: 'Put Jordan’s first actions in the best order.',
        items: [
          'Ask Maya whether the store-by-store view is required or optional for Thursday.',
          'With Alex, check why the Northeast data looked odd before building the regional summary.',
          'Draft the regional shortage summary for Thursday’s deadline.',
          'Post the agreed plan and open questions in the team channel.',
          'Start scoping the optional store-level view once the summary is on track.',
        ],
        explanation: 'Clarify scope first (cheap, and it avoids rework), then check the data risk that could undermine accuracy, then build the firm deliverable, share the plan, and only then pick up optional work.',
        hints: ['What could invalidate the whole deliverable if it is wrong?', 'Which question is quick and changes how much work there is?'],
      },
    },
    {
      id: 'm2-independent', kind: 'independent', title: 'Independent practice: reply to Dana',
      intro: 'Maya asks Jordan to draft the acknowledgement to Dana. It should confirm what the team will deliver and when, and ask about the optional request. No template is provided.',
      activity: {
        kind: 'draft', prompt: 'Write a short, professional reply to Dana (3–5 sentences).', minWords: 35,
        placeholder: 'Hi Dana, thank you for…',
        criteria: [
          { label: 'Confirms the firm Thursday deliverable', anyOf: ['thursday', 'regional'], coaching: 'Name the firm deliverable and its date so the client knows what to expect.' },
          { label: 'Addresses the Northeast data question', anyOf: ['northeast', 'data'], coaching: 'The client raised a concern. Acknowledge it and say you are checking.' },
          { label: 'Clarifies the optional store-level view', anyOf: ['store', 'optional', 'priority', 'scope', 'confirm'], coaching: 'Ask whether the store-level view is needed for Thursday or can follow.' },
          { label: 'Avoids over-promising', anyOf: ['will confirm', 'will update', 'by end of day', 'after we', 'once we', 'check'], coaching: 'Avoid promising everything. Say what you will confirm and by when.' },
        ],
        model: 'Hi Dana, thanks for the note. We will deliver the regional shortage summary by Thursday 12:00 for your board pre-read. We are also checking the Northeast figures with our data lead and will share what we find by end of day Tuesday. Could you confirm whether the store-by-store view is needed for Thursday, or can it follow afterwards? We want to protect accuracy on the regional numbers first.',
      },
    },
    {
      id: 'm2-check', kind: 'check', title: 'Knowledge check: who owns what?',
      activity: {
        kind: 'choice', prompt: 'On Tuesday, Jordan sees that both Alex and Jordan have started cleaning the Northeast data, and Maya has not been told. What is the best next step?',
        options: [
          { text: 'Keep going and compare results afterwards; one of them will be right.', quality: 'poor', feedback: 'Duplicated effort wastes time and risks two conflicting versions.', consequence: 'Two data cleaning versions arrive Wednesday; reconciling them costs half a day and the team is rattled.' },
          { text: 'Message Alex and Maya: “We both started on the Northeast cleanup. Proposal: Alex owns it and I validate afterwards. OK?”', quality: 'best', feedback: 'It names the overlap, proposes a clear owner and keeps the manager informed, without blame.', consequence: 'Maya confirms in one line. Jordan switches to validating, and Thursday’s deliverable is protected.' },
          { text: 'Stop work and wait for someone to notice.', quality: 'poor', feedback: 'Waiting delays a Thursday deadline, and the lack of communication continues.', consequence: 'A day is lost before anyone notices the pause.' },
          { text: 'Tell Alex to stop because Jordan started first.', quality: 'ok', feedback: 'It resolves the overlap but ignores who is accountable and could damage a working relationship.', consequence: 'Alex stops, but the data lead role was Alex’s; Maya later has to re-assign and explain.' },
        ],
      },
    },
    {
      id: 'm2-consequence', kind: 'consequence', title: 'What happened, and why it matters',
      text: [
        'The regional summary went to Dana on Wednesday afternoon, a day early, with the Northeast data issue explained in a footnote. Dana’s reply was short and positive, and she confirmed the store-level view could follow the next week.',
        'Early scope questions and one named owner per task are small habits that stop rework. They also build the quiet trust that lets managers give new hires more responsibility.',
        'Review your results below and retry any decision you would handle differently.',
      ],
    },
    {
      id: 'm2-reinforce', kind: 'reinforce', title: 'Make it stick: your request-triage routine',
      reflection: 'Think of a recent message at work or school that contained more than one request. How did you decide what to do first?',
      checklist: [
        'Split every request into separate asks.',
        'Mark each as firm or soft, with a date.',
        'Confirm ownership with the person accountable.',
        'Post the plan where the whole team can see it.',
      ],
      application: 'The next time you receive a multi-part request, reply with a three-line plan: what you will do, by when, and what you need clarified.',
      resource: { label: 'ELEVATE onboarding toolkit: RACI and communication templates', file: 'downloads/elevate-onboarding-toolkit.pdf' },
    },
  ],
}
