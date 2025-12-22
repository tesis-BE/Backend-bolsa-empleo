const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interview.controller');
const { authMiddleware } = require('../middlewares');

router.post('/', authMiddleware, interviewController.create);

router.patch('/:id/confirm', authMiddleware, interviewController.confirm);

router.patch('/:id/reschedule', authMiddleware, interviewController.reschedule);

router.patch('/:id/complete', authMiddleware, interviewController.complete);

router.delete('/:id/cancel', authMiddleware, interviewController.cancel);

router.get('/upcoming', authMiddleware, interviewController.getUpcoming);

module.exports = router;
