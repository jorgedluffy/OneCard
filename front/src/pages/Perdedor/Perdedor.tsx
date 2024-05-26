import { useNavigate } from "react-router-dom";
import { socket } from "../../App";
import { useEffect } from "react";
import hasPerdido from '../../assets/HAS-PERDIDO.png';


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
      <div className="fin-partida" >
        <img src={hasPerdido} alt="ONE CARD GIF" />
      </div>
      <div className="fin-partida" >
        <button onClick={reiniciarPartida}><h1>VOLVER A JUGAR</h1></button>
      </div>
    </>
  )
}

