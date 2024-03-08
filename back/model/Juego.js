// Juego.js
class Juego {
    constructor(jugador1, jugador2) {
      this.jugador1 = jugador1;
      this.jugador2 = jugador2;
      this.turnoActual = jugador1; // Comienza el turno del jugador1
    }
  
    faseRobo() {
      this.turnoActual.robarCarta();
      console.log('Fase de Robo');
    }
  
    fasePrincipal() {
      // Implementa la lógica de la fase principal
      console.log('Fase Principal');
    }
  
    faseCombate() {
      console.log('Fase de Combate');
      const jugadorActivo = this.turnoActual;
      const jugadorOponente = (jugadorActivo === this.jugador1) ? this.jugador2 : this.jugador1;
  
      jugadorActivo.faseCombate(jugadorOponente);
    }
  
    cambiarTurno() {
      this.turnoActual = (this.turnoActual === this.jugador1) ? this.jugador2 : this.jugador1;
      console.log(`Turno cambiado a ${this.turnoActual.nombre}`);
    }
  
    // Otras funciones y lógica de juego aquí...
  }
  
  module.exports = Juego;
  