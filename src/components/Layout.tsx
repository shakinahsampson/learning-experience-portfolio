import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { clearAllProgress } from '../lib/storage'

const nav = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/lab', label: 'Learning Lab' },
  { to: '/toolkit', label: 'Toolkit' },
  { to: '/contact', label: 'Contact' },
]

export function Layout() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => {
    setOpen(false)
    window.scrollTo(0, 0)
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [loc.pathname])

  const link = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm font-medium border-b-2 ${isActive ? 'border-gold text-sage-900' : 'border-transparent text-warm-600 hover:text-sage-900'}`

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:p-3">Skip to main content</a>
      <header className="sticky top-0 z-40 border-b border-warm-200 bg-ivory/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/" className="font-serif text-xl text-sage-900">Shakinah Sampson</Link>
          <nav aria-label="Primary" className="hidden md:flex gap-1">
            {nav.map((n) => <NavLink key={n.to} to={n.to} end={n.end} className={link}>{n.label}</NavLink>)}
          </nav>
          <button type="button" className="md:hidden btn btn-ghost" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
        </div>
        {open && (
          <nav id="mobile-nav" aria-label="Primary mobile" className="md:hidden flex flex-col border-t border-warm-200 px-5 py-2">
            {nav.map((n) => <NavLink key={n.to} to={n.to} end={n.end} className={link}>{n.label}</NavLink>)}
          </nav>
        )}
      </header>
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <footer className="mt-24 border-t border-warm-200 bg-sage-900 text-sage-100">
        <div className="mx-auto max-w-6xl px-5 py-10 text-sm">
          <p className="max-w-3xl">
            <strong>Notice:</strong> All fictional organizations (e.g., Meridian Strategy Group), employees, datasets, and simulated outcomes in this portfolio are illustrative. They are independent portfolio projects, not client or employer work.
          </p>
          <p className="mt-3 max-w-3xl">
            <strong>Privacy:</strong> This site has no backend, analytics, or accounts. Optional learner progress and reflections are stored only in your browser’s localStorage.{' '}
            <button type="button" className="underline" onClick={() => { clearAllProgress(); alert('Saved progress on this device has been cleared.'); window.location.reload() }}>Clear saved progress</button>
          </p>
          <p className="mt-4 text-sage-300">© {new Date().getFullYear()} Shakinah Sampson ·{' '}
            <a className="underline" href="mailto:kinah93sampson@gmail.com">kinah93sampson@gmail.com</a> ·{' '}
            <a className="underline" href="https://shakinahsampson.github.io/learning-experience-portfolio/legacy/">Earlier prototype</a>
          </p>
        </div>
      </footer>
    </>
  )
}
