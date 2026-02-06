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
router.post('/', jobValidator.create, JobController.create.bind(JobController));

router.get('/my/jobs', JobController.getMyJobs.bind(JobController));

router.put(
  '/:id',
  jobValidator.update,
  JobController.update.bind(JobController)
);

router.patch(
  '/:id',
  jobValidator.update,
  JobController.update.bind(JobController)
);

router.patch('/:id/publish', JobController.publish.bind(JobController));

router.patch('/:id/close', JobController.close.bind(JobController));

router.delete('/:id', JobController.delete.bind(JobController));

module.exports = router;
