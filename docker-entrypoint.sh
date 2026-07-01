#!/bin/sh
# Arranque del backend.
# Carga los datos iniciales (base_de_datos/bolsa_empleo.sql) SOLO si la base
# de datos todavia no tiene informacion. Si ya tiene datos, no vuelve a cargar.
set -e

DB_HOST="${DB_HOST:-postgres}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"
DB_NAME="${DB_NAME:-bolsa_empleo}"
SEED_FILE="base_de_datos/bolsa_empleo.sql"

export PGPASSWORD="$DB_PASSWORD"

echo "Verificando el estado de la base de datos en ${DB_HOST}:${DB_PORT}..."

# Cuenta cuantos roles existen. Si la tabla no existe todavia, devuelve 0.
ROLE_COUNT=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tA \
  -c "SELECT count(*) FROM public.roles;" 2>/dev/null || echo "0")

if [ "$ROLE_COUNT" = "0" ]; then
  echo "La base de datos esta vacia. Cargando datos iniciales desde ${SEED_FILE}..."
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
    -v ON_ERROR_STOP=1 -f "$SEED_FILE"
  echo "Datos iniciales cargados correctamente."
else
  echo "La base de datos ya contiene datos (${ROLE_COUNT} roles). No se recarga."
fi

echo "Iniciando el servidor..."
exec node src/index.js
