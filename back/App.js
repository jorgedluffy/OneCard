import express from 'express'
import http from 'http'
import Juego from './model/Juego.js';
import { Server as SocketServer } from 'socket.io'
import mongoose from 'mongoose'

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

const PORT = process.env.PORT || 3000;

// Configuración de Express
app.use(express.json());

const juego = new Juego();

// Configuración de Socket.io
io.on('connection', (socket) => {

    console.log('Nuevo intento de conexión');
    if (!juego.getPartidaIniciada()) {
        console.log('Nuevo jugador conectado');
        juego.anyadirJugador(socket.id, `Jugador${juego.getJugadoresConectados().length + 1}`);
        enviarJugadores();


        // Comienza la partida cuando hay suficientes jugadores
        juego.comprobarIniciarPartida();
        iniciarPartida();
    }
    socket.on('disconnect', () => {
        console.log('Jugador desconectado');
        juego.eliminarJugador(socket.id)
        reiniciarPartida()
    });
});

function iniciarPartida() {
    if (juego.getPartidaIniciada()) {
        console.log('Partida iniciada');

        juego.iniciarPartida()

        io.emit('partidaIniciada', { mensaje: '¡La partida ha comenzado!' });
    }
}

function reiniciarPartida() {

    enviarJugadores()

    if (juego.getPartidaIniciada()) {
        juego.reiniciarPartida();
        io.emit('partidaReiniciada', { mensaje: '¡La partida se ha reiniciado!' });
    }
}


function enviarJugadores() {
    io.emit('jugadores', juego.getJugadoresConectados().map(j => ({ id: j.id, nombre: j.nombre })));
}

server.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
