import { Container, PageHeader } from '../components/ui'

export default function Contact() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="Let’s connect" lead="I’m open to Instructional Designer, Learning Experience Designer, L&D, onboarding, training, program coordination, talent development, and digital adoption roles." />
      <Container className="pb-8">
        <ul className="grid gap-5 md:grid-cols-2">
          <li className="card"><h2 className="text-lg">Email</h2><p className="mt-2"><a className="underline text-sage-700" href="mailto:kinah93sampson@gmail.com?subject=Learning%20%26%20Development%20opportunity">kinah93sampson@gmail.com</a></p></li>
          <li className="card"><h2 className="text-lg">Earlier prototype</h2><p className="mt-2"><a className="underline text-sage-700" href="https://shakinahsampson.github.io/learning-experience-portfolio/legacy/">“From Knowledge to Action” (12-screen onboarding demo)</a></p></li>
          <li className="card"><h2 className="text-lg">Portfolio site</h2><p className="mt-2"><a className="underline text-sage-700" href="https://shakinahsampson.github.io/learning-experience-portfolio/">shakinahsampson.github.io/learning-experience-portfolio</a></p></li>
        </ul>
        <p className="mt-8 max-w-2xl text-sm text-warm-600">This site has no contact form or backend, so nothing you type is collected. Email goes directly to me.</p>
      </Container>
    </>
  )
}
