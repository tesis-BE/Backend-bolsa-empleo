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

router.get(
  '/dashboard/users-stats',
  authMiddleware,
  analyticsController.getUsersStatsByType
);

router.get(
  '/dashboard/applications-stats',
  authMiddleware,
  analyticsController.getApplicationsGlobalStats
);

router.get(
  '/dashboard/companies-stats',
  authMiddleware,
  analyticsController.getCompaniesStats
);

router.get(
  '/dashboard/top-companies',
  authMiddleware,
  analyticsController.getTopCompaniesByHires
);

router.get(
  '/dashboard/graduates-profile',
  authMiddleware,
  analyticsController.getGraduatesProfileStats
);

router.get(
  '/dashboard/graduates-by-faculty',
  authMiddleware,
  analyticsController.getGraduatesByFaculty
);

router.get(
  '/dashboard/time-to-hire',
  authMiddleware,
  analyticsController.getAverageTimeToHire
);

router.get(
  '/dashboard/top-skills',
  authMiddleware,
  analyticsController.getTopSkillsDemand
);

module.exports = router;
