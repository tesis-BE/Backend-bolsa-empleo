const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const companyRoutes = require('./company.routes');
const jobRoutes = require('./job.routes');
const applicationRoutes = require('./application.routes');
const conversationRoutes = require('./conversation.routes');
const notificationRoutes = require('./notification.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/companies', companyRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/conversations', conversationRoutes);
router.use('/notifications', notificationRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
