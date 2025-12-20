const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interview.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares');
const { USER_TYPES } = require('../config/constants');

router.post(
  '/',
  authMiddleware,
  roleMiddleware([USER_TYPES.RECRUITER, USER_TYPES.ADMIN]),
  interviewController.create
);

router.patch(
  '/:id/confirm',
  authMiddleware,
  roleMiddleware([USER_TYPES.GRADUATE]),
  interviewController.confirm
);

router.patch(
  '/:id/reschedule',
  authMiddleware,
  roleMiddleware([USER_TYPES.RECRUITER]),
  interviewController.reschedule
);

router.patch(
  '/:id/complete',
  authMiddleware,
  roleMiddleware([USER_TYPES.RECRUITER]),
  interviewController.complete
);

router.delete('/:id/cancel', authMiddleware, interviewController.cancel);

router.get('/upcoming', authMiddleware, interviewController.getUpcoming);

module.exports = router;
