
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
    const CuraChopper = new Carta(9, "Cura Chopper", "Magica", 0, 3, 0, "Restaura 3 puntos de vida", "");
    const CuraHiriluk = new Carta(10, "Cura Hiriluk", "Magica", 0, 5, 0, "Restaura 5 puntos de vida", "");
    const DefensaFrankyShogun = new Carta(11, "Defensa Franky Shogun", "Magica", 0, 7, 0, "Aumenta la defensa de un personaje en 7", "");
    const DialImpacto = new Carta(12, "Dial de Impacto", "Magica", 1, 0, 0, "Quita 1 puntos de vida", "");
    const Enma = new Carta(13, "Enma", "Magica", 3, 0, 0, "Quita 3 puntos de vida", "");
    const Murakumogiri = new Carta(14, "Murakumogiri", "Magica", 5, 0, 0, "Quita 5 puntos de vida", "");

    return [Enma, CuraChopper, DefensaFrankyShogun, Murakumogiri, CuraHiriluk, DialImpacto];
  }

  //TODO: Implementar obtención de cartas desde BBDD
  inicializarCartasSombreroDePaja() {
    const luffy = new Carta(0, "Monkey D. Luffy", "Personaje", 10, 5, 7, "Red Hawk", "Sombrero de Paja");
    const zoro = new Carta(1, "Roronoa Zoro", "Personaje", 8, 6, 6, "Santoryu: Oni Giri", "Sombrero de Paja");
    const sanji = new Carta(2, "Vinsmoke Sanji", "Personaje", 4, 4, 4, "Diable Jambe", "Sombrero de Paja");
    const nami = new Carta(3, "Nami", "Personaje", 2, 3, 2, "Clima Tact", "Sombrero de Paja");
    const usopp = new Carta(4, "Usopp", "Personaje", 1, 3, 1, "Kabuto", "Sombrero de Paja");
    const robin = new Carta(5, "Nico Robin", "Personaje", 4, 2, 3, "Mil Flower", "Sombrero de Paja");
    const chopper = new Carta(6, "Tony Tony Chopper", "Personaje", 2, 4, 2, "Monster Point", "Sombrero de Paja");
    const franky = new Carta(7, "Franky", "Personaje", 5, 7, 4, "Coup de Vent", "Sombrero de Paja");

    const campoMugiwara = new Carta(8, "Campo Mugiwara", "Campo", 0, 0, 0, "Aumenta la energía de los Sombrero de Paja en 1", "Sombrero de Paja");

    this.deck = [luffy, zoro, sanji, nami, usopp, robin, chopper, franky, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara,
      campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara, ...this.getCartasMagicas()];

  }


  //TODO: Implementar obtención de cartas desde BBDD
  inicializarCartasMarina() {
    const akainu = new Carta(15, "Almirante Akainu", "Personaje", 8, 4, 7, "Magu Magu no Mi", "Marina");
    const kizaru = new Carta(16, "Almirante Kizaru", "Personaje", 7, 4, 6, "Pika Pika no Mi", "Marina");
    const smoker = new Carta(17, "Smoker", "Personaje", 5, 3, 4, "Moku Moku no Mi", "Marina");
    const kuzan = new Carta(18, "Almirante Kuzan", "Personaje", 7, 4, 6, "Hie Hie no Mi", "Marina");
    const fujitora = new Carta(19, "Almirante Fujitora", "Personaje", 8, 1, 6, "Zushi Zushi no Mi", "Marina");
    const doflamingo = new Carta(20, "Donquixote Doflamingo", "Personaje", 6, 3, 4, "Jaula de pajaros", "Marina");
    const tashigi = new Carta(21, "Tashigi", "Personaje", 1, 3, 1, "Tatsumaki", "Marina");
    const garp = new Carta(22, "Almirante Garp", "Personaje", 3, 8, 4, "Puño de amor", "Marina");

    const campoMarina = new Carta(23, "Campo Marina", "Campo", 0, 0, 0, "Aumenta la energía de los personajes de la Marina en 1", "Marina");

    this.deck = [akainu, kizaru, smoker, kuzan, fujitora, doflamingo, tashigi, garp, campoMarina, campoMarina, campoMarina,
      campoMarina, campoMarina, campoMarina, campoMarina, campoMarina, campoMarina, campoMarina, campoMarina, campoMarina, campoMarina, campoMarina, ...this.getCartasMagicas()];
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