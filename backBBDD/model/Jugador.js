import Carta from './Carta.js';
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
    this.tripulacion = tripulacion;
    this.faseActual = FASES.ESPERA;
    this.esFasePrimera = true;
    this.mana = 0;
    this.vidas = 20;
    this.tablero = []; // Cartas de no campo en mesa
    this.mano = []; // Cartas en Mano
    this.deck = []; // Cartas en Baraja
    this.campos = []; // Cartas de campo en mesa
    this.descartes = []; // Cartas descartadas o usadas
  }

  setTablero(tablero) {
    this.tablero = tablero;
  }

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
    return this.esFasePrimera;
  }

  finalizarPrimeraFase() {
    this.esFasePrimera = false;
  }

  robarCartasIniciales() {
    for (let i = 0; i < CARTAS_INICIALES; i++) {
      this.robarCarta();
    }
  }

  robarCarta() {
    if (this.deck.length > 0) {
      const carta = this.deck.pop();
      this.mano.push(carta);
      console.log(`${this.nombre} roba una carta: ${carta.nombre}`);
    }
  }

  obtenerRandom() {
    return Math.random() - 0.5;
  }

  barajarCartas() {
    this.deck = this.deck.sort(() => this.obtenerRandom());
  }

  async inicializarCartas() {
    if (this.tripulacion === TRIPULACIONES.SOMBRERO_PAJA) {
      await this.inicializarCartasSombreroDePaja();
    } else if (this.tripulacion === TRIPULACIONES.MARINA) {
      await this.inicializarCartasMarina();
    }
  }

  async meterCartasMagicas() {
    const cartasMagicas = await getCartasMagicas();
    if (cartasMagicas) {
      this.deck = [...this.deck, ...cartasMagicas];
    }
  }

  async inicializarCartasSombreroDePaja() {
    const cartasTripulacion = await getCartasTripulacion("Sombrero de Paja");
    if (cartasTripulacion) {
      this.deck = cartasTripulacion;
      console.log("deck", JSON.stringify(this.deck));
    }
    await this.meterCartasMagicas();
  }

  async inicializarCartasMarina() {
    const cartasTripulacion = await getCartasTripulacion("Marina");
    if (cartasTripulacion) {
      this.deck = cartasTripulacion;
      console.log("deck", JSON.stringify(this.deck));
    }
    await this.meterCartasMagicas();
  }

  bajarCartaCampo(carta) {
    console.log("Bajando carta de campo");
    const campo = this.mano.find(c => c.id === carta.id);
    if (campo) {
      this.mano = this.mano.filter(c => c.id !== carta.id);
      this.campos.push(carta);
      console.log('cartas de campo:', this.campos);
    }
  }

  bajarCarta(carta) {
    console.log("Bajando carta");
    this.mano = this.mano.filter(c => c.id !== carta.id);
    if (carta.tipo === TIPO_CARTA.PERSONAJE) {
      this.tablero.push(carta);
    }
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
    const response = await fetch(`http://localhost:3000/cartas/tripulacion/${trip}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    console.log('Data received from API:', data);

    if (!data.ok) {
      throw new Error(`API responded with an error: ${data.error || 'Unknown error'}`);
    }

    return data.result.map(carta => new Carta(
      carta._id,
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
    return [];
  }
}

async function getCartasMagicas() {
  try {
    const response = await fetch('http://localhost:3000/cartas/tipo/Magica');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    console.log('Data received from API:', data);

    if (!data.ok) {
      throw new Error(`API responded with an error: ${data.error || 'Unknown error'}`);
    }

    return data.result.map(carta => new Carta(
      carta._id,
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
    return [];
  }
}
