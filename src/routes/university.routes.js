const express = require('express');
const router = express.Router();
const UniversityController = require('../controllers/university.controller');
const { authMiddleware } = require('../middlewares');
const { universityValidator } = require('../validators');

// Rutas públicas (solo lectura)
router.get(
  '/base/find-all',
  UniversityController.getAll.bind(UniversityController)
);
router.get(
  '/base/get-one/:id',
  UniversityController.getById.bind(UniversityController)
);
router.get(
  '/code/:code',
  UniversityController.getByCode.bind(UniversityController)
);

// Rutas protegidas (requieren autenticación)
router.use(authMiddleware);

router.post(
  '/base/create',
  universityValidator.createUniversity,
  UniversityController.create.bind(UniversityController)
);

router.put(
  '/base/update/:id',
  universityValidator.updateUniversity,
  UniversityController.update.bind(UniversityController)
);

router.delete(
  '/base/delete/:id',
  UniversityController.delete.bind(UniversityController)
);

module.exports = router;
