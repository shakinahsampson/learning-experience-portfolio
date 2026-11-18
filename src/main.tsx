import { Component, type ReactNode, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes, Link } from 'react-router-dom'
import './index.css'
import { Layout } from './components/Layout'
import { Container } from './components/ui'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Lab from './pages/Lab'
import Toolkit from './pages/Toolkit'
import Contact from './pages/Contact'

class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed ? (
      <Container className="py-20" ><h1 className="text-3xl">Something went wrong</h1><p className="mt-3">Please <button className="underline" onClick={() => location.reload()}>reload the page</button>.</p></Container>
    ) : this.props.children
  }
}

const NotFound = () => (
  <Container className="py-20"><h1 className="text-3xl">Page not found</h1><p className="mt-3"><Link className="underline" to="/">Return home</Link></p></Container>
)

// HashRouter keeps deep links working on GitHub Pages (no server-side rewrites).
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:slug" element={<ProjectDetail />} />
            <Route path="lab" element={<Lab />} />
            <Route path="toolkit" element={<Toolkit />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  </StrictMode>,
)
