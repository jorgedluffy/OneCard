import { FASES, TRIPULACIONES, TIPO_CARTA } from './constants.js';
import Jugador from './Jugador.js';
// Juego.js
export default class Juego {
  jugadoresConectados;
  partidaIniciada;
  jugadorActual;
  tripulacion = 1;
  cartaSeleccionada;
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
  anyadirJugador(id, nombre, trip) {
    this.jugadoresConectados.push(new Jugador(id, nombre, trip));
  }

  eliminarJugador(id) {
    this.jugadoresConectados = this.jugadoresConectados.filter(j => j.id !== id);

    this.enviarJugadores()
  }

  comprobarIniciarPartida() {
    this.partidaIniciada = this.jugadoresConectados.length == 2 && !this.partidaIniciada;
  }

  async iniciarPartida() {
    console.log('Partida iniciada');
    this.io.emit('partidaIniciada', { mensaje: '¡La partida ha comenzado!' });

    // Esperar a que todos los jugadores inicialicen sus cartas
    await Promise.all(this.jugadoresConectados.map(async (jugador) => {
      await jugador.inicializarCartas();
      jugador.barajarCartas();
      jugador.robarCartasIniciales();
    }));

    if (this.io) {
      this.io.emit('fasesIniciadas', { mensaje: '¡Las fases han comenzado!' });
    }

    // Iniciar fases
    this.jugadorActual = 0;
    this.jugadoresConectados[this.jugadorActual].setFaseActual(FASES.ROBAR);
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
  cambiarJugador(cambiarEstado = true, estaDefendiendo = false) {
    if (this.jugadorActual == 0) {
      this.jugadorActual = 1;
    } else {
      this.jugadorActual = 0;
    }

    if (cambiarEstado) {
      if (estaDefendiendo) this.jugadoresConectados[this.jugadorActual].setFaseActual(FASES.DEFENSA);
      else this.jugadoresConectados[this.jugadorActual].setFaseActual(FASES.ROBAR);
    }

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
      this.socket.on('esperarDefensa', (carta) => {
        console.log('esperarDefensa')
        this.cartaSeleccionada = carta;
        this.jugadoresConectados[this.jugadorActual].setFaseActual(FASES.ESPERA);
        this.cambiarJugador(true, true);
        this.enviarJugadores();
      })
      this.socket.on('atacar', () => {
        console.log('atacar')
        this.jugadoresConectados[this.jugadorActual].restarVidas(this.cartaSeleccionada.ataque)
        this.jugadoresConectados[this.jugadorActual].setFaseActual(FASES.ESPERA);
        this.io.emit('comprobarFinPartida', this.jugadoresConectados)
        this.jugadoresConectados[this.jugadorActual].setFaseActual(FASES.ROBAR);

        this.enviarJugadores();
      })
      this.socket.on('defender', (cartaDefensa) => {
        console.log('defender')
        this.defender(cartaDefensa)
        this.enviarJugadores();
        this.cartaSeleccionada = null;
      })
      this.socket.on('cartaMagicaBufoYCartaPersonaje', (cartas) => {
        if (cartas.cartaBufo.nombre === "Defensa Franky Shogun") {

          this.jugadoresConectados[this.jugadorActual].setTablero(this.jugadoresConectados[this.jugadorActual].tablero.map(c => {
            if (c.id == cartas.carta.id)

              return { ...c, defensa: c.defensa += cartas.cartaBufo.defensa }
            else
              return c
          }))
        }
        else if (cartas.cartaBufo.nombre === "Enma" || cartas.cartaBufo.nombre === "Murakumogiri") {
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

    if (carta.nombre === "Cura Chopper" || carta.nombre === "Cura Hiriluk") {
      this.jugadoresConectados[this.jugadorActual].sumarVidas(carta.defensa)
      this.finalizarBajarCarta()
      return
    }

    if (carta.nombre === "Dial de Impacto") {
      let jugadorContrincante = this.jugadorActual === 0 ? this.jugadoresConectados[1] : this.jugadoresConectados[0]
      jugadorContrincante.restarVidas(carta.ataque)
      this.finalizarBajarCarta()
      return
    }

    if (carta.nombre === "Defensa Franky Shogun" || carta.nombre === "Enma" || carta.nombre === "Murakumogiri") {
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

  defender(cartaDefensa) {
    console.log("carta defensa", cartaDefensa)

    if (this.cartaSeleccionada) {
      if (this.cartaSeleccionada.ataque > cartaDefensa.defensa) {
        // Se resta vida, se descarta carta de defensa, se confirma si hay ganador y sino se continua
        console.log("cartaAtaque > cartaDefensa")
        let vidaPerdida = this.cartaSeleccionada.ataque - cartaDefensa.defensa
        this.jugadoresConectados[this.jugadorActual].restarVidas(vidaPerdida)

        this.jugadoresConectados[this.jugadorActual].tablero = this.jugadoresConectados[this.jugadorActual].tablero.filter(c => c.id !== cartaDefensa.id)
        if (cartaDefensa.tipo === TIPO_CARTA.PERSONAJE)
          this.jugadoresConectados[this.jugadorActual].descartes.push(cartaDefensa)

        this.jugadoresConectados[this.jugadorActual].setFaseActual(FASES.ESPERA);
        this.io.emit('comprobarFinPartida', this.jugadoresConectados)
        this.jugadoresConectados[this.jugadorActual].setFaseActual(FASES.ROBAR);
      }
      else if (this.cartaSeleccionada.ataque < cartaDefensa.defensa) {
        // Se cambia de jugador, se descarta la carta de ataque y volvemos al jugador que defiende. Se pasa a fase de robo.
        console.log("cartaAtaque < cartaDefensa")
        this.cambiarJugador(false)
        this.jugadoresConectados[this.jugadorActual].tablero = this.jugadoresConectados[this.jugadorActual].tablero.filter(c => c.id !== this.cartaSeleccionada.id)
        if (this.cartaSeleccionada.tipo === TIPO_CARTA.PERSONAJE)
          this.jugadoresConectados[this.jugadorActual].descartes.push(this.cartaSeleccionada)

        this.cambiarJugador()

        this.jugadoresConectados[this.jugadorActual].setFaseActual(FASES.ROBAR);
      }
      else if (this.cartaSeleccionada.ataque === cartaDefensa.defensa) {
        //iguales nada (las dos cartas descartes)
        //se descarta carta de defensa, se cambia al jugador de ataque, se descarta carta ataque, se vuelve a jugador defensor y se cambia estado a robo.
        console.log("cartaAtaque = cartaDefensa")
        this.jugadoresConectados[this.jugadorActual].tablero = this.jugadoresConectados[this.jugadorActual].tablero.filter(c => c.id !== cartaDefensa.id)
        if (cartaDefensa.tipo === TIPO_CARTA.PERSONAJE)
          this.jugadoresConectados[this.jugadorActual].descartes.push(cartaDefensa)
        this.cambiarJugador(false)
        this.jugadoresConectados[this.jugadorActual].tablero = this.jugadoresConectados[this.jugadorActual].tablero.filter(c => c.id !== this.cartaSeleccionada.id)
        if (this.cartaSeleccionada.tipo === TIPO_CARTA.PERSONAJE)
          this.jugadoresConectados[this.jugadorActual].descartes.push(this.cartaSeleccionada)

        this.cambiarJugador() // Al no pasar parametros, cambia a estado robar
      } else {
        console.log("Error al recibir las cartas")
      }
    }
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
