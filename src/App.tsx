import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LinkemPage } from './pages/LinkemPage'
import { ShowemPage } from './pages/ShowemPage'
import { MsgPage } from './pages/MsgPage'
import './App.css'

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/linkem" element={<LinkemPage />} />
        <Route path="/showem" element={<ShowemPage />} />
        <Route path="/msg" element={<MsgPage />} />
      </Routes>
    </Router>
  )
}

export default App
