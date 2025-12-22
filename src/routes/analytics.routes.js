const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { authMiddleware } = require('../middlewares');

router.get(
  '/recruiter',
  authMiddleware,
  analyticsController.getRecruiterAnalytics
);

router.get(
  '/jobs/expiring',
  authMiddleware,
  analyticsController.getJobsAboutToExpire
);

router.get(
  '/jobs/no-applications',
  authMiddleware,
  analyticsController.getJobsWithoutApplications
);

module.exports = router;
