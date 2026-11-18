import { useState } from 'react'

export interface Choice {
  text: string
  next: string
  quality: 'best' | 'okay' | 'poor'
  reply: string // what the other person says/does
  coach: string // coaching note
}
export interface Node {
  id: string
  prompt: string
  context?: string
  choices?: Choice[]
  end?: { title: string; summary: string }
}

const qualityLabel = { best: 'Effective', okay: 'Partly effective', poor: 'Less effective' } as const
const points = { best: 2, okay: 1, poor: 0 } as const

/** Branching scenario: each choice gets a reaction + coaching, then routes to the next node. Supports retry. */
export function Branching({ nodes, start, title }: { nodes: Node[]; start: string; title: string }) {
  const [current, setCurrent] = useState(start)
  const [picked, setPicked] = useState<Choice | null>(null)
  const [history, setHistory] = useState<{ prompt: string; choice: Choice }[]>([])
  const node = nodes.find((n) => n.id === current)!
  const total = history.reduce((a, h) => a + points[h.choice.quality], 0)
  const max = history.length * 2

  const choose = (c: Choice) => {
    setPicked(c)
    setHistory((h) => [...h, { prompt: node.prompt, choice: c }])
  }
  const advance = () => {
    if (!picked) return
    setCurrent(picked.next)
    setPicked(null)
  }
  const restart = () => {
    setCurrent(start)
    setPicked(null)
    setHistory([])
  }

  if (node.end && !picked) {
    return (
      <section className="card fade-in" aria-labelledby="scn-end">
        <h3 id="scn-end" className="text-xl">{node.end.title}</h3>
        <p className="mt-2">{node.end.summary}</p>
        <p className="mt-3 font-semibold" role="status">Decision quality: {total}/{max} points</p>
        <ol className="mt-3 space-y-2 text-sm">
          {history.map((h, i) => (
            <li key={i}><strong>{qualityLabel[h.choice.quality]}:</strong> “{h.choice.text}”</li>
          ))}
        </ol>
        <button type="button" className="btn btn-primary mt-5" onClick={restart}>Retry the scenario</button>
      </section>
    )
  }

  return (
    <section className="card fade-in" aria-label={title}>
      <p className="eyebrow">Decision {history.length + (picked ? 0 : 1)}</p>
      {node.context && <p className="mt-2 text-sm text-warm-600">{node.context}</p>}
      <p className="mt-2 text-lg font-serif">{node.prompt}</p>
      <div className="mt-4 space-y-2" role="group" aria-label="Your options">
        {node.choices?.map((c, i) => (
          <button key={i} type="button" className={`choice ${picked ? (picked === c ? (c.quality === 'best' ? 'correct' : c.quality === 'poor' ? 'wrong' : '') : '') : ''}`} aria-pressed={picked === c} disabled={!!picked} onClick={() => choose(c)}>
            {c.text}
          </button>
        ))}
      </div>
      {picked && (
        <div className="mt-5 rounded-lg bg-sage-50 p-4" role="status">
          <p className="font-semibold">{qualityLabel[picked.quality]}</p>
          <p className="mt-1 italic">{picked.reply}</p>
          <p className="mt-2 text-sm"><strong>Coaching:</strong> {picked.coach}</p>
          <button type="button" className="btn btn-primary mt-4" onClick={advance}>Continue</button>
        </div>
      )}
    </section>
  )
}
