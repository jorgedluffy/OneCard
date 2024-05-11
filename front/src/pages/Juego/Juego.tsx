
import { useEffect, useState } from 'react'
import './Juego.css'
import { FASES, TIPO_CARTA, TRIPULACIONES } from '../../constants'
import { useNavigate } from 'react-router-dom'
import { socket } from '../../App'
import GameCard from '../../components/GameCard/GameCard'
import { Grid } from '@mui/material'



function Juego() {
  const [esTurnoActual, setEsTurnoActual] = useState(false)
  const [jugador, setJugador] = useState({} as any)
  const [jugadorEnemigo, setJugadorEnemigo] = useState({} as any)

  const navigate = useNavigate();

  useEffect(() => {
    socket.on('jugadores', jugadores => {
      setJugador(jugadores.filter((j: any) => j.id === socket.id)[0])
      setJugadorEnemigo(jugadores.filter((j: any) => j.id !== socket.id)[0])
      console.log(jugador)

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
    socket.on('comprobarFinPartida', jugadores => {
      if (jugadores[0].vidas <= 0 || jugadores[1].vidas <= 0) {

        const jugadorActual = jugadores.filter((j: any) => j.id === socket.id)[0]
        if (jugadorActual.vidas <= 0) {
          navigate("/perdedor");

        } else {
          navigate("/ganador");
        }
      }
    })
  })


  const robarCarta = () => socket.emit('robarCarta')
  const pasarTurno = () => socket.emit('pasarTurno')

  const bajarCampo = (id: any) => {
    socket.emit('bajarCartaCampo', jugador.mano.find((carta: any) => carta.id == id))
  }

  const bajarCarta = (id: any) => {
    socket.emit('bajarCarta', jugador.mano.find((carta: any) => carta.id == id))
  }

  const atacar = (id: any) => {
    socket.emit('atacar', jugador.tablero.find((carta: any) => carta.id == id))
  }

  const defender = (id: any) => {
    socket.emit('defender', jugador.tablero.find((carta: any) => carta.id == id))
  }

  const isDisabledCard = (tipo: string): boolean => {
    if (jugador.faseActual === FASES.BAJAR_CAMPO && tipo === TIPO_CARTA.CAMPO) return false;
    else if (jugador.faseActual === FASES.BAJAR_NO_CAMPO && (tipo === TIPO_CARTA.PERSONAJE || tipo === TIPO_CARTA.MAGICA)) return false;
    else return true
  }

  const mostrarMano = () => {
    console.log(jugador.mano)

    return jugador.mano.map((carta: any) => {
      console.log(carta.nombre)

      if (carta.tipo === TIPO_CARTA.CAMPO) {
        return <GameCard {...carta} tipo='carta_campo' disabled={isDisabledCard(carta.tipo)} onClick={() => bajarCampo(carta.id)} />
      }
      else if (carta.tipo === TIPO_CARTA.PERSONAJE) {
        return <GameCard {...carta} tipo='carta_personaje' disabled={isDisabledCard(carta.tipo)} onClick={() => bajarCarta(carta.id)} />
      }
      else {
        return <GameCard {...carta} tipo='carta_magica' disabled={isDisabledCard(carta.tipo)} onClick={() => bajarCarta(carta.id)} />
      }

    })
  }

  const mostrarTablero = () => {
    console.log(jugador.tablero)
    const mana = jugador.campos.length;

    return jugador.tablero.map((carta: any) => {
      console.log(carta.nombre)
      if (jugador.faseActual === FASES.ATACAR)
        return <GameCard {...carta} tipo='carta_personaje' disabled={jugador.faseActual !== FASES.ATACAR || carta.energia > mana} onClick={() => atacar(carta.id)} />
      else if (jugador.faseActual === FASES.DEFENSA)
        return <GameCard {...carta} tipo='carta_personaje' disabled={jugador.faseActual !== FASES.DEFENSA} onClick={() => defender(carta.id)} />
      else
        return <GameCard {...carta} tipo='carta_personaje' disabled={true} />
    })
  }

  const mostrarTableroEnemigo = () => {
    console.log(jugadorEnemigo.tablero)

    return jugadorEnemigo.tablero.map((carta: any) => {
      console.log(carta.nombre)

      if (carta.tipo === TIPO_CARTA.PERSONAJE) {
        return <GameCard {...carta} tipo='carta_personaje' disabled={true} />
      }
      else {
        return <GameCard {...carta} tipo='carta_magica' disabled={true} />
      }

    })
  }

  const getFaseActual = () => {
    if (jugador.faseActual === FASES.ROBAR) return <>Robo</>
    else if (jugador.faseActual === FASES.BAJAR_CAMPO) return <>Bajar carta de campo</>
    else if (jugador.faseActual === FASES.BAJAR_NO_CAMPO) return <>Bajar carta personaje o magia</>
    else if (jugador.faseActual === FASES.ESPERA) return <>Esperar</>
    else if (jugador.faseActual === FASES.ATACAR) return <>Atacar</>
    else if (jugador.faseActual === FASES.DEFENSA) return <>Defensa</>
    else return <></>

  }

  return (
    <>

      <Grid container>
        <Grid item xs={2}>
          {
            jugador && jugador.descartes && <div className='campos-desk-contenido' >CAMPOS:  {jugador.campos.length}</div>
          }
          {
            jugador && jugador.deck && <div className='campos-desk-contenido mt10' >DECK: {jugador.deck.length}</div>
          }
        </Grid>
        <Grid item xs={8} className='texto-centrado'>
          <Grid container>
            <Grid item xs={6}>
              <h1>Tu tripulación es:  {jugador.tripulacion == TRIPULACIONES.MARINA ? "MARINA" : "MUGIWARA"} </h1>
            </Grid>
            <Grid item xs={6}>
              <h1>{esTurnoActual ? "Es tu turno" : "Turno del contrincante"}: {getFaseActual()} </h1>

            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2} >
          <div className='vidas-descartes'>
            <div className='vidas-descartes-contenido'>
              <div >Vidas: {jugador.vidas}</div>
              {jugadorEnemigo && <div >Vidas enemigo: {jugadorEnemigo.vidas}</div>}
            </div>

            {
              jugador && jugador.descartes && <div className='vidas-descartes-contenido mt10'>
                DESCARTES: {jugador.descartes.length}</div>
            }
          </div>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} className='contenido-centrado'>
          {esTurnoActual && jugador && jugador.faseActual !== FASES.ROBAR &&
            <button onClick={pasarTurno}>PASAR TURNO</button>
          }

          {esTurnoActual && jugador && jugador.faseActual === FASES.ROBAR &&
            <button onClick={robarCarta}>ROBAR CARTA</button>
          }
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          {
            jugadorEnemigo && jugadorEnemigo.tablero &&
            <Grid container>
              <Grid item xs={12} className='contenido-centrado'>
                <h2>TABLERO ENEMIGO</h2>
              </Grid>
              <Grid item xs={12} className='contenido-centrado'>
                {mostrarTableroEnemigo()}
              </Grid>
            </Grid>
          }
          <hr />
          {
            jugador && jugador.tablero &&
            <Grid container >
              <Grid item xs={12} className='contenido-centrado'>
                <h2>TABLERO</h2>
              </Grid>
              <Grid item xs={12} className='contenido-centrado'>
                {mostrarTablero()}
              </Grid>
            </Grid>
          }
          {
            jugador && jugador.mano &&
            <div className='contenedor max-content'>
              <div className='contenido-centrado max-content'>
                <h2>MANO</h2>
              </div>
              <div className='contenido-centrado max-content'>
                {mostrarMano()}
              </div>
            </div>
          }
        </Grid>
      </Grid >
    </>
  )
}

export default Juego
