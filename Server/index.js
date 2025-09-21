const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // Importar dotenv
const cors = require('cors');

// Configurar dotenv ANTES de usar cualquier variable de entorno
dotenv.config();

const app = express();

// Importar Rutas
const authRoutes = require('./routes/auth');

// Conectar a la DB
const dbConnectionString = process.env.DB_CONNECTION_STRING.replace('<db_password>', process.env.DB_PASSWORD);
mongoose.connect(dbConnectionString)
    .then(() => console.log('Conectado a MongoDB...'))
    .catch(error => console.error('Error de conexión a la base de datos:', error));

// Middlewares
app.use(cors()); // Habilitar CORS para todas las rutas
app.use(express.json()); // para parsear application/json

// Middleware de Rutas
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
