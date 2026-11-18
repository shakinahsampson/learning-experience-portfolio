const base = 'h-full w-full'

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 320 150" className={base} role="img" aria-label={label} focusable="false">
      <rect width="320" height="150" fill="#eef3ee" />
      {children}
    </svg>
  )
}

export function Preview({ slug }: { slug: string }) {
  if (slug === 'elevate')
    return (
      <Frame label="Illustration: a six-phase 90-day onboarding roadmap">
        <line x1="30" y1="80" x2="290" y2="80" stroke="#3f6350" strokeWidth="3" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <circle cx={30 + i * 52} cy="80" r="13" fill={i < 4 ? '#3f6350' : '#fdfaf3'} stroke="#3f6350" strokeWidth="2" />
            <text x={30 + i * 52} y="85" textAnchor="middle" fontSize="12" fontWeight="700" fill={i < 4 ? '#fff' : '#2f4a3c'}>{i + 1}</text>
            <rect x={14 + i * 52} y={i % 2 ? 104 : 38} width="32" height="8" rx="3" fill="#cbd8cb" />
          </g>
        ))}
        <text x="30" y="22" fontSize="11" fill="#2f4a3c" fontFamily="serif">Day 0 → Day 90</text>
      </Frame>
    )
  if (slug === 'launchpad')
    return (
      <Frame label="Illustration: a project board with three columns of task cards">
        {['To do', 'In progress', 'Blocked'].map((h, c) => (
          <g key={h}>
            <rect x={14 + c * 100} y="14" width="92" height="122" rx="6" fill="#fdfaf3" stroke="#cbd8cb" />
            <text x={22 + c * 100} y="30" fontSize="9" fontWeight="700" fill="#2f4a3c">{h}</text>
            {[0, 1, 2].slice(0, c === 2 ? 1 : 3).map((r) => (
              <g key={r}>
                <rect x={20 + c * 100} y={38 + r * 31} width="80" height="26" rx="4" fill="#fff" stroke="#cbd8cb" />
                <rect x={25 + c * 100} y={44 + r * 31} width="46" height="4" rx="2" fill="#9fb59f" />
                <rect x={25 + c * 100} y={53 + r * 31} width="22" height="4" rx="2" fill={c === 2 ? '#9b2c2c' : '#c9a74a'} />
              </g>
            ))}
          </g>
        ))}
      </Frame>
    )
  if (slug === 'coachforward')
    return (
      <Frame label="Illustration: a branching dialogue between a manager and an employee">
        <rect x="16" y="16" width="150" height="30" rx="10" fill="#3f6350" />
        <rect x="26" y="27" width="100" height="5" rx="2" fill="#fff" opacity=".8" />
        <rect x="154" y="56" width="150" height="30" rx="10" fill="#fff" stroke="#cbd8cb" />
        <rect x="164" y="67" width="90" height="5" rx="2" fill="#9fb59f" />
        <path d="M40 100 L40 112 M40 112 L100 112 M40 112 L40 126 M100 112 L100 126 M100 112 L160 112 L160 126" stroke="#8a6d1f" strokeWidth="2" fill="none" />
        {[40, 100, 160].map((x) => <circle key={x} cx={x} cy="132" r="6" fill="#c9a74a" />)}
        <text x="200" y="124" fontSize="11" fill="#2f4a3c" fontFamily="serif">S · B · I · A</text>
      </Frame>
    )
  return (
    <Frame label="Illustration: a bar chart and trend line">
      {[40, 62, 50, 82, 70, 96].map((h, i) => <rect key={i} x={28 + i * 44} y={128 - h} width="28" height={h} rx="3" fill={i === 5 ? '#c9a74a' : '#3f6350'} />)}
      <polyline points="42,86 86,70 130,78 174,50 218,58 262,34" fill="none" stroke="#2b2b2b" strokeWidth="2" />
      <line x1="20" y1="128" x2="300" y2="128" stroke="#9fb59f" />
    </Frame>
  )
}
