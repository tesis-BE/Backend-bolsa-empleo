# 🧪 Guía de Testing - Correcciones de Seguridad

Esta guía te ayudará a verificar que todas las correcciones de seguridad estén funcionando correctamente.

---

## 📋 Prerequisitos

Antes de probar, asegúrate de:

1. ✅ Tener el servidor corriendo: `npm run dev`
2. ✅ Tener PostgreSQL corriendo con la base de datos configurada
3. ✅ Tener las variables de entorno en `.env`
4. ✅ Tener al menos un usuario registrado para pruebas

---

## 1. 🔒 Probar Rate Limiting

### Test 1.1: Límite de Login (5 intentos / 15 minutos)

**Herramienta**: Postman, Thunder Client, o curl

```bash
# Ejecutar este comando 6 veces seguidas
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario_falso@test.com",
    "password": "password_incorrecto"
  }'
```

**Resultado esperado:**

- Intentos 1-5: `400 Bad Request` o `401 Unauthorized` (credenciales incorrectas)
- Intento 6: `429 Too Many Requests` con mensaje:
  ```json
  {
    "success": false,
    "message": "Demasiados intentos de inicio de sesión. Por favor, intente más tarde."
  }
  ```

**✅ Corrección funciona si**: El 6to intento retorna error 429

---

### Test 1.2: Límite de Registro

```bash
# Ejecutar 6 veces con diferentes emails
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test1@test.com",
    "password": "TestPass123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**✅ Corrección funciona si**: El 6to intento retorna error 429

---

## 2. 🛡️ Probar Sanitización XSS

### Test 2.1: Intentar inyectar script en biografía

**Endpoint**: `PATCH /api/v1/users/profile`

```bash
curl -X PATCH http://localhost:3001/api/v1/users/profile \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "<script>alert(\"XSS\")</script>Hola, soy desarrollador"
  }'
```

**Resultado esperado:**

- Status: `200 OK`
- El script debe guardarse escapado en la base de datos:
  ```
  &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;Hola, soy desarrollador
  ```

**Verificar en la BD:**

```sql
SELECT bio FROM users WHERE id = TU_USER_ID;
```

**✅ Corrección funciona si**: Los caracteres `<`, `>`, `"` se convierten a entidades HTML

---

### Test 2.2: Intentar inyectar en nombre de empresa

```bash
curl -X POST http://localhost:3001/api/v1/companies \
  -H "Authorization: Bearer RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "<img src=x onerror=alert(1)>",
    "description": "Empresa de prueba XSS"
  }'
```

**✅ Corrección funciona si**: El nombre se guarda escapado o retorna error de validación

---

## 3. 🔐 Probar Verificación JWT en Socket.IO

### Test 3.1: Conectar con token inválido

**En el frontend (o con socket.io-client)**:

```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:3001', {
  auth: { token: 'token_completamente_invalido' },
});

socket.on('connect', () => {
  console.log('✅ Conectado (NO DEBERÍA OCURRIR)');
});

socket.on('connect_error', (err) => {
  console.log('❌ Error de conexión:', err.message);
  // Debe mostrar: "Token inválido o expirado"
});
```

**✅ Corrección funciona si**: La conexión falla con error "Token inválido o expirado"

---

### Test 3.2: Enviar mensaje muy largo

**Con token válido**, intentar enviar un mensaje de más de 5000 caracteres:

```javascript
socket.emit('send_message', {
  conversationId: 1,
  content: 'A'.repeat(6000), // 6000 caracteres
});

socket.on('error', (data) => {
  console.log('Error recibido:', data.message);
  // Debe mostrar: "El mensaje es demasiado largo (máximo 5000 caracteres)"
});
```

**✅ Corrección funciona si**: El socket emite error de longitud

---

## 4. 📁 Probar Validación de Archivos

### Test 4.1: Subir ejecutable disfrazado como PDF

**Preparación:**

1. Crear un archivo de texto: `echo "This is not a PDF" > fake.txt`
2. Renombrar: `mv fake.txt fake_cv.pdf` (en Windows: `ren fake.txt fake_cv.pdf`)

**Subir archivo:**

```bash
curl -X POST http://localhost:3001/api/v1/users/cv \
  -H "Authorization: Bearer TU_TOKEN" \
  -F "cv=@fake_cv.pdf" \
  -F "file_type=cv"
```

**Resultado esperado:**

```json
{
  "success": false,
  "message": "El contenido del archivo no coincide con el tipo esperado"
}
```

**✅ Corrección funciona si**: El archivo es rechazado y eliminado del servidor

---

### Test 4.2: Subir imagen real como foto de perfil

**Con una imagen JPEG/PNG válida:**

```bash
curl -X POST http://localhost:3001/api/v1/users/photo \
  -H "Authorization: Bearer TU_TOKEN" \
  -F "photo=@foto_real.jpg" \
  -F "file_type=photo"
```

**Resultado esperado:**

```json
{
  "success": true,
  "message": "Foto de perfil actualizada",
  "data": { ... }
}
```

**✅ Corrección funciona si**: La imagen válida se acepta correctamente

---

## 5. 🔄 Probar Transacciones Atómicas

### Test 5.1: Simular fallo en postulación

**Este test requiere modificar temporalmente el código para forzar un error:**

**En `application.service.js`, línea ~68, agregar:**

```javascript
// Después de crear la aplicación, antes de la notificación
throw new Error('Error simulado para testing'); // ⚠️ TEMPORAL
```

**Ejecutar postulación:**

```bash
curl -X POST http://localhost:3001/api/v1/applications \
  -H "Authorization: Bearer GRADUATE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": 1,
    "coverLetter": "Me interesa esta oferta"
  }'
```

**Verificar en la BD:**

```sql
-- No debe existir la aplicación ni la notificación
SELECT * FROM applications WHERE user_id = TU_USER_ID AND job_id = 1;
SELECT * FROM notifications WHERE event_type = 'new_application';
```

**✅ Corrección funciona si**: NO hay registros (se revirtió la transacción)

**⚠️ IMPORTANTE**: Eliminar el `throw new Error` después de la prueba

---

### Test 5.2: Postulación exitosa completa

**Sin el error simulado, ejecutar:**

```bash
curl -X POST http://localhost:3001/api/v1/applications \
  -H "Authorization: Bearer GRADUATE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": 2,
    "coverLetter": "Me interesa esta oferta"
  }'
```

**Verificar en la BD:**

```sql
-- Deben existir AMBOS registros
SELECT * FROM applications WHERE user_id = TU_USER_ID AND job_id = 2;
SELECT * FROM notifications WHERE event_type = 'new_application' AND related_id = (SELECT id FROM applications WHERE user_id = TU_USER_ID AND job_id = 2);
```

**✅ Corrección funciona si**: Existen AMBOS registros (aplicación + notificación)

---

## 6. ✅ Probar Validaciones de Salario y Fecha

### Test 6.1: Salario máximo menor que mínimo

```bash
curl -X POST http://localhost:3001/api/v1/jobs \
  -H "Authorization: Bearer RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Desarrollador Senior",
    "description": "Descripción con más de 20 caracteres para cumplir validación",
    "jobType": "full-time",
    "salaryMin": 3000,
    "salaryMax": 1000
  }'
```

**Resultado esperado:**

```json
{
  "success": false,
  "errors": [
    {
      "msg": "El salario máximo debe ser mayor o igual al mínimo",
      "param": "salaryMax"
    }
  ]
}
```

**✅ Corrección funciona si**: Retorna error de validación

---

### Test 6.2: Fecha de expiración en el pasado

```bash
curl -X POST http://localhost:3001/api/v1/jobs \
  -H "Authorization: Bearer RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Desarrollador Junior",
    "description": "Descripción con más de 20 caracteres para cumplir validación",
    "jobType": "full-time",
    "expiresAt": "2020-01-01T00:00:00.000Z"
  }'
```

**Resultado esperado:**

```json
{
  "success": false,
  "errors": [
    {
      "msg": "La fecha de expiración debe ser en el futuro",
      "param": "expiresAt"
    }
  ]
}
```

**✅ Corrección funciona si**: Retorna error de validación

---

### Test 6.3: Fecha de expiración válida (futura)

```bash
curl -X POST http://localhost:3001/api/v1/jobs \
  -H "Authorization: Bearer RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Desarrollador Full Stack",
    "description": "Descripción con más de 20 caracteres para cumplir validación",
    "jobType": "full-time",
    "salaryMin": 1000,
    "salaryMax": 3000,
    "expiresAt": "2026-12-31T23:59:59.000Z"
  }'
```

**Resultado esperado:**

```json
{
  "success": true,
  "message": "Oferta creada exitosamente",
  "data": { ... }
}
```

**✅ Corrección funciona si**: La oferta se crea correctamente

---

## 7. 🔍 Verificación Final: Checklist Completo

Marca cada item después de probarlo:

- [ ] Rate limiting en login (6to intento bloqueado)
- [ ] Rate limiting en register (6to intento bloqueado)
- [ ] XSS sanitización en bio (caracteres escapados)
- [ ] XSS sanitización en nombre de empresa
- [ ] Socket.IO rechaza tokens inválidos
- [ ] Socket.IO rechaza mensajes muy largos (>5000 chars)
- [ ] Validación de archivo rechaza fake PDFs
- [ ] Validación de archivo acepta imágenes reales
- [ ] Transacciones revierten todo en caso de error
- [ ] Transacciones guardan todo en caso de éxito
- [ ] Validación rechaza salaryMax < salaryMin
- [ ] Validación rechaza fechas pasadas
- [ ] Validación acepta fechas futuras

---

## 🐛 Troubleshooting

### "Error: Cannot find module 'express-rate-limit'"

```bash
cd Backend-bolsa-empleo
npm install express-rate-limit file-type@16.5.4
```

### "Error: Cannot find module 'file-type'"

```bash
npm install file-type@16.5.4
# Nota: Usamos versión 16.5.4 porque es la última compatible con require()
```

### Rate limiting no funciona después de 15 minutos

- Es normal, el límite se resetea cada 15 minutos
- Para testing rápido, puedes cambiar temporalmente en `rate-limit.middleware.js`:
  ```javascript
  windowMs: 1 * 60 * 1000, // 1 minuto en lugar de 15
  ```

### Socket.IO no conecta

- Verifica que CORS esté configurado correctamente en `.env`
- Verifica que el frontend use el puerto correcto (3001 por defecto)

---

## 📝 Registro de Pruebas

Después de ejecutar todos los tests, documenta los resultados:

```
Fecha: _______________
Ejecutado por: _______________

RESULTADOS:
✅ Rate Limiting: PASS / FAIL
✅ Sanitización XSS: PASS / FAIL
✅ Socket.IO JWT: PASS / FAIL
✅ Validación Archivos: PASS / FAIL
✅ Transacciones: PASS / FAIL
✅ Validaciones Extra: PASS / FAIL

Notas adicionales:
_________________________________
_________________________________
```

---

**¿Todo funciona?** 🎉 ¡Felicidades! Tu backend está seguro y listo para producción.

**¿Algo falló?** 🔧 Revisa los logs del servidor con `npm run dev` y verifica los mensajes de error.
