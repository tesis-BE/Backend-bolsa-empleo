const express = require('express');
const router = express.Router();
const JobController = require('../controllers/job.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares');
const { jobValidator } = require('../validators');
const { USER_TYPES } = require('../config/constants');

// Rutas públicas
router.get('/search', JobController.search.bind(JobController));
router.get('/:id', JobController.findById.bind(JobController));

// Rutas protegidas
router.use(authMiddleware);

// Para reclutadores
router.post(
  '/',
  roleMiddleware([USER_TYPES.RECRUITER, USER_TYPES.ADMIN]),
  jobValidator.create,
  JobController.create.bind(JobController)
);

router.get(
  '/my/jobs',
  roleMiddleware([USER_TYPES.RECRUITER]),
  JobController.getMyJobs.bind(JobController)
);

router.put(
  '/:id',
  roleMiddleware([USER_TYPES.RECRUITER, USER_TYPES.ADMIN]),
  jobValidator.update,
  JobController.update.bind(JobController)
);

router.patch(
  '/:id/publish',
  roleMiddleware([USER_TYPES.RECRUITER, USER_TYPES.ADMIN]),
  JobController.publish.bind(JobController)
);

router.patch(
  '/:id/close',
  roleMiddleware([USER_TYPES.RECRUITER, USER_TYPES.ADMIN]),
  JobController.close.bind(JobController)
);

router.delete(
  '/:id',
  roleMiddleware([USER_TYPES.RECRUITER, USER_TYPES.ADMIN]),
  JobController.delete.bind(JobController)
);

module.exports = router;
