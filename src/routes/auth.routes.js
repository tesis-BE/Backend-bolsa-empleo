const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { authValidator } = require('../validators');
const { loginLimiter } = require('../middlewares/rate-limit.middleware');

// Rutas públicas (con rate limiting)
router.post(
  '/register',
  loginLimiter,
  authValidator.register,
  AuthController.register
);
router.post('/login', loginLimiter, authValidator.login, AuthController.login);
router.post('/refresh-token', loginLimiter, AuthController.refreshToken);

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
