const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { authValidator } = require('../validators');

// Rutas públicas
router.post('/register', authValidator.register, AuthController.register);
router.post('/login', authValidator.login, AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);

// Rutas protegidas
const { authMiddleware } = require('../middlewares');
router.get('/me', authMiddleware, AuthController.getMe);
router.post(
  '/change-password',
  authMiddleware,
  authValidator.changePassword,
  AuthController.changePassword
);

module.exports = router;
