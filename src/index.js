require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');

const sequelize = require('./config/database');
const { createDatabaseIfNotExists } = require('./config/database');
const models = require('./models');
const errorHandler = require('./middlewares/error.middleware');
const requestLogger = require('./middlewares/request-logger.middleware');
const routes = require('./routes');

const app = express();
const server = http.createServer(app);

// CORS abierto para desarrollo
const corsOptions = {
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: false,
  },
});

// Middlewares globales
app.use(cors(corsOptions));

// Helmet con configuración que permite recursos cross-origin
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(requestLogger);

// Servir archivos estáticos con headers CORS explícitos
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, '..', 'uploads')));

// Rutas de la API
app.use('/api/v1', routes);

// Socket.IO middleware para autenticación
const { verifyToken } = require('./utils/jwt.util');

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Token no proporcionado'));
  }

  try {
    const decoded = verifyToken(token);
    socket.userId = decoded.id;
    socket.userType = decoded.userType;
    socket.companyId = decoded.companyId;
    next();
  } catch (error) {
    next(new Error('Token inválido o expirado'));
  }
});

// Socket.IO event listeners
require('./socket/chat.socket')(io);
const notificationSocket = require('./socket/notification.socket')(io);

// Hacer disponible el socket de notificaciones globalmente
global.notificationSocket = notificationSocket;

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

    server.listen(PORT, () => {
      console.log(`✓ Servidor ejecutándose en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('✗ Error al inicializar:', error.message);
    process.exit(1);
  }
}

initializeApp();

module.exports = { app, server, io };
