export default class Carta {
  id;
  nombre;
  tipo; //TODO: cambiar a tipo constante en lugar de string
  ataque;
  defensa;
  energia;
  habilidad;
  tripulacion;

  constructor(id, nombre, tipo, ataque, defensa, habilidad, energia, tripulacion) {
    this.id = id;
    this.nombre = nombre; // Nombre de la carta (por ejemplo, Luffy)
    this.tipo = tipo; // Tipo de la carta (por ejemplo, personaje, campo, magica)
    this.ataque = ataque; // Poder de la carta (puntos de ataque)
    this.defensa = defensa; // Poder de la carta (puntos de defensa)
    this.energia = energia; // Energias necesarias para bajar la carta (puntos de energia)
    this.habilidad = habilidad; // Habilidad de la carta (habilidad especial)
    this.tripulacion = tripulacion; // A qué tripulación pertenece la carta (por ejemplo, Marina o Sombrero de Paja)
  }

  mostrarInformacion() {
    console.log(`Nombre: ${this.nombre}`);
    console.log(`Tipo: ${this.tipo}`);
    console.log(`Ataque: ${this.ataque}`);
    console.log(`Defensa: ${this.defensa}`);
    console.log(`Energia: ${this.energia}`);
    console.log(`Habilidad: ${this.habilidad}`);
    console.log(`Tripulación: ${this.tripulacion}`);
  }
  atacar(cartaObjetivo) {
    // Simular un ataque restando los puntos de ataque de la carta atacante a la defensa de la carta objetivo
    const danioInfligido = this.ataque - cartaObjetivo.defensa;
    cartaObjetivo.defensa -= danioInfligido;

    console.log(`${this.nombre} atacó a ${cartaObjetivo.nombre} y le infligió ${danioInfligido} puntos de daño.`);
  }

  defender() {
    // Simular una acción de defensa, podrías agregar lógica adicional aquí según las reglas del juego
    console.log(`${this.nombre} se defendió.`);
  }
  aplicarHabilidadEspecial() {
    // Implementa la lógica de la habilidad especial de la carta
    console.log(`${this.nombre}: Se activa la habilidad especial - ${this.habilidadEspecial}`);
  }
}