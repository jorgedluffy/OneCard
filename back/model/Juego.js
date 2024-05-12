import { FASES, TRIPULACIONES, TIPO_CARTA } from './constants.js';
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
    this.jugadorActual = 0;
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
    let tripulacion = TRIPULACIONES.SOMBRERO_PAJA;
    if (this.jugadoresConectados.length > 0) {
      const tripulacionContrincante = this.jugadoresConectados[0].getTripulacion();
      if (tripulacionContrincante === 1) tripulacion = TRIPULACIONES.MARINA
    }
    this.jugadoresConectados.push(new Jugador(id, nombre, tripulacion));

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
    this.jugadoresConectados.forEach(j => j.resetearJugador())
    this.partidaIniciada = false;
    this.jugadorActual = 0;
    this.enviarJugadores();
  }

  //--- 

  // METODOS JUEGO
  cambiarJugador(estaDefendiendo = false) {
    if (this.jugadorActual == 0) {
      this.jugadorActual = 1;
    } else {
      this.jugadorActual = 0;
    }

    if (estaDefendiendo) this.jugadoresConectados[this.jugadorActual].setFaseActual(FASES.DEFENSA);
    else this.jugadoresConectados[this.jugadorActual].setFaseActual(FASES.ROBAR);

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
      this.socket.on('pasarTurno', () => {
        if (this.jugadoresConectados[this.jugadorActual].getFaseActual() === FASES.DEFENSA) {
          this.jugadoresConectados[this.jugadorActual].setFaseActual(FASES.ROBAR);
        }
        else {
          const nuevaFase = this.getNuevaFase()
          this.jugadoresConectados[this.jugadorActual].setFaseActual(nuevaFase);
          if (nuevaFase === FASES.ESPERA) {
            if (this.jugadoresConectados[this.jugadorActual].getEsFasePrimera())
              this.jugadoresConectados[this.jugadorActual].finalizarPrimeraFase();
            this.cambiarJugador()
          }
        }
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

        if (carta.tipo === TIPO_CARTA.MAGICA) {
          this.usarHabilidadMagica(carta)
          this.jugadoresConectados[this.jugadorActual].descartes.push(carta)
        } else {
          this.finalizarBajarCarta()
        }

        this.enviarJugadores();
      })
      this.socket.on('atacar', (carta) => {
        console.log('atacar')
        //TODO: mejorar para que no ataque y luego defienda, que se reste la defensa del ataque
        this.atacar(carta);
        this.jugadoresConectados[this.jugadorActual].setFaseActual(FASES.ESPERA);
        this.cambiarJugador(true);
        this.enviarJugadores();
      })
      this.socket.on('defender', (carta) => {
        console.log('defender')
        this.defender(carta)
        this.jugadoresConectados[this.jugadorActual].setFaseActual(FASES.ESPERA);
        this.io.emit('comprobarFinPartida', this.jugadoresConectados)
        this.jugadoresConectados[this.jugadorActual].setFaseActual(FASES.ROBAR);
        this.enviarJugadores();
      })
      this.socket.on('cartaMagicaBufoYCartaPersonaje', (cartas) => {
        if (cartas.cartaBufo.id === 11) {

          this.jugadoresConectados[this.jugadorActual].setTablero(this.jugadoresConectados[this.jugadorActual].tablero.map(c => {
            if (c.id == cartas.carta.id)

              return { ...c, defensa: c.defensa += cartas.cartaBufo.defensa }
            else
              return c
          }))
        }
        else if (cartas.cartaBufo.id === 13 || cartas.cartaBufo.id === 14) {
          this.jugadoresConectados[this.jugadorActual].setTablero(this.jugadoresConectados[this.jugadorActual].tablero.map(c => {
            if (c.id == cartas.carta.id)

              return { ...c, ataque: c.ataque += cartas.cartaBufo.ataque }
            else
              return c
          }))

        }
        this.finalizarBajarCarta()

        this.enviarJugadores();
      })
      this.socket.on('reiniciarPartida', () => {
        console.log('reiniciarPartida')
        this.reiniciarPartida();

        this.comprobarIniciarPartida();
        if (this.getPartidaIniciada()) {
          this.iniciarPartida()
        }
      })
    }
  }
  finalizarBajarCarta() {

    if (this.jugadoresConectados[this.jugadorActual].getEsFasePrimera()) {
      this.jugadoresConectados[this.jugadorActual].setFaseActual(FASES.ESPERA);
      this.jugadoresConectados[this.jugadorActual].finalizarPrimeraFase();
      this.cambiarJugador();
    }
    else if (this.esPrimeraFaseTerminada) {
      this.jugadoresConectados[this.jugadorActual].setFaseActual(FASES.ATACAR);
    }
  }

  usarHabilidadMagica(carta) {

    if (carta.id === 9 || carta.id === 10) {
      this.jugadoresConectados[this.jugadorActual].sumarVidas(carta.defensa)
      this.finalizarBajarCarta()
      return
    }

    if (carta.id === 12) {
      let jugadorContrincante = this.jugadorActual === 0 ? this.jugadoresConectados[1] : this.jugadoresConectados[0]
      jugadorContrincante.restarVidas(carta.ataque)
      this.finalizarBajarCarta()
      return
    }

    if (carta.id === 11 || carta.id === 13 || carta.id === 14) {
      this.jugadoresConectados[this.jugadorActual].faseActual = FASES.HABILIDAD_MAGICA

      this.io.emit('habilidadMagica', carta)
      this.enviarJugadores()
    }
    return
  }

  getNuevaFase() {
    const faseActual = this.jugadoresConectados[this.jugadorActual].getFaseActual();

    if (faseActual === FASES.BAJAR_CAMPO) return FASES.BAJAR_NO_CAMPO
    if (faseActual === FASES.BAJAR_NO_CAMPO && !this.jugadoresConectados[this.jugadorActual].getEsFasePrimera()) return FASES.ATACAR

    return FASES.ESPERA
  }
  atacar(carta) {
    console.log("Atacando")
    console.log(carta)

    const jugadorContrincante = this.jugadorActual === 0 ? 1 : 0;
    this.jugadoresConectados[jugadorContrincante].restarVidas(carta.ataque);
  }

  defender(carta) {
    console.log("Defendiendo")
    console.log(carta)

    this.jugadoresConectados[this.jugadorActual].sumarVidas(carta.defensa);
  }
  esPrimeraFaseTerminada() {
    return !this.jugadoresConectados[0].getEsFasePrimera() && !this.jugadoresConectados[1].getEsFasePrimera();
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
