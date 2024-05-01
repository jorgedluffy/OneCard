import express from 'express'
import http from 'http'
import Juego from './model/Juego.js';
import { Server as SocketServer } from 'socket.io'

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

const PORT = process.env.PORT || 3000;

// Configuración de Express
app.use(express.json());

const juego = new Juego();

// Configuración de Socket.io
io.on('connection', (socket) => {
    juego.setSocket(io)
    console.log('Nuevo intento de conexión');
    if (!juego.getPartidaIniciada()) {
        console.log('Nuevo jugador conectado');
        juego.anyadirJugador(socket.id, `Jugador${juego.getJugadoresConectados().length + 1}`);
        enviarJugadores();


        // Comienza la partida cuando hay suficientes jugadores
        juego.comprobarIniciarPartida();
        iniciarPartida();
    }
    socket.on('robarCarta', () => {
        juego.getJugadoresConectados()[juego.jugadorActual].robarCarta()
        enviarJugadores()
    })
    socket.on('disconnect', () => {
        console.log('Jugador desconectado');
        juego.eliminarJugador(socket.id)
        reiniciarPartida()
    });
});


function iniciarPartida() {
    console.log(juego.getPartidaIniciada())
    if (juego.getPartidaIniciada()) {
        console.log('Partida iniciada');

        io.emit('partidaIniciada', { mensaje: '¡La partida ha comenzado!' });

        juego.iniciarPartida()
        enviarJugadores()
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
    io.emit('jugadores', juego.getJugadoresConectados());
}

server.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
