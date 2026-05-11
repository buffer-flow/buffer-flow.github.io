import { Link } from 'react-router-dom'
import { AnimatedBackground } from '../components/AnimatedBackground'
import './ProductPage.css'

export function LinkemPage() {
  return (
    <>
      <AnimatedBackground />
      <div className="product-page">
        <header className="product-header">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>Link'em</h1>
        </header>
        
        <main className="product-content">
          <section className="intro-section">
            <h2>Add Links to Any Website</h2>
            <p>
              Link'em is a powerful browser extension that lets you add, manage, and share 
              links on any website. Perfect for annotating web pages with additional resources,
              references, or custom navigation paths.
            </p>
          </section>

          <section className="features-section">
            <h2>Features</h2>
            <ul className="features-list">
              <li>Add links to any element on a webpage</li>
              <li>Organize and categorize your links</li>
              <li>Share annotated pages with your team</li>
              <li>Store links for future reference</li>
              <li>Visual link management interface</li>
            </ul>
          </section>

          <section className="cta-section">
            <h2>Get Started</h2>
            <p>Install the Link'em extension from your browser's extension store.</p>
          </section>
        </main>
      </div>
    </>
  )
}
