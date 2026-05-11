import { AnimatedBackground } from '../components/AnimatedBackground'
import { ProductButton } from '../components/ProductButton'
import './HomePage.css'

export function HomePage() {
  return (
    <>
      <AnimatedBackground />
      <main className="home-container">
        <div className="home-content">
          <section className="about-section">
            <h1>BufferFlow</h1>
            <p className="tagline">
              Simplify how you share and explain web experiences
            </p>
            <p className="description">
              BufferFlow provides browser extensions that make it easy to create, 
              annotate, and share interactive web experiences with your team.
            </p>
          </section>

          <section className="products-section">
            <h2>Our Products</h2>
            <div className="products-grid">
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
