// CartaController.js
const mongoose = require('mongoose');
const Carta = require('./Carta');

mongoose.connect('mongodb://localhost:27017/tu_base_de_datos', { useNewUrlParser: true, useUnifiedTopology: true });

const cartaSchema = new mongoose.Schema({
  nombre: String,
  tipo: String,
  ataque: Number,
  defensa: Number,
  energia: Number,
  habilidadEspecial: String,
  tripulacion: String,
});

const CartaModel = mongoose.model('Carta', cartaSchema);

async function crearCartaEnBD(carta) {
  try {
    const nuevaCarta = new CartaModel(carta);
    await nuevaCarta.save();
    console.log('Carta creada exitosamente:', nuevaCarta);
  } catch (error) {
    console.error('Error al crear la carta:', error);
    throw error;
  }
}

async function obtenerCartasPorTripulacion(tripulacion) {
  try {
    const cartas = await CartaModel.find({ tripulacion });
    return cartas;
  } catch (error) {
    console.error('Error al obtener cartas:', error);
    throw error;
  }
}

module.exports = { crearCartaEnBD, obtenerCartasPorTripulacion };
