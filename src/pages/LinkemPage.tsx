import { Link } from 'react-router-dom'
import { AnimatedBackground } from '../components/AnimatedBackground'


const LINKEM_DEMO_URL = 'https://buffer-flow.github.io/#/msg?for=linkem&name=import-link&base64=eyJjb25kaXRpb25zIjpbeyJjcmVhdGVkX2F0IjoiIiwiaWQiOiIiLCJsaW5rX2lkIjoiIiwidHlwZSI6InVybF9zdGFydCIsInZhbHVlIjoiaHR0cHM6Ly93d3cuZ29vZHJlYWRzLmNvbS9ib29rL3Nob3cvNjA1MzE0MDYtdHJlc3Mtb2YtdGhlLWVtZXJhbGQtc2VhIn0seyJjcmVhdGVkX2F0IjoiIiwiaWQiOiIiLCJsaW5rX2lkIjoiIiwidHlwZSI6InhwYXRoX2V4aXN0cyIsInZhbHVlIjoiLy9kaXZbQGlkPVwiX19uZXh0XCJdL2RpdlsyXS9tYWluWzFdL2RpdlsxXS9kaXZbMl0vZGl2WzJdL2RpdlsxXS9kaXZbMV0vaDFbMV0ifV0sImNyZWF0ZWRfYXQiOiIyMDI2LTA1LTExVDE4OjU0OjAxLjc5MloiLCJkaXNwbGF5X25hbWUiOiJDbGljayBoZXJlIiwiaHJlZl9mb3JtYXQiOiJodHRwczovL3d3dy5nb29nbGUuY29tL3NlYXJjaD9xPXt0ZXh0LXZhbHVlfSIsImljb24iOm51bGwsImlkIjoibG9jYWwtYzU2MDhmNjQtMTNkYi00Y2JmLWE3NzctMzZjNDU3N2YyYzc4LTc0OWU0YTZiLTEzNjItNDA0NC1iNDUxLWRhYWZjZDlhMjdkYSIsIm5hbWUiOiJMaW5rIG9uIEVtZXJhbGQiLCJvbl9zZWxlY3RlZF90ZXh0X3JlZ2V4IjoiRW1lcmFsZCIsIm9uX3hwYXRoIjoiLy9kaXZbQGlkPVwiX19uZXh0XCJdL2RpdlsyXS9tYWluWzFdL2RpdlsxXS9kaXZbMl0vZGl2WzJdL2RpdlsxXS9kaXZbMV0vaDFbMV0iLCJwb3NpdGlvbiI6Im5leHRfdG9fdGV4dCIsInVwZGF0ZWRfYXQiOiIyMDI2LTA1LTExVDE4OjU0OjAxLjc5MloiLCJ1c2VyX2lkIjoibG9jYWwtYzU2MDhmNjQtMTNkYi00Y2JmLWE3NzctMzZjNDU3N2YyYzc4IiwidmlzaWJpbGl0eSI6InByaXZhdGUifQ==&redirectUrl=https://www.goodreads.com/book/show/60531406-tress-of-the-emerald-sea';

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
            <a href={LINKEM_DEMO_URL} className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
              Try the Demo
            </a>
          </section>
        </main>
      </div>
    </>
  )
}
