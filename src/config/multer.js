const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { fileTypeFromBuffer } = require('file-type');

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

// Filtro de archivos con validación de magic numbers
const fileFilter = (req, file, cb) => {
  const fileType = req.body.file_type || 'cv';
  let allowedTypes = [];
  let allowedMimes = [];

  if (fileType === 'cv') {
    allowedTypes = (process.env.ALLOWED_CV_TYPES || 'application/pdf').split(
      ','
    );
    allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
  } else if (fileType === 'photo' || fileType === 'logo') {
    allowedTypes = (
      process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png'
    ).split(',');
    allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  }

  // Validación básica de mimetype
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`));
  }

  cb(null, true);
};

// Middleware para validar contenido real del archivo después de subirlo
const validateFileContent = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const buffer = fs.readFileSync(req.file.path);
    const fileType = await fileTypeFromBuffer(buffer);

    const fileTypeParam = req.body.file_type || 'cv';
    let allowedMimes = [];

    if (fileTypeParam === 'cv') {
      allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
    } else if (fileTypeParam === 'photo' || fileTypeParam === 'logo') {
      allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    }

    // Validar el tipo real del archivo
    if (!fileType || !allowedMimes.includes(fileType.mime)) {
      // Eliminar archivo si la validación falla
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'El contenido del archivo no coincide con el tipo esperado',
      });
    }

    next();
  } catch (error) {
    // Eliminar archivo en caso de error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      success: false,
      message: 'Error al validar el archivo',
    });
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
  },
});

module.exports = { upload, validateFileContent };
