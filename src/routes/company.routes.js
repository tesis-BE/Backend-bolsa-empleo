const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/company.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares');
const { companyValidator } = require('../validators');
const { upload, validateFileContent } = require('../config/multer');
const { USER_TYPES } = require('../config/constants');

// Rutas públicas
router.get('/', CompanyController.findAll.bind(CompanyController));
router.get('/:id', CompanyController.findById.bind(CompanyController));
router.get('/:id/jobs', CompanyController.getWithJobs.bind(CompanyController));

// Rutas protegidas para reclutadores
router.use(authMiddleware);

router.post(
  '/',
  roleMiddleware([USER_TYPES.RECRUITER]),
  companyValidator.create,
  CompanyController.create.bind(CompanyController)
);

router.get(
  '/my/company',
  roleMiddleware([USER_TYPES.RECRUITER]),
  CompanyController.getMyCompany.bind(CompanyController)
);

router.put(
  '/',
  roleMiddleware([USER_TYPES.RECRUITER]),
  companyValidator.update,
  CompanyController.update.bind(CompanyController)
);

router.post(
  '/logo',
  roleMiddleware([USER_TYPES.RECRUITER]),
  upload.single('logo'),
  validateFileContent,
  CompanyController.uploadLogo.bind(CompanyController)
);

module.exports = router;
