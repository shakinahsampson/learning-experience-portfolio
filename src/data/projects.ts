export type Category =
  | 'Onboarding'
  | 'Instructional Design'
  | 'Learning Operations'
  | 'Performance Enablement'
  | 'Digital Adoption'
  | 'Learning Analytics'

export const CATEGORIES: Category[] = [
  'Onboarding', 'Instructional Design', 'Learning Operations', 'Performance Enablement', 'Digital Adoption', 'Learning Analytics',
]

export interface Table { caption: string; head: string[]; rows: string[][] }
export interface Section {
  id: string
  heading: string
  paragraphs?: string[]
  bullets?: string[]
  tables?: Table[]
  faq?: { q: string; a: string }[]
}
export interface Resource { label: string; file: string }
export interface Project {
  slug: string
  name: string
  title: string
  categories: Category[]
  summary: string
  org: string
  audience: string
  tools: string
  labId: 'elevate' | 'launchpad' | 'coachforward' | 'insight360'
  objectives: string[]
  resources: Resource[]
  sections: Section[]
}

export const SIMULATION_NOTICE =
  'Independent simulated portfolio project. Organizations, people, data, and outcomes are fictional and illustrative — this is not client or employer work, and no real results are claimed.'

const elevate: Project = {
  slug: 'elevate',
  name: 'ELEVATE',
  title: '90-Day Consulting Employee Onboarding and Performance Enablement',
  categories: ['Onboarding', 'Performance Enablement', 'Instructional Design', 'Learning Operations'],
  summary:
    'A structured 90-day onboarding journey for a fictional management consulting firm, with an interactive learning module, role-based checklists, RACI, manager guides, and an evaluation plan.',
  org: 'Meridian Strategy Group (fictional management consulting firm)',
  audience: 'New consultants and new hires',
  tools: 'Backward design, ADDIE, adult learning principles, scenario-based learning, Kirkpatrick Levels 1–4',
  labId: 'elevate',
  objectives: [
    'Describe the 90-day onboarding journey and locate the resource for each phase (assessed in Lesson 1 knowledge check; target ≥ 80%).',
    'Identify three role-specific performance expectations and the evidence used to evaluate each (Lesson 2 check; target ≥ 80%).',
    'Select an appropriate response to five realistic first-month situations (scenario decisions; target ≥ 4 of 5 on first attempt).',
    'Draft a SMART 30-day plan with at least two measurable goals (reviewed with a checklist rubric).',
    'Apply a structured feedback request to a manager check-in (observed by manager at day 45).',
  ],
  resources: [
    { label: '90-day onboarding checklist (CSV)', file: 'downloads/elevate-90-day-onboarding-checklist.csv' },
    { label: 'RACI matrix (CSV)', file: 'downloads/elevate-raci-matrix.csv' },
    { label: 'Facilitator guide (Markdown)', file: 'downloads/elevate-facilitator-guide.md' },
    { label: 'Manager check-in guide (Markdown)', file: 'downloads/elevate-manager-checkin-guide.md' },
    { label: 'Email communications (Markdown)', file: 'downloads/elevate-email-templates.md' },
    { label: 'Project plan template (CSV)', file: 'downloads/project-plan-template.csv' },
  ],
  sections: [
    {
      id: 'challenge',
      heading: 'The challenge',
      paragraphs: [
        'Meridian Strategy Group, a fictional 400-person consulting firm, hires in cohorts of 10–25 consultants. In this scenario, each practice area onboards differently: some new hires receive a plan on day one, others find out what is expected of them in week three. Resources are scattered across shared drives, email threads, and individual notebooks, and nobody tracks whether onboarding is working.',
        'The business problem is four-fold: inconsistent experiences, unclear performance expectations, fragmented resources, and limited measurement. The performance goal for the simulated program is that new hires can contribute to a client team with confidence and understand how their performance is evaluated by day 90.',
      ],
    },
    {
      id: 'audience',
      heading: 'Audience analysis',
      paragraphs: [
        'Two primary groups were defined as design personas (fictional): experienced hires who know consulting but not Meridian’s methods, and early-career analysts who are new to client work. Both are adult learners with limited time, high expectations, and a preference for relevance over theory.',
      ],
      bullets: [
        'Prior knowledge varies widely, so each lesson opens with a short self-check and lets learners skip ahead.',
        'Time is scarce: modules are chunked into 10–15 minutes and mobile-friendly.',
        'Managers are the strongest influence on early performance, so manager guides are a deliverable, not an afterthought.',
        'Accessibility and caption needs are planned from the start rather than retrofitted.',
      ],
    },
    {
      id: 'analysis',
      heading: 'Analysis (ADDIE: Analyze)',
      paragraphs: [
        'The analysis would combine stakeholder interviews, an audit of existing materials, and a review of new-hire feedback. In this simulation the findings are assumed and clearly illustrative.',
      ],
      tables: [
        {
          caption: 'Simulated needs analysis summary',
          head: ['Finding (illustrative)', 'Root cause', 'Design response'],
          rows: [
            ['New hires unsure what “good” looks like', 'Expectations not documented by role', 'Role-based expectation sheets and examples; scenario decisions that model good judgment'],
            ['Resources hard to find', 'No single entry point', 'One onboarding hub and a phased resource map'],
            ['Managers vary in onboarding quality', 'No shared check-in structure', 'Manager check-in guide and calendar prompts'],
            ['No evidence of effectiveness', 'No data collected', 'Evaluation plan aligned to Kirkpatrick Levels 1–4'],
          ],
        },
      ],
    },
    {
      id: 'journey',
      heading: 'The 90-day onboarding journey',
      paragraphs: ['Backward design shaped the journey: the end-state performance at day 90 determined what must be learned and when.'],
      tables: [
        {
          caption: 'Journey by phase',
          head: ['Phase', 'Focus', 'Key experiences', 'Success indicator'],
          rows: [
            ['Preboarding (T-7 to Day 0)', 'Reduce anxiety; get ready', 'Welcome email, buddy intro, access provisioned, forms', 'Everything ready on Day 1'],
            ['Day one', 'Belonging and clarity', 'Welcome meeting, 90-day plan walkthrough, tool tour, team lunch', 'New hire can state top 3 priorities'],
            ['First week', 'Orientation and expectations', 'Orientation workshop, role expectations, shadowing', 'Expectations doc agreed with manager'],
            ['First 30 days', 'Foundations', 'Learning lessons 1–3, weekly 1:1s, 30-day pulse', 'Knowledge checks passed; pulse completed'],
            ['Days 31–60', 'Contribution', 'Lead a work product, mid-point conversation, networking', 'Feedback received and applied'],
            ['Days 61–90', 'Independence and review', 'Final assessment, 90-day review, Level 1–3 evaluation', 'Review documented; goals for next quarter'],
          ],
        },
      ],
    },
    {
      id: 'design',
      heading: 'Design decisions (how the frameworks shaped the work)',
      bullets: [
        'Backward design: I wrote the day-90 performance outcomes and assessment evidence first, then planned lessons only for what supports them. Content that did not support an outcome was cut.',
        'Adult learning principles: learners choose their path in Lesson 1 (self-direction), scenarios use realistic consulting situations (relevance and experience), and each lesson ends with an action to try this week (problem-centered).',
        'Scenario-based learning: decisions are modeled on first-month dilemmas — for example, how to respond to an unclear client request — with feedback that explains the reasoning, not just right or wrong.',
        'Kirkpatrick: the evaluation plan was written before development so each objective maps to a measure (see Evaluation).',
        'Cognitive load: each screen has one task; job aids carry reference detail so learners do not memorize it.',
      ],
      tables: [
        {
          caption: 'Objectives → assessment → activity alignment',
          head: ['Objective', 'Assessment evidence', 'Learning activity'],
          rows: [
            ['Describe the 90-day journey', 'Lesson 1 knowledge check', 'Interactive journey timeline'],
            ['Identify expectations and evidence', 'Lesson 2 knowledge check', 'Role expectation sort and discussion'],
            ['Select appropriate actions', 'Scenario decisions + final assessment', 'Branching first-month scenarios'],
            ['Draft SMART 30-day plan', 'Rubric', '30-day plan template with peer review'],
            ['Request and use feedback', 'Manager observation at day 45', 'Feedback request practice and manager check-in guide'],
          ],
        },
      ],
    },
    {
      id: 'checklist',
      heading: 'Role-based onboarding checklist',
      paragraphs: ['A fuller version is downloadable as CSV. Owners are roles, so the checklist can be reused across practice areas.'],
      tables: [
        {
          caption: 'Checklist excerpt',
          head: ['Phase', 'Owner', 'Task', 'Due'],
          rows: [
            ['Preboarding', 'People Ops', 'Send welcome email and first-day logistics', 'T-7 days'],
            ['Preboarding', 'IT', 'Provision laptop and accounts', 'T-3 days'],
            ['Day 1', 'Manager', 'Welcome meeting and 90-day plan walkthrough', 'Day 1'],
            ['Week 1', 'Manager', 'Clarify role expectations and success measures', 'Day 3'],
            ['Days 8–30', 'L&D', 'Send 30-day pulse survey', 'Day 30'],
            ['Days 31–60', 'Manager', 'Mid-point performance conversation', 'Day 45'],
            ['Days 61–90', 'Manager', '90-day performance review', 'Day 88'],
          ],
        },
      ],
    },
    {
      id: 'raci',
      heading: 'Stakeholder and RACI matrix',
      paragraphs: ['R = Responsible, A = Accountable, C = Consulted, I = Informed. One accountable owner per activity.'],
      tables: [
        {
          caption: 'RACI (excerpt)',
          head: ['Activity', 'New hire', 'Manager', 'Buddy', 'L&D', 'People Ops', 'IT', 'Practice lead'],
          rows: [
            ['Preboarding communications', 'I', 'C', 'I', 'C', 'R', 'I', 'A'],
            ['Orientation workshop delivery', 'I', 'C', 'I', 'R', 'C', 'I', 'A'],
            ['Weekly 1:1 check-ins', 'R', 'R', 'C', 'I', 'I', 'I', 'A'],
            ['90-day performance review', 'R', 'R', 'I', 'C', 'C', 'I', 'A'],
            ['Evaluation data collection', 'C', 'C', 'I', 'R', 'C', 'I', 'A'],
          ],
        },
      ],
    },
    {
      id: 'timeline',
      heading: 'Project timeline (12 weeks to build and pilot)',
      tables: [
        {
          caption: 'Development timeline',
          head: ['Weeks', 'ADDIE phase', 'Activities', 'Deliverable'],
          rows: [
            ['1–2', 'Analyze', 'Stakeholder interviews, audit, audience profile', 'Needs analysis summary'],
            ['3–4', 'Design', 'Objectives, assessment blueprint, storyboards', 'Design document'],
            ['5–8', 'Develop', 'Build module, job aids, communications; SME and accessibility review', 'Working prototype'],
            ['9–10', 'Implement', 'Pilot with small group; manager briefing; launch', 'Pilot feedback'],
            ['11–12', 'Evaluate', 'Level 1–2 review, retrospective', 'Evaluation summary and backlog'],
          ],
        },
      ],
    },
    {
      id: 'orientation',
      heading: 'Orientation schedule',
      tables: [
        {
          caption: 'Day-one and week-one schedule',
          head: ['Time', 'Day 1', 'Week 1 highlights'],
          rows: [
            ['09:00', 'Welcome with manager; 90-day plan', 'Day 2: role expectations workshop'],
            ['10:30', 'Tools tour with buddy', 'Day 3: expectations agreement with manager'],
            ['12:00', 'Team lunch', 'Day 4: orientation workshop (3 hours)'],
            ['13:30', 'Orientation module 1: How we work', 'Day 5: shadow client-prep sessions; reflection'],
            ['16:00', 'End-of-day check-in', 'End of week: pulse of three questions'],
          ],
        },
      ],
    },
    {
      id: 'facilitator',
      heading: 'Facilitator preparation guide',
      bullets: [
        'T-5 days: confirm roster, accommodations, and virtual or room set-up.',
        'T-4 days: tailor examples to participant roles.',
        'T-2 days: test slides, breakouts, captions, and polls.',
        'T-1 day: share job aids and brief guest managers on timing.',
        'Session: open the room early, set norms, and use pair talk before cold-calling.',
        'After: send resources in 24 hours and log exit-ticket themes in the improvement backlog.',
      ],
      paragraphs: ['The full guide with agenda and debrief questions is downloadable below.'],
    },
    {
      id: 'comms',
      heading: 'Email communications',
      bullets: [
        'Preboarding welcome (T-7): sets expectations and names the buddy.',
        'Day-one agenda (T-1): reduces first-day uncertainty.',
        '30-day pulse invitation: short, confidential, explains how feedback is used.',
        'Manager reminder (Day 40): prompts the mid-point conversation.',
        '90-day wrap-up: invites reflection and the final assessment.',
      ],
      paragraphs: ['Sample templates are downloadable.'],
    },
    {
      id: 'faq',
      heading: 'Onboarding FAQ',
      faq: [
        { q: 'Who do I ask if I’m not sure who to ask?', a: 'Start with your buddy. If they don’t know, they will point you to the right person. There are no bad questions in the first 90 days.' },
        { q: 'How is my performance evaluated?', a: 'Against role expectations agreed in week one, using the evidence listed in your 90-day plan. Review conversations happen at day 45 and day 88.' },
        { q: 'How long does the learning module take?', a: 'About 45–60 minutes in total, split into short lessons. Progress is saved in your browser (in this demo).' },
        { q: 'What if I fall behind?', a: 'Tell your manager early. The plan can be adjusted; what matters is that support is provided.' },
        { q: 'Can I request accommodations?', a: 'Yes. Contact People Ops or your manager at any time. Materials are designed for captions, keyboard navigation, and screen readers.' },
      ],
    },
    {
      id: 'performance',
      heading: 'Performance review cycle',
      tables: [
        {
          caption: 'Review cycle',
          head: ['When', 'Conversation', 'Inputs', 'Output'],
          rows: [
            ['Week 1', 'Expectations agreement', 'Role expectation sheet', 'Signed-off 90-day plan'],
            ['Weekly', '1:1 check-in (30 min)', 'Plan, commitments, obstacles', 'Two priorities for next week'],
            ['Day 45', 'Mid-point conversation', 'Work product feedback, peer input', 'Updated goals and development focus'],
            ['Day 88', '90-day review', 'Evidence, final assessment, self-reflection', 'Documented review and next-quarter goals'],
          ],
        },
      ],
    },
    {
      id: 'checkin',
      heading: 'Manager check-in guide',
      bullets: [
        'Connect (3 min), Progress (7), Obstacles (8), Feedback (7), Commit (5).',
        'Questions change by phase: clarity in week one, practice in the first month, application in month two, independence in month three.',
        'Follow up on red flags such as repeated missed commitments or missing access.',
      ],
    },
    {
      id: 'evaluation',
      heading: 'Evaluation plan',
      tables: [
        {
          caption: 'Kirkpatrick-aligned plan',
          head: ['Level', 'Question', 'Measure', 'Method / timing'],
          rows: [
            ['1 Reaction', 'Is onboarding relevant and usable?', 'Relevance rating (1–5); open comments', 'Exit ticket; 30-day pulse'],
            ['2 Learning', 'Can new hires apply what they learned?', 'Scenario-based assessment; checklist rubric for 30-day plan', 'Lesson checks; final assessment'],
            ['3 Behavior', 'Are they applying it?', 'Manager observation checklist', 'Day 45 and day 88'],
            ['4 Results', 'Is onboarding contributing to business goals?', 'Time-to-productivity, early retention (agreed before launch)', 'Quarterly; requires baseline and comparison before claiming impact'],
          ],
        },
      ],
      paragraphs: ['The plan separates what the program controls (Levels 1–2) from outcomes with many influences (Level 4), so results are not overclaimed.'],
    },
    {
      id: 'dashboard',
      heading: 'Simulated results dashboard',
      paragraphs: ['The Learning Lab includes a dashboard using explicitly synthetic data from a fictional pilot. It illustrates how results would be read and used; it does not describe real outcomes.'],
    },
    {
      id: 'deliverables',
      heading: 'Deliverables, constraints, and implementation',
      bullets: [
        'Deliverables: needs analysis, design document, objectives and assessment map, interactive module with final assessment, orientation guide, manager guide, communications, FAQ, evaluation plan, and dashboard prototype.',
        'Constraints (simulated): no budget for authoring tools, no LMS, a hard 12-week timeline, and SME availability limited to two hours a week. These led to a lightweight browser-based build and reusable templates.',
        'Implementation approach: pilot with one cohort, brief managers first, collect Level 1–2 data, iterate, then scale.',
      ],
    },
    {
      id: 'retrospective',
      heading: 'Retrospective',
      paragraphs: [
        'What worked: writing the evaluation plan before development kept the design focused and made it easy to cut nice-to-have content. Designing for managers as well as new hires acknowledged where most of the real influence sits.',
        'What I would change: the module covers many topics; with real stakeholders I would pilot a smaller core first. I would also test the feedback wording with real new hires before finalizing.',
        'Limits: this is a simulated project. I did not run it with real learners, and the dashboard data are synthetic. I draw on my experience designing curriculum, facilitating learning, and supporting colleague onboarding and learning technologies in education to make the scenarios realistic, but I do not claim corporate HR experience.',
      ],
    },
  ],
}

const launchpad: Project = {
  slug: 'launchpad',
  name: 'LAUNCHPAD',
  title: 'Digital Adoption and Change Enablement',
  categories: ['Digital Adoption', 'Instructional Design', 'Performance Enablement'],
  summary:
    'A 20-minute interactive microlearning course for employees adopting a new internal project management platform: workflow simulation, guided practice, branching troubleshooting, and a quick-reference job aid.',
  org: 'Fictional internal platform “FlowBoard”',
  audience: 'Employees and team leads moving from spreadsheets and email to a new project management platform',
  tools: 'ADDIE, ADKAR-informed change enablement, microlearning, simulation, branching scenarios',
  labId: 'launchpad',
  objectives: [
    'Update a project’s status with an accurate summary in the simulated platform.',
    'Identify and flag a blocker with the needed information and owner.',
    'Assign a single accountable owner and due date to a task.',
    'Select the right escalation path for a risk based on severity and timing.',
    'Choose an appropriate troubleshooting action when a workflow fails.',
  ],
  resources: [
    { label: 'Quick-reference job aid (Markdown)', file: 'downloads/launchpad-quick-reference-job-aid.md' },
    { label: 'Project plan template (CSV)', file: 'downloads/project-plan-template.csv' },
    { label: 'Evaluation plan template (CSV)', file: 'downloads/kirkpatrick-evaluation-plan-template.csv' },
  ],
  sections: [
    {
      id: 'problem',
      heading: 'Problem and context',
      paragraphs: [
        'A fictional company is moving project tracking from spreadsheets and email to a new platform. Leaders worry that adoption will be uneven: people may keep using old tools, update statuses inconsistently, or avoid the platform when something goes wrong.',
        'The goal is not to teach every feature. It is to enable four high-frequency tasks that make the platform worth using: update status, flag blockers, assign owners, and escalate risks.',
      ],
    },
    {
      id: 'addie',
      heading: 'ADDIE process in this project',
      tables: [
        {
          caption: 'ADDIE applied',
          head: ['Phase', 'What happened (simulated)', 'Decision it influenced'],
          rows: [
            ['Analyze', 'Task analysis of the four workflows; assumed barriers: habit, fear of visibility, uncertainty when errors appear', 'Focus on four tasks; add confidence-building troubleshooting'],
            ['Design', 'Objectives with observable verbs; 20-minute limit; simulation over screenshots', 'Practice in a safe simulated interface'],
            ['Develop', 'Built simulation, branching scenarios, job aid, comms and support plan', 'Job aid mirrors simulation steps'],
            ['Implement', 'Three-wave rollout with champions and office hours', 'Support plan sized to adoption curve'],
            ['Evaluate', 'Level 1–3 measures plus platform usage indicators', 'Distinguish learning from adoption outcomes'],
          ],
        },
      ],
    },
    {
      id: 'change',
      heading: 'Change-management rationale',
      paragraphs: [
        'Adoption is a behavior change, not a training event. I used an ADKAR-informed lens (Awareness, Desire, Knowledge, Ability, Reinforcement) to decide what each part of the program should do.',
      ],
      bullets: [
        'Awareness and Desire: the communication plan explains why the change is happening and what is in it for each role.',
        'Knowledge and Ability: the microlearning gives hands-on practice with the four tasks.',
        'Reinforcement: champions, office hours, and a job aid reduce relapse into old habits.',
        'Training alone does not fix a poorly configured tool or a leader who ignores the platform; the support plan names those risks.',
      ],
    },
    {
      id: 'pathway',
      heading: 'Learning pathway (about 20 minutes)',
      tables: [
        {
          caption: 'Course outline',
          head: ['Segment', 'Minutes', 'Interaction'],
          rows: [
            ['Why this matters and objectives', '2', 'Pick the goal most relevant to you'],
            ['Workflow simulation: status, blocker, owner, escalate', '8', 'Click-through simulation with guided hints'],
            ['Guided practice', '4', 'Complete tasks with feedback'],
            ['Troubleshooting branches', '4', 'Branching decisions'],
            ['Knowledge check and job aid', '2', 'Scored check; downloadable reference'],
          ],
        },
      ],
    },
    {
      id: 'comms',
      heading: 'Communication plan',
      tables: [
        {
          caption: 'Communications (simulated)',
          head: ['When', 'Audience', 'Message', 'Channel'],
          rows: [
            ['T-4 weeks', 'All employees', 'Why we’re changing; timeline; what to expect', 'Email + all-hands'],
            ['T-2 weeks', 'Team leads', 'Their role; how to support the team', 'Briefing'],
            ['Launch', 'All employees', 'Start here: 20-minute course and job aid', 'Intranet + email'],
            ['Week 2', 'All employees', 'Quick wins and tips from champions', 'Newsletter'],
            ['Week 6', 'Team leads', 'Usage snapshot and next steps', 'Team meeting'],
          ],
        },
      ],
    },
    {
      id: 'support',
      heading: 'Adoption support plan',
      bullets: [
        'Champions: one volunteer per team with extra practice and a direct line to the platform admin.',
        'Office hours: twice weekly for the first four weeks, tapering after.',
        'Job aid: one-page quick reference linked from the platform home.',
        'Feedback loop: a short form for “what confused me”, reviewed weekly.',
        'Leader behavior: leaders run weekly reviews from the platform, not from separate spreadsheets.',
      ],
    },
    {
      id: 'evaluation',
      heading: 'Evaluation strategy',
      tables: [
        {
          caption: 'Evaluation measures',
          head: ['Level', 'Measure', 'Note'],
          rows: [
            ['1 Reaction', 'Confidence rating before/after; usability comments', 'Collected in course'],
            ['2 Learning', 'Task completion and knowledge check score', 'Collected in course'],
            ['3 Behavior', 'Share of projects with a status updated in the past 7 days; blockers logged with owner', 'Platform usage data (privacy-aware, aggregated)'],
            ['4 Results', 'Reduced status-meeting time; faster risk escalation', 'Requires baseline; avoid claiming causation from training alone'],
          ],
        },
      ],
    },
    {
      id: 'retrospective',
      heading: 'Retrospective',
      paragraphs: [
        'What worked: a safe simulation with immediate hints gives the confidence that reading documentation does not. Branching troubleshooting addresses the moment when many people abandon new tools.',
        'What I would change: with real data I would segment by role since team leads and contributors need different practice. The simulation represents a fictional interface; a real project would need validation with the real platform and users.',
        'Limits: simulated project; no real adoption results are claimed.',
      ],
    },
  ],
}

const coachforward: Project = {
  slug: 'coachforward',
  name: 'COACHFORWARD',
  title: 'Manager Feedback and Performance Conversations',
  categories: ['Performance Enablement', 'Instructional Design'],
  summary:
    'A scenario-based learning experience for first-time people managers: choose responses in feedback conversations, see branching outcomes, get coaching, and retry.',
  org: 'Fictional learning experience; no company is represented',
  audience: 'First-time people managers (fictional audience)',
  tools: 'Scenario-based learning, S-B-I-A feedback model, deliberate practice, Kirkpatrick Levels 1–3',
  labId: 'coachforward',
  objectives: [
    'Open a feedback conversation by stating its purpose and positive intent.',
    'Describe an employee behavior using specific, observable facts rather than labels.',
    'Ask an open question to understand the employee’s perspective before offering solutions.',
    'Agree on one specific next step with a follow-up date.',
    'Reflect on one personal growth area using the conversation checklist.',
  ],
  resources: [
    { label: 'Feedback job aid (Markdown)', file: 'downloads/coachforward-feedback-job-aid.md' },
    { label: 'Performance conversation checklist (Markdown)', file: 'downloads/coachforward-conversation-checklist.md' },
    { label: 'Evaluation plan template (CSV)', file: 'downloads/kirkpatrick-evaluation-plan-template.csv' },
  ],
  sections: [
    {
      id: 'problem',
      heading: 'Problem statement',
      paragraphs: [
        'First-time managers often avoid hard conversations, deliver vague feedback, or jump to solutions. The result is unclear expectations and unaddressed performance issues. This project is a fictional design exercise; it is not a program I delivered in a corporate setting.',
        'My background in education — giving feedback to students and colleagues, and facilitating professional learning — informs the realism of the scenarios, but the context here is workplace management.',
      ],
    },
    {
      id: 'framework',
      heading: 'Feedback framework: S-B-I-A',
      paragraphs: ['I chose a simple, memorable four-step structure so managers can use it in the moment.'],
      tables: [
        {
          caption: 'S-B-I-A',
          head: ['Step', 'What the manager does', 'Example'],
          rows: [
            ['Situation', 'Names when and where', '“In Tuesday’s client meeting…”'],
            ['Behavior', 'States what was observed', '“…you interrupted the client twice.”'],
            ['Impact', 'Describes the effect', '“It made it hard for them to finish their point.”'],
            ['Ask / Agree', 'Invites their view; agrees next step', '“What was happening? What could you try next time?”'],
          ],
        },
      ],
    },
    {
      id: 'design',
      heading: 'Design rationale',
      bullets: [
        'Deliberate practice: managers rarely get safe practice at difficult conversations. Branching scenarios provide repeatable attempts with consequences.',
        'Feedback that coaches: each choice leads to a realistic employee response and a coaching note that explains why.',
        'Retry by design: learners are encouraged to explore less effective choices and see the contrast.',
        'Backward design: the final assessment measures the same behaviors as the objectives.',
      ],
    },
    {
      id: 'pathway',
      heading: 'Learning pathway',
      tables: [
        {
          caption: 'Pathway',
          head: ['Step', 'Activity', 'Time'],
          rows: [
            ['1', 'Pre-reflection: how comfortable am I with feedback?', '3 min'],
            ['2', 'Framework introduction and example', '5 min'],
            ['3', 'Branching scenario with three decision points', '10 min'],
            ['4', 'Retry and compare outcomes', '5 min'],
            ['5', 'Knowledge assessment', '5 min'],
            ['6', 'Reflection and reinforcement commitments', '5 min'],
          ],
        },
      ],
    },
    {
      id: 'accessibility',
      heading: 'Accessibility considerations',
      bullets: [
        'All interactions work with keyboard and screen readers; choices are real buttons.',
        'Feedback never relies on color alone; icons and text labels accompany status.',
        'Scenarios use plain language and avoid idioms that are hard to translate.',
        'Reflection responses are optional to share and stay on the learner’s device.',
      ],
    },
    {
      id: 'reinforcement',
      heading: 'Reinforcement plan',
      tables: [
        {
          caption: 'Reinforcement',
          head: ['When', 'Action'],
          rows: [
            ['Day 2', 'Email with the job aid and a prompt to schedule a feedback conversation'],
            ['Week 1', 'Peer pair: practice one conversation using S-B-I-A'],
            ['Week 3', 'Micro-refresher: one new scenario'],
            ['Week 6', 'Manager reflection and follow-up check-in with their own manager'],
          ],
        },
      ],
    },
    {
      id: 'evaluation',
      heading: 'Evaluation measures',
      tables: [
        {
          caption: 'Evaluation',
          head: ['Level', 'Measure'],
          rows: [
            ['1 Reaction', 'Relevance and confidence ratings'],
            ['2 Learning', 'Scenario choices and assessment score; improvement on retry'],
            ['3 Behavior', 'Self-reported use of S-B-I-A at 30 days; employee pulse question on clarity of feedback (aggregated)'],
            ['4 Results', 'Not measured directly; consider team engagement trends with caution about causation'],
          ],
        },
      ],
    },
    {
      id: 'retrospective',
      heading: 'Retrospective',
      paragraphs: [
        'The branching model is simple by design. Real conversations are more varied, and a real program should include live practice with a coach. I would test scenarios with experienced managers to improve realism. No learners have taken this program; the outcomes are illustrative.',
      ],
    },
  ],
}

const insight360: Project = {
  slug: 'insight360',
  name: 'INSIGHT360',
  title: 'Learning Analytics and Program Evaluation',
  categories: ['Learning Analytics', 'Learning Operations'],
  summary:
    'An interactive dashboard and case study built on a clearly labeled synthetic dataset of 72 learner records: enrollment, completion, assessment gains, satisfaction, cohort participation, data quality checks, and executive recommendations.',
  org: 'Fictional learning organization; fully synthetic data',
  audience: 'L&D leaders and program owners',
  tools: 'Kirkpatrick Levels 1–4, data quality checks, privacy-by-design, executive communication',
  labId: 'insight360',
  objectives: [
    'Calculate and interpret enrollment, completion, and assessment-gain metrics.',
    'Compare cohorts and identify patterns worth investigating.',
    'Identify data quality problems before drawing conclusions.',
    'Distinguish learning metrics from business outcomes.',
    'Draft executive recommendations that match the strength of evidence.',
  ],
  resources: [
    { label: 'Synthetic learner dataset (CSV)', file: 'downloads/insight360-synthetic-learners.csv' },
    { label: 'One-page executive summary (Markdown)', file: 'downloads/insight360-executive-summary.md' },
    { label: 'Evaluation plan template (CSV)', file: 'downloads/kirkpatrick-evaluation-plan-template.csv' },
  ],
  sections: [
    {
      id: 'question',
      heading: 'The question',
      paragraphs: [
        'A fictional L&D leader needs to know whether three programs are working and where to invest next. The case shows how I would structure that analysis and communicate it to executives.',
        'My own analytic experience comes from analyzing learning outcomes in education settings; this project translates that practice to a corporate L&D context using synthetic data.',
      ],
    },
    {
      id: 'data',
      heading: 'About the dataset',
      paragraphs: [
        'The dataset has 72 synthetic learner records across three fictional programs and six cohorts, generated with a fixed random seed (scripts/generate-data.mjs). No real person is represented. Three data problems were injected on purpose to demonstrate quality checks.',
      ],
      tables: [
        {
          caption: 'Data dictionary',
          head: ['Field', 'Definition'],
          rows: [
            ['learner_id', 'Synthetic pseudonymous identifier (SYN-###)'],
            ['program / cohort', 'Fictional program and start cohort'],
            ['completed', 'Yes if the learner finished all required activities'],
            ['participation_pct', 'Share of required activities attempted (0–100)'],
            ['pre_score / post_score', 'Assessment scores out of 100 before and after the program'],
            ['satisfaction_1_5', 'Post-program rating (1 = very dissatisfied, 5 = very satisfied)'],
            ['manager_observed_application', 'Whether a manager observed the learner applying skills (Yes / Not yet)'],
          ],
        },
      ],
    },
    {
      id: 'privacy',
      heading: 'Privacy considerations',
      bullets: [
        'Use pseudonymous IDs; keep the key separate from analysis files.',
        'Report in aggregate and suppress groups smaller than about 10 in real data.',
        'Collect only data needed to answer the evaluation questions.',
        'Be transparent with learners about what is collected and who sees it.',
        'Do not use learning data for unrelated performance decisions without clear policy and consent.',
      ],
    },
    {
      id: 'learning-vs-business',
      heading: 'Learning metrics versus business outcomes',
      paragraphs: [
        'Completion, scores, and satisfaction are learning metrics (Kirkpatrick Levels 1–2, with application at Level 3). They do not show that the program improved productivity, retention, or revenue.',
        'A pre/post gain shows learners know more after the program. It does not show the program caused the gain: learners may have improved through experience, and without a comparison group or a baseline we cannot rule that out. A Level 4 claim would need a pre-agreed business measure, a baseline, and ideally a comparison group.',
      ],
    },
    {
      id: 'recommendations',
      heading: 'Executive recommendations (illustrative)',
      bullets: [
        'Investigate lower-engagement cohorts with learner and manager conversations before changing content.',
        'Add manager reinforcement prompts to raise on-the-job application.',
        'Fix data capture: require a post-assessment before marking completion; validate percentage fields; enforce unique IDs.',
        'Design a Level 4 study with a baseline and comparison group before claiming business impact.',
      ],
    },
    {
      id: 'retrospective',
      heading: 'Retrospective',
      paragraphs: [
        'Synthetic data cannot teach real-world messiness such as missing records across systems. Next, I would add confidence intervals and a small-group suppression rule to the dashboard. The numbers shown are illustrative only.',
      ],
    },
  ],
}

export const PROJECTS: Project[] = [elevate, launchpad, coachforward, insight360]
export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug)
