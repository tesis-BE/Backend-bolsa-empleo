const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crear directorios si no existen
const uploadDirs = ['./uploads/cvs', './uploads/photos', './uploads/logos'];
uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType = req.body.file_type || 'cv';
    let uploadDir = './uploads/cvs';

    if (fileType === 'photo') uploadDir = './uploads/photos';
    else if (fileType === 'logo') uploadDir = './uploads/logos';

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10485760; // 10MB

  if (file.size > maxSize) {
    return cb(
      new Error(`Archivo demasiado grande. Máximo: ${maxSize / 1024 / 1024}MB`)
    );
  }

  const fileType = req.body.file_type || 'cv';
  let allowedTypes = [];

  if (fileType === 'cv') {
    allowedTypes = process.env.ALLOWED_CV_TYPES.split(',');
  } else if (fileType === 'photo' || fileType === 'logo') {
    allowedTypes = process.env.ALLOWED_IMAGE_TYPES.split(',');
  }

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760,
  },
});

module.exports = { upload };
