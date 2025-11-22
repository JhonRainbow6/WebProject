const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // Importar dotenv
const cors = require('cors');
const path = require('path');
const passport = require('passport');

// Configurar dotenv ANTES de usar cualquier variable de entorno
dotenv.config();

// Configurar Passport (asegúrate de que este require se ejecute)
require('./config/passport-setup');

const app = express();

// Importar Rutas
const authRoutes = require('./routes/auth');
const dealsRoutes = require('./routes/deals');
const newsRoutes = require('./routes/news');
const steamRoutes = require('./routes/steam');

// Conectar a la DB
const dbConnectionString = process.env.DB_CONNECTION_STRING.replace('<db_password>', process.env.DB_PASSWORD);
mongoose.connect(dbConnectionString)
    .then(() => console.log('Conectado a MongoDB...'))
    .catch(error => console.error('Error de conexión a la base de datos:', error));

// Middlewares
app.use(cors()); // Habilitar CORS para todas las rutas
app.use(express.json()); // para parsear application/json
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Configurar la carpeta de uploads como estática

// Inicializar Passport
app.use(passport.initialize());

// Middleware de Rutas
app.use('/api/auth', authRoutes);
app.use('/api/deals', dealsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/steam', steamRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
