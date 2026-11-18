import { useState } from 'react'
import { usePersisted } from '../lib/storage'

export interface Question {
  q: string
  options: string[]
  correct: number
  explain: string[] // feedback per option
}

interface Props {
  id: string // persistence key
  title: string
  questions: Question[]
  passMark: number // 0–1
  onComplete?: (score: number) => void
}

/** Scored multi-question check with per-option feedback and retry. Best score is stored locally. */
export function Quiz({ id, title, questions, passMark, onComplete }: Props) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null))
  const [submitted, setSubmitted] = useState(false)
  const [best, setBest] = usePersisted<number | null>(`quiz:${id}`, null)

  const score = answers.filter((a, i) => a === questions[i].correct).length
  const pct = score / questions.length
  const allAnswered = answers.every((a) => a !== null)

  const submit = () => {
    setSubmitted(true)
    if (best === null || score > best) setBest(score)
    onComplete?.(score)
  }
  const retry = () => {
    setAnswers(questions.map(() => null))
    setSubmitted(false)
  }

  return (
    <section aria-labelledby={`quiz-${id}`} className="card">
      <h3 id={`quiz-${id}`} className="text-xl">{title}</h3>
      {best !== null && <p className="mt-1 text-sm text-warm-600">Best saved score on this device: {best}/{questions.length}</p>}
      <ol className="mt-4 space-y-6">
        {questions.map((qu, qi) => (
          <li key={qi}>
            <fieldset>
              <legend className="font-semibold">{qi + 1}. {qu.q}</legend>
              <div className="mt-2 space-y-2">
                {qu.options.map((opt, oi) => {
                  const chosen = answers[qi] === oi
                  const cls = submitted ? (oi === qu.correct ? 'correct' : chosen ? 'wrong' : '') : ''
                  return (
                    <button
                      key={oi}
                      type="button"
                      className={`choice ${cls}`}
                      aria-pressed={chosen}
                      disabled={submitted}
                      onClick={() => setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))}
                    >
                      {opt}
                      {submitted && oi === qu.correct && <span className="sr-only"> (correct answer)</span>}
                    </button>
                  )
                })}
              </div>
              {submitted && answers[qi] !== null && (
                <p className="mt-2 text-sm" role="status">
                  <strong>{answers[qi] === qu.correct ? '✓ Correct. ' : '✗ Not quite. '}</strong>
                  {qu.explain[answers[qi] as number]}
                </p>
              )}
            </fieldset>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {!submitted ? (
          <button type="button" className="btn btn-primary" disabled={!allAnswered} onClick={submit}>Check answers</button>
        ) : (
          <>
            <p role="status" className="font-semibold">
              Score: {score}/{questions.length} — {pct >= passMark ? 'Target met ✓' : `Target is ${Math.round(passMark * 100)}%. Review the feedback and try again.`}
            </p>
            <button type="button" className="btn btn-ghost" onClick={retry}>Retry</button>
          </>
        )}
        {!submitted && !allAnswered && <span className="text-sm text-warm-600">Answer every question to continue.</span>}
      </div>
    </section>
  )
}
