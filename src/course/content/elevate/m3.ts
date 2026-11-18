import type { Module } from '../../types'

export const m3: Module = {
  id: 'm3',
  title: 'Module 3 · Managing risks and escalation',
  minutes: 25,
  summary: 'Spot risks early, document them clearly and escalate with a recommendation instead of a complaint.',
  objectives: [
    'Identify and document a project risk with likelihood and impact.',
    'Decide when and to whom to escalate.',
    'Draft a professional escalation message with options and a recommendation.',
  ],
  steps: [
    {
      id: 'm3-scenario', kind: 'scenario', title: 'The file that did not arrive',
      characters: ['Jordan', 'Alex', 'Maya'],
      narrative: [
        'It is week six of the Harbor Retail engagement. The Northeast stock file that Alex has been waiting for still has not arrived from the client’s data team. Yesterday the client also moved the board pre-read forward by two days.',
        'Alex is concerned but reluctant to “bother Maya” because she is at a client workshop all day. Jordan notices that two later tasks depend on this file, and the data that has arrived so far contains obvious gaps.',
      ],
      blocks: [{
        t: 'table', caption: 'Project status snapshot', head: ['Item', 'Status', 'Note'],
        rows: [
          ['Northeast stock file', 'Overdue 3 days', 'Client data team has not responded'],
          ['Regional model', 'Blocked', 'Needs Northeast data'],
          ['Board pre-read', 'Moved forward 2 days', 'Now due Wednesday 10:00'],
          ['Data completeness', '82% of expected stores', 'Eastern region incomplete'],
        ],
      }],
      stakes: 'If nobody speaks up, the team may find out on Tuesday night that Wednesday’s deliverable cannot be finished. Raising it early gives Maya time to negotiate scope, resources or a revised date with the client.',
    },
    {
      id: 'm3-instruction', kind: 'instruction', title: 'Identify, document, communicate, escalate',
      blocks: [
        { t: 'flow', title: 'The four-step risk routine', steps: [
          { label: 'Identify', detail: 'Notice signals: overdue inputs, shifting dates, unclear ownership, data gaps. Ask “what could stop us hitting the date?”' },
          { label: 'Document', detail: 'Log it with a description, likelihood, impact, owner and next date. If it is not written down, it is not managed.' },
          { label: 'Communicate', detail: 'Tell people who can act on it, using facts rather than blame.' },
          { label: 'Escalate', detail: 'Escalate when you cannot resolve it within your authority or timeline, or when impact reaches a client commitment.' },
        ] },
        { t: 'table', caption: 'When to escalate', head: ['Situation', 'Action'], rows: [
          ['Within your control, low impact', 'Handle it and note it in the update.'],
          ['Needs someone else’s decision, moderate impact', 'Inform your manager with a recommendation within the day.'],
          ['Threatens a client date or commitment', 'Escalate now, with options and the decision you need.'],
        ] },
        { t: 'callout', tone: 'tip', title: 'A strong escalation message', text: 'Situation → Impact → What you have tried → Options → Your recommendation → The decision you need, and by when. Keep it under 150 words and stay factual.' },
        { t: 'annotated', title: 'Annotated example: a strong escalation message', lines: [
          'Subject: Decision needed today: Northeast data delay may affect Wednesday pre-read',
          'Maya, the Northeast stock file is now three days overdue, which blocks the regional model.',
          'If we receive it by Tuesday 10:00 we can still deliver Wednesday. After that, we risk missing the pre-read.',
          'Alex has contacted the client data team twice with no response; I can call their lead today.',
          'Options: (1) ask Dana to prompt her data team, (2) deliver Wednesday with the 82% of data we have plus clear caveats.',
          'I recommend option 1 today, with option 2 as the fallback. Could you decide by 2 p.m.?',
        ], notes: [
          { line: 0, label: 'Subject line', body: 'States the action required and the topic, so it is read quickly.' },
          { line: 1, label: 'Situation', body: 'Facts only: what is delayed and what it blocks.' },
          { line: 2, label: 'Impact', body: 'Names the real deadline consequence and the point of no return.' },
          { line: 3, label: 'What was tried', body: 'Shows ownership before escalating.' },
          { line: 4, label: 'Options', body: 'Offers choices so the manager can decide quickly.' },
          { line: 5, label: 'Recommendation and ask', body: 'Makes a recommendation and sets a time for the decision.' },
        ] },
      ],
    },
    {
      id: 'm3-worked', kind: 'worked', title: 'Worked example: Rowan and the slipping vendor date',
      situation: 'Rowan, a coordinator on another project, hears that a vendor’s delivery may slip by a week. The launch is in ten days. Here is how an experienced colleague handles it.',
      steps: [
        { thought: 'A week’s slip on a ten-day runway is a serious threat. But I only have a rumour. I should verify before escalating.', action: 'Rowan emails the vendor and asks for a confirmed date and the cause.' },
        { thought: 'Whatever the answer, this belongs in the risk log now, because the launch plan depends on it.', action: 'Rowan logs: “Vendor delivery may slip 1 week; likelihood high; impact high; owner Rowan; review daily.”' },
        { thought: 'My manager needs options, not just bad news.', action: 'Rowan drafts two options: delay launch by two days, or launch with a phased scope.' },
        { thought: 'The sooner it is shared, the more room for decisions.', action: 'Rowan sends it that afternoon with a recommendation and a request for a decision by Friday.' },
      ],
      takeaway: 'Verify quickly, log immediately, escalate with options and a recommendation. Timeliness is part of the professionalism.',
    },
    {
      id: 'm3-guided', kind: 'guided', title: 'Guided practice: log the risk',
      intro: 'Sort the statements into a risk record. Hints show the reasoning.',
      activity: {
        kind: 'sort', prompt: 'Which part of a risk entry does each statement belong in?',
        buckets: ['Description (fact)', 'Impact', 'Mitigation / next action'],
        items: [
          { text: 'The Northeast stock file is 3 days overdue.', bucket: 0, why: 'This is a verifiable fact about the situation.' },
          { text: 'The regional model cannot be completed; Wednesday’s pre-read is at risk.', bucket: 1, why: 'This describes the consequence if the risk is not resolved.' },
          { text: 'Call the client’s data lead today and ask Dana to prompt the team.', bucket: 2, why: 'This is a concrete action that reduces the risk.' },
          { text: 'Prepare a caveated version using 82% of the data as a fallback.', bucket: 2, why: 'A fallback plan is a mitigation, not an impact.' },
        ],
        hints: ['Facts describe what is; impacts describe what will happen.', 'Mitigations are things someone will do.'],
      },
    },
    {
      id: 'm3-independent', kind: 'independent', title: 'Independent practice: draft the escalation',
      intro: 'Maya is at the workshop and checks messages at lunch. Draft the escalation she will read. There is no template here: apply the approach you have learned.',
      activity: {
        kind: 'draft', prompt: 'Write the escalation message to Maya (aim for 80–150 words).', minWords: 50, placeholder: 'Subject: …',
        criteria: [
          { label: 'States the situation factually', anyOf: ['overdue', 'delayed', 'has not arrived', 'not received', 'late'], coaching: 'Open with the fact: what is late and for how long.' },
          { label: 'Explains the impact on the deadline', anyOf: ['wednesday', 'pre-read', 'blocks', 'blocked', 'risk', 'impact'], coaching: 'Connect the delay to the client commitment.' },
          { label: 'Shows what has been tried', anyOf: ['contacted', 'emailed', 'called', 'followed up', 'asked', 'tried'], coaching: 'Show you acted before escalating.' },
          { label: 'Offers options or a recommendation', anyOf: ['option', 'recommend', 'propose', 'suggest', 'fallback'], coaching: 'Offer at least two options and recommend one.' },
          { label: 'Asks for a decision with a time', anyOf: ['decide', 'decision', 'by \\d', 'by end', 'by noon', 'p\\.?m', 'a\\.?m'], coaching: 'State the decision you need and when you need it.' },
        ],
        model: 'Subject: Decision needed today: Northeast data delay may affect Wednesday pre-read\n\nMaya, the Northeast stock file is three days overdue and blocks the regional model. If it arrives by Tuesday 10:00 we can still meet Wednesday. Alex has emailed the client’s data team twice without a reply. Options: (1) ask Dana to prompt her team, (2) deliver with 82% of the data and clear caveats. I recommend option 1 today with option 2 as the fallback. Could you decide by 2 p.m.? I can make the call to their data lead immediately after.',
      },
    },
    {
      id: 'm3-check', kind: 'check', title: 'Knowledge check: who needs to know?',
      activity: {
        kind: 'choice', prompt: 'Maya replies that she needs more time to decide. Meanwhile, Alex suggests quietly “fixing” the missing data by estimating the Northeast figures, so nobody has to be told. What should Jordan do?',
        options: [
          { text: 'Agree. If the numbers look plausible, the client will not notice.', quality: 'poor', feedback: 'Silently estimating data misrepresents the work and could damage client trust and the firm’s integrity.', consequence: 'The board sees estimates presented as actuals. A later audit exposes the issue and Meridian has to issue a correction.' },
          { text: 'Suggest including a clearly labelled estimate as a fallback, but only with Maya’s approval and visible caveats.', quality: 'best', feedback: 'An estimate can be legitimate when it is labelled, approved and transparent. Jordan keeps Maya in the loop and protects integrity.', consequence: 'Maya approves the labelled fallback. If the file arrives late, the team updates the numbers with minimal disruption.' },
          { text: 'Escalate directly to the partner without telling Maya.', quality: 'poor', feedback: 'Skipping your manager is rarely the right first move, and it undermines trust. Escalate through the person accountable unless there is an ethical or urgent reason not to.', consequence: 'The partner asks Maya what is happening; Maya feels bypassed and Jordan’s credibility drops.' },
          { text: 'Do nothing until the file arrives.', quality: 'ok', feedback: 'Waiting avoids bad decisions but leaves the deadline risk unmanaged. A fallback plan is still needed.', consequence: 'The file arrives Tuesday night with no time to build the model, and the team scrambles.' },
        ],
      },
    },
    {
      id: 'm3-consequence', kind: 'consequence', title: 'What happened, and why it matters',
      text: [
        'Maya read the message at lunch, asked Dana to prompt her data team, and approved a labelled fallback. The file arrived Tuesday at 15:00. The team stayed late but delivered on Wednesday, and the pre-read included a short note on data completeness.',
        'Early, structured escalation gave Maya the time to use her client relationship. A late or vague message would have left her only bad options.',
        'Review your decisions and retry any you want to revisit.',
      ],
    },
    {
      id: 'm3-reinforce', kind: 'reinforce', title: 'Make it stick: your escalation checklist',
      reflection: 'Recall a time when you waited too long to raise a problem, or raised one well. What made the difference?',
      checklist: [
        'Is it a fact or a rumour? Verify quickly.',
        'Is it in the risk log with an owner and a date?',
        'Do I have at least two options and a recommendation?',
        'Have I told the person who can act, with the decision I need and by when?',
      ],
      application: 'Keep a simple risk log for your next project. Review it weekly and escalate anything that threatens a commitment.',
      resource: { label: 'ELEVATE onboarding toolkit: escalation guide and templates', file: 'downloads/elevate-onboarding-toolkit.pdf' },
    },
  ],
}
