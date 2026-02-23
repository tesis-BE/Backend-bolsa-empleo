const express = require('express');
const router = express.Router();
const RecruiterRequestController = require('../controllers/recruiter-request.controller');
const recruiterRequestValidator = require('../validators/recruiter-request.validator');
const { authMiddleware, isAdmin } = require('../middlewares');
const { upload, validateFileContent } = require('../config/multer');
const { loginLimiter } = require('../middlewares/rate-limit.middleware');

// Ruta pública: enviar solicitud (con logo opcional y rate limiting)
router.post(
  '/',
  loginLimiter,
  upload.single('logo'),
  validateFileContent,
  recruiterRequestValidator.create,
  RecruiterRequestController.create
);

// Rutas protegidas (admin)
router.get('/', authMiddleware, isAdmin, RecruiterRequestController.findAll);
router.get('/:id', authMiddleware, isAdmin, RecruiterRequestController.findOne);
router.post('/:id/approve', authMiddleware, isAdmin, RecruiterRequestController.approve);
router.post('/:id/reject', authMiddleware, isAdmin, RecruiterRequestController.reject);

module.exports = router;
