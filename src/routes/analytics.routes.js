const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares');
const { USER_TYPES } = require('../config/constants');

router.get(
  '/recruiter',
  authMiddleware,
  roleMiddleware([USER_TYPES.RECRUITER]),
  analyticsController.getRecruiterAnalytics
);

router.get(
  '/jobs/expiring',
  authMiddleware,
  roleMiddleware([USER_TYPES.RECRUITER]),
  analyticsController.getJobsAboutToExpire
);

router.get(
  '/jobs/no-applications',
  authMiddleware,
  roleMiddleware([USER_TYPES.RECRUITER]),
  analyticsController.getJobsWithoutApplications
);

module.exports = router;
