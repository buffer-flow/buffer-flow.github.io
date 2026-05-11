import { Link } from 'react-router-dom'
import { AnimatedBackground } from '../components/AnimatedBackground'
import './ProductPage.css'

export function ShowemPage() {
  return (
    <>
      <AnimatedBackground />
      <div className="product-page">
        <header className="product-header">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>Show'em</h1>
        </header>
        
        <main className="product-content">
          <section className="intro-section">
            <h2>Create Visual Guides for Your Website</h2>
            <p>
              Show'em is a browser extension that empowers you to create interactive visual guides
              on any website. Add markers, steps, arrows, and annotations to show users exactly how
              to perform tasks on your web application.
            </p>
          </section>

          <section className="features-section">
            <h2>Features</h2>
            <ul className="features-list">
              <li>Add markers and highlights to elements</li>
              <li>Create step-by-step visual guides</li>
              <li>Draw arrows to direct attention</li>
              <li>Add detailed annotations and instructions</li>
              <li>Record and share video walkthroughs</li>
              <li>Customize appearance and branding</li>
            </ul>
          </section>

          <section className="cta-section">
            <h2>Get Started</h2>
            <p>Install the Show'em extension from your browser's extension store.</p>
          </section>
        </main>
      </div>
    </>
  )
}
