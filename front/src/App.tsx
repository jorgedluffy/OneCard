
import { useEffect, useState } from 'react'
import './App.css'
import io from 'socket.io-client'
import { FASES, TIPO_CARTA, TRIPULACIONES } from './constants'

const socket = io("/")


function App() {
  const [esTurnoActual, setEsTurnoActual] = useState(false)
  const [jugador, setJugador] = useState({} as any)
  const [jugadorEnemigo, setJugadorEnemigo] = useState({} as any)

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
        return <button disabled={isDisabledCard(carta.tipo)} className='carta_campo' onClick={() => bajarCampo(carta.id)}  > Carta: {carta.nombre}</button>
      }
      else if (carta.tipo === TIPO_CARTA.PERSONAJE) {
        return <button disabled={isDisabledCard(carta.tipo)} className='carta_personaje' onClick={() => bajarCarta(carta.id)}  > Carta: {carta.nombre}</button>
      }
      else {
        return <button disabled={isDisabledCard(carta.tipo)} className='carta_magica' onClick={() => bajarCarta(carta.id)}  > Carta: {carta.nombre}</button>
      }

    })
  }
  const mostrarTablero = () => {
    console.log(jugador.tablero)

    return jugador.tablero.map((carta: any) => {
      console.log(carta.nombre)

      if (carta.tipo === TIPO_CARTA.PERSONAJE) {
        return <button disabled={jugador.faseActual !== FASES.ATACAR} className='carta_personaje' onClick={() => atacar(carta.id)}  > Carta: {carta.nombre}</button>
      }
      else {
        return <button disabled={true} className='carta_magica'  > Carta: {carta.nombre}</button>
      }

    })
  }

  const mostrarTableroEnemigo = () => {
    console.log(jugadorEnemigo.tablero)

    return jugadorEnemigo.tablero.map((carta: any) => {
      console.log(carta.nombre)

      if (carta.tipo === TIPO_CARTA.PERSONAJE) {
        return <button disabled={true} className='carta_personaje'> Carta: {carta.nombre}</button >
      }
      else {
        return <button disabled={true} className='carta_magica'  > Carta: {carta.nombre}</button>
      }

    })
  }

  const mostrarCampo = () => {
    console.log(jugador.campos)

    return jugador.campos.map((carta: any) => {
      console.log(carta.nombre)

      return <button disabled={true} className='carta_campo' > Carta: {carta.nombre}</button>


    })
  }


  const getFaseActual = () => {
    if (jugador.faseActual === FASES.ROBAR) return <>Robo</>
    else if (jugador.faseActual === FASES.BAJAR_CAMPO) return <>Bajar carta de campo</>
    else if (jugador.faseActual === FASES.BAJAR_NO_CAMPO) return <>Bajar carta personaje o magia</>
    else if (jugador.faseActual === FASES.ESPERA) return <>Turno del contrincante</>
    else if (jugador.faseActual === FASES.ATACAR) return <>Atacar</>
    else return <></>

  }

  return (
    <>
      <div className='vidas'>Vidas: {jugador.vidas}</div>
      {/* {JSON.stringify(jugador)} */}

      <h1>Tu tripulación es:  {jugador.tripulacion == TRIPULACIONES.MARINA ? "MARINA" : "MUGIWARA"} </h1>
      <h1>Es el turno de:  {esTurnoActual ? "Es tu turno" : "Turno del contrincante"} </h1>
      <h1>Fase actual:  {getFaseActual()} </h1>

      {esTurnoActual && jugador && jugador.faseActual !== FASES.ROBAR &&
        <button onClick={pasarTurno}>PASAR TURNO</button>
      }

      {esTurnoActual && jugador && jugador.faseActual === FASES.ROBAR &&
        <button onClick={robarCarta}>ROBAR CARTA</button>
      }
      {
        jugador && jugador.mano && <div className='contenedor'><h2>MANO</h2>{mostrarMano()}</div>
      }
      {
        jugador && jugador.tablero && <div className='contenedor'><h2>TABLERO</h2>{mostrarTablero()}</div>
      }
      {
        jugador && jugador.campos && <div className='contenedor'><h2>CAMPOS: {jugador.campos.length} </h2>{mostrarCampo()}</div>
      }
      {
        jugadorEnemigo && jugadorEnemigo.tablero && <div className='contenedor'><h2>TABLERO ENEMIGO</h2>{mostrarTableroEnemigo()}</div>
      }
    </>
  )
}

export default App
