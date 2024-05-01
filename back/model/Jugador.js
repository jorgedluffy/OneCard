
import Carta from './Carta.js'
// import mongoose from 'mongoose'
//import { obtenerCartasPorTripulacion } from './CartaController.js';
import { TRIPULACIONES, CARTAS_INICIALES } from '../constants.js';

export default class Jugador {
  id;
  nombre;
  tripulacion;
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
    this.mana = 0;
    this.vidas = 20;
    this.tablero = [];
    this.mano = [];
    this.deck = [];
    this.campos = [];
    this.descartes = [];
  }

  // inicializarDatos() {
  //   inicializarCartasDesdeBD();
  //   this.inicializarCartas();
  // }

  // faseCombate(jugadorOponente) {
  //   console.log(`${this.nombre} ataca a ${jugadorOponente.nombre}!`);
  //   for (const atacante of this.tablero) {
  //     for (const defensor of jugadorOponente.tablero) {
  //       // Simulación simple: atacante reduce la vida del defensor según su ataque
  //       defensor.defensa -= atacante.ataque;
  //       console.log(`${atacante.nombre} ataca a ${defensor.nombre}.`);
  //     }
  //   }
  // }

  // setMana() {
  //   this.mana = this.campos.length();
  // }

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
  inicializarCartasSombreroDePaja() {
    const luffy = new Carta("Monkey D. Luffy", "Personaje", 10, 5, 8, "Gomu Gomu no Pistol", "Sombrero de Paja");
    const zoro = new Carta("Roronoa Zoro", "Personaje", 8, 6, 7, "Santoryu: Oni Giri", "Sombrero de Paja");
    const sanji = new Carta("Vinsmoke Sanji", "Personaje", 9, 4, 7, "Diable Jambe", "Sombrero de Paja");
    const nami = new Carta("Nami", "Personaje", 6, 3, 5, "Clima Tact", "Sombrero de Paja");
    const usopp = new Carta("Usopp", "Personaje", 7, 3, 6, "Kabuto", "Sombrero de Paja");
    const robin = new Carta("Nico Robin", "Personaje", 5, 2, 4, "Flower-Flower Fruit", "Sombrero de Paja");
    const chopper = new Carta("Tony Tony Chopper", "Personaje", 6, 4, 5, "Monster Point", "Sombrero de Paja");
    const franky = new Carta("Franky", "Personaje", 8, 7, 6, "Coup de Vent", "Sombrero de Paja");

    const cartaMagicaBufeante = new Carta("Bufeo Mágico", "Magica", 0, 0, 0, "Aumenta el ataque de un personaje en 3", "General");
    const cartaMagicaCurativa = new Carta("Cura Magica", "Magica", 0, 0, 0, "Restaura 5 puntos de vida", "General");
    const cartaMagicaDefensiva = new Carta("Defensa Magica", "Magica", 0, 0, 0, "Aumenta la defensa de un personaje en 4", "General");
    const cartaMagicaOfensiva = new Carta("Ataque Mágico", "Magica", 0, 0, 0, "Aumenta el ataque de un personaje en 5", "General");
    const cartaMagicaEscudo = new Carta("Escudo Mágico", "Magica", 0, 0, 0, "Protege a un personaje de todo el daño durante un turno", "General");
    const cartaMagicaDobleAtaque = new Carta("Doble Ataque", "Magica", 0, 0, 0, "Permite a un personaje atacar dos veces en un turno", "General");

    const campoMugiwara = new Carta("Campo Sombrero de Paja", "Campo", 0, 0, 0, "Aumenta la energía de los Sombrero de Paja en 1", "Sombrero de Paja");

    const cartasMagicas = [cartaMagicaBufeante, cartaMagicaCurativa, cartaMagicaDefensiva, cartaMagicaOfensiva, cartaMagicaEscudo, cartaMagicaDobleAtaque];
    this.deck = [luffy, zoro, sanji, nami, usopp, robin, chopper, franky, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara,
      campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara, ...cartasMagicas];

  }


  //TODO: Implementar obtención de cartas desde BBDD
  inicializarCartasMarina() {
    const akainu = new Carta("Almirante Akainu", "Personaje", 12, 8, 10, "Magu Magu no Mi", "Marina");
    const kizaru = new Carta("Almirante Kizaru", "Personaje", 11, 7, 9, "Pika Pika no Mi", "Marina");
    const smoker = new Carta("Smoker", "Personaje", 10, 6, 8, "Moku Moku no Mi", "Marina");
    const kuzan = new Carta("Almirante Kuzan", "Personaje", 11, 7, 9, "Hie Hie no Mi", "Marina");
    const fujitora = new Carta("Almirante Fujitora", "Personaje", 11, 8, 10, "Zushi Zushi no Mi", "Marina");
    const doflamingo = new Carta("Donquixote Doflamingo", "Personaje", 10, 7, 9, "Ito Ito no Mi", "Marina");
    const aokiji = new Carta("Almirante Aokiji", "Personaje", 10, 7, 9, "Hie Hie no Mi", "Marina");
    const garp = new Carta("Almirante Garp", "Personaje", 11, 8, 10, "Haki", "Marina");

    // Crear cartas mágicas
    const cartaMagicaBufeante = new Carta("Bufeo Mágico", "Magica", 0, 0, 0, "Aumenta el ataque de un personaje en 3", "General");
    const cartaMagicaCurativa = new Carta("Cura Magica", "Magica", 0, 0, 0, "Restaura 5 puntos de vida", "General");
    const cartaMagicaDefensiva = new Carta("Defensa Magica", "Magica", 0, 0, 0, "Aumenta la defensa de un personaje en 4", "General");
    const cartaMagicaOfensiva = new Carta("Ataque Mágico", "Magica", 0, 0, 0, "Aumenta el ataque de un personaje en 5", "General");
    const cartaMagicaEscudo = new Carta("Escudo Mágico", "Magica", 0, 0, 0, "Protege a un personaje de todo el daño durante un turno", "General");
    const cartaMagicaDobleAtaque = new Carta("Doble Ataque", "Magica", 0, 0, 0, "Permite a un personaje atacar dos veces en un turno", "General");
    const campoMarina = new Carta("Campo Marina", "Campo", 0, 0, 0, "Aumenta la energía delos personajes de la Marina en 1", "Marina");
    const cartasMagicas = [cartaMagicaBufeante, cartaMagicaCurativa, cartaMagicaDefensiva, cartaMagicaOfensiva, cartaMagicaEscudo, cartaMagicaDobleAtaque];
    this.deck = [akainu, kizaru, smoker, kuzan, fujitora, doflamingo, aokiji, garp, campoMarina, campoMarina, campoMarina,
      campoMarina, campoMarina, campoMarina, campoMarina, campoMarina, campoMarina, campoMarina, campoMarina, campoMarina, campoMarina, campoMarina, ...cartasMagicas];
  }


}