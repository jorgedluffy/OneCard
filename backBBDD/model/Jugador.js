
import Carta from './Carta.js'
// import mongoose from 'mongoose'
//import { obtenerCartasPorTripulacion } from './CartaController.js';
import { TRIPULACIONES, CARTAS_INICIALES, FASES, TIPO_CARTA } from './constants.js';

export default class Jugador {
  id;
  nombre;
  tripulacion;
  faseActual;
  esFasePrimera;
  mana;
  vidas;
  tablero;
  mano;
  deck;
  campos;
  descartes;

  constructor(id, nombre, tripulacion) {
    this.id = id;
    this.nombre = nombre;
    this.tripulacion = tripulacion; //TODO: Cambiar por TRIPULACIONES.SIN_TRIPULACION cuando se implemente que el usuario pueda elegir su tripulación
    this.faseActual = FASES.ESPERA;
    this.esFasePrimera = true;
    this.mana = 0;
    this.vidas = 20;
    this.tablero = []; //Cartas de no campo en mesa
    this.mano = []; //Cartas en Mano
    this.deck = []; //Cartas en Baraja
    this.campos = []; //Cartas de campo en mesa
    this.descartes = []; //Cartas descartadas o usadas
  }


  setTablero(tablero) {
    this.tablero = tablero;
  }
  // inicializarDatos() {
  //   inicializarCartasDesdeBD();
  //   this.inicializarCartas();
  // }


  // setMana() {
  //   this.mana = this.campos.length();
  // }
  getTripulacion() {
    return this.tripulacion;
  }

  restarVidas(vidasPerdida) {
    this.vidas -= vidasPerdida;
  }

  sumarVidas(vidasExtra) {
    this.vidas += vidasExtra;
  }
  getFaseActual() {
    return this.faseActual;
  }
  setFaseActual(faseActual) {
    this.faseActual = faseActual;
  }

  getEsFasePrimera() {
    return this.esFasePrimera
  }

  finalizarPrimeraFase() {
    this.esFasePrimera = false;
  }

  robarCartasIniciales() {
    for (var i = 0; i < CARTAS_INICIALES; i++) this.robarCarta();
  }

  robarCarta() {
    if (this.deck.length > 0) {
      const carta = this.deck.pop();
      this.mano.push(carta);
      console.log(`${this.nombre} roba una carta: ${carta.nombre}`);
    }
  }

  obtenerRandom(a, b) {
    return Math.random() - 0.5;
  }

  barajarCartas() {
    this.deck = this.deck.sort((a, b) => this.obtenerRandom());
  }



  // jugarCartaAlTablero(carta) {
  //   //this.mano.remove(carta)
  //   this.tablero.push(carta);
  //   console.log(`${this.nombre} juega ${carta.nombre} al tablero.`);
  // }

  // // Método para añadir una carta a la base de datos
  // async agregarCartaALaBD(nuevaCarta) {
  //   try {
  //     // Asegurarse de que la nueva carta sea una instancia de la clase Carta
  //     if (!(nuevaCarta instanceof Carta)) {
  //       throw new Error('El objeto proporcionado no es una instancia de Carta.');
  //     }

  //     // Guardar la nueva carta en la base de datos
  //     const cartaGuardada = await CartaController.guardarCarta(nuevaCarta);
  //     console.log(`Carta ${nuevaCarta.nombre} guardada en la base de datos.`);
  //     return cartaGuardada;
  //   } catch (error) {
  //     console.error('Error al agregar carta a la base de datos:', error);
  //     throw error;
  //   }
  // }
  // async inicializarCartasDesdeBD() {
  //   try {
  //     // Recuperar cartas específicas para el jugador desde la base de datos
  //     const cartasDesdeBD = await obtenerCartasPorTripulacion(this.tipoTripulacion);

  //     // Asignar las cartas recuperadas al deck del jugador
  //     this.deck = cartasDesdeBD;

  //     // También puedes realizar operaciones adicionales según sea necesario

  //   } catch (error) {
  //     console.error('Error al obtener cartas desde la base de datos:', error);
  //     throw error;
  //   }
  // }
  inicializarCartas() {
    // Crear instancias de cartas según el tipo de tripulación
    if (this.tripulacion === TRIPULACIONES.SOMBRERO_PAJA) {
      this.inicializarCartasSombreroDePaja();
    } else if (this.tripulacion === TRIPULACIONES.MARINA) {
      this.inicializarCartasMarina();
    }
  }

  //TODO: Implementar obtención de cartas desde BBDD
  getCartasMagicas() {
    getCartasMagicas().then(cartasMagicas => {
      console.log(cartasMagicas);
      // Aquí puedes hacer lo que necesites con las cartas mágicas obtenidas
    });
  }

  //TODO: Implementar obtención de cartas desde BBDD
  inicializarCartasSombreroDePaja() {
    getCartasTripulacion("Sombrero de Paja").then(cartasTripulacion => {
      console.log(cartasTripulacion);
      // Aquí puedes hacer lo que necesites con las cartas mágicas obtenidas
    });
    /*
        this.deck = [luffy, zoro, sanji, nami, usopp, nami, usopp, nami, usopp, nami, usopp, nami, usopp, nami, usopp, nami, usopp,
          robin, chopper, franky, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara,
          campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara,
          ...this.getCartasMagicas()];
    */
  }


  //TODO: Implementar obtención de cartas desde BBDD
  inicializarCartasMarina() {
    getCartasTripulacion("Marina").then(cartasTripulacion => {
      console.log(cartasTripulacion);
      // Aquí puedes hacer lo que necesites con las cartas mágicas obtenidas
    });
    /*
        this.deck = [akainu, kizaru, smoker, kuzan, fujitora, doflamingo, tashigi, garp, tashigi, garp, tashigi, garp, tashigi, garp, tashigi, garp, tashigi, garp,
          tashigi, garp, tashigi, garp, tashigi, garp, campoMarina, campoMarina, campoMarina, campoMarina, campoMarina, campoMarina,
          campoMarina, campoMarina, campoMarina, campoMarina, campoMarina, campoMarina, campoMarina, campoMarina,
          ...this.getCartasMagicas()];
          */
  }

  bajarCartaCampo(carta) {
    console.log("Bajando carta de campo")
    const campo = this.mano.filter(c => c.id === carta.id)
    console.log('cartas de campo:', campo)
    if (campo.length > 0) {
      const nocampo = this.mano.filter(c => c.id !== carta.id)
      console.log('campo antes del pop', campo)
      campo.pop()
      console.log('campo después del pop', campo)
      this.mano = [...nocampo, ...campo]
      this.campos.push(carta)
    }
  }

  bajarCarta(carta) {
    console.log("Bajando carta ")
    this.mano = this.mano.filter(c => c.id !== carta.id)
    if (carta.tipo === TIPO_CARTA.PERSONAJE)
      this.tablero.push(carta)
  }

  resetearJugador() {
    this.faseActual = FASES.ESPERA;
    this.esFasePrimera = true;
    this.mana = 0;
    this.vidas = 20;
    this.tablero = [];
    this.mano = [];
    this.deck = [];
    this.campos = [];
    this.descartes = [];
  }
}
async function getCartasTripulacion(trip) {
  try {
    const response = await fetch('http://localhost:3000/cartas/tripulacion/' + trip);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    // Log para verificar el contenido de la respuesta
    console.log('Data received from API:', data);

    if (!data.ok) {
      throw new Error('API responded with an error: ' + (data.error || 'Unknown error'));
    }

    const cartas = data.result;

    if (!Array.isArray(cartas)) {
      throw new Error('Expected an array in result but received ' + typeof cartas);
    }

    return cartas.map(carta => new Carta(
      carta._id,  // Asumiendo que quieres usar el campo _id para el id de la carta
      carta.nombre,
      carta.tipo,
      carta.ataque,
      carta.defensa,
      carta.energia,
      carta.habilidadEspecial,
      carta.tripulacion
    ));
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    return undefined;  // O puedes manejar el error de otra manera
  }
}
async function getCartasMagicas() {
  try {
    const response = await fetch('http://localhost:3000/cartas/tipo/Magica');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    // Log para verificar el contenido de la respuesta
    console.log('Data received from API:', data);

    if (!data.ok) {
      throw new Error('API responded with an error: ' + (data.error || 'Unknown error'));
    }

    const cartas = data.result;

    if (!Array.isArray(cartas)) {
      throw new Error('Expected an array in result but received ' + typeof cartas);
    }

    return cartas.map(carta => new Carta(
      carta._id,  // Asumiendo que quieres usar el campo _id para el id de la carta
      carta.nombre,
      carta.tipo,
      carta.ataque,
      carta.defensa,
      carta.energia,
      carta.habilidadEspecial,
      carta.tripulacion
    ));
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    return undefined;  // O puedes manejar el error de otra manera
  }
}