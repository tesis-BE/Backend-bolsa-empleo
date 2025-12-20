const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const workExperienceService = require('../services/workExperience.service');
const educationService = require('../services/education.service');
const certificationService = require('../services/certification.service');
const projectService = require('../services/project.service');
const { authMiddleware } = require('../middlewares');

router.get('/complete', authMiddleware, profileController.getCompleteProfile);

router.get('/work-experiences', authMiddleware, async (req, res, next) => {
  try {
    const data = await workExperienceService.getUserExperiences(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.post('/work-experiences', authMiddleware, async (req, res, next) => {
  try {
    const data = await workExperienceService.createExperience(
      req.user.id,
      req.body
    );
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.put('/work-experiences/:id', authMiddleware, async (req, res, next) => {
  try {
    const data = await workExperienceService.updateExperience(
      req.params.id,
      req.user.id,
      req.body
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.delete(
  '/work-experiences/:id',
  authMiddleware,
  async (req, res, next) => {
    try {
      await workExperienceService.deleteExperience(req.params.id, req.user.id);
      res.json({ success: true, message: 'Experiencia eliminada' });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/educations', authMiddleware, async (req, res, next) => {
  try {
    const data = await educationService.getUserEducations(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.post('/educations', authMiddleware, async (req, res, next) => {
  try {
    const data = await educationService.createEducation(req.user.id, req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.put('/educations/:id', authMiddleware, async (req, res, next) => {
  try {
    const data = await educationService.updateEducation(
      req.params.id,
      req.user.id,
      req.body
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.delete('/educations/:id', authMiddleware, async (req, res, next) => {
  try {
    await educationService.deleteEducation(req.params.id, req.user.id);
    res.json({ success: true, message: 'Educación eliminada' });
  } catch (error) {
    next(error);
  }
});

router.get('/certifications', authMiddleware, async (req, res, next) => {
  try {
    const data = await certificationService.getUserCertifications(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.post('/certifications', authMiddleware, async (req, res, next) => {
  try {
    const data = await certificationService.createCertification(
      req.user.id,
      req.body
    );
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.put('/certifications/:id', authMiddleware, async (req, res, next) => {
  try {
    const data = await certificationService.updateCertification(
      req.params.id,
      req.user.id,
      req.body
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.delete('/certifications/:id', authMiddleware, async (req, res, next) => {
  try {
    await certificationService.deleteCertification(req.params.id, req.user.id);
    res.json({ success: true, message: 'Certificación eliminada' });
  } catch (error) {
    next(error);
  }
});

router.get('/projects', authMiddleware, async (req, res, next) => {
  try {
    const data = await projectService.getUserProjects(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.post('/projects', authMiddleware, async (req, res, next) => {
  try {
    const data = await projectService.createProject(req.user.id, req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.put('/projects/:id', authMiddleware, async (req, res, next) => {
  try {
    const data = await projectService.updateProject(
      req.params.id,
      req.user.id,
      req.body
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.delete('/projects/:id', authMiddleware, async (req, res, next) => {
  try {
    await projectService.deleteProject(req.params.id, req.user.id);
    res.json({ success: true, message: 'Proyecto eliminado' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
