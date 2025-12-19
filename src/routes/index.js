const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const companyRoutes = require('./company.routes');
const jobRoutes = require('./job.routes');
const applicationRoutes = require('./application.routes');
const conversationRoutes = require('./conversation.routes');
const notificationRoutes = require('./notification.routes');
const universityRoutes = require('./university.routes');
const facultyRoutes = require('./faculty.routes');
const roleRoutes = require('./role.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/companies', companyRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/conversations', conversationRoutes);
router.use('/notifications', notificationRoutes);
router.use('/universities', universityRoutes);
router.use('/faculties', facultyRoutes);
router.use('/roles', roleRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
