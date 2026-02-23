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
const careerRoutes = require('./career.routes');
const roleRoutes = require('./role.routes');
const permissionRoutes = require('./permission.routes');
const savedJobRoutes = require('./savedJob.routes');
const interviewRoutes = require('./interview.routes');
const searchRoutes = require('./search.routes');
const analyticsRoutes = require('./analytics.routes');
const recommendationRoutes = require('./recommendation.routes');
const profileRoutes = require('./profile.routes');
const cedulaRoutes = require('./cedula.routes');
const recruiterRequestRoutes = require('./recruiter-request.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/companies', companyRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/conversations', conversationRoutes);
router.use('/notifications', notificationRoutes);
router.use('/universities', universityRoutes);
router.use('/faculties', facultyRoutes);
router.use('/careers', careerRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/saved-jobs', savedJobRoutes);
router.use('/interviews', interviewRoutes);
router.use('/search', searchRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/profile', profileRoutes);
router.use('/cedula', cedulaRoutes);
router.use('/recruiter-requests', recruiterRequestRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
