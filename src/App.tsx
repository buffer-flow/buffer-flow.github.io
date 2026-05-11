import { Routes, Route, HashRouter } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LinkemPage } from './pages/LinkemPage'
import { ShowemPage } from './pages/ShowemPage'
import { MsgPage } from './pages/MsgPage'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/linkem" element={<LinkemPage />} />
        <Route path="/showem" element={<ShowemPage />} />
        <Route path="/msg" element={<MsgPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
