// Juego.js
class Juego {
    constructor(jugador1, jugador2) {
      this.jugador1 = jugador1;
      this.jugador2 = jugador2;
      this.turnoActual = jugador1; // Comienza el turno del jugador1
    }
  
    cambiarTurno() {
      this.turnoActual = (this.turnoActual === this.jugador1) ? this.jugador2 : this.jugador1;
    }
  
    // Otras funciones y lógica de juego aquí...
  }
  
  module.exports = Juego;
  