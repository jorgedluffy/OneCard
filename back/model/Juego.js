import { TRIPULACIONES } from '../constants.js';
import Jugador from './Jugador.js';
// Juego.js
export default class Juego {
  jugadoresConectados;
  partidaIniciada;
  jugadorActual;
  tripulacion = 1;
  io;

  constructor() {
    this.partidaIniciada = false;
    this.jugadoresConectados = [];
  }

  // GETTERS Y SETTERS
  getJugadoresConectados() {
    return this.jugadoresConectados;
  }

  getPartidaIniciada() {
    return this.partidaIniciada;
  }

  getJugadorActual() {
    return this.jugadorActual;
  }
  //---

  setSocket(socket) {
    this.io = socket;
  }
  anyadirJugador(id, nombre) {
    if (this.tripulacion == 1) {
      this.jugadoresConectados.push(new Jugador(id, nombre, TRIPULACIONES.MARINA));
      this.tripulacion++;
    }
    else
      this.jugadoresConectados.push(new Jugador(id, nombre, TRIPULACIONES.SOMBRERO_PAJA));
  }

  eliminarJugador(id) {
    this.jugadoresConectados = this.jugadoresConectados.filter(j => j.id !== id);
  }

  comprobarIniciarPartida() {
    this.partidaIniciada = this.jugadoresConectados.length == 2 && !this.partidaIniciada;
  }

  iniciarPartida() {
    this.jugadoresConectados.forEach(j => {
      // inicializarDeck
      j.inicializarCartas();
      j.barajarCartas();
      // jugadores roban cartas iniciales
      j.robarCartasIniciales();
    });

    this.io.emit('fasesIniciadas', { mensaje: '¡Las fases han comenzado!' });
    // inician fases
    this.cambiarJugador()

  }

  cambiarJugador() {
    if (this.jugadorActual == 0) {
      this.jugadorActual = 1;
    } else {
      this.jugadorActual = 0;
    }
    this.io.emit('turnoActual', this.jugadoresConectados[this.jugadorActual]);
  }


  // faseRobo() {
  //   this.turnoActual.robarCarta();
  //   console.log('Fase de Robo');
  // }

  // fasePrincipal() {
  //   console.log('Fase Principal');
  // }

  // faseCombate() {
  //   console.log('Fase de Combate');
  //   const jugadorActivo = this.turnoActual;
  //   const jugadorOponente = (jugadorActivo === this.jugador1) ? this.jugador2 : this.jugador1;

  //   jugadorActivo.faseCombate(jugadorOponente);
  // }

  // cambiarTurno() {
  //   this.turnoActual = (this.turnoActual === this.jugador1) ? this.jugador2 : this.jugador1;
  //   console.log(`Turno cambiado a ${this.turnoActual.nombre}`);
  // }

  reiniciarPartida() {
    console.log('Reiniciando partida');
    this.partidaIniciada = false;

  }
}
