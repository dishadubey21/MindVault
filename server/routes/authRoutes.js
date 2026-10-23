const express = require('express');
const authController = require('../controllers/authController');
const protect = require('../middlewares/authMiddleware');
const { authRateLimiter } = require('../middlewares/rateLimiter');
const validateRequest = require('../middlewares/validationMiddleware');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  changePasswordSchema,
} = require('../validators/authValidator');

const router = express.Router();

// 1. Public Authentication Routes
router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', authRateLimiter, validateRequest(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refresh);
router.post('/verify-email', validateRequest(verifyEmailSchema), authController.verifyEmail);
router.post('/verify-email/:token', authController.verifyEmail);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema), authController.resetPassword);
router.post('/reset-password/:token', validateRequest(resetPasswordSchema), authController.resetPassword);

// 2. Protected Session Routes
router.get('/me', protect, authController.getMe);
router.patch('/change-password', protect, validateRequest(changePasswordSchema), authController.changePassword);
router.delete('/delete-account', protect, authController.deleteAccount);

module.exports = router;
