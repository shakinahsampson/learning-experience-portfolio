import type { Course, Module } from '../types'
import { FlowBoard, solvedBoard } from '../../lab/flowboard/FlowBoard'
import { supplierCatalog, vendorApi, type GoalId } from '../../lab/flowboard/scenarios'

const m1Goals: GoalId[] = ['status', 'blocker', 'assign']
const m2Goals: GoalId[] = ['dependency', 'escalate', 'update']
const all: GoalId[] = ['status', 'blocker', 'assign', 'dependency', 'escalate', 'update']

const m1: Module = {
  id: 'l1', title: 'Module 1 · Read the project, capture the problem', minutes: 30,
  summary: 'Join a project that is slipping, and record status, blockers and ownership accurately in FlowBoard.',
  objectives: ['Judge a project’s status from evidence.', 'Document a blocker with cause, attempts and impact.', 'Assign ownership and a realistic deadline.'],
  steps: [
    { id: 'l1-scenario', kind: 'scenario', title: 'You join a project that is falling behind', characters: ['Maya Chen', 'Alex Rivera', 'Jordan Lee'],
      narrative: [
        'Your firm has just adopted FlowBoard, a fictional work-management platform, and the Harbor Portal Launch is its first live project. You join mid-way. The dashboard still says “On track”, but the vendor has not delivered the Inventory API sandbox access that the integration team needs.',
        'Maya wants the project to reflect reality before Wednesday’s client call. If FlowBoard is out of date, nobody can trust it, and people will go back to private spreadsheets.',
      ],
      blocks: [{ t: 'table', caption: 'What the team knows right now', head: ['Fact', 'Source'], rows: [
        ['API sandbox access is 5 days overdue', 'FlowBoard overdue alert'], ['Vendor has not replied to two emails and a call', 'Alex'], ['UAT scripts have no owner or date', 'Maya'], ['Integration milestone is 21 March', 'Project plan'],
      ] }],
      stakes: 'Digital adoption fails when the tool shows a different story from the real one. Accurate status, blockers and owners are what make the platform worth using.' },
    { id: 'l1-instruction', kind: 'instruction', title: 'A tour of the board, and what “good data” looks like',
      blocks: [
        { t: 'annotated', title: 'Reading the project header and task list', lines: [
          'Harbor Portal Launch · Status: ON TRACK ▾',
          'Tasks done 0/4 · Overdue 1 · Blockers 0',
          'Obtain vendor Inventory API sandbox access · Alex Rivera · 5 Mar (overdue) · In progress',
          'Build inventory data connector · Alex Rivera · 19 Mar · Not started',
          'Prepare user acceptance test scripts · Unassigned · — · Not started',
        ], notes: [
          { line: 0, label: 'Status menu', body: 'On track = no known threat to dates. At risk = a threat exists and action is needed. Off track = a committed date will be missed without a change in scope or date.' },
          { line: 1, label: 'Summary counters', body: 'Overdue 1 and Blockers 0 disagree: something overdue with no recorded reason means the team’s knowledge is not in the system.' },
          { line: 2, label: 'Overdue task', body: 'The first domino. Open it to record the blocker.' },
          { line: 3, label: 'Dependent task', body: 'Cannot realistically start until access exists; capture this as a dependency (Module 2).' },
          { line: 4, label: 'No owner, no date', body: 'Work with no owner is work nobody is doing. Assign both.' },
        ] },
        { t: 'table', caption: 'Choosing a project status', head: ['Evidence', 'Status'], rows: [['All dates achievable, no overdue critical work', 'On track'], ['Critical task overdue or milestone threatened, recovery possible', 'At risk'], ['Committed date cannot be met without a decision', 'Off track']] },
        { t: 'callout', tone: 'tip', title: 'A blocker has four parts', text: 'What is blocked · Why · What has been tried · Impact on dates. “Waiting on vendor” is a note; the four parts make it actionable.' },
        { t: 'p', text: 'Ownership rule of thumb: one named owner, one date, and the date must land before whatever depends on the work.' },
      ] },
    { id: 'l1-worked', kind: 'worked', title: 'Worked example: documenting a blocker well',
      situation: 'On a different (fictional) project, a coordinator finds a design review overdue because the client’s approver is on leave.',
      steps: [
        { thought: 'Writing “waiting on approver” tells nobody anything they can act on.', action: 'She writes what is blocked: “Design review for the checkout flow cannot be completed.”' },
        { thought: 'Others need the cause, so they can judge whether it is solvable.', action: 'She adds why: “The client approver is on leave until 24 June; no delegate named.”' },
        { thought: 'Showing what I have already tried avoids duplicate chasing.', action: 'She adds: “I have emailed the client sponsor and asked for a delegate.”' },
        { thought: 'The impact is what makes someone care.', action: 'She finishes: “Without approval by 21 June, build starts late and the 5 July release is at risk.” Then sets the task to Blocked.' },
      ],
      takeaway: 'A useful blocker could be understood by a stranger in ten seconds: what, why, tried, impact.' },
    { id: 'l1-guided', kind: 'guided', title: 'Guided practice: update Harbor Portal Launch',
      intro: 'Complete the three tasks in the simulated FlowBoard. The coach panel explains each step; use Check my work whenever you like.',
      activity: { kind: 'custom', render: ({ resolve, resolved }) => <FlowBoard sc={vendorApi} goals={m1Goals} mode="guided" resolved={resolved} onFinish={resolve} /> } },
    { id: 'l1-independent', kind: 'independent', title: 'Independent practice: write a blocker from scratch',
      intro: 'A new project, Summit Catalog Migration. Product images from the supplier are 5 days overdue; Sam has emailed and phoned the supplier. The content import is due 18 June and the “Content ready” milestone is 20 June.',
      activity: { kind: 'draft', prompt: 'Write the blocker note you would record on the overdue task.', minWords: 20, placeholder: 'What is blocked, why, what has been tried, impact…',
        criteria: [
          { label: 'Says what is blocked', anyOf: ['image', 'import', 'content'], coaching: 'Name the work that cannot proceed.' },
          { label: 'Gives the cause', anyOf: ['supplier'], coaching: 'State why: the supplier has not delivered.' },
          { label: 'Records what has been tried', anyOf: ['email', 'called', 'phone', 'chased', 'contact'], coaching: 'Show the attempts so no one repeats them.' },
          { label: 'States the impact on a date', anyOf: ['20 june', 'june 20', 'milestone', 'content ready', 'delay', 'risk'], coaching: 'Connect it to the milestone.' },
        ], model: 'Product images from the supplier are 5 days overdue, so the catalog import cannot start. Sam has emailed and phoned the supplier twice with no committed date. If images are not received by 12 June, the 18 June import and the 20 June “Content ready” milestone are at risk.' } },
    { id: 'l1-check', kind: 'check', title: 'Knowledge check: which status?',
      activity: { kind: 'choice', prompt: 'A critical task is 5 days overdue, nobody has a recovery date, but the go-live is still five weeks away and a workaround may exist. What status fits best?', options: [
        { text: 'On track: the final date has not moved.', quality: 'poor', feedback: 'A critical overdue task with no recovery date is a known threat. Reporting “On track” hides it.', consequence: 'The client learns of the delay in a later meeting and asks why FlowBoard did not show it.' },
        { text: 'At risk, with the blocker and next action recorded.', quality: 'best', feedback: 'There is a real threat but recovery is possible. “At risk” invites help while there is still time.', consequence: 'Maya sees the flag, calls the client sponsor, and the vendor is prompted within a day.' },
        { text: 'Off track: any overdue critical task means failure.', quality: 'ok', feedback: 'Cautious, but “Off track” means a committed date will be missed. Overstating erodes trust in the status field.', consequence: 'The client worries unnecessarily and asks for a recovery plan the team does not yet need.' },
      ] } },
    { id: 'l1-consequence', kind: 'consequence', title: 'What happened, and why it matters',
      text: ['After the update, Maya’s Wednesday call used the FlowBoard view directly. Dana saw the risk, the blocker and the owner for each task, and asked for the vendor escalation herself.', 'Teams adopt a tool when it saves them a meeting. Accurate status and clear blockers are what make people check the platform instead of asking for a separate update.'] },
    { id: 'l1-reinforce', kind: 'reinforce', title: 'Make it stick: your tool-hygiene routine',
      reflection: 'Which of your current tools holds information that is out of date, and what would it take to make it trustworthy?',
      checklist: ['Status matches evidence.', 'Every overdue item has a recorded reason.', 'Every task has one owner and a date.', 'Blockers state what, why, tried, impact.'],
      application: 'Before the next weekly meeting, spend ten minutes making your project tool match reality.',
      resource: { label: 'LAUNCHPAD quick reference (PDF)', file: 'downloads/launchpad-quick-reference.pdf' } },
  ],
}

const m2: Module = {
  id: 'l2', title: 'Module 2 · Connect, escalate, communicate', minutes: 35,
  summary: 'Record dependencies, escalate a delivery risk to the right person, and write a concise update, then repeat the workflow on a different project.',
  objectives: ['Record a dependency.', 'Escalate with severity and the right recipient.', 'Write a concise update.', 'Transfer the workflow to a new project.'],
  steps: [
    { id: 'l2-scenario', kind: 'scenario', title: 'Wednesday’s call is tomorrow', characters: ['Maya Chen', 'Alex Rivera', 'Jordan Lee'],
      narrative: ['The blocker is recorded and UAT scripts have an owner. But the board still hides how the delay spreads: the data connector depends on the sandbox, and the milestone depends on the connector.', 'Maya needs two more things: the risk raised formally to her, and a three-line update she can read aloud on the client call.'],
      blocks: [{ t: 'flow', title: 'How the delay propagates', steps: [
        { label: 'Sandbox access (overdue)', detail: 'Owner: Alex. Blocked by the vendor.' }, { label: 'Build connector', detail: 'Cannot start until access arrives. Due 19 Mar.' }, { label: 'API integration milestone', detail: '21 March. At risk if the connector slips.' }, { label: 'UAT and go-live', detail: '28 March and 4 April. Compressed if integration slips.' },
      ] }],
      stakes: 'Hidden dependencies surprise people. A late, vague update on the client call costs credibility; an early, structured one earns room to recover.' },
    { id: 'l2-instruction', kind: 'instruction', title: 'Dependencies, escalation, and the five-line update',
      blocks: [
        { t: 'p', text: 'A dependency says “this cannot finish (or start) until that is done”. Recording it makes the knock-on effect visible to everyone, including people who never open the blocked task.' },
        { t: 'table', caption: 'Escalation decision matrix', head: ['Situation', 'Severity', 'Send to'], rows: [
          ['Delay absorbed inside the team; no date at risk', 'Low', 'Handle in the task; mention in the update'],
          ['A task date is at risk, a workaround exists', 'Medium', 'Task owner’s manager if you cannot resolve in a day'],
          ['A milestone or client commitment is at risk and the fix needs someone else’s decision', 'High', 'Engagement manager now, with options'],
        ] },
        { t: 'callout', tone: 'warn', title: 'Escalate up, not out', text: 'Send the risk to the one person who can act. Broadcasting to the whole team or the client without your manager’s knowledge creates noise and can damage relationships.' },
        { t: 'doc', kind: 'note', title: 'A concise status update (about 55 words)', lines: ['Status: At risk. Vendor sandbox access is 5 days overdue (emailed twice, called once). The connector cannot start, so the 21 March integration milestone is threatened. Alex is chasing daily; UAT scripts now owned by Jordan. Decision needed from Maya: ask Dana to prompt the vendor’s integration lead today.'] },
        { t: 'list', ordered: true, items: ['Status', 'The blocker and cause', 'What it affects (the date)', 'What has been done', 'The decision or help needed'] },
      ] },
    { id: 'l2-worked', kind: 'worked', title: 'Worked example: shrinking a rambling update',
      situation: 'A colleague drafted a 150-word update that buries the point. Here is how an experienced coordinator tightens it.',
      steps: [
        { thought: 'Readers skim for status and for what is asked of them. Put those first.', action: 'She leads with “Status: At risk” and moves the ask to the end.' },
        { thought: 'Most of the history is not needed. Readers need the cause and the consequence.', action: 'She cuts the timeline of emails to one clause: “emailed twice, called once”.' },
        { thought: 'The date is why anyone cares.', action: 'She names the milestone and its date explicitly.' },
        { thought: 'A vague “let me know” gives the reader nothing to do.', action: 'She ends with a specific, bounded ask: “Decision needed today: ask Dana to prompt the vendor.”' },
      ],
      takeaway: 'Status first, ask last, history trimmed to cause and consequence.' },
    { id: 'l2-guided', kind: 'guided', title: 'Guided practice: dependency, escalation and update',
      intro: 'The earlier fixes are already in place. Complete the remaining three tasks with coaching.',
      activity: { kind: 'custom', render: ({ resolve, resolved }) => <FlowBoard sc={vendorApi} goals={m2Goals} mode="guided" initial={solvedBoard(vendorApi, m1Goals)} resolved={resolved} onFinish={resolve} /> } },
    { id: 'l2-independent', kind: 'independent', title: 'Independent challenge: Summit Supplier Catalog Migration',
      intro: 'A different project, a similar problem. There is no coach panel and the guidance is hidden. You decide the status, document the blocker, assign ownership, record the dependency, escalate and update. Submit when you are ready.',
      activity: { kind: 'custom', render: ({ resolve, resolved }) => <FlowBoard sc={supplierCatalog} goals={all} mode="independent" resolved={resolved} onFinish={resolve} /> } },
    { id: 'l2-check', kind: 'check', title: 'Knowledge check: who should hear first?',
      activity: { kind: 'choice', prompt: 'You discover the supplier will miss a milestone by a week. Your manager is in a meeting for two hours. The client sponsor messages asking “Is everything on track?”', options: [
        { text: 'Reply “Yes, all fine” and tell your manager later.', quality: 'poor', feedback: 'Misleading the client to avoid an awkward conversation is never acceptable.', consequence: 'The delay surfaces the next day and the client doubts the team’s reporting.' },
        { text: 'Reply: “We’re working through a supplier delay and will confirm impact and next steps by 15:00.” Then raise a High risk to your manager.', quality: 'best', feedback: 'Honest, bounded and does not pre-empt your manager. The risk is escalated to the person who can act.', consequence: 'Your manager takes over after the meeting, and the client hears a plan at 15:00.' },
        { text: 'Tell the client the full details and your guess at the new date.', quality: 'ok', feedback: 'Honest, but sharing an unvetted new date before your manager has weighed options may commit the firm to something unwise.', consequence: 'The client holds the team to the guessed date, which later proves wrong.' },
      ] } },
    { id: 'l2-consequence', kind: 'consequence', title: 'What happened, and why it matters',
      text: ['With the dependency visible, the client could see why a vendor delay affected UAT and go-live. Maya read your five-line update on the call, and Dana asked the vendor’s executive sponsor to intervene.', 'Digital adoption is not about knowing where the buttons are. It is about using the system to tell the truth early, so people make decisions with current information.'] },
    { id: 'l2-reinforce', kind: 'reinforce', title: 'Make it stick: the five-line update',
      reflection: 'Think of the last status update you read that was too long or too vague. What would you cut?',
      checklist: ['Lead with status.', 'Name the blocker and the cause.', 'State the date or milestone affected.', 'Say what has been done.', 'End with a specific decision or help needed.'],
      application: 'Use the five-line pattern for your next weekly update, and ask one reader whether it helped.',
      resource: { label: 'LAUNCHPAD quick reference (PDF)', file: 'downloads/launchpad-quick-reference.pdf' } },
  ],
}

export const launchpad: Course = {
  id: 'launchpad',
  title: 'LAUNCHPAD · Digital Adoption & Change Enablement',
  subtitle: 'Learn FlowBoard by using it on a project that is slipping.',
  org: 'Meridian Strategy Group (fictional) adopting FlowBoard, a fictional work-management platform',
  audience: 'Employees and project teams adopting a new work-management platform',
  minutes: 65,
  overview: [
    'A new platform only improves performance if people use it to record the truth. LAUNCHPAD teaches the six habits that matter most on a delayed project: status, blockers, ownership, dependencies, escalation and concise updates.',
    'You practice in FlowBoard, a simulated project-management app with a dashboard, tasks, milestones, risks and notifications. Guided practice uses one project; the independent challenge uses a different one.',
  ],
  objectives: [
    'Update project status based on evidence.', 'Document a blocker with cause, attempts and impact.', 'Assign an owner and realistic deadline.',
    'Record a dependency between tasks.', 'Escalate a delivery risk to the right person.', 'Communicate a concise status update.',
  ],
  characters: [
    { name: 'Jordan Lee', role: 'Consultant (you)', blurb: 'Joining a live project and learning FlowBoard.', initials: 'JL', tone: 'sage' },
    { name: 'Maya Chen', role: 'Engagement manager', blurb: 'Needs the project to reflect reality before the client call.', initials: 'MC', tone: 'charcoal' },
    { name: 'Alex Rivera', role: 'Analyst', blurb: 'Owns the vendor access task and has chased twice.', initials: 'AR', tone: 'gold' },
    { name: 'Dana Whitfield', role: 'Client sponsor', blurb: 'Reads the board before every call.', initials: 'DW', tone: 'warm' },
  ],
  modules: [m1, m2],
  finalAssessment: {
    title: 'LAUNCHPAD performance assessment', intro: 'Five applied tasks on new projects. No hints, no retries within a run.', passMark: 0.75,
    items: [
      { id: 'lf1', objective: 'Choose status from evidence', activity: { kind: 'choice', prompt: 'On the Orchard Analytics project, the data warehouse access request is two days overdue, but there is slack of four days before the milestone. What status fits?', options: [
        { text: 'On track', quality: 'ok', feedback: 'Defensible given the slack, but the overdue item still needs a recorded reason and a watch date.' },
        { text: 'At risk', quality: 'best', feedback: 'A recovery is possible, but the slack is shrinking and the overdue item needs attention.' },
        { text: 'Off track', quality: 'poor', feedback: 'The milestone is not yet lost; this overstates the problem.' },
      ] } },
      { id: 'lf2', objective: 'Recognise a complete blocker', activity: { kind: 'sort', prompt: 'Sort each statement from a blocker note.', buckets: ['Cause', 'Attempt made', 'Impact'], items: [
        { text: 'The client’s legal team has not signed the data-sharing agreement.', bucket: 0, why: 'This explains why work cannot proceed.' },
        { text: 'I have chased the legal contact twice and asked the sponsor to intervene.', bucket: 1, why: 'These are actions already taken.' },
        { text: 'Testing cannot begin by 14 July, which puts the 21 July launch at risk.', bucket: 2, why: 'It links the blocker to a date.' },
      ] } },
      { id: 'lf3', objective: 'Order the workflow', activity: { kind: 'order', prompt: 'Order the actions when you spot a threatened milestone.', items: ['Verify the facts and what has been tried.', 'Record the blocker and dependency in the tool.', 'Set status to match the evidence.', 'Raise a High risk to your manager with options.', 'Send a five-line update.'], explanation: 'Verify first, record the facts in the tool, make status honest, escalate to the right person, then communicate to the wider group.' } },
      { id: 'lf4', objective: 'Escalate appropriately', activity: { kind: 'choice', prompt: 'A milestone is at risk and the fix needs a client decision. Whom do you raise it with first?', options: [
        { text: 'The whole project team in the group chat.', quality: 'poor', feedback: 'Broadcasting does not get a decision; it adds noise.' },
        { text: 'Your engagement manager, with options and the decision needed.', quality: 'best', feedback: 'The manager owns the client relationship and can act.' },
        { text: 'The client sponsor directly.', quality: 'poor', feedback: 'Your manager should decide what the client hears and how.' },
      ] } },
      { id: 'lf5', objective: 'Write a concise update', activity: { kind: 'draft', prompt: 'Write a 40–70 word update for a project at risk because a supplier is late with images (milestone 20 June).', minWords: 25, criteria: [
        { label: 'Leads with status', anyOf: ['at risk'], coaching: 'Start with the status.' },
        { label: 'Names the cause', anyOf: ['supplier', 'image'], coaching: 'Name the cause.' },
        { label: 'Names the affected date', anyOf: ['20 june', 'june 20', 'milestone'], coaching: 'Name the milestone.' },
        { label: 'States the ask', anyOf: ['decision', 'need', 'request', 'ask', 'approve'], coaching: 'End with the decision or help needed.' },
      ], model: 'Status: At risk. Supplier product images are 5 days overdue (emailed twice, called once), so catalog import is stalled and the 20 June Content-ready milestone is threatened. Sam is chasing daily. Decision needed: Rosa to ask the client sponsor to prompt the supplier today.' } },
    ],
  },
  resources: [
    { label: 'LAUNCHPAD quick reference (PDF, 2 pages)', file: 'downloads/launchpad-quick-reference.pdf', note: 'Workflow, examples, troubleshooting and escalation matrix' },
  ],
  disclosure: 'LAUNCHPAD is an independent, fictional portfolio simulation. FlowBoard is an invented application, not real software, and all projects, clients and people are fictional. No real adoption results are claimed.',
}
