FROM node:20-alpine

WORKDIR /app

# Cliente de PostgreSQL, necesario para cargar los datos iniciales al arrancar.
RUN apk add --no-cache postgresql-client

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Script de arranque que siembra la base solo si esta vacia.
RUN chmod +x docker-entrypoint.sh

EXPOSE 3001

CMD ["./docker-entrypoint.sh"]
