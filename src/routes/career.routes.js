const express = require('express');
const router = express.Router();
const CareerController = require('../controllers/career.controller');
const { authMiddleware } = require('../middlewares');
const { careerValidator } = require('../validators');

router.get('/base/find-all', CareerController.getAll.bind(CareerController));
router.get(
  '/base/get-one/:id',
  CareerController.getById.bind(CareerController)
);
router.get(
  '/faculty/:facultyId',
  CareerController.getByFaculty.bind(CareerController)
);

router.use(authMiddleware);

router.post(
  '/base/create',
  careerValidator.createCareer,
  CareerController.create.bind(CareerController)
);

router.put(
  '/base/update/:id',
  careerValidator.updateCareer,
  CareerController.update.bind(CareerController)
);

router.delete(
  '/base/delete/:id',
  CareerController.delete.bind(CareerController)
);

module.exports = router;
