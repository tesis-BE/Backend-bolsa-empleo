const express = require('express');
const router = express.Router();
const savedJobController = require('../controllers/savedJob.controller');
const { authMiddleware } = require('../middlewares');
const { USER_TYPES } = require('../config/constants');

router.post('/jobs/:jobId/save', authMiddleware, savedJobController.save);

router.delete('/jobs/:jobId/save', authMiddleware, savedJobController.unsave);

router.get('/saved', authMiddleware, savedJobController.getMySavedJobs);

router.get(
  '/jobs/:jobId/is-saved',
  authMiddleware,
  savedJobController.checkSaved
);

module.exports = router;
