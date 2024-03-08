
Carta = require('./Carta');
const mongoose = require('mongoose');
CartaController = require('./cartaController');
class Jugador { 
    constructor(nombre) {
      this.nombre = nombre;
      this.vidas = 20;
      this.tablero = [];
      this.mano = [];
      this.deck = [];
      this.campos = [];
      this.descartes = [];
      this.inicializarCartas();
    }
    faseCombate(jugadorOponente) {
      console.log(`${this.nombre} ataca a ${jugadorOponente.nombre}!`);
      for (const atacante of this.tablero) {
        for (const defensor of jugadorOponente.tablero) {
          // Simulación simple: atacante reduce la vida del defensor según su ataque
          defensor.defensa -= atacante.ataque;
          console.log(`${atacante.nombre} ataca a ${defensor.nombre}.`);
        }
      }
    }
    robarCarta() {
      if (this.mazo.length > 0) {
        const carta = this.mazo.pop();
        this.mano.push(carta);
        console.log(`${this.nombre} roba una carta: ${carta.nombre}`);
      }
    }
  
    jugarCartaAlTablero(carta) {
      this.tablero.push(carta);
      console.log(`${this.nombre} juega ${carta.nombre} al tablero.`);
    }
    // Método para añadir una carta a la base de datos
    async agregarCartaALaBD(nuevaCarta) {
      try {
        // Asegurarse de que la nueva carta sea una instancia de la clase Carta
        if (!(nuevaCarta instanceof Carta)) {
          throw new Error('El objeto proporcionado no es una instancia de Carta.');
        }

        // Guardar la nueva carta en la base de datos
        const cartaGuardada = await CartaController.guardarCarta(nuevaCarta);
        console.log(`Carta ${nuevaCarta.nombre} guardada en la base de datos.`);
        return cartaGuardada;
      } catch (error) {
        console.error('Error al agregar carta a la base de datos:', error);
        throw error;
      }
    }
    async inicializarCartasDesdeBD() {
        try {
          // Recuperar cartas específicas para el jugador desde la base de datos
          const cartasDesdeBD = await CartaController.obtenerCartasPorTripulacion(this.tipoTripulacion);
    
          // Asignar las cartas recuperadas al deck del jugador
          this.deck = cartasDesdeBD;
    
          // También puedes realizar operaciones adicionales según sea necesario
    
        } catch (error) {
          console.error('Error al obtener cartas desde la base de datos:', error);
          throw error;
        }
    }
    inicializarCartas() {
      // Crear instancias de cartas según el tipo de tripulación
      if (this.tipoTripulacion === 'Sombrero de Paja') {
        this.inicializarCartasSombreroDePaja();
      } else if (this.tipoTripulacion === 'Marina') {
        this.inicializarCartasMarina();
      }
  
      // Puedes agregar lógica para inicializar otros tipos de tripulaciones si es necesario
    }
  
    inicializarCartasSombreroDePaja() {
      // ... Lógica para inicializar las cartas de Sombrero de Paja
    }
  
    inicializarCartasMarina() {
      // ... Lógica para inicializar las cartas de la Marina
    }


    /*
    luffy = new Carta("Monkey D. Luffy", "Personaje", 10, 5, 8, "Gomu Gomu no Pistol", "Sombrero de Paja");
    zoro = new Carta("Roronoa Zoro", "Personaje", 8, 6, 7, "Santoryu: Oni Giri", "Sombrero de Paja");
    sanji = new Carta("Vinsmoke Sanji", "Personaje", 9, 4, 7, "Diable Jambe", "Sombrero de Paja");
    nami = new Carta("Nami", "Personaje", 6, 3, 5, "Clima Tact", "Sombrero de Paja");
    usopp = new Carta("Usopp", "Personaje", 7, 3, 6, "Kabuto", "Sombrero de Paja");
    robin = new Carta("Nico Robin", "Personaje", 5, 2, 4, "Flower-Flower Fruit", "Sombrero de Paja");
    chopper = new Carta("Tony Tony Chopper", "Personaje", 6, 4, 5, "Monster Point", "Sombrero de Paja");
    franky = new Carta("Franky", "Personaje", 8, 7, 6, "Coup de Vent", "Sombrero de Paja");
    
    // Crear instancias de cartas para la Marina
    akainu = new Carta("Almirante Akainu", "Personaje", 12, 8, 10, "Magu Magu no Mi", "Marina");
    kizaru = new Carta("Almirante Kizaru", "Personaje", 11, 7, 9, "Pika Pika no Mi", "Marina");
    smoker = new Carta("Smoker", "Personaje", 10, 6, 8, "Moku Moku no Mi", "Marina");
    kuzan = new Carta("Almirante Kuzan", "Personaje", 11, 7, 9, "Hie Hie no Mi", "Marina");
    fujitora = new Carta("Almirante Fujitora", "Personaje", 11, 8, 10, "Zushi Zushi no Mi", "Marina");
    doflamingo = new Carta("Donquixote Doflamingo", "Personaje", 10, 7, 9, "Ito Ito no Mi", "Marina");
    aokiji = new Carta("Almirante Aokiji", "Personaje", 10, 7, 9, "Hie Hie no Mi", "Marina");
    garp = new Carta("Almirante Garp", "Personaje", 11, 8, 10, "Haki", "Marina");
    
    // Crear cartas mágicas
    cartaMagicaBufeante = new Carta("Bufeo Mágico", "Magica", 0, 0, 0, "Aumenta el ataque de un personaje en 3", "General");
    cartaMagicaCurativa = new Carta("Cura Magica", "Magica", 0, 0, 0, "Restaura 5 puntos de vida", "General");
    cartaMagicaDefensiva = new Carta("Defensa Magica", "Magica", 0, 0, 0, "Aumenta la defensa de un personaje en 4", "General");
    cartaMagicaOfensiva = new Carta("Ataque Mágico", "Magica", 0, 0, 0, "Aumenta el ataque de un personaje en 5", "General");
    cartaMagicaEscudo = new Carta("Escudo Mágico", "Magica", 0, 0, 0, "Protege a un personaje de todo el daño durante un turno", "General");
    cartaMagicaDobleAtaque = new Carta("Doble Ataque", "Magica", 0, 0, 0, "Permite a un personaje atacar dos veces en un turno", "General");
    // Crear cartas de campo para los Sombrero de Paja
    campoMugiwara = new Carta("Campo Sombrero de Paja", "Campo", 0, 0, 0, "Aumenta la energía de los Sombrero de Paja en 1", "Sombrero de Paja");

    // Crear cartas de campo para la Marina
    campoMarina = new Carta("Campo Marina", "Campo", 0, 0, 0, "Aumenta la energía delos personajes de la Marina en 1", "Marina");

    // Combinar todas las cartas
    cartasSombreroDePaja = [luffy, zoro, sanji, nami, usopp, robin, chopper, franky, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara
        , campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara, campoMugiwara];
    cartasMarina = [this.akainu, this.kizaru, smoker, kuzan, fujitora, doflamingo, aokiji, garp, campoMarina, campoMarina, campoMarina
        , campoMarina, campoMarina, campoMarina, campoMarina, campoMarina, campoMarina, campoMarina, campoMarina, campoMarina, campoMarina, campoMarina];
    cartasMagicas = [cartaMagicaBufeante, cartaMagicaCurativa, cartaMagicaDefensiva, cartaMagicaOfensiva, cartaMagicaEscudo, cartaMagicaDobleAtaque];
    todasLasCartas = [...cartasSombreroDePaja, ...cartasMarina, ...cartasMagicas];
    */
    
}
  
module.exports = Jugador;