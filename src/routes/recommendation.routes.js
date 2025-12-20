const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendation.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares');
const { USER_TYPES } = require('../config/constants');

router.get(
  '/recommended',
  authMiddleware,
  roleMiddleware([USER_TYPES.GRADUATE]),
  recommendationController.getRecommended
);

router.get('/similar/:jobId', recommendationController.getSimilar);

module.exports = router;
