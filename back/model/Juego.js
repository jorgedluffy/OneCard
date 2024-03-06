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
  
  // Ejemplo de uso
  const jugador1 = new Jugador("Marina");
  const jugador2 = new Jugador("Sombrero de Paja");
  const juego = new Juego(jugador1, jugador2);
  
  
  // Iniciar el juego y realizar acciones según las reglas específicas.
  