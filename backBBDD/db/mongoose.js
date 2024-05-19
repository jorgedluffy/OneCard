import mongoose from "mongoose";

// TODO: Conexión base para un futuro uso de la BBDD para inicializar los datos.
export default async function connectDB() {
    try {
        // Conectar a la base de datos
        await mongoose.connect('localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Cierra la conexión a la base de datos al finalizar
        await mongoose.disconnect();
        console.log('Conexión a la base de datos cerrada');
    }
}