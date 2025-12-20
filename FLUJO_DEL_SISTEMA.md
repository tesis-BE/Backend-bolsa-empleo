# 🔄 Análisis del Flujo del Sistema - Bolsa de Empleos ULEAM

**Fecha**: 20 de diciembre de 2025  
**Estado del servidor**: ✅ Funcionando correctamente en puerto 3001

---

## 📊 FLUJO COMPLETO DEL SISTEMA

### 1. 🔐 AUTENTICACIÓN Y REGISTRO

#### 1.1 Registro de Usuarios

**Endpoint**: `POST /api/v1/auth/register`

**Flujo**:

```
Usuario → Envía datos → Validator (sanitización XSS) → AuthService.register()
         ↓
   Verifica email único
         ↓
   Crea usuario con bcrypt
         ↓
   Genera JWT + RefreshToken
         ↓
   Retorna tokens + datos de usuario
```

**Tipos de usuario disponibles**:

- `graduate` (Egresado) - **POR DEFECTO**
- `recruiter` (Reclutador)
- `admin` (Administrador)

**✅ Correcciones implementadas**:

- Rate limiting: 5 intentos cada 15 minutos
- Sanitización XSS en firstName, lastName
- Validación de contraseña: min 8, max 128, 1 mayúscula, 1 número, 1 especial

#### 1.2 Login

**Endpoint**: `POST /api/v1/auth/login`

**Flujo**:

```
Usuario → Envía email + password → Rate Limiter (5/15min) → Validator
         ↓
   Busca usuario por email
         ↓
   Compara password con bcrypt
         ↓
   Verifica isActive = true
         ↓
   Genera JWT + RefreshToken
         ↓
   Retorna tokens + datos de usuario
```

**Respuesta exitosa**:

```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "usuario@example.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      "userType": "graduate",
      "isActive": true
    }
  }
}
```

---

### 2. 👔 FLUJO DEL RECLUTADOR

#### 2.1 Crear Empresa (OBLIGATORIO antes de crear ofertas)

**Endpoint**: `POST /api/v1/companies`  
**Rol requerido**: `recruiter`

**Flujo**:

```
Reclutador → Envía datos de empresa → Validator (sanitización XSS)
         ↓
   CompanyService.create()
         ↓
   Crea empresa asociada al recruiterId
         ↓
   Retorna empresa creada
```

**Datos requeridos**:

- `name` (min 2, max 255 caracteres)
- `description` (opcional, min 10, max 2000)
- `industry` (opcional)
- `website` (opcional, URL válida)
- `location` (opcional)

**⚠️ IMPORTANTE**: Un reclutador **DEBE** tener una empresa antes de crear ofertas de trabajo.

#### 2.2 Crear Oferta de Trabajo

**Endpoint**: `POST /api/v1/jobs`  
**Rol requerido**: `recruiter` o `admin`

**Flujo**:

```
Reclutador → Envía datos de job → Validator (validaciones)
         ↓
   JobService.createForRecruiter(recruiterId, data)
         ↓
   Busca empresa del reclutador
         ↓
   ¿Tiene empresa? → NO → Error: "Primero debes registrar tu empresa"
         ↓ SÍ
   Crea job con status = "DRAFT" (borrador)
         ↓
   Retorna job creado
```

**Estados de una oferta**:

- `borrador` - Creada pero no visible para estudiantes
- `publicado` - **VISIBLE** para estudiantes, pueden postularse
- `cerrado` - No acepta más postulaciones
- `pausado` - Temporalmente no visible
- `expirado` - Venció el deadline

**Validaciones especiales implementadas**:

- ✅ `salaryMax >= salaryMin` (no puede ser menor)
- ✅ `expiresAt` debe ser fecha futura
- ✅ Sanitización XSS en title y description

#### 2.3 Publicar Oferta (hacer visible para estudiantes)

**Endpoint**: `PATCH /api/v1/jobs/:id/publish`

**Flujo**:

```
Reclutador → Solicita publicar job → Verifica permisos
         ↓
   JobService.publish(jobId, recruiterId)
         ↓
   Cambia status de "borrador" a "publicado"
         ↓
   AHORA los estudiantes pueden verla y postularse
```

#### 2.4 Ver Postulaciones Recibidas

**Endpoint**: `GET /api/v1/applications/received`

**Flujo**:

```
Reclutador → Solicita postulaciones → ApplicationService.getByRecruiter()
         ↓
   Busca empresa del reclutador
         ↓
   Obtiene todas las applications de jobs de esa empresa
         ↓
   Retorna lista paginada con datos del estudiante
```

**Datos que recibe el reclutador**:

```json
{
  "data": [
    {
      "id": 1,
      "status": "pendiente",
      "coverLetter": "Me interesa...",
      "appliedAt": "2025-12-20T10:00:00Z",
      "user": {
        "id": 5,
        "firstName": "María",
        "lastName": "García",
        "email": "maria@example.com",
        "bio": "Desarrolladora...",
        "linkedinUrl": "...",
        "cvFile": { "path": "uploads/cvs/..." }
      },
      "job": {
        "id": 10,
        "title": "Desarrollador Full Stack"
      }
    }
  ]
}
```

#### 2.5 Cambiar Estado de Postulación

**Endpoint**: `PATCH /api/v1/applications/:id/status`

**Flujo**:

```
Reclutador → Cambia status → ApplicationService.updateStatus()
         ↓ [CON TRANSACCIÓN]
   Verifica permisos (dueño de la empresa)
         ↓
   Actualiza status de la application
         ↓
   ¿Status = "revisado" o "entrevistado"?
         ↓ SÍ
   Crea conversación de chat (si no existe)
         ↓
   Crea notificación al estudiante
         ↓
   Commit de transacción → Todo o nada
```

**Estados disponibles**:

- `pendiente` - Recién enviada
- `revisado` - Reclutador la revisó → **CREA CHAT**
- `entrevistado` - Seleccionado para entrevista → **CREA CHAT**
- `aceptado` - Contratado ✅
- `rechazado` - No seleccionado ❌

**✅ Transacción atómica**: Si falla crear la conversación o notificación, **todo se revierte**.

---

### 3. 🎓 FLUJO DEL ESTUDIANTE (EGRESADO)

#### 3.1 Ver Ofertas Disponibles

**Endpoint**: `GET /api/v1/jobs/search`  
**Acceso**: Público (no requiere autenticación)

**Flujo**:

```
Estudiante → Busca ofertas → JobService.search()
         ↓
   Filtra solo jobs con status = "publicado"
         ↓
   Aplica filtros (título, tipo, salario, ubicación, etc.)
         ↓
   Retorna lista paginada de ofertas
```

**Filtros disponibles**:

- `title` - Busca en el título (ILIKE)
- `type` - Tipo de trabajo (full-time, part-time, contract, internship, temporary)
- `mode` - Modalidad (remote, on-site, hybrid)
- `minSalary`, `maxSalary` - Rango salarial
- `skills` - Habilidades requeridas
- `location` - Ubicación
- `companyId` - Empresa específica

#### 3.2 Ver Detalle de Oferta

**Endpoint**: `GET /api/v1/jobs/:id`

**Datos que recibe**:

```json
{
  "data": {
    "id": 10,
    "title": "Desarrollador Full Stack",
    "description": "Buscamos...",
    "jobType": "full-time",
    "workMode": "hybrid",
    "salaryMin": 1500,
    "salaryMax": 2500,
    "skills": ["React", "Node.js", "PostgreSQL"],
    "expiresAt": "2026-01-31T23:59:59Z",
    "status": "publicado",
    "company": {
      "id": 2,
      "name": "Tech Solutions S.A.",
      "description": "...",
      "industry": "Tecnología",
      "location": "Manta, Ecuador"
    }
  }
}
```

#### 3.3 Postularse a una Oferta

**Endpoint**: `POST /api/v1/applications`  
**Rol requerido**: `graduate`

**Flujo**:

```
Estudiante → Envía postulación → ApplicationService.apply()
         ↓ [CON TRANSACCIÓN]
   Verifica que job existe y está "publicado"
         ↓
   Verifica que NO ha postulado antes (índice único: userId + jobId)
         ↓
   Crea application con status = "pendiente"
         ↓
   Crea notificación al reclutador
         ↓
   Commit de transacción
```

**Datos enviados**:

```json
{
  "jobId": 10,
  "coverLetter": "Me interesa esta oferta porque..." // Opcional, max 2000 caracteres
}
```

**✅ Validaciones**:

- No puede postular dos veces al mismo trabajo (error: "Ya has postulado a esta oferta")
- Solo puede postular si el job está "publicado"
- La carta de presentación se sanitiza (XSS)

#### 3.4 Ver Mis Postulaciones

**Endpoint**: `GET /api/v1/applications/my`

**Flujo**:

```
Estudiante → Solicita sus postulaciones → ApplicationService.getByUser()
         ↓
   Obtiene todas las applications del usuario
         ↓
   Incluye datos del job y la empresa
         ↓
   Retorna lista paginada ordenada por fecha (más reciente primero)
```

**Datos que recibe**:

```json
{
  "data": [
    {
      "id": 1,
      "status": "revisado",
      "coverLetter": "...",
      "appliedAt": "2025-12-20T10:00:00Z",
      "job": {
        "id": 10,
        "title": "Desarrollador Full Stack",
        "company": {
          "name": "Tech Solutions S.A.",
          "location": "Manta"
        }
      },
      "conversation": {
        "id": 5 // Si existe, puede chatear
      }
    }
  ]
}
```

#### 3.5 Cancelar Postulación

**Endpoint**: `DELETE /api/v1/applications/:id`

**Restricción**: Solo puede cancelar si el status es **"pendiente"**  
(No puede cancelar si ya fue revisada, entrevistada, aceptada o rechazada)

---

### 4. 💬 FLUJO DE CHAT EN TIEMPO REAL

#### 4.1 ¿Cuándo se crea una conversación?

**AUTOMÁTICAMENTE** cuando el reclutador cambia el status de una postulación a:

- `revisado` → Crea conversación
- `entrevistado` → Crea conversación

**Modelo de datos**:

```javascript
Conversation {
  id: 5,
  applicationId: 1, // ÚNICO (una conversación por postulación)
  graduateId: 5,
  recruiterId: 3,
  createdAt, updatedAt
}
```

#### 4.2 Conectarse al Chat (WebSocket)

**Conexión**: `socket.io` en `http://localhost:3001`

**Flujo**:

```
Usuario → Se conecta con token JWT
         ↓
   Socket.IO middleware verifica token (✅ implementado)
         ↓
   Extrae userId, userType del token
         ↓
   Usuario conectado y autenticado
```

**Código del cliente**:

```javascript
const socket = io('http://localhost:3001', {
  auth: { token: 'eyJhbGciOiJIUzI1NiIs...' }, // Token JWT
});

socket.on('connect', () => {
  console.log('✅ Conectado al chat');
});
```

#### 4.3 Unirse a una Conversación

**Evento**: `join_conversation`

```javascript
socket.emit('join_conversation', {
  conversationId: 5,
  userId: 3, // ID del usuario actual
});

socket.on('joined_conversation', (data) => {
  console.log('Unido a conversación', data.conversationId);
});
```

**Validaciones**:

- El usuario debe pertenecer a la conversación (ser graduado o reclutador de esa conversation)
- Si no pertenece, recibe evento `error`

#### 4.4 Enviar Mensaje

**Evento**: `send_message`

```javascript
socket.emit('send_message', {
  conversationId: 5,
  content: 'Hola, me interesa la posición...',
});
```

**Flujo en el servidor**:

```
Usuario → Envía mensaje → chat.socket.js
         ↓
   Valida que esté autenticado (socket.userId)
         ↓
   Valida longitud del mensaje (max 5000 caracteres) ✅
         ↓
   Verifica que pertenece a la conversación
         ↓
   Guarda mensaje en BD (Message.create)
         ↓
   Emite "receive_message" a todos en la sala
```

**✅ Validaciones implementadas**:

- Máximo 5000 caracteres por mensaje
- No puede estar vacío
- Usuario debe pertenecer a la conversación

#### 4.5 Recibir Mensajes

**Evento**: `receive_message`

```javascript
socket.on('receive_message', (data) => {
  console.log('Nuevo mensaje:', data);
  // {
  //   id: 123,
  //   conversationId: 5,
  //   senderId: 3,
  //   senderName: "Juan Pérez",
  //   content: "Hola...",
  //   createdAt: "2025-12-20T12:00:00Z"
  // }
});
```

#### 4.6 Indicador de "Escribiendo..."

**Eventos**: `user_typing`

```javascript
// Emitir cuando el usuario está escribiendo
socket.emit('user_typing', {
  conversationId: 5,
  isTyping: true, // o false cuando deja de escribir
});

// Recibir cuando el otro usuario está escribiendo
socket.on('user_typing', (data) => {
  if (data.isTyping) {
    console.log('El otro usuario está escribiendo...');
  }
});
```

#### 4.7 Marcar Mensajes como Leídos

**Evento**: `mark_as_read`

```javascript
socket.emit('mark_as_read', {
  conversationId: 5,
  messageIds: [123, 124, 125],
});

socket.on('messages_read', (data) => {
  console.log('Mensajes leídos:', data.messageIds);
});
```

---

### 5. 🔔 SISTEMA DE NOTIFICACIONES

#### 5.1 Cuándo se crean notificaciones

**AUTOMÁTICAMENTE** en estos eventos:

1. **Nueva postulación** (estudiante postula)

   - Destinatario: Reclutador dueño de la oferta
   - Mensaje: "Tienes una nueva postulación para {título}"
   - Tipo: `info`

2. **Cambio de status** (reclutador cambia estado)

   - Destinatario: Estudiante que postuló
   - Mensajes según status:
     - `revisado`: "Tu postulación para {título} ha sido revisada"
     - `entrevistado`: "Has sido seleccionado para entrevista en {título}"
     - `aceptado`: "¡Felicidades! Has sido aceptado para {título}"
     - `rechazado`: "Tu postulación para {título} ha sido rechazada"
   - Tipos: `info`, `success`, `warning`

3. **Reclutador postula candidato**
   - Destinatario: Estudiante postulado
   - Mensaje: "Has sido postulado a {título} por tu reclutador"
   - Tipo: `info`

#### 5.2 Ver Notificaciones

**Endpoint**: `GET /api/v1/notifications`

**Parámetros**:

- `page`, `pageSize` - Paginación
- `unreadOnly=true` - Solo no leídas

#### 5.3 Marcar como Leída

**Endpoint**: `PATCH /api/v1/notifications/:id/read`

---

## 🚨 PROBLEMAS POTENCIALES Y SOLUCIONES

### ❌ Problema 1: Reclutador sin empresa

**Error**: "Primero debes registrar tu empresa"

**Solución**:

1. El reclutador debe crear su empresa primero: `POST /api/v1/companies`
2. Luego puede crear ofertas de trabajo

**Flujo correcto**:

```
1. Register como "recruiter"
2. Login
3. POST /api/v1/companies (crear empresa)
4. POST /api/v1/jobs (crear ofertas)
```

### ❌ Problema 2: Estudiante no ve ofertas

**Causa**: Las ofertas están en estado "borrador"

**Solución**: El reclutador debe publicarlas

```
PATCH /api/v1/jobs/:id/publish
```

Solo las ofertas con `status = "publicado"` son visibles en la búsqueda.

### ❌ Problema 3: Chat no funciona

**Causas posibles**:

1. Token inválido → Verificar que se envía en `auth: { token }`
2. No hay conversación → Solo existe si status es "revisado" o "entrevistado"
3. CORS mal configurado → Verificar `.env` tiene `CORS_ORIGIN=http://localhost:4200`

### ❌ Problema 4: No puede postularse dos veces

**Es correcto**: Hay un índice único en `(userId, jobId)`

**Error esperado**: "Ya has postulado a esta oferta"

Solución: Si quiere postularse de nuevo, debe cancelar primero (si está en "pendiente")

---

## 📝 RESUMEN DE ENDPOINTS PRINCIPALES

### Autenticación

- `POST /api/v1/auth/register` - Registrarse
- `POST /api/v1/auth/login` - Iniciar sesión
- `GET /api/v1/auth/me` - Obtener perfil

### Empresas (Reclutador)

- `POST /api/v1/companies` - Crear empresa
- `GET /api/v1/companies/my/company` - Ver mi empresa
- `PUT /api/v1/companies` - Actualizar empresa

### Ofertas de Trabajo

- `POST /api/v1/jobs` - Crear oferta (recruiter)
- `GET /api/v1/jobs/search` - Buscar ofertas (público)
- `GET /api/v1/jobs/:id` - Ver detalle
- `PATCH /api/v1/jobs/:id/publish` - Publicar oferta
- `GET /api/v1/jobs/my/jobs` - Mis ofertas (recruiter)

### Postulaciones

- `POST /api/v1/applications` - Postularse (graduate)
- `GET /api/v1/applications/my` - Mis postulaciones (graduate)
- `GET /api/v1/applications/received` - Postulaciones recibidas (recruiter)
- `PATCH /api/v1/applications/:id/status` - Cambiar estado (recruiter)
- `DELETE /api/v1/applications/:id` - Cancelar postulación (graduate)

### Chat (WebSocket)

- `join_conversation` - Unirse a conversación
- `send_message` - Enviar mensaje
- `receive_message` - Recibir mensaje
- `user_typing` - Indicador de escritura
- `mark_as_read` - Marcar como leído

### Notificaciones

- `GET /api/v1/notifications` - Ver notificaciones
- `PATCH /api/v1/notifications/:id/read` - Marcar como leída

---

## ✅ FLUJO COMPLETO PASO A PASO

### Escenario: Un estudiante postula a una oferta

```
1. RECLUTADOR:
   └─ Register (userType: "recruiter")
   └─ Login → Recibe token
   └─ POST /api/v1/companies (crear empresa)
   └─ POST /api/v1/jobs (crear oferta en "borrador")
   └─ PATCH /api/v1/jobs/:id/publish (publicar oferta)

2. ESTUDIANTE:
   └─ Register (userType: "graduate")
   └─ Login → Recibe token
   └─ GET /api/v1/jobs/search (ver ofertas publicadas) ✅
   └─ GET /api/v1/jobs/:id (ver detalle)
   └─ POST /api/v1/applications (postularse)
        └─ Se crea Application con status "pendiente"
        └─ Se crea Notification al reclutador ✅

3. RECLUTADOR:
   └─ GET /api/v1/notifications (ve: "Nueva postulación") ✅
   └─ GET /api/v1/applications/received (ve la postulación)
   └─ PATCH /api/v1/applications/:id/status → status: "revisado"
        └─ Se crea Conversation ✅
        └─ Se crea Notification al estudiante ✅

4. ESTUDIANTE:
   └─ GET /api/v1/notifications (ve: "Tu postulación ha sido revisada") ✅
   └─ GET /api/v1/applications/my (ve conversation.id existe)
   └─ Socket.IO connect + join_conversation
   └─ Puede chatear con el reclutador ✅

5. CHAT EN TIEMPO REAL:
   Estudiante ←───┐
                  ├─→ [Socket.IO] ←──┐
   Reclutador ←───┘                  │
                                     │
   Mensajes en tiempo real ✅        │
   Indicador "escribiendo..." ✅     │
   Marcar como leído ✅              │
```

---

**Elaborado por**: GitHub Copilot  
**Fecha**: 20 de diciembre de 2025  
**Estado**: ✅ Sistema funcionando correctamente
