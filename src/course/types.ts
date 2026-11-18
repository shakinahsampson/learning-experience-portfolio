import type { ReactNode } from 'react'

export interface Character { name: string; role: string; blurb: string; initials: string; tone: 'sage' | 'gold' | 'charcoal' | 'warm' }
export interface Resource { label: string; file: string; note?: string }

/** ---------- Instructional content blocks ---------- */
export type Block =
  | { t: 'p'; text: string }
  | { t: 'list'; items: string[]; ordered?: boolean }
  | { t: 'callout'; title?: string; text: string; tone?: 'info' | 'warn' | 'tip' }
  | { t: 'doc'; kind: 'email' | 'brief' | 'chat' | 'note'; title: string; meta?: [string, string][]; lines: string[] }
  | { t: 'timeline'; title?: string; items: { when: string; label: string; detail: string }[] }
  | { t: 'flow'; title?: string; steps: { label: string; detail: string }[] }
  | { t: 'table'; caption: string; head: string[]; rows: string[][] }
  /** Document with numbered annotations the learner can open one by one. */
  | { t: 'annotated'; title: string; lines: string[]; notes: { line: number; label: string; body: string }[] }
  | { t: 'dialogue'; lines: { who: string; text: string }[] }

/** ---------- Activities (scored or ungraded interactions) ---------- */
export interface Option { text: string; quality: 'best' | 'ok' | 'poor'; feedback: string; consequence?: string }
export interface ChoiceActivity { kind: 'choice'; prompt: string; context?: string; options: Option[]; hints?: string[] }
export interface OrderActivity { kind: 'order'; prompt: string; items: string[] /* in CORRECT order */; explanation: string; hints?: string[] }
export interface SortActivity {
  kind: 'sort'; prompt: string; buckets: string[]
  items: { text: string; bucket: number; why: string }[]; hints?: string[]
}
export interface DraftCriterion { label: string; anyOf: string[] /* case-insensitive substrings/regex sources */ ; coaching: string }
export interface DraftActivity {
  kind: 'draft'; prompt: string; context?: string; placeholder?: string; minWords: number
  criteria: DraftCriterion[]; model: string; hints?: string[]
}
export interface BranchNode {
  id: string; speaker?: string; say?: string; context?: string; prompt?: string
  choices?: { text: string; next: string; quality: 'best' | 'ok' | 'poor'; reply: string; coach: string; consequence?: string }[]
  end?: { title: string; summary: string }
}
export interface BranchActivity { kind: 'branch'; title: string; start: string; nodes: BranchNode[]; hints?: string[] }
export interface CustomActivity {
  kind: 'custom'; prompt?: string
  render: (api: { resolve: (score: number, max: number) => void; resolved: boolean }) => ReactNode
}
export type Activity = ChoiceActivity | OrderActivity | SortActivity | DraftActivity | BranchActivity | CustomActivity

/** ---------- Lesson steps (8-step instructional sequence) ---------- */
export type StepKind = 'scenario' | 'instruction' | 'worked' | 'guided' | 'independent' | 'check' | 'consequence' | 'reinforce'
export interface StepBase { id: string; kind: StepKind; title: string }
export interface ScenarioStep extends StepBase { kind: 'scenario'; narrative: string[]; characters?: string[]; stakes: string; blocks?: Block[] }
export interface InstructionStep extends StepBase { kind: 'instruction'; blocks: Block[] }
export interface WorkedStep extends StepBase { kind: 'worked'; situation: string; steps: { thought: string; action: string }[]; takeaway: string; blocks?: Block[] }
export interface ActivityStep extends StepBase { kind: 'guided' | 'independent' | 'check'; intro?: string; activity: Activity; points?: number; blocks?: Block[] }
/** Step 7: shows what happened as a result of the learner's earlier decisions and invites a retry. */
export interface ConsequenceStep extends StepBase { kind: 'consequence'; text: string[]; retryStepId?: string }
export interface ReinforceStep extends StepBase {
  kind: 'reinforce'; reflection: string; checklist: string[]; application: string; resource?: Resource
}
export type Step = ScenarioStep | InstructionStep | WorkedStep | ActivityStep | ConsequenceStep | ReinforceStep

export interface Module { id: string; title: string; minutes: number; summary: string; objectives: string[]; steps: Step[] }

export interface FinalItem { id: string; objective: string; activity: Activity }
export interface Course {
  id: string; title: string; subtitle: string; org: string; audience: string; minutes: number
  overview: string[]; objectives: string[]; characters: Character[]
  modules: Module[]
  finalAssessment: { title: string; intro: string; passMark: number; items: FinalItem[] }
  resources: Resource[]
  disclosure: string
}

/** ---------- Progress state (persisted in localStorage on this device only) ---------- */
export interface StepResult { score: number; max: number; attempts: number; firstScore: number }
export interface CourseState {
  visited: string[]
  results: Record<string, StepResult>
  reflections: Record<string, string>
  checklists: Record<string, number[]>
  final?: { score: number; max: number; attempts: number; best: number }
}
export const emptyState = (): CourseState => ({ visited: [], results: {}, reflections: {}, checklists: {} })
