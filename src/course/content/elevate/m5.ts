import type { Module } from '../../types'

export const m5: Module = {
  id: 'm5',
  title: 'Module 5 · Your 90-day readiness challenge',
  minutes: 30,
  summary: 'An integrated week at Harbor Retail: client communication, collaboration, deadlines, feedback and judgment in one connected scenario.',
  objectives: [
    'Combine prioritization, communication, risk and feedback skills in one scenario.',
    'Make and justify decisions under competing priorities.',
    'Reflect on evidence of readiness against 90-day expectations.',
  ],
  steps: [
    {
      id: 'm5-scenario', kind: 'scenario', title: 'Day 84: the busiest Tuesday',
      characters: ['Jordan', 'Maya', 'Alex', 'Priya'],
      narrative: [
        'It is day 84. Maya is travelling and unreachable until 14:00. The client has asked for a revised recommendation slide by 16:00, Alex is out sick, and Priya has asked Jordan to complete a short onboarding feedback survey before 17:00, which feeds the firm’s next onboarding review.',
        'At 09:30 Jordan notices that a number on last week’s client slide (a 12% shortage rate) does not match the updated data, which shows 15%. The client’s board meets tomorrow.',
      ],
      blocks: [{
        t: 'table', caption: 'Today’s demands', head: ['From', 'Demand', 'Due', 'Consequence of missing it'],
        rows: [
          ['Client (Dana)', 'Revised recommendation slide', '16:00 today', 'Board pack incomplete'],
          ['Jordan (self)', 'Correct the 12% vs 15% figure', 'Before board tomorrow', 'Board sees an incorrect figure'],
          ['Priya', 'Onboarding feedback survey', '17:00 today', 'Missing input to onboarding review'],
          ['Alex (absent)', 'Data validation handover', 'Today', 'Unvalidated figures'],
        ],
      }],
      stakes: 'This is the type of day the 90-day program has been preparing Jordan for. The scenario rewards judgment, honesty and communication, not heroics.',
    },
    {
      id: 'm5-instruction', kind: 'instruction', title: 'The readiness checklist: five questions before you act',
      blocks: [
        { t: 'flow', title: 'Judgment under pressure', steps: [
          { label: '1. What is firm and dated?', detail: 'Identify commitments others rely on.' },
          { label: '2. What is the consequence of being wrong?', detail: 'An incorrect figure in front of a board outweighs a late survey.' },
          { label: '3. Who needs to know?', detail: 'Name the people who can decide or be harmed by surprise.' },
          { label: '4. What can I decide myself?', detail: 'Use your authority; do not escalate what you can safely handle.' },
          { label: '5. What do I document?', detail: 'Leave a short written trail for people who come back later.' },
        ] },
        { t: 'callout', tone: 'warn', title: 'Integrity first', text: 'An error you discover is not a failure. Hiding it is. Report corrections promptly with what changed, why, and what the corrected figure means.' },
        { t: 'table', caption: 'Readiness evidence over 90 days', head: ['Capability', 'Evidence you could show'], rows: [
          ['Orientation and goals', 'A measurable 30-day goal and review notes'],
          ['Client communication', 'Clear, timely client replies'],
          ['Risk and escalation', 'A risk log entry and an escalation with options'],
          ['Feedback', 'A development plan with follow-up'],
        ] },
      ],
    },
    {
      id: 'm5-worked', kind: 'worked', title: 'Worked example: Morgan finds an error',
      situation: 'Morgan, on another team, notices a typo that changes a client’s budget figure in a deck sent yesterday. The manager is in a meeting.',
      steps: [
        { thought: 'This changes a number the client may rely on. I should not hide it or wait.', action: 'Morgan checks the source to confirm the correct figure.' },
        { thought: 'The manager owns the client relationship, but they are unavailable. Telling nobody is not an option.', action: 'Morgan messages the manager: “I found an error in yesterday’s deck: budget is 1.2M, not 2.1M. I have prepared a corrected slide and can send once you approve.”' },
        { thought: 'The fix should be traceable.', action: 'Morgan saves the corrected version with a short change note.' },
      ],
      takeaway: 'Verify, tell the accountable person promptly with the fix ready, and document the correction.',
    },
    {
      id: 'm5-guided', kind: 'guided', title: 'Guided practice: order Jordan’s day',
      intro: 'Use the five questions. Hints are available.',
      activity: {
        kind: 'order', prompt: 'Order Jordan’s actions from first to last.',
        items: [
          'Confirm the correct figure (15%) against the source data.',
          'Message Maya with the discrepancy and a corrected slide, and ask for a quick decision.',
          'Tell Dana a revised slide is coming by 16:00 and a correction note will follow.',
          'Build the revised recommendation slide using the validated numbers.',
          'Complete the onboarding feedback survey before 17:00.',
        ],
        explanation: 'Confirming accuracy comes first because everything else depends on it. Maya must hear about the error as soon as possible, and the client’s expectation is managed before the slide is built. The survey is real but lowest consequence, and fits in the remaining time.',
        hints: ['What can invalidate everything else if left unchecked?', 'Who should hear about the error before the client does?'],
      },
    },
    {
      id: 'm5-independent', kind: 'independent', title: 'Independent challenge: three decisions, one day',
      intro: 'No hints or step-by-step coaching. Work through the day and see how your decisions compound.',
      activity: {
        kind: 'branch', title: 'Jordan’s Tuesday', start: 'n1',
        nodes: [
          { id: 'n1', context: '09:30. Jordan has found the 12% vs 15% discrepancy. Maya is unreachable until 14:00.', prompt: 'What does Jordan do first?',
            choices: [
              { text: 'Verify against the source, then send Maya a short heads-up with the corrected figure.', next: 'n2', quality: 'best', reply: 'The source confirms 15%. Maya’s auto-reply says she will see messages at 14:00.', coach: 'You verified before raising it, and you made sure Maya had the facts when she lands.' },
              { text: 'Quietly update the slide and say nothing: it is only a small difference.', next: 'n2', quality: 'poor', reply: 'The slide is updated, but the old figure is already in last week’s pack.', coach: 'A 3-point difference in front of a board is material. Silent corrections leave people relying on the old figure.' },
              { text: 'Phone the client immediately to confess the error.', next: 'n2', quality: 'ok', reply: 'Dana is surprised; she asks why her contact on the project was not told first.', coach: 'Transparency is right, but Maya owns the relationship and should hear first.' },
            ] },
          { id: 'n2', context: '11:00. Dana messages: “Can you confirm the 12% shortage figure for the board? We are quoting it tomorrow.”', prompt: 'How does Jordan reply?',
            choices: [
              { text: '“Thanks, Dana. We are re-validating the figure and will confirm by 16:00 together with the revised slide. Please hold the 12% for now.”', next: 'n3', quality: 'best', reply: 'Dana: Thanks for the heads-up. I will hold it until I hear from you.', coach: 'You gave a clear time commitment and prevented her from quoting the old figure, without making claims beyond your authority.' },
              { text: '“Yes, 12% is confirmed.”', next: 'n3', quality: 'poor', reply: 'Dana forwards the 12% to her board.', coach: 'Confirming a figure you know is likely wrong compounds the error.' },
              { text: '“I cannot say anything until Maya is back.”', next: 'n3', quality: 'ok', reply: 'Dana: I need something before the end of day.', coach: 'Deferring is not dishonest, but you can give a safe holding reply with a time instead of leaving her stuck.' },
            ] },
          { id: 'n3', context: '15:00. Maya replies: “Thanks for catching this. Send the corrected slide. Please also draft a two-line correction note for Dana.” It is 15:00 and the survey is still open.', prompt: 'What is the best use of the next hour?',
            choices: [
              { text: 'Finish the slide and correction note first, send to Maya for a quick check, then do the survey before 17:00.', next: 'n4', quality: 'best', reply: 'Maya approves at 15:40. Dana receives the slide at 15:55 with the correction note. The survey is completed at 16:40.', coach: 'You ordered work by consequence and still met every commitment.' },
              { text: 'Do the survey first because it is quick.', next: 'n5', quality: 'poor', reply: 'The survey is finished, but the slide goes out at 16:20 and Dana has to chase.', coach: 'Easy wins can crowd out the commitment with the highest consequence.' },
              { text: 'Skip the survey entirely to focus on the slide.', next: 'n4', quality: 'ok', reply: 'The slide is on time. Priya later asks where Jordan’s feedback is.', coach: 'The slide was right to prioritize, but the survey was achievable and Priya was relying on it.' },
            ] },
          { id: 'n4', end: { title: 'Day complete: commitments met', summary: 'The corrected slide reached the client on time with a transparent note, Maya was informed, and the onboarding review had your input. The pattern: verify, inform the accountable person, give the client a holding reply, then prioritize by consequence.' } },
          { id: 'n5', end: { title: 'Day complete: client chased', summary: 'The work was finished but late, and the client had to follow up. The decision that mattered was ordering by consequence rather than convenience. Retry to see the difference.' } },
        ],
      },
    },
    {
      id: 'm5-check', kind: 'check', title: 'Knowledge check: professional judgment',
      activity: {
        kind: 'choice', prompt: 'At the 90-day readiness review, Maya asks: “Tell me about the 12% vs 15% moment. What would you do differently?” Which answer best demonstrates readiness?',
        options: [
          { text: '“Nothing. I handled it perfectly.”', quality: 'poor', feedback: 'Confidence is good, but a reflective practitioner can name what they would refine.', consequence: 'Maya notes limited self-awareness and plans more coaching.' },
          { text: '“I would flag the discrepancy to you and the client a little sooner, and add a validation check when we first publish a figure.”', quality: 'best', feedback: 'Specific, honest and forward-looking; links to a process improvement.', consequence: 'Maya adds the validation check to the team’s template and cites the example to other new hires.' },
          { text: '“It was Alex’s validation that failed.”', quality: 'poor', feedback: 'Blame doesn’t answer the question and undermines collaboration.', consequence: 'Maya notices the deflection and asks Alex for his side.' },
          { text: '“I am not sure. It worked out.”', quality: 'ok', feedback: 'Honest, but a missed chance to show learning.', consequence: 'Maya has to prompt for reflection, which weakens the impression.' },
        ],
      },
    },
    {
      id: 'm5-consequence', kind: 'consequence', title: 'What happened, and why it matters',
      text: [
        'The board used the correct 15% figure and Dana thanked the team for the transparency. In the 90-day review Maya cited the day as evidence of readiness: Jordan had prioritized by consequence, communicated early and documented the correction.',
        'Notice how the decisions connect: a quick verification enabled a safe client reply, which made time for the survey. In real work, small judgment calls stack.',
        'Check your decisions below and retry any that you would handle differently.',
      ],
    },
    {
      id: 'm5-reinforce', kind: 'reinforce', title: 'Make it stick: your readiness snapshot',
      reflection: 'Which of the five capabilities (orientation, client communication, risk, feedback, judgment) feels strongest, and which would you most like to develop in your next 90 days?',
      checklist: [
        'Write one piece of evidence for each capability.',
        'Pick one capability to develop and write a measurable goal.',
        'Share the goal and evidence with your manager.',
        'Schedule a 30-day follow-up.',
      ],
      application: 'Use the 90-day plan template to prepare your own readiness review, even in a role you already hold.',
      resource: { label: 'ELEVATE onboarding toolkit: 90-day plan and readiness checklist', file: 'downloads/elevate-onboarding-toolkit.pdf' },
    },
  ],
}
