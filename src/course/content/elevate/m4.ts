import type { Module } from '../../types'

export const m4: Module = {
  id: 'm4',
  title: 'Module 4 · Feedback and performance',
  minutes: 25,
  summary: 'Interpret feedback, ask clarifying questions, identify development needs and set measurable goals.',
  objectives: [
    'Interpret feedback and separate observations from judgments.',
    'Ask clarifying questions that turn feedback into specific actions.',
    'Create a development plan with measurable goals.',
  ],
  steps: [
    {
      id: 'm4-scenario', kind: 'scenario', title: 'The 30-day check-in',
      characters: ['Jordan', 'Maya'],
      narrative: [
        'Thirty days in, Jordan sits down with Maya for the scheduled review. Jordan is proud of the Harbor Retail work and is hoping for praise. Maya opens warmly, then says: “Your analysis is accurate, but your updates sometimes arrive late and I have to ask for them. I’d like to talk about that.”',
        'Jordan feels a flush of defensiveness. The updates were late because Jordan was waiting to be sure everything was perfect. How Jordan responds in the next minute will shape what Maya says next.',
      ],
      blocks: [{
        t: 'dialogue', lines: [
          { who: 'Maya', text: 'Your analysis has been accurate and well organised. The part I want to work on is updates. Twice this month I learned about a delay from the client instead of from you.' },
          { who: 'Jordan', text: '…' },
        ],
      }],
      stakes: 'Feedback is information, and how Jordan handles it signals maturity. A defensive reaction can end the conversation; a curious one can turn it into a development plan.',
    },
    {
      id: 'm4-instruction', kind: 'instruction', title: 'Receive feedback and turn it into a plan',
      blocks: [
        { t: 'flow', title: 'LISTEN → CLARIFY → CONFIRM → PLAN', steps: [
          { label: 'Listen', detail: 'Hear the whole message before responding. Note the specific examples.' },
          { label: 'Clarify', detail: 'Ask open questions: “Can you give me an example?” “What would good look like?”' },
          { label: 'Confirm', detail: 'Paraphrase what you heard to check you understood it.' },
          { label: 'Plan', detail: 'Agree on one or two specific actions, a measure and a follow-up date.' },
        ] },
        { t: 'table', caption: 'Observation versus judgment', head: ['Observation (usable)', 'Judgment (harder to act on)'], rows: [
          ['Two updates arrived after the client had already asked.', 'You are not communicative.'],
          ['The summary had no risks section.', 'You are not thorough.'],
        ] },
        { t: 'callout', tone: 'tip', title: 'Useful clarifying questions', text: '“Can you tell me about a specific time?” · “What would you have wanted to see?” · “How would we know it has improved?” · “What is the one change that would matter most?”' },
        { t: 'p', text: 'Feedback can come from several places: a manager’s words, a client’s reaction, completed work or a missed deadline. Treat them all as data about your work. Then convert the data into a development goal using Action + Evidence + Timeframe.' },
      ],
    },
    {
      id: 'm4-worked', kind: 'worked', title: 'Worked example: Casey hears feedback about meetings',
      situation: 'Casey, a colleague on another team, hears from a manager: “You sometimes dominate meetings.” Watch how Casey turns an unclear remark into something actionable.',
      steps: [
        { thought: 'My first reaction is to defend myself. But the feedback is too general to act on, and I want to understand it.', action: 'Casey takes a breath and says: “Thank you for telling me. Can you give me an example?”' },
        { thought: 'An example turns a judgment into an observation.', action: 'The manager mentions Monday’s planning meeting, where Casey answered every question before others spoke.' },
        { thought: 'I should confirm that I understand it.', action: 'Casey says: “So in Monday’s meeting I answered before others could. Is that right?”' },
        { thought: 'Now I can make a concrete plan.', action: 'Casey proposes: “In the next three meetings I will wait for two others to speak before I answer. Could you tell me in two weeks if it is working?”' },
      ],
      takeaway: 'Defensiveness fades when curiosity takes over. Ask for an example, confirm it, and then propose a measurable change with a follow-up date.',
    },
    {
      id: 'm4-guided', kind: 'guided', title: 'Guided practice: converse with Maya',
      intro: 'Jordan has to respond. Choose replies and see how Maya reacts. Hints are available.',
      activity: {
        kind: 'branch', title: 'Respond to Maya’s feedback', start: 'a',
        hints: ['Which response invites Maya to give an example?', 'Which one helps you understand rather than defend?'],
        nodes: [
          { id: 'a', speaker: 'Maya', say: 'Twice this month I learned about a delay from the client instead of from you. I want to work on that.', prompt: 'How does Jordan respond?',
            choices: [
              { text: '“I was waiting until I was sure the numbers were right before telling you.”', next: 'b', quality: 'ok', reply: 'I understand the instinct. Accuracy matters. But I would rather hear early and imperfectly.', coach: 'You explained honestly, but it sounded slightly defensive. Maya now has to correct the logic before moving forward.' },
              { text: '“Thanks for telling me. Can you walk me through the two times so I understand?”', next: 'c', quality: 'best', reply: 'Sure. The Northeast delay on the 12th, and the revised scope on the 19th. Both times, I heard from the client first.', coach: 'You opened with curiosity and asked for specifics, which converts a general comment into observable examples.' },
              { text: '“The client has been moving the goalposts. That is not my fault.”', next: 'd', quality: 'poor', reply: 'I am not blaming you for the client’s changes. I am talking about how we learn about them.', coach: 'Shifting blame hides the actual issue. Maya must now spend time clarifying that she is not blaming you.' },
            ] },
          { id: 'b', speaker: 'Maya', say: 'I would rather have a rough heads-up in the morning than a perfect update on Friday. Does that make sense?', prompt: 'Next move?',
            choices: [
              { text: '“Yes. So a short note when something changes, even before I have all the details?”', next: 'e', quality: 'best', reply: 'Exactly. Two lines is enough.', coach: 'You paraphrased and confirmed. That turns feedback into a clear working agreement.' },
              { text: '“I will try to do better.”', next: 'e', quality: 'poor', reply: 'Thanks. What would “better” look like?', coach: '“Try to do better” is not measurable. Maya has to ask for the detail you could have offered.' },
            ] },
          { id: 'c', speaker: 'Maya', say: 'On the 12th I only found out because Dana mentioned it. If I had known an hour earlier, I could have prepared for her call.', prompt: 'Next move?',
            choices: [
              { text: '“That makes sense. What would you want from me in that situation?”', next: 'e', quality: 'best', reply: 'A quick message when anything changes the date or scope. Even two lines.', coach: 'You invited Maya to define success, which gives you a specific standard to meet.' },
              { text: '“I see. I will try to send more updates.”', next: 'e', quality: 'ok', reply: 'Good. Let us make it specific so we both know what it looks like.', coach: 'Right intent, but vague. A specific commitment is more useful.' },
            ] },
          { id: 'd', speaker: 'Maya', say: 'Let me rephrase. The client’s changes are real. What I need is to hear about them from you first. Can we agree on how?', prompt: 'Next move?',
            choices: [
              { text: '“I am sorry. I was defensive. Yes: I will send a short message whenever scope or a date changes.”', next: 'e', quality: 'best', reply: 'Thank you, I appreciate that.', coach: 'Recovering gracefully is a strong skill. A short acknowledgement and a concrete commitment repair the conversation.' },
              { text: '“I still think the client is the issue.”', next: 'f', quality: 'poor', reply: 'We may not agree on that. I will keep this on the radar and we will revisit it.', coach: 'Holding your position without hearing the request leaves the problem unresolved, and Maya now has doubts about your coachability.' },
            ] },
          { id: 'e', end: { title: 'Agreement reached', summary: 'Jordan and Maya agree on a clear, observable working practice and a follow-up date. Notice how the quality of Jordan’s early replies shaped how specific the final agreement became.' } },
          { id: 'f', end: { title: 'No agreement yet', summary: 'The conversation ended without a shared plan. Maya will follow up, but Jordan missed the chance to show openness to feedback. Retry to explore a different first response.' } },
        ],
      },
    },
    {
      id: 'm4-independent', kind: 'independent', title: 'Independent practice: build a development plan',
      intro: 'Maya asks Jordan to send a development plan after the check-in. Write one development goal that addresses her feedback. No template is supplied.',
      activity: {
        kind: 'draft', prompt: 'Write Jordan’s development goal and how progress will be measured (2–4 sentences).', minWords: 30, placeholder: 'My development goal is…',
        criteria: [
          { label: 'Addresses the feedback (timely updates)', anyOf: ['update', 'notify', 'inform', 'message', 'communicat'], coaching: 'Link the goal to Maya’s feedback about timely updates.' },
          { label: 'Specifies an observable action', anyOf: ['send', 'share', 'post', 'notify', 'message'], coaching: 'Describe what you will actually do.' },
          { label: 'Includes a measure', anyOf: ['each', 'every', 'within', 'hour', 'same day', 'zero', 'no instances', '\\d+'], coaching: 'Add a measurable standard, such as “within two hours” or “every time scope changes.”' },
          { label: 'Includes a follow-up date or review', anyOf: ['review', 'check-in', 'by day', 'week', 'follow', 'days'], coaching: 'Add when you and Maya will review progress.' },
        ],
        model: 'My goal is to keep Maya informed of any change to scope or dates. Whenever a date or scope changes, I will send a two-line message within two hours, before the client contacts her. We will review progress at the day-45 check-in using the log of messages sent and any instances where Maya heard about a change from the client first.',
      },
    },
    {
      id: 'm4-check', kind: 'check', title: 'Knowledge check: interpret the feedback',
      activity: {
        kind: 'choice', prompt: 'A week later, Alex tells Jordan: “Maya said your updates are better but your summaries still feel long.” Jordan feels the praise was overshadowed. What is the most useful response?',
        options: [
          { text: 'Ignore it: the feedback is second-hand.', quality: 'poor', feedback: 'Second-hand feedback is incomplete, but still a signal. Ignoring it wastes useful data.', consequence: 'Summaries remain long, and Maya notices that Jordan did not follow up.' },
          { text: 'Ask Maya directly: “I heard summaries may be long. Could you show me one that was the right length?”', quality: 'best', feedback: 'You verify at the source, ask for a model and show you are acting on feedback.', consequence: 'Maya shares an example; Jordan’s next summary is half the length and she notices.' },
          { text: 'Shorten summaries drastically without asking anyone.', quality: 'ok', feedback: 'Action is good, but guessing the right length risks removing what the client needs.', consequence: 'One summary is now too thin, and Maya asks for the missing detail.' },
          { text: 'Tell Alex the feedback is unfair.', quality: 'poor', feedback: 'Venting to colleagues does not resolve it and can create gossip.', consequence: 'The remark gets back to Maya and weakens trust.' },
        ],
      },
    },
    {
      id: 'm4-consequence', kind: 'consequence', title: 'What happened, and why it matters',
      text: [
        'Over the next month, Jordan’s short heads-up messages became part of the team’s habit. At the 60-day check-in Maya had specific evidence to point to, and the conversation moved from “what is wrong” to “what is next”.',
        'People who ask for examples and propose measurable actions are easier to coach. They also help managers give clearer feedback over time.',
        'Review your decisions below and retry anything you want to improve.',
      ],
    },
    {
      id: 'm4-reinforce', kind: 'reinforce', title: 'Make it stick: your feedback toolkit',
      reflection: 'Recall a time you received feedback that stung. What would you ask now to understand it better?',
      checklist: [
        'Pause and listen to the whole message before replying.',
        'Ask for one specific example.',
        'Paraphrase to confirm what you heard.',
        'Turn it into a goal with a measure and a review date.',
      ],
      application: 'After your next piece of feedback, write down the observation, the clarifying question you asked, and one measurable action, then share it with the person who gave it.',
      resource: { label: 'ELEVATE onboarding toolkit: manager check-in guide', file: 'downloads/elevate-onboarding-toolkit.pdf' },
    },
  ],
}
