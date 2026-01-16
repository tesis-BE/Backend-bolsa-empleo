const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fileType = require('file-type');

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
    // Detectar tipo de archivo por el fieldname
    let uploadDir = './uploads/cvs';

    if (file.fieldname === 'photo') uploadDir = './uploads/photos';
    else if (file.fieldname === 'logo') uploadDir = './uploads/logos';
    else if (file.fieldname === 'cv') uploadDir = './uploads/cvs';

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Filtro de archivos con validación de magic numbers
const fileFilter = (req, file, cb) => {
  const fileType = file.fieldname; // Usar fieldname directamente
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
      process.env.ALLOWED_IMAGE_TYPES ||
      'image/jpeg,image/png,image/jpg,image/webp'
    ).split(',');
    allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
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
    console.log('=== Validando archivo ===');
    console.log('Fieldname:', req.file.fieldname);
    console.log('Original name:', req.file.originalname);
    console.log('Mimetype:', req.file.mimetype);
    console.log('Path:', req.file.path);
    console.log('Size:', req.file.size);

    const buffer = fs.readFileSync(req.file.path);
    const detectedType = await fileType.fromBuffer(buffer);

    console.log('Detected file type:', detectedType);

    const fileTypeParam = req.file.fieldname; // Usar fieldname del archivo
    let allowedMimes = [];

    if (fileTypeParam === 'cv') {
      allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
    } else if (fileTypeParam === 'photo' || fileTypeParam === 'logo') {
      allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    }

    console.log('Allowed mimes:', allowedMimes);
    console.log('File type mime:', detectedType?.mime);
    console.log(
      'Is valid?',
      detectedType && allowedMimes.includes(detectedType.mime)
    );

    // Validar el tipo real del archivo
    if (!detectedType || !allowedMimes.includes(detectedType.mime)) {
      console.log('❌ Validación falló - eliminando archivo');
      // Eliminar archivo si la validación falla
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'El contenido del archivo no coincide con el tipo esperado',
      });
    }

    console.log('✅ Validación exitosa');
    next();
  } catch (error) {
    console.error('❌ Error en validateFileContent:', error);
    // Eliminar archivo en caso de error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      success: false,
      message: 'Error al validar el archivo',
      error: error.message,
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
