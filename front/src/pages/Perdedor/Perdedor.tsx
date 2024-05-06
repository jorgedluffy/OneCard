import { useNavigate } from "react-router-dom";
import { socket } from "../../App";
import { useEffect } from "react";


export default function Perdedor() {
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
      <p>HAS PERDIDO</p>
      <button onClick={reiniciarPartida}>VOLVER A JUGAR</button>
    </>
  )
}

