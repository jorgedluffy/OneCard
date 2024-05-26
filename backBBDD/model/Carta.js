export default class Carta {
  id;
  nombre;
  tipo; //TODO: cambiar a tipo constante en lugar de string
  ataque;
  defensa;
  energia;
  habilidad;
  tripulacion;
  img;

  constructor(id, nombre, tipo, ataque, defensa, energia, habilidad, tripulacion, img) {
    this.id = id;
    this.nombre = nombre; // Nombre de la carta (por ejemplo, Luffy)
    this.tipo = tipo; // Tipo de la carta (por ejemplo, personaje, campo, magica)
    this.ataque = ataque; // Poder de la carta (puntos de ataque)
    this.defensa = defensa; // Poder de la carta (puntos de defensa)
    this.energia = energia; // Energias necesarias para bajar la carta (puntos de energia)
    this.habilidad = habilidad; // Habilidad de la carta (habilidad especial)
    this.tripulacion = tripulacion; // A qué tripulación pertenece la carta (por ejemplo, Marina o Sombrero de Paja)
    this.img = img; // nombre de la imagen que pertenece la carta
  }


}