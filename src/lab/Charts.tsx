export interface Datum { label: string; value: number }

/** Accessible horizontal bar chart: SVG with role=img plus a real data table for screen readers. */
export function BarChart({ title, data, max, unit }: { title: string; data: Datum[]; max: number; unit: string }) {
  const rowH = 34
  const h = data.length * rowH + 8
  return (
    <figure className="card">
      <figcaption className="font-serif text-lg text-sage-900">{title}</figcaption>
      {data.length === 0 ? (
        <p className="mt-3 text-sm text-warm-600">No data for the current filters.</p>
      ) : (
        <>
          <svg viewBox={`0 0 400 ${h}`} role="img" aria-label={`${title}: ${data.map((d) => `${d.label} ${d.value}${unit}`).join(', ')}`} className="mt-3 w-full">
            {data.map((d, i) => {
              const w = Math.max(0, Math.min(1, d.value / max)) * 230
              return (
                <g key={d.label} transform={`translate(0 ${i * rowH + 4})`}>
                  <text x="0" y="18" fontSize="12" fill="#2b2d2c">{d.label}</text>
                  <rect x="120" y="4" width="230" height="20" rx="4" fill="#e4dfd5" />
                  <rect x="120" y="4" width={w} height="20" rx="4" fill="#3f5a4a" />
                  <text x="356" y="19" fontSize="12" fill="#2b2d2c" fontWeight="600">{d.value}{unit}</text>
                </g>
              )
            })}
          </svg>
          <details className="mt-2 text-sm">
            <summary className="cursor-pointer text-sage-700">View as table</summary>
            <table className="mt-2 w-full"><tbody>
              {data.map((d) => <tr key={d.label}><th scope="row" className="text-left font-normal pr-4">{d.label}</th><td>{d.value}{unit}</td></tr>)}
            </tbody></table>
          </details>
        </>
      )}
    </figure>
  )
}
