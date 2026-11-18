export type GoalId = 'status' | 'blocker' | 'assign' | 'dependency' | 'escalate' | 'update'
export type TaskStatus = 'Not started' | 'In progress' | 'Blocked' | 'Done'
export type ProjectStatus = 'On track' | 'At risk' | 'Off track'

export interface FTask { id: string; title: string; owner: string | null; due: string | null; status: TaskStatus; dependsOn: string | null; blocker: string | null; milestone?: string }
export interface Person { name: string; role: string }
export interface Note { when: string; from: string; text: string }

export interface FScenario {
  id: string
  name: string
  client: string
  today: string
  goLive: string
  people: Person[]
  tasks: FTask[]
  status: ProjectStatus
  milestones: { name: string; date: string }[]
  notifications: Note[]
  brief: string
  goals: Record<GoalId, { title: string; guide: string; done: string }>
  expect: {
    status: ProjectStatus
    blockerTask: string; blockerWords: string[]; sampleBlocker: string
    assignTask: string; ownerOk: string[]; dueMax: string
    dep: [string, string]
    escalateSeverity: 'High'; escalateTo: string
    updateWords: string[][]; updateMax: number
  }
  otherProject: { name: string; status: ProjectStatus; note: string }[]
}

export const GOAL_ORDER: GoalId[] = ['status', 'blocker', 'assign', 'dependency', 'escalate', 'update']

export const vendorApi: FScenario = {
  id: 'harbor-portal',
  name: 'Harbor Portal Launch',
  client: 'Harbor Retail (fictional)',
  today: '2025-03-10',
  goLive: '2025-04-04',
  brief: 'You have just joined the Harbor Portal Launch. The team is falling behind because the vendor has not yet provided sandbox access to the Inventory API. Maya (engagement manager) has asked you to bring FlowBoard up to date before Wednesday’s client call.',
  people: [
    { name: 'Maya Chen', role: 'Engagement manager' },
    { name: 'Alex Rivera', role: 'Analyst' },
    { name: 'Jordan Lee', role: 'Consultant (you)' },
    { name: 'Dana Whitfield', role: 'Client sponsor' },
  ],
  status: 'On track',
  milestones: [
    { name: 'API integration complete', date: '2025-03-21' },
    { name: 'User acceptance testing', date: '2025-03-28' },
    { name: 'Go-live', date: '2025-04-04' },
  ],
  tasks: [
    { id: 't1', title: 'Obtain vendor Inventory API sandbox access', owner: 'Alex Rivera', due: '2025-03-05', status: 'In progress', dependsOn: null, blocker: null, milestone: 'API integration complete' },
    { id: 't2', title: 'Build inventory data connector', owner: 'Alex Rivera', due: '2025-03-19', status: 'Not started', dependsOn: null, blocker: null, milestone: 'API integration complete' },
    { id: 't3', title: 'Prepare user acceptance test scripts', owner: null, due: null, status: 'Not started', dependsOn: null, blocker: null, milestone: 'User acceptance testing' },
    { id: 't4', title: 'Draft stakeholder training notes', owner: 'Jordan Lee', due: '2025-03-26', status: 'In progress', dependsOn: null, blocker: null },
  ],
  notifications: [
    { when: 'Today 08:12', from: 'FlowBoard', text: 'Task “Obtain vendor Inventory API sandbox access” is 5 days overdue.' },
    { when: 'Today 09:40', from: 'Alex Rivera', text: 'Still no reply from the vendor’s integration team. I have emailed twice and called once.' },
    { when: 'Yesterday', from: 'Maya Chen', text: 'Please update the project before Wednesday’s call with Dana. UAT scripts have no owner yet.' },
  ],
  goals: {
    status: { title: 'Update the project status', guide: 'Open the status menu in the project header. A project with an overdue critical task and a milestone 11 days away is not “On track”. Choose the status that matches the evidence.', done: 'Status reflects the delay. This lets the client see risk early.' },
    blocker: { title: 'Document the blocker', guide: 'Open the overdue API access task and add a blocker. A good blocker states what is blocked, why, what has been tried and the impact on dates.', done: 'Blocker documented with cause, attempts and impact.' },
    assign: { title: 'Assign an owner and deadline', guide: 'The UAT scripts have no owner or due date. Assign a team member and a date that falls before the 28 March testing milestone.', done: 'UAT scripts have a clear owner and a realistic date.' },
    dependency: { title: 'Identify a dependency', guide: 'The connector cannot be built until sandbox access exists. On the connector task, set “Depends on” to the access task.', done: 'Dependency recorded, so the schedule impact is visible.' },
    escalate: { title: 'Escalate the delivery risk', guide: 'Open “Raise risk”. Rate the severity and send it to the person who can act on it: the engagement manager, not the whole team.', done: 'Risk escalated at the right level to the right person.' },
    update: { title: 'Write a concise status update', guide: 'Write a short update (under 70 words) with: status, the blocker and its impact, what you have done, and the decision you need.', done: 'Update is concise and contains what readers need.' },
  },
  expect: {
    status: 'At risk',
    sampleBlocker: 'Vendor has not provided sandbox access. We emailed and called twice; this delays the connector and puts the 21 March integration milestone at risk.',
    blockerTask: 't1', blockerWords: ['vendor', 'sandbox|access|api', 'email|called|contact|follow', 'connector|delay|go-live|milestone|21|impact'],
    assignTask: 't3', ownerOk: ['Alex Rivera', 'Jordan Lee'], dueMax: '2025-03-26',
    dep: ['t2', 't1'],
    escalateSeverity: 'High', escalateTo: 'Maya Chen',
    updateWords: [['at risk'], ['vendor|sandbox|api'], ['connector|milestone|go-live|21 march|march 21'], ['decision|need|request|approve|escalat|ask']], updateMax: 70,
  },
  otherProject: [
    { name: 'Northwind Onboarding Portal', status: 'On track', note: '3 tasks due this week' },
    { name: 'Orchard Analytics Refresh', status: 'At risk', note: 'Data access pending' },
  ],
}

export const supplierCatalog: FScenario = {
  id: 'summit-catalog',
  name: 'Summit Supplier Catalog Migration',
  client: 'Summit Foods (fictional)',
  today: '2025-06-09',
  goLive: '2025-07-11',
  brief: 'You are covering for a colleague on a different project. Product images from the supplier have not arrived, and the team is unsure who owns the pricing check. Update FlowBoard without step-by-step guidance.',
  people: [
    { name: 'Rosa Patel', role: 'Engagement manager' },
    { name: 'Sam Okafor', role: 'Data specialist' },
    { name: 'Lee Nakamura', role: 'Consultant (you)' },
    { name: 'Greta Holm', role: 'Client sponsor' },
  ],
  status: 'On track',
  milestones: [
    { name: 'Content ready', date: '2025-06-20' },
    { name: 'Client review', date: '2025-06-27' },
    { name: 'Go-live', date: '2025-07-11' },
  ],
  tasks: [
    { id: 's1', title: 'Receive supplier product images', owner: 'Sam Okafor', due: '2025-06-04', status: 'In progress', dependsOn: null, blocker: null, milestone: 'Content ready' },
    { id: 's2', title: 'Import and tag catalog content', owner: 'Sam Okafor', due: '2025-06-18', status: 'Not started', dependsOn: null, blocker: null, milestone: 'Content ready' },
    { id: 's3', title: 'Pricing accuracy check', owner: null, due: null, status: 'Not started', dependsOn: null, blocker: null, milestone: 'Client review' },
    { id: 's4', title: 'Prepare client review pack', owner: 'Lee Nakamura', due: '2025-06-25', status: 'Not started', dependsOn: null, blocker: null },
  ],
  notifications: [
    { when: 'Today 07:55', from: 'FlowBoard', text: 'Task “Receive supplier product images” is 5 days overdue.' },
    { when: 'Today 10:05', from: 'Sam Okafor', text: 'Supplier says images will follow “soon”. I have chased by email and phone.' },
    { when: 'Yesterday', from: 'Rosa Patel', text: 'Pricing accuracy check has no owner. I need this resolved before the client review.' },
  ],
  goals: {
    status: { title: 'Update the project status', guide: '', done: 'Status reflects the evidence.' },
    blocker: { title: 'Document the blocker', guide: '', done: 'Blocker documented.' },
    assign: { title: 'Assign an owner and deadline', guide: '', done: 'Owner and date set.' },
    dependency: { title: 'Identify a dependency', guide: '', done: 'Dependency recorded.' },
    escalate: { title: 'Escalate the delivery risk', guide: '', done: 'Risk escalated.' },
    update: { title: 'Write a concise status update', guide: '', done: 'Update is concise and complete.' },
  },
  expect: {
    status: 'At risk',
    sampleBlocker: 'Supplier has not sent product images. Sam emailed and phoned twice; this delays the content import and puts the 20 June milestone at risk.',
    blockerTask: 's1', blockerWords: ['supplier', 'image', 'email|called|contact|chased|follow', 'import|content|delay|milestone|20|impact'],
    assignTask: 's3', ownerOk: ['Sam Okafor', 'Lee Nakamura'], dueMax: '2025-06-25',
    dep: ['s2', 's1'],
    escalateSeverity: 'High', escalateTo: 'Rosa Patel',
    updateWords: [['at risk'], ['supplier|image'], ['import|content|milestone|go-live|20 june|june 20'], ['decision|need|request|approve|escalat|ask']], updateMax: 70,
  },
  otherProject: [
    { name: 'Alder Finance Reporting', status: 'On track', note: 'Next milestone in 12 days' },
    { name: 'Bayside HR Intranet', status: 'Off track', note: 'Scope change pending' },
  ],
}
