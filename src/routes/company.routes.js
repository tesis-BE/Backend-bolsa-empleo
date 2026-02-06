const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/company.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares');
const { companyValidator } = require('../validators');
const { upload, validateFileContent } = require('../config/multer');
const { USER_TYPES } = require('../config/constants');

router.get('/', CompanyController.findAll.bind(CompanyController));

router.use(authMiddleware);

router.get(
  '/my/company',
  CompanyController.getMyCompany.bind(CompanyController)
);

router.post(
  '/',
  companyValidator.create,
  CompanyController.create.bind(CompanyController)
);

router.put(
  '/',
  companyValidator.update,
  CompanyController.update.bind(CompanyController)
);

router.post(
  '/logo',
  upload.single('logo'),
  validateFileContent,
  CompanyController.uploadLogo.bind(CompanyController)
);

router.post(
  '/recruiters',
  companyValidator.addRecruiter,
  CompanyController.addRecruiter.bind(CompanyController)
);

router.post(
  '/:companyId/recruiters',
  roleMiddleware(USER_TYPES.ADMIN),
  companyValidator.addRecruiter,
  CompanyController.addRecruiterToCompany.bind(CompanyController)
);

router.delete(
  '/recruiters/:userId',
  CompanyController.removeRecruiter.bind(CompanyController)
);

router.delete(
  '/:companyId/recruiters/:userId',
  roleMiddleware(USER_TYPES.ADMIN),
  CompanyController.removeRecruiterFromCompany.bind(CompanyController)
);

router.patch(
  '/:id/status',
  companyValidator.updateStatus,
  CompanyController.updateStatus.bind(CompanyController)
);

router.get('/:id', CompanyController.findById.bind(CompanyController));
router.get('/:id/jobs', CompanyController.getWithJobs.bind(CompanyController));

router.patch(
  '/:id/status',
  companyValidator.updateStatus,
  CompanyController.updateStatus.bind(CompanyController)
);

module.exports = router;
