const Jugador = require('./Jugador');
const Juego = require('./Juego');
const CartaController = require('./CartaController');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para manejar el cuerpo de la solicitud
app.use(express.json());

// Ruta para agregar una carta a la base de datos
app.post('/agregarCarta', async (req, res) => {
  try {
    const { nombre, tipo, ataque, defensa, energia, habilidadEspecial, tripulacion } = req.body;

    // Crear una nueva instancia de Carta con los datos recibidos
    const nuevaCarta = new Carta(nombre, tipo, ataque, defensa, energia, habilidadEspecial, tripulacion);

    // Añadir la nueva carta a la base de datos
    const cartaGuardada = await CartaController.guardarCarta(nuevaCarta);

    res.status(201).json({ mensaje: 'Carta añadida correctamente', carta: cartaGuardada });
  } catch (error) {
    console.error('Error en la solicitud POST:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});

async function ejemploPrograma() {
  try {
    // Conectar a la base de datos
    await mongoose.connect('localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Conexión exitosa a la base de datos');

    // Crear jugadores con sus propias cartas
    const jugadorSombreroDePaja = new Jugador('Jugador Sombrero de Paja', 'Sombrero de Paja');
    await jugadorSombreroDePaja.inicializarCartasDesdeBD();

    const jugadorMarina = new Jugador('Jugador Marina', 'Marina');
    await jugadorMarina.inicializarCartasDesdeBD();

    // Crear el juego con los jugadores
    const juego = new Juego(jugadorMarina, jugadorSombreroDePaja);

    // Simular el juego (por ejemplo, cada jugador roba 3 cartas al principio)
    jugadorSombreroDePaja.mano = jugadorSombreroDePaja.deck.splice(0, 3);
    jugadorMarina.mano = jugadorMarina.deck.splice(0, 3);

    console.log(`${jugadorSombreroDePaja.nombre}: Mano inicial -`, jugadorSombreroDePaja.mano);
    console.log(`${jugadorMarina.nombre}: Mano inicial -`, jugadorMarina.mano);

    // Simular el juego: Jugador Sombrero de Paja juega una carta de la mano
    const cartaJugadaSombreroDePaja = jugadorSombreroDePaja.mano.shift();
    console.log(`${jugadorSombreroDePaja.nombre} juega la carta:`, cartaJugadaSombreroDePaja);

    // Simular el juego: Aplicar lógica de juego, por ejemplo, añadir a la pila de descartes
    jugadorSombreroDePaja.descartes.push(cartaJugadaSombreroDePaja);

    console.log(`${jugadorSombreroDePaja.nombre}: Mano después de jugar -`, jugadorSombreroDePaja.mano);
    console.log(`${jugadorSombreroDePaja.nombre}: Pila de descartes -`, jugadorSombreroDePaja.descartes);

    // Repite el proceso para el Jugador Marina y realiza más acciones según sea necesario
    // ...

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Cierra la conexión a la base de datos al finalizar
    await mongoose.disconnect();
    console.log('Conexión a la base de datos cerrada');
  }
}

// Llamar a la función de ejemplo
ejemploPrograma();
