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
    juego.setIo(io)
    juego.setSocket(socket)
    console.log('Nuevo intento de conexión');
    if (!juego.getPartidaIniciada()) {
        console.log('Nuevo jugador conectado');
        juego.anyadirJugador(socket.id, `Jugador${juego.getJugadoresConectados().length + 1}`);


        // Comienza la partida cuando hay suficientes jugadores
        juego.comprobarIniciarPartida();
        if (juego.getPartidaIniciada()) {
            juego.iniciarPartida()
        }
    }
    socket.on('disconnect', () => {
        //TODO: Reiniciar datos del juego o crear un nuevo objeto juego
        console.log('Jugador desconectado');
        juego.eliminarJugador(socket.id)
        if (juego.getPartidaIniciada()) {
            juego.reiniciarPartida();
        }
    });
});


server.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
