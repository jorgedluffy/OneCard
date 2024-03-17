import express from 'express'
import http from 'http'
import { Server as SocketServer } from 'socket.io'
import mongoose from 'mongoose'

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

const PORT = process.env.PORT || 3000;

// Configuración de Express
app.use(express.json());

// Configuración de Socket.io
let jugadoresConectados = [];
let partidaIniciada = false;

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

        // Si la partida ya ha comenzado y un jugador se desconecta, podrías reiniciar el juego o hacer otras acciones.
        if (partidaIniciada) {
            reiniciarPartida();
        }
    });

    // Comienza la partida cuando hay suficientes jugadores
    if (jugadoresConectados.length == 2 && !partidaIniciada) {
        iniciarPartida();
    }
});

function iniciarPartida() {
    console.log('Partida iniciada');
    partidaIniciada = true;

    // Aquí puedes agregar la lógica para configurar la partida, distribuir cartas, etc.
    // Puedes emitir eventos a los clientes para notificarles que la partida ha comenzado.
    io.emit('partidaIniciada', { mensaje: '¡La partida ha comenzado!' });
}

function reiniciarPartida() {
    console.log('Reiniciando partida');
    partidaIniciada = false;

    // Aquí puedes agregar la lógica para reiniciar la partida, reiniciar cartas, etc.
    // Puedes emitir eventos a los clientes para notificarles que la partida se reinicia.
    io.emit('partidaReiniciada', { mensaje: '¡La partida se ha reiniciado!' });
}

server.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
