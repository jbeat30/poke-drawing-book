import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { SEOHead } from './layout'
import { HomePage } from './pages/HomePage'
import { PokemonDetailPage } from './pages/PokemonDetailPage'

function App() {
  return (
    <Router>
      <SEOHead />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pokemon/:name" element={<PokemonDetailPage />} />
      </Routes>
    </Router>
  )
}

export default App
