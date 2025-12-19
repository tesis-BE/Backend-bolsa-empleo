const express = require('express');
const router = express.Router();
const FacultyController = require('../controllers/faculty.controller');
const { authMiddleware } = require('../middlewares');
const { facultyValidator } = require('../validators');

// Rutas públicas (solo lectura)
router.get('/base/find-all', FacultyController.getAll.bind(FacultyController));
router.get(
  '/base/get-one/:id',
  FacultyController.getById.bind(FacultyController)
);
router.get(
  '/university/:universityId',
  FacultyController.getByUniversity.bind(FacultyController)
);

// Rutas protegidas (requieren autenticación)
router.use(authMiddleware);

router.post(
  '/base/create',
  facultyValidator.createFaculty,
  FacultyController.create.bind(FacultyController)
);

router.put(
  '/base/update/:id',
  facultyValidator.updateFaculty,
  FacultyController.update.bind(FacultyController)
);

router.delete(
  '/base/delete/:id',
  FacultyController.delete.bind(FacultyController)
);

module.exports = router;
