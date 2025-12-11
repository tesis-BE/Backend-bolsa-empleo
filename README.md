# Backend Bolsa de Empleos

Backend para plataforma de bolsa de empleos para graduados, desarrollado con Node.js, Express y PostgreSQL.

## 📋 Características

- ✅ Autenticación con JWT + bcrypt
- ✅ Chat en tiempo real con Socket.IO
- ✅ Sistema de roles y permisos
- ✅ Gestión de empresas y ofertas de trabajo
- ✅ Postulaciones con estados (pendiente, revisado, entrevistado, aceptado, rechazado)
- ✅ Sistema de notificaciones internas
- ✅ Carga de archivos (CV, fotos, logos) con validación
- ✅ Búsqueda y filtros avanzados
- ✅ Base de datos PostgreSQL con Sequelize ORM

## 🚀 Instalación

### Requisitos

- Node.js 14+
- PostgreSQL 12+
- npm o yarn

### Pasos

1. **Clonar el repositorio**

```bash
git clone <repo_url>
cd Backend-bolsa-empleo
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

```bash
cp .env.example .env
```

Editar `.env` con tus valores:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bolsa_empleos
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRE=7d

PORT=3001
NODE_ENV=development

CORS_ORIGIN=http://localhost:4200
```

4. **Crear base de datos**

```bash
createdb bolsa_empleos
```

5. **Ejecutar servidor**

```bash
npm run dev
```

Server estará en: `http://localhost:3001`

## 📁 Estructura de Carpetas

```
Backend-bolsa-empleo/
├── src/
│   ├── config/              # Configuración (DB, JWT, constantes, multer)
│   ├── models/              # Modelos Sequelize
│   ├── services/            # Lógica de negocio
│   ├── controllers/         # Controladores de rutas
│   ├── routes/              # Definición de rutas
│   ├── middlewares/         # Middleware (auth, roles, errores)
│   ├── validators/          # Validación con express-validator
│   ├── utils/               # Utilidades (JWT, respuestas)
│   ├── socket/              # Socket.IO listeners
│   └── index.js             # Punto de entrada
├── uploads/
│   ├── cvs/                 # CVs subidos
│   ├── photos/              # Fotos de perfil
│   └── logos/               # Logos de empresas
├── .env
├── package.json
└── README.md
```

## 🔐 Autenticación

### Registro

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "Juan",
  "lastName": "Pérez"
}
```

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      "userType": "graduate"
    }
  }
}
```

## 🗄️ Modelos de Base de Datos

### Users

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  user_type ENUM('graduate', 'recruiter', 'admin'),
  bio TEXT,
  linkedin_url VARCHAR(255),
  cv_file_id INT,
  profile_photo_id INT,
  company_id INT,
  is_active BOOLEAN DEFAULT true,
  available_for_work BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Companies

```sql
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  industry VARCHAR(100),
  recruiter_id INT UNIQUE NOT NULL,
  logo_id INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Jobs

```sql
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  job_type ENUM('full-time', 'part-time', 'contract', 'internship', 'temporary'),
  work_mode ENUM('remote', 'on-site', 'hybrid'),
  salary_min INT,
  salary_max INT,
  skills JSON,
  deadline DATE,
  company_id INT NOT NULL,
  status ENUM('borrador', 'publicado', 'cerrado', 'pausado', 'expirado'),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Applications

```sql
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  job_id INT NOT NULL,
  user_id INT NOT NULL,
  cover_letter TEXT,
  status ENUM('pendiente', 'revisado', 'entrevistado', 'aceptado', 'rechazado'),
  rejection_reason TEXT,
  applied_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(job_id, user_id)
);
```

### Conversations & Messages

```sql
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  application_id INT UNIQUE NOT NULL,
  graduate_id INT NOT NULL,
  recruiter_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id INT NOT NULL,
  sender_id INT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 💬 Socket.IO Events (Chat)

### Cliente → Servidor

```javascript
// Unirse a conversación
socket.emit('join_conversation', {
  conversationId: 1,
  userId: 5,
});

// Enviar mensaje
socket.emit('send_message', {
  conversationId: 1,
  content: 'Hola, ¿cómo estás?',
});

// Usuario escribiendo
socket.emit('user_typing', {
  conversationId: 1,
  isTyping: true,
});

// Marcar como leído
socket.emit('mark_as_read', {
  conversationId: 1,
  messageIds: [1, 2, 3],
});
```

### Servidor → Cliente

```javascript
// Mensaje recibido
socket.on('receive_message', (data) => {
  console.log('Nuevo mensaje:', data);
  // { id, conversationId, senderId, senderName, content, createdAt }
});

// Usuario escribiendo
socket.on('user_typing', (data) => {
  console.log(data);
  // { userId, isTyping }
});

// Mensajes leídos
socket.on('messages_read', (data) => {
  console.log(data);
  // { messageIds: [1, 2, 3] }
});
```

## 📊 Endpoints API

### Auth

- `POST /api/v1/auth/register` - Registrarse
- `POST /api/v1/auth/login` - Iniciar sesión
- `GET /api/v1/auth/me` - Obtener perfil (protegido)
- `POST /api/v1/auth/logout` - Cerrar sesión

### Users

- `GET /api/v1/users` - Listar usuarios (admin)
- `GET /api/v1/users/:id` - Obtener usuario
- `PATCH /api/v1/users/:id` - Actualizar perfil
- `PATCH /api/v1/users/:id/type` - Cambiar tipo (admin)
- `PATCH /api/v1/users/:id/status` - Cambiar estado (admin)
- `GET /api/v1/users/search/graduates` - Buscar graduados

### Companies

- `POST /api/v1/companies` - Crear empresa (recruiter)
- `GET /api/v1/companies` - Listar empresas
- `GET /api/v1/companies/:id` - Obtener empresa
- `PATCH /api/v1/companies/:id` - Actualizar empresa
- `DELETE /api/v1/companies/:id` - Eliminar empresa

### Jobs

- `POST /api/v1/jobs` - Crear oferta (recruiter)
- `GET /api/v1/jobs` - Listar ofertas públicas
- `GET /api/v1/jobs/search` - Buscar ofertas con filtros
- `PATCH /api/v1/jobs/:id/status` - Cambiar estado
- `DELETE /api/v1/jobs/:id` - Eliminar oferta

### Applications

- `POST /api/v1/applications` - Crear postulación (graduate)
- `GET /api/v1/applications` - Listar postulaciones
- `PATCH /api/v1/applications/:id/status` - Cambiar estado
- `DELETE /api/v1/applications/:id` - Cancelar postulación

### Conversations & Messages

- `GET /api/v1/conversations` - Listar conversaciones
- `GET /api/v1/conversations/:id/messages` - Obtener mensajes
- `POST /api/v1/conversations/:id/messages` - Crear mensaje (fallback si Socket falla)

### Files

- `POST /api/v1/files/upload` - Subir archivo
- `DELETE /api/v1/files/:id` - Eliminar archivo

### Notifications

- `GET /api/v1/notifications` - Listar notificaciones
- `PATCH /api/v1/notifications/:id/read` - Marcar como leída
- `DELETE /api/v1/notifications/:id` - Eliminar notificación

## 🔒 Seguridad

- **Contraseñas**: Hasheadas con bcrypt (10 salts)
- **JWT**: Expira en 15 minutos, refresh token en 7 días
- **CORS**: Configurado para dominio específico
- **Helmet**: Headers de seguridad HTTP
- **Validación**: Express-validator en todos los endpoints
- **Rate limiting**: Por implementar para login (5 intentos/15min)

## 📝 Variables de Entorno

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bolsa_empleos
DB_USER=postgres
DB_PASSWORD=

# JWT
JWT_SECRET=tu_clave_secreta_aqui_cambiar_en_produccion
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=tu_refresh_secret_aqui
JWT_REFRESH_EXPIRE=7d

# Servidor
PORT=3001
NODE_ENV=development

# Archivos
MAX_FILE_SIZE=10485760
ALLOWED_CV_TYPES=application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp

# CORS
CORS_ORIGIN=http://localhost:4200
```

## 🧪 Testing

Por implementar con Jest

```bash
npm test
```

## 📈 Próximas Mejoras

- [ ] Rate limiting
- [ ] Auditoría de cambios
- [ ] Búsqueda full-text con Elasticsearch
- [ ] Caché con Redis
- [ ] Métricas y monitoring
- [ ] Documentación Swagger
- [ ] Tests unitarios e integración
- [ ] Email notifications
- [ ] Recomendación inteligente de trabajos

## 👥 Contribuidores

- Fabricio

## 📄 Licencia

MIT
