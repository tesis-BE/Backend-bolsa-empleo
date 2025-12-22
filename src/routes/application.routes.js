const express = require('express');
const router = express.Router();
const ApplicationController = require('../controllers/application.controller');
const { authMiddleware } = require('../middlewares');
const { applicationValidator } = require('../validators');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Para egresados
router.post(
  '/',
  applicationValidator.apply,
  ApplicationController.apply.bind(ApplicationController)
);

router.get(
  '/my',
  ApplicationController.getMyApplications.bind(ApplicationController)
);

router.delete('/:id', ApplicationController.cancel.bind(ApplicationController));

// Para reclutadores
router.get(
  '/received',
  ApplicationController.getRecruiterApplications.bind(ApplicationController)
);

router.post(
  '/by-recruiter',
  applicationValidator.applyByRecruiter,
  ApplicationController.applyByRecruiter.bind(ApplicationController)
);

router.get(
  '/job/:jobId',
  ApplicationController.getByJob.bind(ApplicationController)
);

router.patch(
  '/:id/status',
  applicationValidator.updateStatus,
  ApplicationController.updateStatus.bind(ApplicationController)
);

// Ver detalle de postulación (egresado dueño o reclutador)
router.get('/:id', ApplicationController.getById.bind(ApplicationController));

module.exports = router;
