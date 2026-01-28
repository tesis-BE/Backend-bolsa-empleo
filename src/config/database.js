const { Sequelize } = require('sequelize');
const { Client } = require('pg');

// Función para crear la BD si no existe
async function createDatabaseIfNotExists() {
  const dbName = process.env.DB_NAME || 'bolsa_empleo';
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: 'postgres', // Conectar a la BD por defecto
  });

  try {
    await client.connect();
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (result.rowCount === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
    }
  } catch (error) {
    // Si el error es porque ya existe, ignorar
    if (error.code !== '42P04') {
      console.error('Error verificando/creando BD:', error.message);
    }
  } finally {
    await client.end();
  }
}

const sequelize = new Sequelize(
  process.env.DB_NAME || 'bolsa_empleo',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = sequelize;
module.exports.createDatabaseIfNotExists = createDatabaseIfNotExists;
