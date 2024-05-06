import { useEffect } from "react"
import { socket } from "../../App"
import { useNavigate } from "react-router-dom";


export default function Ganador() {
  const navigate = useNavigate();
  useEffect(() => {
    socket.on('partidaReiniciada', mensaje => {
      console.log(mensaje)
      navigate("/");
    })
  })

  const reiniciarPartida = () => {
    socket.emit('reiniciarPartida')
  }

  return (
    <>
      <p>HAS GANADO</p>
      <button onClick={reiniciarPartida}>VOLVER A JUGAR</button>
    </>
  )
}

