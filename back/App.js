// server.js

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const Jugador = require('./jugador'); // Asegúrate de tener una clase Jugador

let jugadoresConectados = [];

io.on('connection', (socket) => {
  console.log('Nuevo jugador conectado');

  const nuevoJugador = new Jugador(socket.id);
  jugadoresConectados.push(nuevoJugador);

  // Envía la lista de jugadores a todos los clientes
  io.emit('jugadores', jugadoresConectados.map(j => j.id));

  socket.on('disconnect', () => {
    console.log('Jugador desconectado');
    // Elimina al jugador desconectado de la lista
    jugadoresConectados = jugadoresConectados.filter(j => j.id !== socket.id);
    // Envía la nueva lista de jugadores a todos los clientes
    io.emit('jugadores', jugadoresConectados.map(j => j.id));
  });

  // Agrega más lógica para gestionar las acciones del juego
});

server.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
