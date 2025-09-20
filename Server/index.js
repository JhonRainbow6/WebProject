const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Carga las variables de entorno en .env

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // parsear JSON

// Obtencion de credenciales desde .env
const miPassword = process.env.DB_PASSWORD;
const cadenaConexion = process.env.DB_CONNECTION_STRING;

// Conexión a MongoDB
mongoose.connect(cadenaConexion.replace('<db_password>', miPassword), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('No se pudo conectar a MongoDB', err));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
