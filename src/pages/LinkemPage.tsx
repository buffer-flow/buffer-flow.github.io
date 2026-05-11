import { Link } from 'react-router-dom'
import { AnimatedBackground } from '../components/AnimatedBackground'

export function LinkemPage() {
  return (
    <>
      <AnimatedBackground />
      <div className="relative z-10 min-h-screen p-8 pt-16 text-white md:p-8">
        <div className="mx-auto mb-12 max-w-3xl">
          <Link to="/" className="mb-6 inline-block text-white/80 transition-opacity duration-300 hover:opacity-100">← Back to Home</Link>
          <h1 className="text-5xl font-bold text-shadow">Link'em</h1>
        </div>
        
        <main className="mx-auto max-w-3xl">
          <section className="mb-8 space-y-4 rounded-xl border border-white/20 bg-white/10 p-8 backdrop-blur-md">
            <h2 className="text-3xl font-bold">Add Links to Any Website</h2>
            <p className="text-lg leading-relaxed opacity-90">
              Link'em is a powerful browser extension that lets you add, manage, and share 
              links on any website. Perfect for annotating web pages with additional resources,
              references, or custom navigation paths.
            </p>
          </section>

          <section className="mb-8 space-y-4 rounded-xl border border-white/20 bg-white/10 p-8 backdrop-blur-md">
            <h2 className="text-3xl font-bold">Features</h2>
            <ul className="space-y-3 pl-0">
              <li className="relative pl-8 text-lg leading-relaxed opacity-90">
                <span className="absolute left-0 text-xl font-bold text-cyan-300">✓</span>
                Add links to any element on a webpage
              </li>
              <li className="relative pl-8 text-lg leading-relaxed opacity-90">
                <span className="absolute left-0 text-xl font-bold text-cyan-300">✓</span>
                Organize and categorize your links
              </li>
              <li className="relative pl-8 text-lg leading-relaxed opacity-90">
                <span className="absolute left-0 text-xl font-bold text-cyan-300">✓</span>
                Share annotated pages with your team
              </li>
              <li className="relative pl-8 text-lg leading-relaxed opacity-90">
                <span className="absolute left-0 text-xl font-bold text-cyan-300">✓</span>
                Store links for future reference
              </li>
              <li className="relative pl-8 text-lg leading-relaxed opacity-90">
                <span className="absolute left-0 text-xl font-bold text-cyan-300">✓</span>
                Visual link management interface
              </li>
            </ul>
          </section>

          <section className="mb-8 space-y-4 rounded-xl border border-white/20 bg-white/10 p-8 backdrop-blur-md">
            <h2 className="text-3xl font-bold">Get Started</h2>
            <p className="text-lg leading-relaxed opacity-90">Install the Link'em extension from your browser's extension store.</p>
          </section>
        </main>
      </div>
    </>
  )
}
