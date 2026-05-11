import { Link } from 'react-router-dom'
import './ProductButton.css'

interface ProductButtonProps {
  name: string
  path: string
  description: string
}

export function ProductButton({ name, path, description }: ProductButtonProps) {
  return (
    <Link to={path} className="product-button">
      <div className="product-button-content">
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
    </Link>
  )
}
