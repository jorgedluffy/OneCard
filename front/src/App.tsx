
import { useEffect } from 'react'
import './App.css'
import io from 'socket.io-client'

const socket = io("/")


function App() {

  useEffect(() => {
    socket.on('jugadores', jugadores => {
      console.log(jugadores)
    })
    socket.on('partidaIniciada', mensaje => {
      console.log(mensaje)
    })
    socket.on('partidaReiniciada', mensaje => {
      console.log(mensaje)
    })
  })

  return (
    <>
      <p >
        holiwiii
      </p>
    </>
  )
}

export default App
