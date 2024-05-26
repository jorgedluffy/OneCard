import { useEffect } from "react"
import { socket } from "../../App"
import { useNavigate } from "react-router-dom";
import hasGanado from '../../assets/HAS-GANADO.png';


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
      <div className="fin-partida" >
        <img src={hasGanado} alt="ONE CARD GIF" />
      </div>
      <div className="fin-partida" >
        <button onClick={reiniciarPartida}><h1>VOLVER A JUGAR</h1></button>
      </div>
    </>
  )
}

