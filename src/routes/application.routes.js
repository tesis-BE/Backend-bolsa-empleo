const express = require('express');
const router = express.Router();
const ApplicationController = require('../controllers/application.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares');
const { applicationValidator } = require('../validators');
const { USER_TYPES } = require('../config/constants');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Para egresados
router.post(
  '/',
  roleMiddleware([USER_TYPES.GRADUATE]),
  applicationValidator.apply,
  ApplicationController.apply.bind(ApplicationController)
);

router.get(
  '/my',
  roleMiddleware([USER_TYPES.GRADUATE]),
  ApplicationController.getMyApplications.bind(ApplicationController)
);

router.delete(
  '/:id',
  roleMiddleware([USER_TYPES.GRADUATE]),
  ApplicationController.cancel.bind(ApplicationController)
);

// Para reclutadores
router.get(
  '/received',
  roleMiddleware([USER_TYPES.RECRUITER]),
  ApplicationController.getRecruiterApplications.bind(ApplicationController)
);

router.get(
  '/job/:jobId',
  roleMiddleware([USER_TYPES.RECRUITER, USER_TYPES.ADMIN]),
  ApplicationController.getByJob.bind(ApplicationController)
);

router.patch(
  '/:id/status',
  roleMiddleware([USER_TYPES.RECRUITER, USER_TYPES.ADMIN]),
  applicationValidator.updateStatus,
  ApplicationController.updateStatus.bind(ApplicationController)
);

// Ver detalle de postulación (egresado dueño o reclutador)
router.get('/:id', ApplicationController.getById.bind(ApplicationController));

module.exports = router;
