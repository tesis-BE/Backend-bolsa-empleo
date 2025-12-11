require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');

const sequelize = require('./config/database');
const { createDatabaseIfNotExists } = require('./config/database');
const models = require('./models');
const errorHandler = require('./middlewares/error.middleware');
const routes = require('./routes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
  },
});

// Middlewares globales
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use('/uploads', express.static('uploads'));

// Rutas de la API
app.use('/api/v1', routes);

// Socket.IO middleware para autenticación
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Token no proporcionado'));
  }
  // Verificar token aquí
  next();
});

// Socket.IO event listeners (se configurarán en socket/chat.socket.js)
require('./socket/chat.socket')(io);

// Error handling
app.use(errorHandler);

// Inicializar BD y servidor
const PORT = process.env.PORT || 3001;

async function initializeApp() {
  try {
    // Crear BD si no existe
    await createDatabaseIfNotExists();

    // Conectar a la BD
    await sequelize.authenticate();
    console.log('✓ Base de datos conectada');

    // Sincronizar modelos (crear tablas)
    await sequelize.sync({ alter: true });
    console.log('✓ Tablas sincronizadas');

    server.listen(PORT, () => {
      console.log(`✓ Servidor ejecutándose en puerto ${PORT}`);
      console.log(
        `✓ CORS habilitado para: ${
          process.env.CORS_ORIGIN || 'http://localhost:4200'
        }`
      );
      console.log(`✓ API disponible en: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error('✗ Error al inicializar:', error.message);
    process.exit(1);
  }
}

initializeApp();

module.exports = { app, server, io };
