const express = require('express');
const router = express.Router();
const JobController = require('../controllers/job.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares');
const { jobValidator } = require('../validators');
const { USER_TYPES } = require('../config/constants');

// ── Rutas públicas ─────────────────────────────────
// /search y /my/jobs deben ir ANTES de /:id para que
// Express no los capture como parámetro dinámico.
router.get('/search', JobController.search.bind(JobController));

// /my/jobs requiere auth pero debe estar antes de /:id
router.get('/my/jobs', authMiddleware, JobController.getMyJobs.bind(JobController));

// Detalle público de una oferta (no requiere login)
router.get('/:id', JobController.findById.bind(JobController));

// ── Rutas protegidas ────────────────────────────────
router.use(authMiddleware);

router.post('/', jobValidator.create, JobController.create.bind(JobController));

router.put('/:id', jobValidator.update, JobController.update.bind(JobController));

router.patch('/:id', jobValidator.update, JobController.update.bind(JobController));

router.patch('/:id/publish', JobController.publish.bind(JobController));

router.patch('/:id/close', JobController.close.bind(JobController));

router.patch('/:id/draft', JobController.toDraft.bind(JobController));

router.delete('/:id', JobController.delete.bind(JobController));

module.exports = router;
