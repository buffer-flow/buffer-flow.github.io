import { Link } from 'react-router-dom'

export function ShowemPage() {
  return (
    <>
      <div className="relative z-10 min-h-screen p-8 pt-16 text-white md:p-8">
        <div className="mx-auto mb-12 max-w-3xl">
          <Link to="/" className="mb-6 inline-block text-white/80 transition-opacity duration-300 hover:opacity-100">← Back to Home</Link>
          <h1 className="text-5xl font-bold text-shadow">Show'em</h1>
        </div>
        
        <main className="mx-auto max-w-3xl">
          <section className="mb-8 space-y-4 rounded-xl border border-white/20 bg-white/10 p-8 backdrop-blur-md">
            <h2 className="text-3xl font-bold">Create Visual Guides for Your Website</h2>
            <p className="text-lg leading-relaxed opacity-90">
              Show'em is a browser extension that empowers you to create interactive visual guides
              on any website. Add markers, steps, arrows, and annotations to show users exactly how
              to perform tasks on your web application.
            </p>
          </section>

          <section className="mb-8 space-y-4 rounded-xl border border-white/20 bg-white/10 p-8 backdrop-blur-md">
            <h2 className="text-3xl font-bold">Features</h2>
            <ul className="space-y-3 pl-0">
              <li className="relative pl-8 text-lg leading-relaxed opacity-90">
                <span className="absolute left-0 text-xl font-bold text-cyan-300">✓</span>
                Add markers and highlights to elements
              </li>
              <li className="relative pl-8 text-lg leading-relaxed opacity-90">
                <span className="absolute left-0 text-xl font-bold text-cyan-300">✓</span>
                Create step-by-step visual guides
              </li>
              <li className="relative pl-8 text-lg leading-relaxed opacity-90">
                <span className="absolute left-0 text-xl font-bold text-cyan-300">✓</span>
                Draw arrows to direct attention
              </li>
              <li className="relative pl-8 text-lg leading-relaxed opacity-90">
                <span className="absolute left-0 text-xl font-bold text-cyan-300">✓</span>
                Add detailed annotations and instructions
              </li>
              <li className="relative pl-8 text-lg leading-relaxed opacity-90">
                <span className="absolute left-0 text-xl font-bold text-cyan-300">✓</span>
                Record and share video walkthroughs
              </li>
              <li className="relative pl-8 text-lg leading-relaxed opacity-90">
                <span className="absolute left-0 text-xl font-bold text-cyan-300">✓</span>
                Customize appearance and branding
              </li>
            </ul>
          </section>

          <section className="mb-8 space-y-4 rounded-xl border border-white/20 bg-white/10 p-8 backdrop-blur-md">
            <h2 className="text-3xl font-bold">Get Started</h2>
            <p className="text-lg leading-relaxed opacity-90">Install the Show'em extension from your browser's extension store.</p>
          </section>
        </main>
      </div>
    </>
  )
}
