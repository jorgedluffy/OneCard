
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Juego from './pages/Juego/Juego'
import Perdedor from './pages/Perdedor/Perdedor'
import Ganador from './pages/Ganador/Ganador'
import { io } from 'socket.io-client'

export const socket = io("/")

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Juego />} />
        <Route path="/perdedor" element={<Perdedor />} />
        <Route path="/ganador" element={<Ganador />} />
      </Routes>
    </BrowserRouter>

  )
}