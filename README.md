# Backend Bolsa de Empleos

## STACK TECNOLÓGICO

- Node.js + Express 5.2.1
- PostgreSQL + Sequelize 6.37.7
- Socket.IO (WebSocket)
- JWT Authentication
- Bcrypt password hashing

## ARQUITECTURA

Patrón MVC con capas: Routes → Controllers → Services → Models
Middleware chain: auth → role validation → business logic → error handler

## MÓDULOS IMPLEMENTADOS

### CORE (Base)

- Authentication: JWT tokens, bcrypt hashing, session management
- Authorization: Role-based access control (graduate, recruiter, admin)
- File Upload: CV, photos, logos with magic number validation
- Chat: Real-time messaging with Socket.IO
- Notifications: Internal notification system

### SEARCH (Opción 3)

- Advanced filtering: title, jobType, workMode, salaryMin, salaryMax, skills, location, companyName, facultyId, postedWithin, experienceLevel
- Full-text search: PostgreSQL tsvector with to_tsquery
- Skills matching: Array overlap algorithm with percentage threshold
- Endpoints: GET /api/v1/search/advanced, GET /api/v1/search/full-text, POST /api/v1/search/match-skills

### ANALYTICS (Opción 4)

- Recruiter dashboard metrics: totalApplications, growthRate, conversionRate, topJobs, applicationsByStatus, averageResponseTime
- Job performance tracking: jobsAboutToExpire, jobsWithoutApplications
- Date-based aggregations: daily/weekly/monthly trends
- Endpoint: GET /api/v1/analytics/recruiter

### SAVED JOBS (Opción 5)

- Favorites system: User can save/unsave jobs
- Unique constraint: userId + jobId
- Pagination support
- Endpoints: POST /api/v1/saved-jobs/jobs/:jobId/save, DELETE /api/v1/saved-jobs/jobs/:jobId/save, GET /api/v1/saved-jobs/saved

### INTERVIEWS (Opción 7)

- Lifecycle: propose → confirm → reschedule → complete → cancel
- proposedDates array, selectedDate field
- Status enum: pending, confirmed, completed, cancelled, rescheduled
- Type enum: presencial, virtual
- Meeting details: location, meetingLink, duration, notes
- Endpoints: POST /api/v1/interviews, PATCH /api/v1/interviews/:id/confirm, PATCH /api/v1/interviews/:id/reschedule

### ENHANCED PROFILE (Opción 8)

- WorkExperience: company, position, startDate, endDate, isCurrent, description, achievements[]
- Education: institution, degree, fieldOfStudy, graduationYear, gpa, honors, isCurrent
- Certification: name, issuingOrganization, issueDate, expirationDate, credentialId, credentialUrl
- Project: name, description, technologies[], projectUrl, liveUrl, thumbnailUrl, isCurrent
- Endpoints: CRUD operations under /api/v1/profile/\*

### RECOMMENDATIONS (Opción 9)

- Multi-factor scoring algorithm:
  - Skills match: 40% weight
  - Faculty match: 30% weight
  - Experience level match: 20% weight
  - Location match: 10% weight
- Match reasons explanation for UI display
- Similar jobs algorithm based on skill overlap
- Endpoints: GET /api/v1/recommendations/recommended, GET /api/v1/recommendations/similar/:jobId

## INSTALACIÓN

### Requisitos

Node.js 14+, PostgreSQL 12+, npm/yarn

### Setup

1. npm install
2. Create .env file with: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET, JWT_REFRESH_SECRET, PORT, CORS_ORIGIN
3. createdb bolsa_empleos
4. npm run dev

### Server runs on

http://localhost:3001/api/v1

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

## MODELOS DE BASE DE DATOS

### CORE MODELS (15 total)

- User: id, email, password, firstName, lastName, userType[graduate|recruiter|admin], bio, linkedinUrl, cvFileId, profilePhotoId, companyId, facultyId, isActive, availableForWork
- Company: id, name, description, industry, recruiterId, logoId, isActive
- Job: id, title, description, jobType[full-time|part-time|contract|internship|temporary], workMode[remote|on-site|hybrid], salaryMin, salaryMax, skills[], deadline, companyId, facultyId, status[borrador|publicado|cerrado|pausado|expirado]
- Application: id, jobId, userId, coverLetter, status[pendiente|revisado|entrevistado|aceptado|rechazado], rejectionReason, appliedAt
- Conversation: id, applicationId, graduateId, recruiterId
- Message: id, conversationId, senderId, content, isRead
- File: id, fileName, fileType, filePath, uploadedBy
- Notification: id, userId, title, message, isRead, relatedEntityType, relatedEntityId
- Role: id, name, description
- Permission: id, name, description
- RolePermission: roleId, permissionId
- Faculty: id, name, description, universityId
- University: id, name, location
- UserSkill: id, userId, skillName, proficiencyLevel
- UserPortfolio: id, userId, title, description, url

### NEW MODELS (6 added - Dec 2025)

- SavedJob: id, userId, jobId, createdAt | UNIQUE(userId, jobId)
- Interview: id, applicationId, proposedDates[], selectedDate, status[pending|confirmed|completed|cancelled|rescheduled], interviewType[presencial|virtual], location, meetingLink, duration, notes
- WorkExperience: id, userId, company, position, startDate, endDate, isCurrent, description, achievements[]
- Education: id, userId, institution, degree, fieldOfStudy, startDate, endDate, graduationYear, gpa, honors, isCurrent
- Certification: id, userId, name, issuingOrganization, issueDate, expirationDate, credentialId, credentialUrl
- PESTRUCTURA DE CARPETAS

src/
├── config/ Database connection, multer file upload, constants
├── models/ 21 Sequelize models (15 core + 6 new)
├── services/ Business logic layer (19 services)
├── controllers/ HTTP request handlers (12 controllers)
├── routes/ API route definitions (13 route files)
├── middlewares/ Auth, role, error handlers
├── validators/ Express-validator schemas
├── utils/ JWT helper, response formatter
├── socket/ Socket.IO chat listeners
└── index.js Server entry point

uploads/
├── cvs/ User CV files
├── photos/ Profile photos
└── logos/ Company logosd SERIAL PRIMARY KEY,
job_id INT NOT NULL,
user_id INT NOT NULL,
cover_letter TEXT,
status ENUM('pendiente', 'revisado', 'entrevistado', 'aceptado', 'rechazado'),
rejection_reason TEXT,
applied_at TIMESTAMP DEFAULT NOW(),
uAUTHENTICATION FLOW

POST /api/v1/auth/register
Body: { email, password, firstName, lastName }
Returns: { success, message, data: { user } }

POST /api/v1/auth/login
Body: { email, password }
Returns: { success, data: { token, user: { id, email, firstName, lastName, userType } } }

GET /api/v1/auth/me
Headers: Authorization: Bearer <token>
Returns: { success, data: { user } }Usuario escribiendo
socket.emit('user_typing', {
conversationId: 1,
isTyping: true,
});

// Marcar como leído
socket.emit('mark_as_read', {
conversationId: 1,
messageIds: [1, 2, 3],
});

````

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
````

## 📊 Endpoints API

### Auth

- `POST /api/v1/auth/register` - Registrarse
- `POST /api/v1/auth/login` - Iniciar sesión
- `GET /api/v1/auth/me` - Obtener perfil (protegido)
- `POST /api/v1/auth/logout` - Cerrar sesión

### Users

- `GET /api/v1/users` - Listar usuarios (admin)
- `SOCKET.IO EVENTS

### Client → Server

- join_conversation: { conversationId, userId }
- send_message: { conversationId, content }
- user_typing: { conversationId, isTyping }
- mark_as_read: { conversationId, messageIds[] }

### Server → Client

- receive_message: { id, conversationId, senderId, senderName, content, createdAt }
- user_typing: { userId, isTyping }
- messages_read: { messageIds[] }\*CORS\*\*: Configurado para dominio específico
- **Helmet**: Headers de seguridad HTTP
- \*API ENDPOINTS (30+ routes)

### Auth (4)

POST /api/v1/auth/register - Create account
POST /api/v1/auth/login - Authenticate user
GET /api/v1/auth/me - Get current user profile
POST /api/v1/auth/logout - Invalidate session

### Users (6)

GET /api/v1/users - List all users [admin]
GET /api/v1/users/:id - Get user by ID
PATCH /api/v1/users/:id - Update user profile
PATCH /api/v1/users/:id/type - Change userType [admin]
PATCH /api/v1/users/:id/status - Change isActive [admin]
GET /api/v1/users/search/graduates - Search graduates with filters

### Companies (5)

POST /api/v1/companies - Create company [recruiter]
GET /api/v1/companies - List companies
GET /api/v1/companies/:id - Get company details
PATCH /api/v1/companies/:id - Update company [owner]
DELETE /api/v1/companies/:id - Delete company [owner]

### Jobs (5)

POST /api/v1/jobs - Create job offer [recruiter]
GET /api/v1/jobs - List public jobs
GET /api/v1/jobs/search - Search with filters
PATCH /api/v1/jobs/:id/status - Update job status [recruiter]
DELETE /api/v1/jobs/:id - Delete job [recruiter]

### Applications (4)

POST /api/v1/applications - Apply to job [graduate]
GET /api/v1/applications - List applications
PATCH /api/v1/applications/:id/status - Update status [recruiter]
DELETE /api/v1/applications/:id - Cancel application [graduate]

### Conversations (3)

GET /api/v1/conversations - List user conversations
GET /api/v1/conversations/:id/messages - Get messages
POST /api/v1/conversations/:id/messages - Send message

### Files (2)

POST /api/v1/files/upload - Upload file (CV, photo, logo)
DELETE /api/v1/files/:id - Delete file [owner]

### Notifications (3)

GET /api/v1/notifications - List user notifications
PATCH /api/v1/notifications/:id/read - Mark as read
DELETE /api/v1/notifications/:id - Delete notification

### SavedJobs (4) [NEW]

POST /api/v1/saved-jobs/jobs/:jobId/save - Save job
DELETE /api/v1/saved-jobs/jobs/:jobId/save - Unsave job
GET /api/v1/saved-jobs/saved - List saved jobs
GET /api/v1/saved-jobs/jobs/:jobId/is-saved - Check if saved

### Interviews (6) [NEW]

POST /api/v1/interviews - Create interview [recruiter]
PATCH /api/v1/interviews/:id/confirm - Confirm date [graduate]
PATCH /api/v1/interviews/:id/reschedule - Reschedule interview
PATCH /api/v1/interviews/:id/complete - Mark complete [recruiter]
DELETE /api/v1/interviews/:id/cancel - Cancel interview
GET /api/v1/interviews/upcoming - List upcoming interviews

### Search (3) [NEW]

GET /api/v1/search/advanced - Advanced search with filters
GET /api/v1/search/full-text - Full-text search with PostgreSQL
POST /api/v1/search/match-skills - Match by skills threshold

### Analytics (3) [NEW]

GET /api/v1/analytics/recruiter - Dashboard metrics [recruiter]
GET /api/v1/analytics/jobs/expiring - Jobs about to expire [recruiter]
GET /api/v1/analytics/jobs/no-applications - Jobs without apps [recruiter]

### Recommendations (2) [NEW]

GET /api/v1/recommendations/recommended - Get recommended jobs
GET /api/v1/recommendations/similar/:jobId - Get similar jobs

### Profile (13) [NEW]

GET /api/v1/profile/complete - Get complete profile with all sections
POST /api/v1/profile/work-experiences - Add work experience
GET /api/v1/profile/work-experiences - List work experiences
PATCH /api/v1/profile/work-experiences/:id - Update work experience
DELETE /api/v1/profile/work-experiences/:id - Delete work experience
POST /api/v1/profile/educations - Add education
GET /api/v1/profile/educations - List educations
PATCH /api/v1/profile/educations/:id - Update education
DELETE /api/v1/profile/educations/:id - Delete education
POST /api/v1/profile/certifications - Add certification
GET /api/v1/profile/certifications - List certifications
PATCH /api/v1/profile/certifications/:id - Update certification
DELETE /api/v1/profile/certifications/:id - Delete certification
POST /api/v1/profile/projects - Add project
GET /api/v1/profile/projects - List projects
PATCH /api/v1/profile/projects/:id - Update project
DELETE /api/v1/profile/projects/:id - Delete project

- [ ] Tests unitarios e integración
- [SEGURIDAD

### Authentication & Authorization

- Bcrypt password hashing: 10 salt rounds
- JWT tokens: 15min access, 7d refresh
- Role-based access control: graduate, recruiter, admin
- Middleware chain: verifyToken → checkRole → business logic

### API Protection

- Rate limiting: 5 attempts/15min login, 100 req/min general
- CORS: Restricted to configured origin
- Helmet: HTTP security headers
- Express-validator: Input validation on all endpoints
- XSS sanitization: .escape() on text inputs

### File Security

- Magic number validation: Prevents disguised malware
- File type whitelist: CV (pdf, doc, docx), Images (jpg, png, webp)
- Size limits: 10MB max per file
- Unique filename generation: UUID-based to prevent collisions

### Data Integrity

- Database transactions: Atomic operations for critical flows
- Unique constraints: userId+jobId on SavedJob, applicationId on Interview
- Foreign key constraints: Referential integrity enforced
- Socket.IO JWT verification: Real token check on WebSocket connectionVARIABLES DE ENTORNO

DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
JWT_SECRET, JWT_EXPIRE (15m), JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRE (7d)
PORT (3001), NODE_ENV (development|production)
MAX_FILE_SIZE (10485760), ALLOWED_CV_TYPES, ALLOWED_IMAGE_TYPES
CORS_ORIGIN (http://localhost:4200)

## ALGORITMOS CLAVE

### Recommendation Scoring

score = (skillsMatch _ 0.4) + (facultyMatch _ 0.3) + (experienceMatch _ 0.2) + (locationMatch _ 0.1)
Returns: matchScore (0-100), matchReasons[], recommendedJobs[]

### Skills Matching

Uses PostgreSQL array overlap operator: skills && requiredSkills
Calculates match percentage: (matchedSkills.length / requiredSkills.length) \* 100
Threshold configurable per query

### Full-Text Search

PostgreSQL tsvector with to_tsquery
Searches across: title, description, company name
Returns ranked results by relevance

### Analytics Calculations

Growth rate: ((current - previous) / previous) _ 100
Conversion rate: (accepted / total) _ 100
Average response time: AVG(EXTRACT(EPOCH FROM (updated_at - applied_at)))

## CHANGELOG (Dec 2025)

ADDED:

- SavedJob model with unique constraint
- Interview model with lifecycle management
- WorkExperience, Education, Certification, Project models
- Search service with advanced filtering + full-text + skills matching
- Analytics service with 15+ recruiter metrics
- Recommendation service with multi-factor scoring algorithm
- Profile service for complete user profile aggregation
- 6 new controllers, 7 new route files
- 30+ new API endpoints

FIXED:

- Frontend error.interceptor.ts: Removed window.location.reload() on 401
- Model export pattern: Converted to direct Sequelize model exports
- Relationship definitions: Reordered hasMany before belongsTo

SECURITY IMPROVEMENTS:

- Rate limiting on login (5/15min) and general routes (100/min)
- XSS sanitization with .escape()
- Magic number validation for file uploads
- Socket.IO JWT verification
- Database transactions on critical operations
