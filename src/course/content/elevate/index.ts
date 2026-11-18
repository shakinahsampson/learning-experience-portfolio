import type { Course } from '../../types'
import { m1 } from './m1'
import { m2 } from './m2'
import { m3 } from './m3'
import { m4 } from './m4'
import { m5 } from './m5'

export const elevate: Course = {
  id: 'elevate',
  title: 'ELEVATE · 90-Day Consulting Employee Onboarding & Performance Enablement',
  subtitle: 'Follow Jordan through the first 90 days at Meridian Strategy Group.',
  org: 'Meridian Strategy Group (fictional management consulting firm)',
  audience: 'New consultants, new hires and managers who support onboarding',
  minutes: 120,
  overview: [
    'Meridian Strategy Group has inconsistent onboarding, unclear performance expectations, fragmented learning resources and limited visibility into readiness. ELEVATE is a simulated program that responds to those problems with a connected story and a toolkit.',
    'You will step into Jordan’s role as a new consultant, working with Maya, Alex and Priya through five modules. Each follows the same sequence: a realistic situation, instruction, a worked example, guided practice, independent practice, a knowledge check, consequences and a transfer activity.',
  ],
  objectives: [
    'Prioritize orientation tasks and write a measurable 30-day development goal.',
    'Interpret a client request, clarify ownership and communicate concisely.',
    'Identify, document and escalate risks with options and a recommendation.',
    'Receive feedback, ask clarifying questions and build a development plan.',
    'Apply professional judgment across competing priorities in an integrated scenario.',
  ],
  characters: [
    { name: 'Jordan', role: 'New consultant (you)', blurb: 'Capable, motivated and still learning the firm’s expectations.', initials: 'J', tone: 'sage' },
    { name: 'Maya', role: 'Engagement manager', blurb: 'Leads the Harbor Retail engagement and gives direct, practical feedback.', initials: 'M', tone: 'charcoal' },
    { name: 'Alex', role: 'Project team colleague', blurb: 'Analyst and onboarding buddy; deep on the data, light on process.', initials: 'A', tone: 'gold' },
    { name: 'Priya', role: 'HR / L&D program partner', blurb: 'Runs onboarding and gathers feedback to improve the program.', initials: 'P', tone: 'warm' },
  ],
  modules: [m1, m2, m3, m4, m5],
  finalAssessment: {
    title: 'ELEVATE readiness assessment',
    intro: 'Six new situations at Meridian. Apply what you have learned; there are no hints and no retries within a run.',
    passMark: 0.75,
    items: [
      {
        id: 'f1', objective: 'Write a measurable development goal',
        activity: { kind: 'choice', prompt: 'Priya asks new hires to submit a 30-day goal. Which is the strongest?', options: [
          { text: 'Improve my teamwork skills.', quality: 'poor', feedback: 'No evidence, no date: it cannot be reviewed.' },
          { text: 'By day 30, lead one 15-minute team stand-up and collect feedback from two teammates.', quality: 'best', feedback: 'Observable, dated and evidenced.' },
          { text: 'Try to speak up more in meetings during my first month.', quality: 'ok', feedback: 'Has a timeframe but no measure for “more”.' },
        ] },
      },
      {
        id: 'f2', objective: 'Prioritize a multi-part request',
        activity: { kind: 'order', prompt: 'A client asks for (a) a firm summary by Friday, (b) an optional extra chart, (c) a check on an odd data point. Order your actions.', items: [
          'Check the odd data point that could invalidate the summary.',
          'Confirm with your manager whether the chart is optional.',
          'Build the Friday summary.',
          'Scope the optional chart if time remains.',
        ], explanation: 'Data accuracy underpins the summary; confirming scope is quick; the firm deliverable follows; optional work last.' },
      },
      {
        id: 'f3', objective: 'Classify observations and judgments',
        activity: { kind: 'sort', prompt: 'Sort each statement.', buckets: ['Observation', 'Judgment'], items: [
          { text: 'The report was sent two days after the deadline.', bucket: 0, why: 'Verifiable fact.' },
          { text: 'She is unreliable.', bucket: 1, why: 'A conclusion about a person, not an event.' },
          { text: 'The risk section was missing from the last two updates.', bucket: 0, why: 'Countable and checkable.' },
          { text: 'He does not care about quality.', bucket: 1, why: 'Assumes motive.' },
        ] },
      },
      {
        id: 'f4', objective: 'Escalate a risk appropriately',
        activity: { kind: 'choice', prompt: 'A vendor will deliver three days late, threatening a client date in five days. You have tried contacting them twice. What is best?', options: [
          { text: 'Keep chasing the vendor and mention it at Friday’s team meeting.', quality: 'poor', feedback: 'Friday is too late for a five-day runway.' },
          { text: 'Message your manager today with the facts, two options and a recommendation, and ask for a decision by tomorrow.', quality: 'best', feedback: 'Timely, structured and decision-oriented.' },
          { text: 'Tell the client directly that the vendor is late.', quality: 'poor', feedback: 'Your manager should lead the client conversation and decide what to share.' },
        ] },
      },
      {
        id: 'f5', objective: 'Respond to feedback constructively',
        activity: { kind: 'choice', prompt: 'Your manager says your slides are “too dense.” Which reply is most useful?', options: [
          { text: '“The client wanted all the detail.”', quality: 'poor', feedback: 'Defends rather than learns.' },
          { text: '“Thanks. Could you show me one slide that is the right density so I can match it?”', quality: 'best', feedback: 'Asks for an example and a standard.' },
          { text: '“OK, I’ll cut them down.”', quality: 'ok', feedback: 'Willing, but you may cut the wrong things without an example.' },
        ] },
      },
      {
        id: 'f6', objective: 'Apply integrated judgment',
        activity: { kind: 'branch', title: 'A Friday afternoon dilemma', start: 'x1', nodes: [
          { id: 'x1', context: '15:30. You find that a client figure from yesterday was wrong. Your manager is in a flight lounge and replies slowly.', prompt: 'What do you do?', choices: [
            { text: 'Confirm the correct figure, message your manager with the fix ready, and tell the client a correction is coming.', next: 'x2', quality: 'best', reply: 'Your manager replies at 16:10: “Thanks. Send the correction.”', coach: 'Verified, informed the accountable person, and managed the client expectation.' },
            { text: 'Wait until Monday to avoid bothering anyone.', next: 'x2', quality: 'poor', reply: 'The client uses the wrong figure over the weekend.', coach: 'Delay turns a small error into a bigger one.' },
          ] },
          { id: 'x2', context: '16:30. The correction is approved. The client asks whether other figures might be wrong.', prompt: 'What is the most honest reply?', choices: [
            { text: '“We have re-checked the related figures and they hold. Here is what we verified.”', next: 'x3', quality: 'best', reply: 'The client accepts and thanks you.', coach: 'Specific and verifiable: reassurance based on checks, not hope.' },
            { text: '“Everything else is definitely fine.”', next: 'x3', quality: 'poor', reply: 'You have not actually checked, and a later error would be damaging.', coach: 'Never promise what you have not verified.' },
          ] },
          { id: 'x3', end: { title: 'Scenario complete', summary: 'Your choices shaped how credible the correction felt to the client.' } },
        ] },
      },
    ],
  },
  resources: [
    { label: 'ELEVATE onboarding toolkit (PDF)', file: 'downloads/elevate-onboarding-toolkit.pdf', note: 'Agenda, 90-day plan, check-in guide, RACI, communications, checklists' },
    { label: 'ELEVATE editable templates (Word)', file: 'downloads/elevate-onboarding-templates.docx', note: 'Editable versions of the key templates' },
  ],
  disclosure: 'ELEVATE is an independent, fictional portfolio simulation. Meridian Strategy Group, Jordan, Maya, Alex, Priya and Harbor Retail are invented. It was not delivered to real employees and no real outcomes are claimed.',
}
