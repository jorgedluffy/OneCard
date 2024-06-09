import express from 'express';
import http from 'http';
import Juego from './model/Juego.js';
import { Server as SocketServer } from 'socket.io';
import mongoose from 'mongoose';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

const PORT = 3000;

// Configuración de Mongoose
mongoose.set('strictQuery', true);
await mongoose.connect('mongodb://localhost:27017/oneCard', {
    useNewUrlParser: true, useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Could not connect to MongoDB:', error));

// Configuración de Express
app.use(express.json());

const juego = new Juego(mongoose.connection.readyState === 1);

// Configuración de Socket.io
io.on('connection', (socket) => {
    juego.setIo(io);
    juego.setSocket(socket);
    console.log('Nuevo intento de conexión');

    socket.on('listoParaJugar', (trip) => {
        if (!juego.getPartidaIniciada()) {
            console.log('Nuevo jugador conectado');
            juego.anyadirJugador(socket.id, `Jugador${juego.getJugadoresConectados().length + 1}`, trip);

            // Comienza la partida cuando hay suficientes jugadores
            juego.comprobarIniciarPartida();
            if (juego.getPartidaIniciada()) {
                juego.iniciarPartida();
            }
        }
    });

    socket.on('disconnect', () => {
        //TODO: Reiniciar datos del juego o crear un nuevo objeto juego
        console.log('Jugador desconectado');
        juego.eliminarJugador(socket.id);
        if (juego.getPartidaIniciada()) {
            juego.reiniciarPartida();
        }
    });
});

// CartaController.js
const cartaSchema = new mongoose.Schema({
    id: Number,
    nombre: String,
    tipo: String,
    ataque: Number,
    defensa: Number,
    energia: Number,
    habilidad: String,
    tripulacion: String,
});

const Carta = mongoose.model('Carta', cartaSchema);

// Endpoints de Cartas
app.get('/cartas', async (req, res) => {
    try {
        const cartas = await Carta.find();
        res.json({ ok: true, result: cartas });
    } catch (error) {
        res.json({ ok: false, error: 'Error fetching cartas' });
    }
});

app.get('/cartas/tipo/:tipo', async (req, res) => {
    try {
        const cartas = await Carta.find({ tipo: req.params.tipo });
        res.json({ ok: true, result: cartas });
    } catch (error) {
        res.json({ ok: false, error: 'Error fetching cartas' });
    }
});

app.get('/cartas/tripulacion/:tripulacion', async (req, res) => {
    try {
        const cartas = await Carta.find({ tripulacion: req.params.tripulacion });
        res.json({ ok: true, result: cartas });
    } catch (error) {
        res.json({ ok: false, error: 'Error fetching cartas' });
    }
});

app.post('/cartas', async (req, res) => {
    try {
        const carta = new Carta(req.body);
        const result = await carta.save();
        res.json({ ok: true, result: result });
    } catch (error) {
        res.json({ ok: false, error: 'Error creating carta' });
    }
});

app.put('/cartas/:id', async (req, res) => {
    try {
        const result = await Carta.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ ok: true, result: result });
    } catch (error) {
        res.json({ ok: false, error: 'Error updating carta' });
    }
});

app.delete('/cartas/:id', async (req, res) => {
    try {
        const result = await Carta.findByIdAndDelete(req.params.id);
        res.json({ ok: true, result: result });
    } catch (error) {
        res.json({ ok: false, error: 'Error deleting carta' });
    }
});

app.listen(8080, () => {
    console.log('Server running on port 8080');
});

server.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
