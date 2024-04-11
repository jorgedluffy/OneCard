
import Jugador from './Jugador.js';

// Juego.js
export default class Juego {
  jugadoresConectados;
  partidaIniciada;

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
  //---

  anyadirJugador(id, nombre) {
    this.jugadoresConectados.push(new Jugador(id, nombre));
  }

  eliminarJugador(id) {
    this.jugadoresConectados = this.jugadoresConectados.filter(j => j.id !== id);
  }

  comprobarIniciarPartida() {
    this.partidaIniciada = this.jugadoresConectados.length == 2 && !this.partidaIniciada
  }

  iniciarPartida() {
    // Lógica principal del juego
  }

  reiniciarPartida() {
    console.log('Reiniciando partida');
    this.partidaIniciada = false;

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

}
