const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const workExperienceController = require('../controllers/workExperience.controller');
const educationController = require('../controllers/education.controller');
const certificationController = require('../controllers/certification.controller');
const projectController = require('../controllers/project.controller');
const { authMiddleware } = require('../middlewares');
const {
  workExperienceValidator,
  educationValidator,
  certificationValidator,
  projectValidator,
} = require('../validators');

// Perfil completo
router.get('/complete', authMiddleware, profileController.getCompleteProfile);

// Experiencias laborales
router.get(
  '/work-experiences',
  authMiddleware,
  workExperienceController.getMyExperiences
);
router.get(
  '/work-experiences/:id',
  authMiddleware,
  workExperienceController.getById
);
router.post(
  '/work-experiences',
  authMiddleware,
  workExperienceValidator.create,
  workExperienceController.create
);
router.put(
  '/work-experiences/:id',
  authMiddleware,
  workExperienceValidator.update,
  workExperienceController.update
);
router.delete(
  '/work-experiences/:id',
  authMiddleware,
  workExperienceValidator.delete,
  workExperienceController.delete
);

// Educación
router.get('/educations', authMiddleware, educationController.getMyEducations);
router.get('/educations/:id', authMiddleware, educationController.getById);
router.post(
  '/educations',
  authMiddleware,
  educationValidator.create,
  educationController.create
);
router.put(
  '/educations/:id',
  authMiddleware,
  educationValidator.update,
  educationController.update
);
router.delete(
  '/educations/:id',
  authMiddleware,
  educationValidator.delete,
  educationController.delete
);

// Certificaciones
router.get(
  '/certifications',
  authMiddleware,
  certificationController.getMyCertifications
);
router.get(
  '/certifications/:id',
  authMiddleware,
  certificationController.getById
);
router.post(
  '/certifications',
  authMiddleware,
  certificationValidator.create,
  certificationController.create
);
router.put(
  '/certifications/:id',
  authMiddleware,
  certificationValidator.update,
  certificationController.update
);
router.delete(
  '/certifications/:id',
  authMiddleware,
  certificationValidator.delete,
  certificationController.delete
);

// Proyectos
router.get('/projects', authMiddleware, projectController.getMyProjects);
router.get('/projects/:id', authMiddleware, projectController.getById);
router.post(
  '/projects',
  authMiddleware,
  projectValidator.create,
  projectController.create
);
router.put(
  '/projects/:id',
  authMiddleware,
  projectValidator.update,
  projectController.update
);
router.delete(
  '/projects/:id',
  authMiddleware,
  projectValidator.delete,
  projectController.delete
);

module.exports = router;
