import { ProductButton } from '../components/ProductButton'

export function HomePage() {
  return (
    <>
      <main className="flex items-center justify-center min-h-screen w-full p-4 relative z-10">
        <div className="max-w-6xl w-full text-white text-center">
          <section className="mb-12">
            <h1 className="text-6xl font-bold mb-4 text-shadow">Buffer Flow</h1>
            <p className="text-lg opacity-90 leading-relaxed">
              I make little projects, usually software, to solve simple problems, or just to have fun!
            </p>
          </section>

          <section>
            <h2 className="text-4xl font-bold mb-8 opacity-95">Things</h2>
            <div className="flex flex-row flex-wrap justify-center items-center gap-8">
              <ProductButton
                name="Link'em"
                path="/linkem"
                description="Add and manage links on any website"
              />
              {/* <ProductButton
                name="Show'em"
                path="/showem"
                description="Create visual guides with markers, steps, and arrows"
              /> */}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
