import { AnimatedBackground } from '../components/AnimatedBackground'
import { ProductButton } from '../components/ProductButton'

export function HomePage() {
  return (
    <>
      <AnimatedBackground />
      <main className="flex items-center justify-center min-h-screen w-full p-8 relative z-10">
        <div className="max-w-3xl w-full text-white text-center">
          <section className="mb-12">
            <h1 className="text-6xl font-bold mb-4 text-shadow">BufferFlow</h1>
            <p className="text-2xl font-light mb-6 opacity-95">
              Simplify how you share and explain web experiences
            </p>
            <p className="text-lg opacity-90 leading-relaxed">
              BufferFlow provides browser extensions that make it easy to create, 
              annotate, and share interactive web experiences with your team.
            </p>
          </section>

          <section>
            <h2 className="text-4xl font-bold mb-8 opacity-95">Our Products</h2>
            <div className="flex flex-wrap justify-center gap-8">
              <ProductButton
                name="Link'em"
                path="/linkem"
                description="Add and manage links on any website"
              />
              <ProductButton
                name="Show'em"
                path="/showem"
                description="Create visual guides with markers, steps, and arrows"
              />
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
