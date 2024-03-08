const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

// Configuración de MongoDB
mongoose.connect('tu_url_de_conexion_a_mongodb', { useNewUrlParser: true, useUnifiedTopology: true });

// Configuración de Express
app.use(express.json());

// Configuración de Socket.io
let jugadoresConectados = [];

io.on('connection', (socket) => {
  console.log('Nuevo jugador conectado');

  const nuevoJugador = { id: socket.id, nombre: `Jugador${jugadoresConectados.length + 1}` };
  jugadoresConectados.push(nuevoJugador);

  // Envía la lista de jugadores a todos los clientes
  io.emit('jugadores', jugadoresConectados.map(j => ({ id: j.id, nombre: j.nombre })));

  socket.on('disconnect', () => {
    console.log('Jugador desconectado');
    // Elimina al jugador desconectado de la lista
    jugadoresConectados = jugadoresConectados.filter(j => j.id !== socket.id);
    // Envía la nueva lista de jugadores a todos los clientes
    io.emit('jugadores', jugadoresConectados.map(j => ({ id: j.id, nombre: j.nombre })));
  });

  // Puedes agregar más lógica para gestionar las acciones del juego aquí...
});

server.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});

// Aquí podrías agregar tus rutas de Express y otros configuraciones si es necesario
