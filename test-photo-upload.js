/**
 * Script de prueba para el endpoint de subida de foto
 *
 * Uso:
 * 1. node test-photo-upload.js <token> <ruta-a-imagen>
 *
 * Ejemplo:
 * node test-photo-upload.js eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... ./test.jpg
 */

const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001/api/v1';

async function testPhotoUpload(token, imagePath) {
  try {
    console.log('\n=== Probando subida de foto ===\n');

    // Verificar que el archivo existe
    if (!fs.existsSync(imagePath)) {
      console.error('❌ El archivo no existe:', imagePath);
      return;
    }

    // Verificar que es una imagen
    const ext = imagePath.toLowerCase().split('.').pop();
    if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
      console.error('❌ El archivo debe ser una imagen (jpg, jpeg, png, webp)');
      return;
    }

    // Crear FormData
    const formData = new FormData();
    formData.append('photo', fs.createReadStream(imagePath));

    console.log('📤 Enviando foto al servidor...');
    console.log('   URL:', `${BASE_URL}/users/photo`);
    console.log('   Archivo:', imagePath);
    console.log('   Tamaño:', fs.statSync(imagePath).size, 'bytes');

    // Hacer la petición
    const response = await fetch(`${BASE_URL}/users/photo`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      console.log('\n✅ Foto subida exitosamente');
      console.log('   URL:', data.data?.url);
      console.log('\nRespuesta completa:', JSON.stringify(data, null, 2));
    } else {
      console.error('\n❌ Error al subir la foto');
      console.error('   Status:', response.status);
      console.error('   Mensaje:', data.message || data.error);
      console.error('\nRespuesta completa:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('\n❌ Error en la prueba:', error.message);
    console.error(error);
  }
}

// Ejecutar el script
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log(`
Uso: node test-photo-upload.js <token> <ruta-a-imagen>

Ejemplo:
node test-photo-upload.js "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." ./test.jpg

Para obtener un token:
1. Inicia sesión desde el frontend o usa:
   curl -X POST http://localhost:3001/api/v1/auth/login \\
     -H "Content-Type: application/json" \\
     -d '{"email":"tu-email@example.com","password":"tu-password"}'
  `);
  process.exit(1);
}

const [token, imagePath] = args;
testPhotoUpload(token, imagePath);
