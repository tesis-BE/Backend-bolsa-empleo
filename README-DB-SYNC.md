# 📋 Sincronización de Base de Datos - Bolsa de Empleos

## 🔴 Problema
Tu base de datos local está **desactualizada** y le faltan **2 tablas nuevas**:
- ❌ `careers` (Tabla de Carreras)
- ❌ `UserRoles` (Relación N:M usuario-roles)

Además **faltan 2 migraciones** que agregan campos importantes:
- ❌ `cedula` en usuarios (para validación nacional)
- ❌ Chat directo sin postulación
- ❌ Adjuntos en mensajes

---

## ✅ Solución Rápida (Opción 1 - RECOMENDADA)

Si tu BD local **solo tiene datos de prueba**, haz esto:

```bash
cd Backend-bolsa-empleo
node scripts/init-database.js
```

**Qué hace:**
- ✅ Aplica todas las migraciones automáticamente
- ✅ Crea las tablas nuevas (careers, UserRoles)
- ✅ Crea roles (admin, recruiter, graduate)
- ✅ Crea todos los permisos
- ✅ Crea usuario admin: `fabriciozavala13@gmail.com` / `123456`
- ✅ Asigna rol admin con todos los permisos
- ✅ Crea universidades y facultades de prueba
- ✅ Crea empresas de prueba

**⚠️ ADVERTENCIA:** Esto sincroniza las tablas pero BORRA datos existentes si ya tienes usuarios.

---

## 📝 Solución Manual (Opción 2 - Si tienes datos cuidados)

Si tienes datos que **quieres preservar**, ejecuta solo las migraciones nuevas:

```bash
cd Backend-bolsa-empleo

# 1. Agregar cédula a usuarios
node -e "
  require('dotenv').config();
  const fs = require('fs');
  const sequelize = require('./src/config/database');
  const sql = fs.readFileSync('./migrations/20260201-add-cedula-to-users.sql', 'utf8');
  sequelize.query(sql).then(() => {
    console.log('✅ Migración 20260201 aplicada');
    process.exit(0);
  }).catch(e => {
    console.error('❌ Error:', e.message);
    process.exit(1);
  });
"

# 2. Crear tabla careers
node -e "
  require('dotenv').config();
  const fs = require('fs');
  const sequelize = require('./src/config/database');
  const sql = fs.readFileSync('./migrations/20260202-create-careers-table.sql', 'utf8');
  sequelize.query(sql).then(() => {
    console.log('✅ Migración 20260202 aplicada');
    process.exit(0);
  }).catch(e => {
    console.error('❌ Error:', e.message);
    process.exit(1);
  });
"

# 3. Ajustes de chat
node -e "
  require('dotenv').config();
  const fs = require('fs');
  const sequelize = require('./src/config/database');
  const sql = fs.readFileSync('./migrations/20260203-chat-notifications-columns.sql', 'utf8');
  sequelize.query(sql).then(() => {
    console.log('✅ Migración 20260203 aplicada');
    process.exit(0);
  }).catch(e => {
    console.error('❌ Error:', e.message);
    process.exit(1);
  });
"

# 4. Crear tabla UserRoles
node -e "
  require('dotenv').config();
  const fs = require('fs');
  const sequelize = require('./src/config/database');
  const sql = fs.readFileSync('./migrations/20260207-create-user-roles-table.sql', 'utf8');
  sequelize.query(sql).then(() => {
    console.log('✅ Migración 20260207 aplicada');
    process.exit(0);
  }).catch(e => {
    console.error('❌ Error:', e.message);
    process.exit(1);
  });
"

# 5. Crear roles y permisos (si no existen)
node scripts/init-database.js
```

---

## 🛠️ Script Completo (Opción 3 - RECOMENDADA para sincronización total)

Ejecuta este comando para **sincronizar TODO sin perder datos**:

```bash
node scripts/full-sync-database.js
```

**Qué hace:**
1. ✅ Aplica todas las migraciones
2. ✅ Crea roles (admin, recruiter, graduate)
3. ✅ Crea permisos (7 en total)
4. ✅ Crea carreras de prueba (Informática, Administración, Ingeniería)
5. ✅ Asigna todos los permisos al rol admin
6. ✅ Asegura que usuario admin tiene todos los permisos

**No borra datos existentes** ✨

---

## 🔧 Scripts Individuales (Si prefieres hacerlo paso a paso)

Si quieres ejecutar solo una parte:

```bash
# Solo migraciones y roles
node scripts/sync-database.js

# Solo crear carreras de prueba
node scripts/populate-careers.js

# Asignar permisos al rol admin
node scripts/assign-admin-permissions.js
```

---

## 📊 Tablas Nuevas (Explicadas Simple)

### Tabla `careers` (Carreras)
```
id → Número único de la carrera
name → Nombre (Ej: "Ingeniería en Sistemas")
description → Descripción
facultyId → ¿A cuál facultad pertenece?
isActive → ¿Está activa o clausurada?
```

**Uso:** Para que los graduados seleccionen su carrera exacta (Ingeniería en Sistemas, Administración, etc.)

---

### Tabla `UserRoles` (Relación Usuario-Roles)
```
userId → ID del usuario
roleId → ID del rol
createdAt → Cuándo se asignó
```

**Uso:** Permite que **un usuario tenga múltiples roles**. Ejemplo:
- Un admin que también es recruiter
- Un recruiter que también es admin

---

## 🔑 Campos Nuevos en Users

| Campo | Tipo | Por qué |
|-------|------|---------|
| `cedula` | Texto | Para validación de identidad (documento nacional) |

---

## 📝 Cambios en other tablas

| Tabla | Cambios |
|-------|---------|
| `conversations` | Ahora `applicationId` puede ser NULL (permite chat directo sin postulación) |
| `messages` | Añade `attachmentUrl` (para archivos) y `readAt` (para marcar como leído) |
| `notifications` | Añade `readAt` (para marcar como leída) |
| `jobs` | Ahora tiene `createdBy` (quién creó la oferta) |

---

## ✔️ Checklist de Verificación

Después de sincronizar, verifica en tu DB:

```sql
-- ¿Existen las tablas nuevas?
\dt careers
\dt "UserRoles"

-- ¿Tienen datos?
SELECT COUNT(*) FROM careers;
SELECT COUNT(*) FROM "UserRoles";

-- ¿Tiene cedula la tabla users?
SELECT column_name FROM information_schema.columns 
WHERE table_name='users' AND column_name='cedula';

-- ¿Existen los permisos?
SELECT COUNT(*) FROM permissions;
-- Debe dar: 7

-- ¿Existe el usuario admin?
SELECT email, "userType" FROM users WHERE email='fabriciozavala13@gmail.com';
-- Debe dar: fabriciozavala13@gmail.com | admin
```

---

## 🚀 Próximos Pasos

1. **Ejecuta una de las opciones arriba** (recomendada: Opción 1)
2. **Verifica con el checklist** que todo funciona
3. **Reinicia el backend:** `npm run dev`
4. **Prueba el login** con: `fabriciozavala13@gmail.com` / `123456`
5. **Frontend:** Hacer login debe mostrar todos los módulos (porque admin tiene todos los permisos)

---

## ❓ Dudas Frecuentes

**P: ¿Perderé mis usuarios si ejecuto init-database.js?**  
R: Sí, es un script que `ALTER TABLE` + sincroniza. Si tienes datos críticos, usa Opción 2.

**P: ¿Qué es `cedula`?**  
R: Es la cédula de identidad del país (documento nacional).

**P: ¿Por qué `careers` si ya tenía `faculties`?**  
R: Porque una Facultad tiene múltiples Carreras. Ej: Facultad de Informática → {Ingeniería en Sistemas, Ingeniería en Redes, ...}

**P: ¿Necesito agregar datos a `careers`?**  
R: El script `init-database.js` no lo hace. Puedes poblarlo después desde el frontend o manualmente.

---

## 📞 Necesitas Ayuda?

- Revisa los archivos de migración en: `Backend-bolsa-empleo/migrations/`
- Revisa los modelos en: `Backend-bolsa-empleo/src/models/`
- Ejecuta `node scripts/init-database.js` si estás perdido

