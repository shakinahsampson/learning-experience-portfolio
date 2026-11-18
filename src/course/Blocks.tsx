import { useState } from 'react'
import type { Block } from './types'

const docTone = { email: 'bg-white', brief: 'bg-[#fbf9f2]', chat: 'bg-sage-50', note: 'bg-[#fffdf5]' } as const

function Timeline({ b }: { b: Extract<Block, { t: 'timeline' }> }) {
  const [i, setI] = useState(0)
  return (
    <div className="card !p-4">
      {b.title && <p className="eyebrow mb-3">{b.title}</p>}
      <ol className="flex flex-wrap gap-2" aria-label="Select a phase to read its details">
        {b.items.map((it, n) => (
          <li key={it.label}>
            <button type="button" aria-pressed={i === n} onClick={() => setI(n)}
              className={`rounded-full border px-3 py-1.5 text-sm ${i === n ? 'border-sage-700 bg-sage-700 text-white' : 'border-warm-400 bg-white text-charcoal hover:bg-sage-50'}`}>
              <span className="font-semibold">{n + 1}.</span> {it.when}
            </button>
          </li>
        ))}
      </ol>
      <div className="mt-4 rounded-lg bg-sage-50 p-4" role="status" aria-live="polite">
        <p className="font-serif text-lg text-sage-900">{b.items[i].label}</p>
        <p className="mt-1 text-sm">{b.items[i].detail}</p>
      </div>
    </div>
  )
}

function Annotated({ b }: { b: Extract<Block, { t: 'annotated' }> }) {
  const [open, setOpen] = useState<number | null>(null)
  const note = open !== null ? b.notes[open] : null
  return (
    <div className="card !p-4">
      <p className="eyebrow">{b.title}</p>
      <div className="mt-3 rounded-lg border border-warm-200 bg-white p-4 text-sm leading-relaxed">
        {b.lines.map((l, n) => {
          const idx = b.notes.findIndex((x) => x.line === n)
          return (
            <p key={n} className={`py-0.5 ${idx >= 0 && open === idx ? 'bg-[#f6ecd0]' : ''}`}>
              {idx >= 0 && (
                <button type="button" aria-label={`Annotation ${idx + 1}: ${b.notes[idx].label}`} aria-pressed={open === idx}
                  onClick={() => setOpen(open === idx ? null : idx)}
                  className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sage-700 text-xs font-bold text-white">{idx + 1}</button>
              )}
              {l}
            </p>
          )
        })}
      </div>
      <div className="mt-3 min-h-[3.5rem] text-sm" role="status" aria-live="polite">
        {note ? <><p className="font-semibold">{open! + 1}. {note.label}</p><p>{note.body}</p></> : <p className="text-warm-600">Select a numbered marker to read the annotation.</p>}
      </div>
    </div>
  )
}

export function Blocks({ blocks }: { blocks?: Block[] }) {
  if (!blocks?.length) return null
  return (
    <div className="space-y-4">
      {blocks.map((b, n) => {
        switch (b.t) {
          case 'p': return <p key={n} className="max-w-prose">{b.text}</p>
          case 'list': {
            const L = b.ordered ? 'ol' : 'ul'
            return <L key={n} className={`max-w-prose space-y-1 pl-5 ${b.ordered ? 'list-decimal' : 'list-disc'}`}>{b.items.map((x, i) => <li key={i}>{x}</li>)}</L>
          }
          case 'callout': {
            const c = b.tone === 'warn' ? 'border-[#9a3b2e] bg-[#f9e7e3]' : b.tone === 'tip' ? 'border-sage-600 bg-sage-50' : 'border-gold bg-[#f8f3e4]'
            return <div key={n} className={`max-w-prose rounded-lg border-l-4 p-4 text-sm ${c}`}>{b.title && <p className="font-semibold">{b.title}</p>}<p>{b.text}</p></div>
          }
          case 'doc':
            return (
              <figure key={n} className={`rounded-lg border border-warm-200 ${docTone[b.kind]} text-sm shadow-sm`} aria-label={b.title}>
                <figcaption className="flex items-center justify-between rounded-t-lg border-b border-warm-200 bg-sage-50 px-4 py-2">
                  <span className="font-semibold text-sage-900">{b.title}</span>
                  <span className="text-xs uppercase tracking-wider text-warm-600">{b.kind === 'email' ? 'Email' : b.kind === 'brief' ? 'Document' : b.kind === 'chat' ? 'Message' : 'Note'} · fictional</span>
                </figcaption>
                {b.meta && <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 border-b border-warm-200 px-4 py-2 text-xs">{b.meta.map(([k, v]) => <div key={k} className="contents"><dt className="font-semibold text-warm-600">{k}</dt><dd>{v}</dd></div>)}</dl>}
                <div className="space-y-2 px-4 py-3">{b.lines.map((l, i) => <p key={i}>{l}</p>)}</div>
              </figure>
            )
          case 'timeline': return <Timeline key={n} b={b} />
          case 'annotated': return <Annotated key={n} b={b} />
          case 'flow':
            return (
              <div key={n} className="card !p-4">
                {b.title && <p className="eyebrow mb-3">{b.title}</p>}
                <ol className="grid gap-3 md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
                  {b.steps.map((s, i) => (
                    <li key={s.label} className="relative rounded-lg border border-warm-200 bg-white p-3">
                      <span className="absolute -top-2 left-3 rounded bg-sage-700 px-1.5 text-xs font-bold text-white">{i + 1}</span>
                      <p className="mt-1 font-semibold text-sage-900">{s.label}</p><p className="mt-1 text-xs text-warm-600">{s.detail}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )
          case 'table':
            return (
              <div key={n} className="table-wrap"><table><caption className="sr-only">{b.caption}</caption>
                <thead><tr>{b.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
                <tbody>{b.rows.map((r, i) => <tr key={i}>{r.map((c, j) => j === 0 ? <th key={j} scope="row" className="p-3 text-left font-semibold align-top">{c}</th> : <td key={j}>{c}</td>)}</tr>)}</tbody></table></div>
            )
          case 'dialogue':
            return (
              <div key={n} className="space-y-2" role="list" aria-label="Conversation">
                {b.lines.map((l, i) => <p key={i} role="listitem" className="max-w-prose rounded-lg bg-white p-3 text-sm shadow-sm"><strong>{l.who}:</strong> “{l.text}”</p>)}
              </div>
            )
        }
      })}
    </div>
  )
}
