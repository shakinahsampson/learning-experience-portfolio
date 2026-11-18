#!/usr/bin/env python3
"""Generate branded PDF, DOCX and XLSX resources into public/downloads/.

Run: python3 scripts/build-resources.py
Requires: reportlab, python-docx, openpyxl. All content is fictional/synthetic.
Insight360 figures are computed from src/data/learners.json.
"""
import json, os, datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle, ListFlowable, ListItem, KeepTogether
from docx import Document
from docx.shared import Pt, RGBColor
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.formatting.rule import CellIsRule, FormulaRule, DataBarRule
from openpyxl.worksheet.datavalidation import DataValidation

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'downloads')
SAGE9, SAGE7, SAGE1 = colors.HexColor('#2f4a3c'), colors.HexColor('#3f6350'), colors.HexColor('#eef3ee')
CHAR, GOLD, WARM = colors.HexColor('#2b2b2b'), colors.HexColor('#8a6d1f'), colors.HexColor('#5f574d')
NOTE = 'Independent fictional portfolio simulation by Shakinah Sampson. Not a real client or employer; no real outcomes are represented.'

# ---------- Document spec renderers ----------
def pdf(fname, title, subtitle, spec, compact=False):
    fs = 8.3 if compact else 10
    ld = fs * 1.32
    body = ParagraphStyle('b', fontName='Helvetica', fontSize=fs, leading=ld, textColor=CHAR, spaceAfter=3 if compact else 5)
    h1 = ParagraphStyle('h1', fontName='Times-Bold', fontSize=22 if not compact else 17, leading=26 if not compact else 20, textColor=SAGE9)
    sub = ParagraphStyle('s', fontName='Times-Italic', fontSize=11 if not compact else 9.5, leading=14, textColor=WARM, spaceAfter=4)
    h2 = ParagraphStyle('h2', fontName='Times-Bold', fontSize=14 if not compact else 11.5, leading=17 if not compact else 13, textColor=SAGE9, spaceBefore=8 if not compact else 5, spaceAfter=3)
    cell = ParagraphStyle('c', parent=body, fontSize=fs - 0.8, leading=(fs - 0.8) * 1.28, spaceAfter=0)
    cellh = ParagraphStyle('ch', parent=cell, fontName='Helvetica-Bold', textColor=colors.white)
    m = 0.55 * inch if compact else 0.8 * inch
    path = os.path.join(OUT, fname)

    def footer(c, d):
        c.saveState(); c.setFont('Helvetica', 7.5); c.setFillColor(WARM)
        c.drawString(m, 0.4 * inch, 'Independent fictional portfolio simulation. No real client or outcomes.')
        c.drawRightString(letter[0] - m, 0.4 * inch, f'{title}  |  Page {d.page}')
        c.setStrokeColor(GOLD); c.setLineWidth(0.8); c.line(m, letter[1] - 0.42 * inch, letter[0] - m, letter[1] - 0.42 * inch)
        c.restoreState()
    doc = BaseDocTemplate(path, pagesize=letter, leftMargin=m, rightMargin=m, topMargin=0.6 * inch, bottomMargin=0.65 * inch, title=title, author='Shakinah Sampson', subject=subtitle, lang='en-US') if False else BaseDocTemplate(path, pagesize=letter, title=title, author='Shakinah Sampson', subject=subtitle)
    doc.addPageTemplates([PageTemplate(id='p', frames=[Frame(m, 0.65 * inch, letter[0] - 2 * m, letter[1] - 1.25 * inch, id='f', leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)], onPage=footer)])
    width = letter[0] - 2 * m
    story = [Paragraph(title, h1), Paragraph(subtitle, sub)]
    for it in spec:
        k = it[0]
        if k == 'h2': story.append(Paragraph(it[1], h2))
        elif k == 'p': story.append(Paragraph(it[1], body))
        elif k == 'ul':
            story.append(ListFlowable([ListItem(Paragraph(t, body), leftIndent=12) for t in it[1]], bulletType='bullet', start='•', leftIndent=12, bulletFontSize=fs))
        elif k == 'table':
            head, rows = it[1], it[2]
            n = len(head)
            cw = it[3] if len(it) > 3 else [width / n] * n
            cw = [w * width / sum(cw) for w in cw]
            data = [[Paragraph(h, cellh) for h in head]] + [[Paragraph(str(c), cell) for c in r] for r in rows]
            t = Table(data, colWidths=cw, repeatRows=1)
            t.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, 0), SAGE7), ('GRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#c9d3c9')), ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                                   ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, SAGE1]), ('TOPPADDING', (0, 0), (-1, -1), 2.5), ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5)]))
            story += [t, Spacer(1, 4)]
        elif k == 'chips':
            data = [[Paragraph(f'<b>{l}</b>', ParagraphStyle('x', parent=cell, textColor=colors.white, alignment=1)) for l, _ in it[1]]]
            t = Table(data, colWidths=[width / len(it[1])] * len(it[1]))
            t.setStyle(TableStyle([('BACKGROUND', (i, 0), (i, 0), colors.HexColor(c)) for i, (_, c) in enumerate(it[1])] + [('BOX', (0, 0), (-1, -1), 0.5, colors.white), ('INNERGRID', (0, 0), (-1, -1), 2, colors.white)]))
            story += [t, Spacer(1, 4)]
        elif k == 'box':
            t = Table([[Paragraph(it[1], body)]], colWidths=[width])
            t.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), SAGE1), ('BOX', (0, 0), (-1, -1), 0.8, SAGE7), ('LEFTPADDING', (0, 0), (-1, -1), 7), ('TOPPADDING', (0, 0), (-1, -1), 4), ('BOTTOMPADDING', (0, 0), (-1, -1), 4)]))
            story += [t, Spacer(1, 5)]
        elif k == 'break':
            from reportlab.platypus import PageBreak
            story.append(PageBreak())
    doc.build(story)
    from pypdf import PdfReader
    print(fname, 'pages:', len(PdfReader(path).pages))

def docx(fname, title, subtitle, spec):
    d = Document()
    d.core_properties.title = title; d.core_properties.author = 'Shakinah Sampson'
    st = d.styles['Normal']; st.font.name = 'Calibri'; st.font.size = Pt(11)
    h = d.add_heading(title, 0)
    for r in h.runs: r.font.color.rgb = RGBColor(0x2f, 0x4a, 0x3c)
    p = d.add_paragraph(subtitle); p.runs[0].italic = True
    d.add_paragraph(NOTE).runs[0].font.size = Pt(9)
    for it in spec:
        k = it[0]
        if k == 'h2': d.add_heading(it[1], 1)
        elif k in ('p', 'box'): d.add_paragraph(it[1].replace('<b>', '').replace('</b>', '').replace('<br/>', '\n'))
        elif k == 'ul':
            for t in it[1]: d.add_paragraph(t.replace('<b>', '').replace('</b>', ''), style='List Bullet')
        elif k == 'table':
            t = d.add_table(rows=1, cols=len(it[1])); t.style = 'Light Grid Accent 1'
            for i, hh in enumerate(it[1]): t.rows[0].cells[i].text = hh
            for r in it[2]:
                cs = t.add_row().cells
                for i, c in enumerate(r): cs[i].text = str(c).replace('<b>', '').replace('</b>', '')
            d.add_paragraph()
        elif k == 'break': d.add_page_break()
    d.save(os.path.join(OUT, fname)); print(fname)

# ---------- Synthetic data for Insight360 (computed) ----------
recs = json.load(open(os.path.join(ROOT, 'src/data/learners.json')))['records']
seen, cl = set(), []
for r in recs:
    if r['learner_id'] in seen or r['participation_pct'] > 100: continue
    seen.add(r['learner_id']); cl.append(r)
def avg(x): return sum(x) / len(x) if x else 0
def summ(rows):
    comp = [r for r in rows if r['completed'] == 'Yes']
    pairs = [r for r in rows if r['pre_score'] is not None and r['post_score'] is not None]
    obs = [r for r in comp if r['manager_observed_application'] in ('Yes', 'Not yet')]
    return dict(n=len(rows), comp=len(comp), rate=100 * len(comp) / len(rows), pre=avg([r['pre_score'] for r in pairs]), post=avg([r['post_score'] for r in pairs]), pairs=len(pairs),
                sat=avg([r['satisfaction_1_5'] for r in rows if r['satisfaction_1_5']]), app=100 * sum(r['manager_observed_application'] == 'Yes' for r in obs) / len(obs) if obs else 0)
S, R = summ(cl), summ(recs)

# ---------- Content ----------
LP = [
    ('p', 'FlowBoard is a <b>fictional</b> work-management platform used in the LAUNCHPAD simulation. Use this guide to practise the six core tasks before the independent challenge.'),
    ('h2', 'Core workflow'),
    ('table', ['#', 'Task', 'How', 'Good looks like'], [
        ['1', 'Review and update status', 'Open the project card, read milestones and tasks, then set status: On track, At risk or Off track.', 'Status matches evidence (e.g. a blocked critical task makes the project At risk).'],
        ['2', 'Document a blocker', 'Open the blocked task, choose Add blocker, state what is blocked, why, since when and who can unblock.', 'Specific cause, date, impact and named unblocker.'],
        ['3', 'Assign owner and due date', 'Open the task, set one Owner, add collaborators, set a realistic due date.', 'One accountable owner; date before the dependent milestone.'],
        ['4', 'Link a dependency', 'On the dependent task, choose Add dependency and select the task it waits for.', 'Direction is correct: the later task depends on the earlier.'],
        ['5', 'Escalate a risk', 'Add a risk, set severity, then notify the engagement lead using the escalation matrix.', 'Escalated early, with options and a decision needed by a date.'],
        ['6', 'Post a status update', 'Post to the project feed: status, blocker, action, date, ask.', 'Under 60 words; no jargon; one clear ask.'],
    ], [0.4, 1.6, 3, 2.4]),
    ('h2', 'What the indicators look like'),
    ('chips', [('On track', '#2f6b4a'), ('At risk', '#8a6d1f'), ('Off track', '#9b2c2c'), ('Blocked', '#4a4a4a'), ('Done', '#3a5a8a')]),
    ('p', 'Status is never colour-only: each chip has a text label. Dependencies appear as “Waits for” links; blockers show a stop icon and the word Blocked.'),
    ('break',),
    ('h2', 'Troubleshooting'),
    ('table', ['Symptom', 'Likely cause', 'What to do'], [
        ['I cannot change a task’s due date', 'You are not the owner or project editor', 'Ask the owner or the project lead; do not work around permissions.'],
        ['A task will not start', 'It waits for another task', 'Check “Waits for”; if the blocker is external, document it as a blocker.'],
        ['My update did not notify anyone', 'Collaborators were not tagged', 'Tag the owner and lead by name in the update.'],
        ['Status shows On track but a task is blocked', 'Status was not updated', 'Update status and add the blocker note the same day.'],
    ], [2, 2, 3.4]),
    ('h2', 'Escalation decision matrix'),
    ('table', ['Impact on delivery date', 'Within owner’s control?', 'Action', 'Who and when'], [
        ['None expected', 'Yes', 'Note in the status update', 'Owner; routine update'],
        ['Might slip under 2 days', 'Yes', 'Re-plan and tell the project lead', 'Owner to lead; same day'],
        ['Will slip over 2 days', 'No (dependency or vendor)', 'Escalate with options and a decision date', 'Lead to sponsor; within 24 hours'],
        ['Client commitment at risk', 'No', 'Escalate now; propose recovery options', 'Engagement manager; immediately'],
    ], [2, 1.8, 2.6, 2]),
    ('h2', 'Escalation message pattern'),
    ('box', '<b>Situation:</b> Vendor API access is five days late. <b>Impact:</b> Integration testing and the 14 March milestone are at risk. <b>Options:</b> (1) escalate to the vendor’s account lead, (2) test with mock data now. <b>Ask:</b> Decision by Thursday noon.'),
    ('h2', 'Keyboard and accessibility'),
    ('ul', ['Tab / Shift+Tab move between cards and controls; Enter or Space activates; Esc closes help.', 'Status, due-date and blocker information is available as text, not colour alone.', 'This guide uses real headings and tables so assistive technology can navigate it. It has not been tested with a screen reader.']),
]

CF = [
    ('p', 'A job aid for first-time managers using the <b>Situation–Behavior–Impact–Ask/Agree (SBI-A)</b> framework. Examples are fictional (Riley and Jamal).'),
    ('h2', '1. The framework'),
    ('table', ['Step', 'Purpose', 'Example'], [
        ['Situation', 'Anchor in a specific time and place', '“In Tuesday’s client call…”'],
        ['Behavior', 'Describe only what was seen or heard', '“…you answered the pricing question before Dana finished asking.”'],
        ['Impact', 'Say the effect on others, work or results', '“Dana went quiet and we missed her real concern.”'],
        ['Ask / Agree', 'Invite their view, then agree on next steps', '“How did that call feel to you? What could we try next time?”'],
    ], [1.2, 2.2, 4]),
    ('h2', '2. Observation versus assumption'),
    ('table', ['Assumption (avoid)', 'Observation (use)'], [
        ['“You don’t care about deadlines.”', '“The report was submitted on the 14th; the deadline was the 12th.”'],
        ['“You’re disengaged in meetings.”', '“In the last three meetings you did not speak and your camera was off.”'],
        ['“You have a bad attitude.”', '“When I asked for changes, you said ‘fine’ and left the call.”'],
    ]),
    ('h2', '3. Planning questions'),
    ('ul', ['What specific event am I addressing, and when did it happen?', 'What exactly did I see or hear? Could a camera have recorded it?', 'What was the impact on the client, team or results?', 'What might I not know? What is their possible perspective?', 'What outcome do I want, and what support can I offer?', 'Where and when will we talk? Is it private and unhurried?']),
    ('h2', '4. Example conversation (fictional)'),
    ('box', '<b>Manager:</b> “Riley, I’d like to talk about Tuesday’s client call. When Dana asked about pricing, you answered before she finished. She went quiet and we didn’t hear her real concern. How did the call feel from your side?”<br/><b>Riley:</b> “I was trying to save time. I didn’t realise.”<br/><b>Manager:</b> “That makes sense. What could you try next time?”'),
    ('h2', '5. Handling reactions'),
    ('table', ['If the employee…', 'Try'], [
        ['Becomes defensive', 'Pause, acknowledge, return to the specific example: “I can see this is hard to hear.”'],
        ['Gives context you did not know', 'Listen fully, summarise it, and decide whether it changes the plan.'],
        ['Goes silent', 'Wait, then ask an open question: “What’s going through your mind?”'],
        ['Becomes upset', 'Offer a break; resume later. Do not rush to fix.'],
    ]),
    ('h2', '6. Commitments and follow-up'),
    ('table', ['Commitment', 'Owner', 'Due', 'Check-in', 'Evidence of progress'], [
        ['Pause and invite client input before answering', 'Riley', 'Next client call', 'Friday 1:1', 'Client asked first in 2 of 3 calls'],
        ['Share two call recordings for coaching', 'Manager', 'Within 1 week', 'Friday 1:1', 'Feedback shared'],
    ], [3, 1, 1.3, 1.3, 2.5]),
    ('p', 'Follow-up script: “Last time we agreed you’d try inviting questions first. What went well? What was hard? What do we adjust?”'),
]
CF_WS = [
    ('h2', 'Conversation planning worksheet'),
    ('table', ['Prompt', 'Your notes'], [['Employee and role', ''], ['Specific situation (when/where)', ''], ['Observable behavior (what was seen or heard)', ''], ['Impact (on people, work, results)', ''], ['Assumptions I must check', ''], ['Questions to ask them', ''], ['Support I can offer', ''], ['Desired outcome', ''], ['Opening sentence', '']]),
    ('h2', 'Commitments log'),
    ('table', ['Commitment', 'Owner', 'Due date', 'Check-in date', 'Status'], [['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', '']]),
    ('h2', 'Reflection'),
    ('ul', ['What went as planned? What surprised me?', 'Where did I slip into assumption or advice?', 'What will I do differently in the next conversation?']),
]

ELEV = [
    ('p', 'Operational templates for the fictional <b>Meridian Strategy Group</b> 90-day consulting onboarding program (ELEVATE). Adapt for your own organisation.'),
    ('h2', '1. New-hire orientation agenda (Day 1)'),
    ('table', ['Time', 'Session', 'Lead', 'Outcome'], [
        ['9:00', 'Welcome and program overview', 'Priya (L&D partner)', 'Know the 90-day roadmap'],
        ['9:45', 'Systems and access setup', 'IT / Priya', 'Logged in to core tools'],
        ['11:00', 'How engagements run', 'Maya (Engagement Manager)', 'Understand roles and cadence'],
        ['12:00', 'Team lunch', 'Alex (colleague)', 'Meet the project team'],
        ['13:00', 'Expectations and 30-day goal', 'Maya', 'Draft a measurable goal'],
        ['15:00', 'Q&A and week-one plan', 'Priya', 'Confirm priorities'],
    ], [0.8, 2.6, 2, 2.4]),
    ('h2', '2. 90-day implementation plan'),
    ('table', ['Phase', 'Days', 'Focus', 'Key activities', 'Readiness evidence'], [
        ['1 Welcome', '0–5', 'Access and orientation', 'Day-1 agenda, buddy intro, first check-in', 'Tools accessed; goals drafted'],
        ['2 Foundations', '6–20', 'Firm methods', 'Methods workshop, shadowing', 'Completes methods module'],
        ['3 First engagement', '21–40', 'Contribute to a team', 'Own a defined workstream', 'Delivers a task with documentation'],
        ['4 Risk and escalation', '41–55', 'Judgment', 'Risk log, escalation practice', 'Logs and escalates a risk'],
        ['5 Feedback', '56–75', 'Growth', 'Mid-point review; development plan', 'Agreed measurable goals'],
        ['6 Readiness', '76–90', 'Independence', 'Capstone and 90-day review', 'Readiness conversation completed'],
    ], [1.4, 0.7, 1.6, 2.4, 2.4]),
    ('h2', '3. Manager check-in guide'),
    ('table', ['Check-in', 'Questions', 'Output'], [
        ['Day 5', 'What is clear? What is confusing? What do you need?', 'Resolved blockers'],
        ['Day 30', 'Which goal progress can you show? What feedback have you had?', 'Updated goal'],
        ['Day 60', 'Where are you confident? Where do you want support?', 'Development plan'],
        ['Day 90', 'What are you ready to own? What next?', 'Readiness summary'],
    ]),
    ('h2', '4. Stakeholder RACI'),
    ('table', ['Activity', 'New hire', 'Manager', 'L&D partner', 'HR', 'IT'], [
        ['Day-1 access', 'I', 'A', 'C', 'C', 'R'], ['Orientation delivery', 'I', 'C', 'R/A', 'C', 'I'], ['30-day goal', 'R', 'A', 'C', 'I', '–'],
        ['Check-ins', 'R', 'A', 'C', 'I', '–'], ['Review coordination', 'C', 'R', 'A', 'R', '–'], ['Program evaluation', 'C', 'C', 'R/A', 'C', '–'],
    ]),
    ('p', 'R = Responsible, A = Accountable, C = Consulted, I = Informed.'),
    ('h2', '5. Communications calendar'),
    ('table', ['When', 'Audience', 'Message', 'Channel', 'Owner'], [
        ['Offer + 2 weeks', 'New hire', 'Welcome and what to expect', 'Email', 'Priya'], ['Day −3', 'Manager', 'Preparation checklist', 'Email', 'Priya'],
        ['Day 1', 'New hire', 'Agenda and buddy', 'Email', 'Maya'], ['Day 30', 'Manager and hire', 'Check-in reminder', 'Calendar', 'Priya'],
        ['Day 75', 'Both', 'Readiness review invitation', 'Email', 'Priya'],
    ]),
    ('h2', '6. New-hire email templates'),
    ('box', '<b>Welcome (before start):</b> Subject: Welcome to Meridian: your first week. Hi Jordan, we’re glad you’re joining us on [date]. Your first day starts at 9:00 with Priya. Your manager, Maya, will meet you at 11:00. Please bring ID for access set-up. Your agenda is attached. If anything is unclear, reply to this email.'),
    ('box', '<b>Day-30 check-in:</b> Subject: Your 30-day check-in. Hi Jordan, please bring your 30-day goal and one example of feedback you received. We’ll review progress and plan the next 30 days.'),
    ('h2', '7. Role-based onboarding checklists'),
    ('table', ['Role', 'Before Day 1', 'First week', 'By Day 30'], [
        ['New hire', 'Return paperwork; read welcome email', 'Complete orientation; set up tools; draft goal', 'Share goal progress; request feedback'],
        ['Manager', 'Assign buddy; schedule check-ins', 'Hold welcome and Day-5 check-in', 'Give feedback with examples'],
        ['L&D partner', 'Confirm agenda and materials', 'Run orientation; collect feedback', 'Review early completion data'],
        ['Buddy', 'Receive a briefing', 'Intro to team and norms', 'Check in weekly'],
    ]),
    ('h2', '8. Facilitator preparation guide'),
    ('ul', ['One week before: confirm room, materials and attendee list.', 'Review the agenda objectives and rehearse the welcome session.', 'Prepare examples from fictional engagements; avoid confidential detail.', 'Plan for questions: capture and follow up within 48 hours.', 'After the session: send the feedback survey and file notes.']),
    ('h2', '9. Biannual performance-review coordination calendar'),
    ('table', ['When', 'Milestone', 'Owner'], [
        ['Week −6', 'Announce cycle and timeline', 'HR'], ['Week −4', 'Employees draft self-reflection', 'Employees'], ['Week −2', 'Managers collect feedback', 'Managers'],
        ['Week 0', 'Review conversations', 'Managers'], ['Week +2', 'Calibration and documentation', 'HR / Managers'], ['Week +4', 'Development plans filed', 'Employees / L&D'],
    ]),
    ('h2', '10. Review-cycle employee FAQ'),
    ('table', ['Question', 'Answer'], [
        ['Why do we hold reviews twice a year?', 'To give regular, specific feedback and adjust goals before problems grow.'],
        ['What should I prepare?', 'A short self-reflection, examples of your work and goals for the next period.'],
        ['Who sees my review?', 'You, your manager and HR. Access follows firm policy.'],
        ['What if I disagree?', 'Add your comments to the record and ask for a follow-up discussion.'],
    ]),
    ('h2', '11. Learning evaluation plan (Kirkpatrick)'),
    ('table', ['Level', 'Question', 'Measure', 'When'], [
        ['1 Reaction', 'Was it relevant and clear?', 'Pulse survey', 'End of each phase'],
        ['2 Learning', 'Can they apply the methods?', 'Scenario assessment', 'Day 60 and 90'],
        ['3 Behavior', 'Are they using it on engagements?', 'Manager observation checklist', 'Day 90'],
        ['4 Results', 'Is time-to-productivity improving?', 'Proposed: manager-rated readiness trend', 'Next two cohorts'],
    ]),
    ('h2', '12. Synthetic participation and completion report'),
    ('p', 'Illustrative sample; invented for demonstration only.'),
    ('table', ['Phase', 'Enrolled', 'Completed', 'Completion'], [[n, 24, c, f'{100 * c / 24:.0f}%'] for n, c in [('1 Welcome', 24), ('2 Foundations', 23), ('3 First engagement', 21), ('4 Risk and escalation', 20), ('5 Feedback', 20), ('6 Readiness', 19)]]),
]

IDD = [
    ('p', 'Design documentation for the four portfolio projects. This is the planning artifact set behind the interactive courses; implementation and evaluation described as “proposed” have <b>not</b> been carried out with real learners.'),
    ('h2', '1. Needs analysis (ELEVATE example)'),
    ('table', ['Question', 'Finding (fictional)'], [
        ['Business problem', 'Inconsistent onboarding; unclear expectations; scattered resources; little visibility into readiness.'],
        ['Performance gap', 'New consultants take varying time to contribute and do not know how to escalate risks.'],
        ['Root causes', 'No standard path; managers improvise; no readiness measure.'],
        ['Is training the solution?', 'Partly: knowledge and practice gaps exist, but manager expectations and tooling also contribute.'],
        ['Constraints', 'Busy engagements; remote participants; small L&D team.'],
    ], [1.5, 5]),
    ('h2', '2. Design document summary'),
    ('table', ['Decision', 'Rationale'], [
        ['Scenario-based, story-driven', 'Judgment skills need realistic practice; recurring characters create context.'],
        ['Eight-step lesson sequence', 'Scenario, instruction, worked example, guided and independent practice, check, consequence, reinforcement.'],
        ['Backward design', 'Define observable performance, then assessment, then activities.'],
        ['Final assessment separate from practice', 'Practice is safe and supported; assessment measures transfer.'],
    ], [2, 4.5]),
    ('h2', '3. Learning objectives matrix'),
    ('table', ['Objective', 'Level', 'Activity', 'Assessment'], [
        ['Draft a measurable 30-day goal', 'Create', 'Guided goal drafting', 'Rubric-based draft'],
        ['Prioritise client requests', 'Apply', 'Prioritisation scenario', 'Scenario check'],
        ['Escalate a risk professionally', 'Apply', 'Escalation message draft', 'Rubric and decision check'],
        ['Interpret feedback and plan development', 'Analyse', 'Check-in simulation', 'Development plan rubric'],
    ]),
    ('h2', '4. Storyboard excerpt (Module 3, Screen 4)'),
    ('table', ['Element', 'Content'], [
        ['Screen goal', 'Decide how to respond to incomplete data and a moving deadline.'], ['On-screen', 'Chat from Alex: “The client data is missing three weeks.” Email from Maya with a new deadline.'],
        ['Interaction', 'Choose an action; receive consequence and coaching.'], ['Accessibility', 'Text alternatives; keyboard operable; feedback announced.'],
        ['Feedback', 'Explains why escalating early with options is effective.'],
    ], [1.5, 5]),
    ('h2', '5. Facilitator guide excerpt'),
    ('ul', ['Open: connect to a time the participant joined a new team (5 min).', 'Present the escalation pattern: Situation, Impact, Options, Ask (10 min).', 'Practice in pairs using the fictional scenario (15 min).', 'Debrief: What made one message easier to act on? (10 min).']),
    ('h2', '6. Evaluation plan'),
    ('table', ['Level', 'Method', 'Status'], [['1 Reaction', 'Short survey', 'Proposed'], ['2 Learning', 'Embedded scenario assessments', 'Built into course'], ['3 Behavior', 'Manager observation', 'Proposed'], ['4 Results', 'Readiness trend', 'Proposed']]),
    ('h2', '7. Assessment blueprint'),
    ('table', ['Objective', 'Item type', 'Items', 'Weight'], [['Goals', 'Draft + rubric', 1, '20%'], ['Prioritisation', 'Scenario', 2, '25%'], ['Escalation', 'Scenario + draft', 2, '30%'], ['Feedback', 'Scenario', 2, '25%']]),
]

IN360 = [
    ('p', 'Executive reporting pack for the fictional INSIGHT360 exercise (Northfield Group). All figures are computed from the 72-record synthetic dataset by <b>scripts/build-resources.py</b>.'),
    ('h2', 'Executive summary'),
    ('box', f'<b>{S["rate"]:.1f}%</b> of {S["n"]} enrolled learners completed. Paired assessment scores rose from <b>{S["pre"]:.1f}</b> to <b>{S["post"]:.1f}</b> (+{S["post"] - S["pre"]:.1f}, n = {S["pairs"]}). Average satisfaction is {S["sat"]:.2f}/5 and manager-observed application is {S["app"]:.0f}%. This shows learning, not proven workplace impact: there is no comparison group. One duplicate and one out-of-range record were excluded.'),
    ('h2', 'Headline metrics'),
    ('table', ['Metric', 'Raw data', 'Cleaned data'], [
        ['Records', R['n'], S['n']], ['Completion rate', f'{R["rate"]:.1f}%', f'{S["rate"]:.1f}%'], ['Average pre score', f'{R["pre"]:.1f}', f'{S["pre"]:.1f}'],
        ['Average post score', f'{R["post"]:.1f}', f'{S["post"]:.1f}'], ['Paired learners', R['pairs'], S['pairs']], ['Satisfaction (1–5)', f'{R["sat"]:.2f}', f'{S["sat"]:.2f}'], ['Observed application', f'{R["app"]:.0f}%', f'{S["app"]:.0f}%'],
    ]),
    ('h2', 'Completion by cohort'),
    ('table', ['Cohort', 'Learners', 'Completed', 'Rate'], [[c, s['n'], s['comp'], f'{s["rate"]:.1f}%'] for c in sorted({r['cohort'] for r in cl}) for s in [summ([r for r in cl if r['cohort'] == c])]]),
    ('p', 'Cohorts are small (about 11–12 records); one learner moves a rate by roughly 9 percentage points.'),
    ('h2', 'Dashboard definitions'),
    ('table', ['Metric', 'Definition'], [['Completion rate', 'Completed ÷ enrolled'], ['Average gain', 'Average post − average pre, learners with both scores'], ['Participation %', 'Share of scheduled activity attended; values above 100 are invalid'], ['Satisfaction', 'Self-rated 1–5 reaction'], ['Observed application', 'Share of observed completers where the manager saw the skill used']]),
    ('h2', 'Sample recommendations'),
    ('ul', ['Check the platform before virtual sessions and offer a technical-support contact; compare technical-difficulty comments next quarter.', 'Add practice time, the second most frequent feedback theme.', 'Gather manager observations for every completer to strengthen Level 3 evidence.', 'Correct the source data issues (duplicate ID, participation above 100%, missing post score).']),
    ('h2', 'Limitations'),
    ('ul', ['Synthetic data: nothing here represents real learners or programs.', 'No comparison group, so no causal claims.', 'Small cohorts make rates volatile.', 'Satisfaction and test scores are not business results (Kirkpatrick Level 4).']),
]

# ---------- Build PDFs and DOCX ----------
os.makedirs(OUT, exist_ok=True)
pdf('launchpad-quick-reference.pdf', 'LAUNCHPAD Quick Reference', 'FlowBoard digital adoption job aid (fictional platform)', LP, compact=True)
pdf('coachforward-manager-toolkit.pdf', 'COACHFORWARD Manager Toolkit', 'Effective feedback and performance conversations', CF + [('break',)] + CF_WS)
docx('coachforward-worksheet.docx', 'COACHFORWARD Planning Worksheet', 'Editable conversation planning and commitments log', CF_WS)
pdf('elevate-onboarding-toolkit.pdf', 'ELEVATE Onboarding Toolkit', '90-day consulting onboarding and performance enablement', ELEV)
docx('elevate-onboarding-templates.docx', 'ELEVATE Onboarding Templates', 'Editable versions of the ELEVATE toolkit', ELEV)
pdf('instructional-design-documentation.pdf', 'Instructional Design Documentation', 'Needs analysis to assessment blueprint', IDD)
docx('instructional-design-templates.docx', 'Instructional Design Templates', 'Editable design documentation', IDD)
pdf('insight360-executive-reporting.pdf', 'INSIGHT360 Executive Reporting Pack', 'Learning analytics summary, definitions, recommendations and limitations', IN360)

# ---------- XLSX workbook ----------
wb = Workbook()
hdr_fill = PatternFill('solid', fgColor='3F6350'); hdr_font = Font(bold=True, color='FFFFFF')
thin = Side(style='thin', color='C9D3C9'); border = Border(left=thin, right=thin, top=thin, bottom=thin)
def style_header(ws, row=1):
    for c in ws[row]:
        c.fill = hdr_fill; c.font = hdr_font; c.alignment = Alignment(wrap_text=True, vertical='center'); c.border = border
d0 = datetime.date(2026, 1, 12)
ws = wb.active; ws.title = 'Tasks'
cols = ['ID', 'ADDIE phase', 'Task', 'Owner', 'Milestone?', 'Depends on', 'Planned start', 'Planned end', 'Actual start', 'Actual end', 'Status', '% complete', 'Planned days', 'Variance (days)', 'Flag']
ws.append(cols); style_header(ws)
tasks = [
    ('Analyze', 'Stakeholder interviews', 'Analyst', 'No', '', 0, 5, 0, 5, 'Complete', 1),
    ('Analyze', 'Needs analysis report', 'Analyst', 'Yes', 'T1', 5, 10, 5, 11, 'Complete', 1),
    ('Design', 'Learning objectives matrix', 'Instructional Designer', 'No', 'T2', 11, 15, 12, 16, 'Complete', 1),
    ('Design', 'Storyboards approved', 'Instructional Designer', 'Yes', 'T3', 16, 24, 17, 26, 'Complete', 1),
    ('Develop', 'Build modules 1–2', 'Developer', 'No', 'T4', 25, 40, 27, None, 'In progress', 0.6),
    ('Develop', 'Build modules 3–5', 'Developer', 'No', 'T5', 41, 58, None, None, 'Not started', 0),
    ('Develop', 'Accessibility review', 'Accessibility lead', 'No', 'T5', 41, 50, None, None, 'Blocked', 0),
    ('Implement', 'Pilot with 8 learners', 'Program Manager', 'Yes', 'T6,T7', 59, 70, None, None, 'Not started', 0),
    ('Implement', 'Facilitator training', 'Facilitator', 'No', 'T8', 60, 66, None, None, 'Not started', 0),
    ('Evaluate', 'Level 1–2 evaluation', 'Analyst', 'No', 'T8', 71, 78, None, None, 'Not started', 0),
    ('Evaluate', 'Executive report', 'Analyst', 'Yes', 'T10', 79, 85, None, None, 'Not started', 0),
]
n = len(tasks)
for i, (ph, t, o, ms, dep, ps, pe, as_, ae, st, pc) in enumerate(tasks, start=2):
    ws.append([f'T{i - 1}', ph, t, o, ms, dep, d0 + datetime.timedelta(ps), d0 + datetime.timedelta(pe),
               d0 + datetime.timedelta(as_) if as_ is not None else None, d0 + datetime.timedelta(ae) if ae is not None else None, st, pc,
               f'=H{i}-G{i}', f'=IF(J{i}="","",J{i}-H{i})', f'=IF(K{i}="Blocked","Blocked",IF(AND(K{i}<>"Complete",H{i}<Summary!$B$3),"Overdue",IF(AND(J{i}<>"",J{i}>H{i}),"Finished late","OK")))'])
last = n + 1
for r in ws.iter_rows(min_row=2, max_row=last):
    for c in r: c.border = border
    for c in r[6:10]: c.number_format = 'yyyy-mm-dd'
    r[11].number_format = '0%'
for col, w in zip('ABCDEFGHIJKLMNO', [6, 12, 30, 22, 11, 12, 13, 13, 13, 13, 13, 12, 12, 14, 14]): ws.column_dimensions[col].width = w
ws.freeze_panes = 'D2'; ws.auto_filter.ref = f'A1:O{last}'
dv = DataValidation(type='list', formula1='"Not started,In progress,Blocked,Complete"', allow_blank=False); ws.add_data_validation(dv); dv.add(f'K2:K{last + 20}')
dv2 = DataValidation(type='list', formula1='"Analyze,Design,Develop,Implement,Evaluate"'); ws.add_data_validation(dv2); dv2.add(f'B2:B{last + 20}')
rng = f'K2:K{last + 20}'
ws.conditional_formatting.add(rng, CellIsRule(operator='equal', formula=['"Complete"'], fill=PatternFill('solid', bgColor='D5E8D4')))
ws.conditional_formatting.add(rng, CellIsRule(operator='equal', formula=['"Blocked"'], fill=PatternFill('solid', bgColor='F4C7C3')))
ws.conditional_formatting.add(rng, CellIsRule(operator='equal', formula=['"In progress"'], fill=PatternFill('solid', bgColor='FFF2CC')))
ws.conditional_formatting.add(f'O2:O{last + 20}', FormulaRule(formula=['OR(O2="Overdue",O2="Blocked")'], fill=PatternFill('solid', bgColor='F4C7C3'), font=Font(bold=True)))
ws.conditional_formatting.add(f'L2:L{last + 20}', DataBarRule(start_type='num', start_value=0, end_type='num', end_value=1, color='3F6350'))

rk = wb.create_sheet('Risks')
rk.append(['ID', 'Risk', 'Related task', 'Likelihood (1–5)', 'Impact (1–5)', 'Score', 'Rating', 'Owner', 'Mitigation', 'Status'])
style_header(rk)
risks = [('Subject-matter experts unavailable for review', 'T4', 4, 4, 'Program Manager', 'Book review slots now; use asynchronous review', 'Open'),
         ('Accessibility review slips', 'T7', 3, 4, 'Accessibility lead', 'Start review on draft builds', 'Open'),
         ('Pilot participants unavailable', 'T8', 3, 3, 'Facilitator', 'Recruit 12 for 8 seats', 'Open'),
         ('Platform export unavailable for evaluation', 'T10', 2, 3, 'Analyst', 'Agree data format early', 'Mitigated')]
for i, (r_, t, l, im, o, m_, s_) in enumerate(risks, start=2):
    rk.append([f'R{i - 1}', r_, t, l, im, f'=D{i}*E{i}', f'=IF(F{i}>=15,"High",IF(F{i}>=8,"Medium","Low"))', o, m_, s_])
for col, w in zip('ABCDEFGHIJ', [6, 40, 12, 14, 12, 8, 10, 20, 40, 12]): rk.column_dimensions[col].width = w
for r in rk.iter_rows(min_row=2, max_row=len(risks) + 1):
    for c in r: c.border = border; c.alignment = Alignment(wrap_text=True, vertical='top')
rk.conditional_formatting.add('G2:G50', CellIsRule(operator='equal', formula=['"High"'], fill=PatternFill('solid', bgColor='F4C7C3')))
rk.conditional_formatting.add('G2:G50', CellIsRule(operator='equal', formula=['"Medium"'], fill=PatternFill('solid', bgColor='FFF2CC')))
rk.conditional_formatting.add('G2:G50', CellIsRule(operator='equal', formula=['"Low"'], fill=PatternFill('solid', bgColor='D5E8D4')))
rk.freeze_panes = 'C2'

sm = wb.create_sheet('Summary', 0)
sm['A1'] = 'L&D Project Management Workbook: Summary'; sm['A1'].font = Font(size=16, bold=True, color='2F4A3C')
sm['A2'] = 'Fictional sample project with synthetic data. Edit the Tasks and Risks sheets and the status date; this sheet recalculates.'
sm['A3'] = 'Status date (edit)'; sm['B3'] = datetime.date(2026, 3, 6); sm['B3'].number_format = 'yyyy-mm-dd'; sm['B3'].fill = PatternFill('solid', fgColor='FFF2CC')
sm['A4'], sm['B4'] = 'Metric', 'Value'; style_header(sm, 4)
T = "Tasks!"
rows = [('Total tasks', f'=COUNTA({T}A2:A200)'), ('Complete', f'=COUNTIF({T}K2:K200,"Complete")'), ('In progress', f'=COUNTIF({T}K2:K200,"In progress")'),
        ('Blocked', f'=COUNTIF({T}K2:K200,"Blocked")'), ('Not started', f'=COUNTIF({T}K2:K200,"Not started")'),
        ('Overall % complete (average)', f'=IFERROR(AVERAGE({T}L2:L200),0)'), ('Milestones', f'=COUNTIF({T}E2:E200,"Yes")'),
        ('Milestones complete', f'=COUNTIFS({T}E2:E200,"Yes",{T}K2:K200,"Complete")'), ('Overdue or blocked tasks', f'=COUNTIF({T}O2:O200,"Overdue")+COUNTIF({T}O2:O200,"Blocked")'),
        ('Average variance on finished tasks (days)', f'=IFERROR(AVERAGE({T}N2:N200),0)'), ('High risks open', '=COUNTIFS(Risks!G2:G200,"High",Risks!J2:J200,"Open")'), ('Total open risks', '=COUNTIF(Risks!J2:J200,"Open")')]
for k, r in enumerate(rows, start=5):
    sm.cell(row=k, column=1, value=r[0]); sm.cell(row=k, column=2, value=r[1])
sm['B10'].number_format = '0%'; sm['B14'].number_format = '0.0'
for j, h in enumerate(['ADDIE phase', 'Tasks', 'Complete', '% tasks complete'], start=1): sm.cell(row=18, column=j, value=h)
style_header(sm, 18)
for i, ph in enumerate(['Analyze', 'Design', 'Develop', 'Implement', 'Evaluate'], start=19):
    sm.append([None] * 0)
    for j, v in enumerate([ph, f'=COUNTIF({T}B2:B200,A{i})', f'=COUNTIFS({T}B2:B200,A{i},{T}K2:K200,"Complete")', f'=IF(B{i}=0,0,C{i}/B{i})'], start=1): sm.cell(row=i, column=j, value=v)
    sm[f'D{i}'].number_format = '0%'
sm.conditional_formatting.add('D19:D23', DataBarRule(start_type='num', start_value=0, end_type='num', end_value=1, color='3F6350'))
sm.conditional_formatting.add('B13', CellIsRule(operator='greaterThan', formula=['0'], fill=PatternFill('solid', bgColor='F4C7C3')))
sm.column_dimensions['A'].width = 42; sm.column_dimensions['B'].width = 14; sm.column_dimensions['C'].width = 14; sm.column_dimensions['D'].width = 18
rd = wb.create_sheet('Read me')
for line in ['How to use this workbook', '1. Add tasks on the Tasks sheet (copy formulas in M:O down).', '2. Choose ADDIE phase and status from the drop-downs.', '3. Enter actual dates as work starts and ends; variance and flags calculate automatically.', '4. Log risks with 1–5 likelihood and impact; rating is calculated.', '5. The Summary sheet recalculates progress, milestones and risks.', 'All data are fictional and synthetic.']:
    rd.append([line])
rd['A1'].font = Font(bold=True, size=14); rd.column_dimensions['A'].width = 100
wb.save(os.path.join(OUT, 'ld-project-management-workbook.xlsx')); print('workbook saved')
