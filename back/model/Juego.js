import { FASES, TRIPULACIONES } from './constants.js';
import Jugador from './Jugador.js';
// Juego.js
export default class Juego {
  jugadoresConectados;
  partidaIniciada;
  jugadorActual;
  tripulacion = 1;
  io;
  socket;

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

  setIo(io) {
    this.io = io;
  }

  setSocket(socket) {
    this.socket = socket;
    this.crearEventos();
  }
  //--- 

  // METODOS CONTROL INICIO PARTIDA
  anyadirJugador(id, nombre) {
    if (this.tripulacion == 1) {
      this.jugadoresConectados.push(new Jugador(id, nombre, TRIPULACIONES.MARINA));
      this.tripulacion++;
    }
    else
      this.jugadoresConectados.push(new Jugador(id, nombre, TRIPULACIONES.SOMBRERO_PAJA));
    this.enviarJugadores()
  }

  eliminarJugador(id) {
    this.jugadoresConectados = this.jugadoresConectados.filter(j => j.id !== id);
    this.enviarJugadores()
  }

  comprobarIniciarPartida() {
    this.partidaIniciada = this.jugadoresConectados.length == 2 && !this.partidaIniciada;
  }

  iniciarPartida() {
    console.log('Partida iniciada');
    this.io.emit('partidaIniciada', { mensaje: '¡La partida ha comenzado!' });

    this.jugadoresConectados.forEach(j => {
      // inicializarDeck
      j.inicializarCartas();
      j.barajarCartas();
      // jugadores roban cartas iniciales
      j.robarCartasIniciales();
    });

    if (this.io) {
      this.io.emit('fasesIniciadas', { mensaje: '¡Las fases han comenzado!' });
    }
    // inician fases
    this.jugadorActual = 0;
    this.jugadoresConectados[this.jugadorActual].setFaseActual(FASES.ROBAR)
    this.enviarJugadorActual();
    this.enviarJugadores();

  }

  reiniciarPartida() {
    console.log('Reiniciando partida');
    this.io.emit('partidaReiniciada', { mensaje: '¡La partida se ha reiniciado!' });
    this.partidaIniciada = false;
    this.enviarJugadores();
    //TODO: Reiniciar datos del juego o crear un nuevo objeto juego
  }

  //--- 

  // METODOS JUEGO
  cambiarJugador() {
    if (this.jugadorActual == 0) {
      this.jugadorActual = 1;
    } else {
      this.jugadorActual = 0;
    }
    this.jugadoresConectados[this.jugadorActual].setFaseActual(FASES.ROBAR);

    this.enviarJugadorActual();
  }


  //--- 

  // METODOS DE EVENTOS

  crearEventos() {
    if (this.socket) {
      this.socket.on('robarCarta', () => {
        this.jugadoresConectados[this.jugadorActual].robarCarta();
        this.jugadoresConectados[this.jugadorActual].setFaseActual(FASES.BAJAR_CAMPO);
        this.enviarJugadores();
      })
      this.socket.on('bajarCartaCampo', (carta) => {
        console.log('bajarCartaCampo')
        this.jugadoresConectados[this.jugadorActual].bajarCartaCampo(carta);
        this.jugadoresConectados[this.jugadorActual].setFaseActual(FASES.BAJAR_NO_CAMPO);
        this.enviarJugadores();
      })
      this.socket.on('bajarCarta', (carta) => {
        console.log('bajarCarta')
        this.jugadoresConectados[this.jugadorActual].bajarCarta(carta);
        if (this.jugadoresConectados[this.jugadorActual].esFasePrimera) {
          this.jugadoresConectados[this.jugadorActual].setFaseActual(FASES.ESPERA);
          this.jugadoresConectados[this.jugadorActual].finalizarPrimeraFase();
          this.cambiarJugador();
        }
        else if (this.esPrimeraFaseTerminada) {
          this.jugadoresConectados[this.jugadorActual].setFaseActual(FASES.ATACAR);
        }
        this.enviarJugadores();
      })
      this.socket.on('atacar', (carta) => {
        console.log('atacar')
        this.jugadoresConectados[this.jugadorActual].atacar(carta);
        this.jugadoresConectados[this.jugadorActual].setFaseActual(FASES.ESPERA);
        this.jugadoresConectados[this.jugadorActual].finalizarPrimeraFase();
        this.cambiarJugador();
        this.enviarJugadores();
      })
    }
  }

  atacar(carta) {
    console.log("Atacando")
    //TODO: Quitar puntos de vida al contrincante (jugador no actual)
  }


  esPrimeraFaseTerminada() {
    return !this.jugadoresConectados[0].esFasePrimera && !this.jugadoresConectados[1].esFasePrimera;
  }

  enviarJugadores() {
    if (this.io) {
      this.io.emit('jugadores', this.jugadoresConectados);
    }
  }
  enviarJugadorActual() {
    if (this.io) {
      this.io.emit('turnoActual', this.jugadoresConectados[this.jugadorActual]);
    }
  }
  //--- 
}
