
import { useEffect, useState } from 'react'
import './App.css'
import io from 'socket.io-client'

const socket = io("/")


function App() {
  const [esTurnoActual, setEsTurnoActual] = useState(false)
  const [jugador, setJugador] = useState({} as any)

  useEffect(() => {
    socket.on('jugadores', jugadores => {
      setJugador(jugadores.filter((j: any) => j.id === socket.id)[0])

    })
    socket.on('partidaIniciada', mensaje => {
      console.log(mensaje)
    })
    socket.on('partidaReiniciada', mensaje => {
      console.log(mensaje)
    })
    socket.on('fasesIniciadas', mensaje => {
      console.log(mensaje)
    })
    socket.on('turnoActual', jugador => {
      setEsTurnoActual(jugador.id === socket.id)
    })
  })

  const robarCarta = () => socket.emit('robarCarta')
  const mostrarMano = () => {
    console.log(jugador.mano)
    return jugador.mano.map((m: any) => {
      console.log(m.nombre)
      return <p> Carta: {m.nombre}</p>

    })
  }

  return (
    <>
      <p >
        holiwiii
      </p>

      {esTurnoActual &&
        <>
          <p >
            ES TU TURNO
          </p>
          <button onClick={robarCarta}>ROBAR CARTA</button>
        </>
      }

      {
        jugador && jugador.mano && mostrarMano()
      }
    </>
  )
}

export default App
