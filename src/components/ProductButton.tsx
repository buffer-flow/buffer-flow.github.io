import { Link } from 'react-router-dom'

interface ProductButtonProps {
  name: string
  path: string
  description: string
}

export function ProductButton({ name, path, description }: ProductButtonProps) {
  return (
    <Link
      to={path}
      className="inline-block px-12 py-8 m-4 bg-white/10 border-2 border-white/30 rounded-xl text-white transition-all duration-300 backdrop-blur-md hover:bg-white/20 hover:border-white/60 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2">{name}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </Link>
  )
}
