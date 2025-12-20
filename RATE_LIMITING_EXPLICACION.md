# 🔒 Explicación del Rate Limiting - Bolsa de Empleos ULEAM

---

## ❓ ¿Dónde se almacenan los límites de intentos?

### Implementación Actual (Memoria RAM)

**Ubicación**: [src/middlewares/rate-limit.middleware.js](src/middlewares/rate-limit.middleware.js)

```javascript
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos por ventana
  // ... Sin configuración de 'store'
});
```

**¿Dónde se guarda?**

- Por defecto, `express-rate-limit` usa **MemoryStore** (RAM del servidor)
- Cada IP tiene un contador que se incrementa con cada petición
- Después de 15 minutos, el contador se resetea automáticamente

**Estructura en memoria (simplificada)**:

```javascript
{
  "192.168.1.100": { count: 3, resetTime: 1703098200000 },
  "10.0.0.5": { count: 5, resetTime: 1703098300000 }, // ← Bloqueado
  "192.168.1.200": { count: 1, resetTime: 1703098100000 }
}
```

### ⚠️ Limitaciones de MemoryStore

1. **Se pierde al reiniciar el servidor** - Los contadores vuelven a 0
2. **No funciona con múltiples servidores** - Si tienes 3 servidores detrás de un load balancer, cada uno tiene su propio contador
3. **Consume RAM** - Si tienes millones de IPs, puede ser problemático

---

## 🚀 Solución para Producción: Redis

### Implementación Recomendada

**Instalar dependencias**:

```bash
npm install rate-limit-redis redis
```

**Crear `src/config/redis.js`**:

```javascript
const redis = require('redis');

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
});

redisClient.on('error', (err) => {
  console.error('❌ Error de Redis:', err);
});

redisClient.connect();

module.exports = redisClient;
```

**Modificar `src/middlewares/rate-limit.middleware.js`**:

```javascript
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redisClient = require('../config/redis');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:login:', // Prefijo para las claves
  }),
  message: {
    success: false,
    message:
      'Demasiados intentos de inicio de sesión. Por favor, intente más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
```

**Ventajas de Redis**:

- ✅ Persiste entre reinicios del servidor
- ✅ Funciona con múltiples servidores (load balancer)
- ✅ Escalable y rápido
- ✅ Puede compartirse entre diferentes aplicaciones

---

## 🔐 Sobre "ligarse si el correo existe realmente"

### Tu Preocupación: Enumeración de Usuarios

**Escenario actual**:

```
Intento 1: user1@test.com + password123 → "Credenciales inválidas"
Intento 2: user2@test.com + password123 → "Credenciales inválidas"
Intento 3: user3@test.com + password123 → "Credenciales inválidas"
...
Intento 6: cualquier@test.com → "Demasiados intentos"
```

**Problema**: Un atacante podría probar 5 emails diferentes para ver cuáles existen antes de ser bloqueado.

### ✅ Solución Implementada (Correcta)

**El rate limiting actual por IP es CORRECTO** porque:

1. **No revela información**: Siempre retorna el mismo mensaje genérico
2. **Protege contra enumeración**: Bloquea después de 5 intentos desde la misma IP, sin importar el email
3. **Evita brute force distribuido**: Aunque el atacante pruebe diferentes emails, se bloquea por IP

### 🎯 Mejora Adicional: Rate Limiting por Email

Si quieres **doble protección**, podemos agregar rate limiting por email:

**Modificar `src/middlewares/rate-limit.middleware.js`**:

```javascript
// Rate limiter por EMAIL además de IP
const loginLimiterByEmail = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 intentos por email (más que por IP)
  keyGenerator: (req) => {
    // Usar email como clave en lugar de IP
    return req.body.email || req.ip;
  },
  message: {
    success: false,
    message:
      'Demasiados intentos para este correo. Por favor, intente más tarde.',
  },
  skipSuccessfulRequests: true, // Resetear si el login es exitoso
});
```

**Aplicar ambos middlewares**:

```javascript
// En src/routes/auth.routes.js
router.post(
  '/login',
  loginLimiter, // ← Límite por IP (5 intentos)
  loginLimiterByEmail, // ← Límite por EMAIL (10 intentos)
  authValidator.login,
  authController.login
);
```

**Resultado**: Ahora tienes protección doble:

- Máximo 5 intentos desde una IP (sin importar qué emails pruebe)
- Máximo 10 intentos a un email específico (aunque venga de diferentes IPs)

---

## 🔄 Sobre "la página se recarga en cada intento fallido"

### 🚨 IMPORTANTE: El rate limiting NO recarga la página

El backend **NUNCA** recarga la página. Cuando el límite se alcanza:

1. Backend retorna `429 Too Many Requests` con JSON:

   ```json
   {
     "success": false,
     "message": "Demasiados intentos..."
   }
   ```

2. El **frontend Angular** es quien decide qué hacer con este error

### 🔍 Análisis del Frontend Actual

**Archivo**: [src/app/features/auth/components/sign-in/sign-in.component.ts](../../Frontend-graduados/src/app/features/auth/components/sign-in/sign-in.component.ts)

**Código actual**:

```typescript
login() {
  this.submitted = true;
  if (this.signInForm.valid) {
    const email = this.formValues['email'].value;
    const password = this.formValues['password'].value;
    this.store.dispatch(login({ email, password })); // ← Usa NgRx Store
  }
}
```

**El problema está en el efecto de NgRx** (archivo: `src/app/core/store/authentication/authentication-effect.ts` probablemente):

```typescript
// POSIBLE CÓDIGO PROBLEMÁTICO
login$ = createEffect(() =>
  this.actions$.pipe(
    ofType(login),
    exhaustMap(({ email, password }) =>
      this.authService.login(email, password).pipe(
        map((user) => loginSuccess({ user })),
        tap(() => {
          this.router.navigate(['/dashboard']); // ← Navega en éxito
        }),
        catchError((error) => {
          // ⚠️ AQUÍ PUEDE ESTAR EL PROBLEMA
          // Si hace window.location.reload() → Recarga la página
          // Si hace this.router.navigate(['/login']) → Parece recarga
          return of(loginFailure({ error: error.message }));
        })
      )
    )
  )
);
```

### ✅ Solución: Manejo Correcto de Errores

**Paso 1: Verificar que no haya `window.location.reload()`**

Buscar en el proyecto:

```bash
cd Frontend-graduados
grep -r "window.location.reload\|location.reload" src/
```

**Paso 2: Actualizar el componente para mostrar el error correctamente**

El código actual **ya maneja bien los errores** con NgRx:

```typescript
// En sign-in.component.ts (líneas 45-53)
this.store
  .select(getError)
  .pipe(takeUntil(this.destroy$))
  .subscribe((error) => {
    if (error) {
      this.errorMessage = error; // ← Muestra el error
      setTimeout(() => {
        this.errorMessage = '';
        this.store.dispatch(clearError());
      }, 5000); // ← Se limpia después de 5 segundos
    }
  });
```

**Paso 3: Verificar el template HTML**

El template debe mostrar el error sin recargar:

```html
<!-- sign-in.component.html -->
<form [formGroup]="signInForm" (ngSubmit)="login()">
  <!-- Alerta de error sin recarga -->
  <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
    {{ errorMessage }}
  </div>

  <!-- Inputs -->
  <div class="mb-3">
    <label>Email</label>
    <input type="email" formControlName="email" class="form-control" />
  </div>

  <div class="mb-3">
    <label>Contraseña</label>
    <input type="password" formControlName="password" class="form-control" />
  </div>

  <!-- Botón con loading state -->
  <button type="submit" [disabled]="loading" class="btn btn-primary">
    <span *ngIf="loading">Cargando...</span>
    <span *ngIf="!loading">Iniciar Sesión</span>
  </button>
</form>
```

**Paso 4: Interceptor HTTP para manejar error 429**

Crear interceptor en `src/app/core/interceptors/rate-limit.interceptor.ts`:

```typescript
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class RateLimitInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 429) {
          // No recargar, solo mostrar mensaje específico
          const message =
            error.error?.message ||
            'Demasiados intentos. Por favor, espere unos minutos.';

          // Podrías mostrar un toast o notificación aquí
          console.warn('🚨 Rate limit alcanzado:', message);

          return throwError(() => new Error(message));
        }

        return throwError(() => error);
      })
    );
  }
}
```

---

## 📊 Headers de Rate Limiting

El middleware actual envía headers informativos:

```http
HTTP/1.1 429 Too Many Requests
RateLimit-Limit: 5
RateLimit-Remaining: 0
RateLimit-Reset: 1703098200
```

**Puedes usarlos en el frontend**:

```typescript
// En auth.service.ts
login(email: string, password: string): Observable<User> {
  return this.http.post<LoginResponse>(endpoint, { email, password }, {
    observe: 'response' // ← Obtener headers
  }).pipe(
    map((response) => {
      const rateLimitRemaining = response.headers.get('RateLimit-Remaining');
      const rateLimitReset = response.headers.get('RateLimit-Reset');

      if (rateLimitRemaining && parseInt(rateLimitRemaining) <= 2) {
        console.warn(`⚠️ Solo quedan ${rateLimitRemaining} intentos`);
        // Mostrar advertencia al usuario
      }

      // ... resto del código
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 429) {
        const resetTime = error.headers.get('RateLimit-Reset');
        const resetDate = new Date(parseInt(resetTime!) * 1000);
        const message = `Demasiados intentos. Podrás intentar de nuevo a las ${resetDate.toLocaleTimeString()}`;
        return throwError(() => new Error(message));
      }
      return throwError(() => error);
    })
  );
}
```

---

## 🎯 Resumen

### ¿Dónde se almacena?

- **Actual**: Memoria RAM del servidor (se pierde al reiniciar)
- **Recomendado para producción**: Redis (persistente, compartido, escalable)

### ¿Se liga al correo real?

- **Actual**: No, se bloquea por IP (correcto para evitar enumeración)
- **Mejora opcional**: Agregar rate limiting por email como segunda capa

### ¿Por qué se recarga la página?

- **El backend NO recarga** - Solo retorna error 429
- **Causa probable**: El frontend Angular tiene un `window.location.reload()` en el manejo de errores
- **Solución**: Verificar efectos de NgRx y eliminar recargas forzadas

### Próximos pasos recomendados

1. ✅ Implementar Redis para producción
2. ✅ Agregar rate limiting por email como segunda capa
3. ✅ Crear interceptor HTTP para manejar error 429 elegantemente
4. ✅ Mostrar advertencia cuando quedan pocos intentos
5. ✅ Usar los headers RateLimit-\* para informar al usuario

---

**Elaborado por**: GitHub Copilot  
**Fecha**: 20 de diciembre de 2025
