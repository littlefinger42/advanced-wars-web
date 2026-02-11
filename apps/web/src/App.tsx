import { Routes, Route } from 'react-router-dom'
import Lobby from './pages/Lobby'
import MapSelect from './pages/MapSelect'
import Game from './pages/Game'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Lobby />} />
      <Route path="/map-select" element={<MapSelect />} />
      <Route path="/game/:roomCode" element={<Game />} />
    </Routes>
  )
}
