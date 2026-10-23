const authService = require('../services/authService');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { MESSAGES } = require('../constants');

// Helper to set refresh token in cookies
const setRefreshTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/v1/auth', // Restrict cookie to auth endpoints
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days in ms
  };
  res.cookie('refreshToken', token, cookieOptions);
};

// Helper to purge refresh token cookies
const clearRefreshTokenCookie = (res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/v1/auth',
  };
  res.clearCookie('refreshToken', cookieOptions);
};

/**
 * Controller class managing account lifecycle endpoints
 */
class AuthController {
  
  // POST /register
  register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    
    await authService.registerUser({ username, email, password });

    return new ApiResponse(
      201,
      MESSAGES.AUTH.REGISTER_SUCCESS
    ).send(res);
  });

  // POST /login
  login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const loginDetails = await authService.loginUser({ email, password });
      
      // Clear rate limit failed attempts on successful login
      if (req.clearFailedAuthAttempts) {
        req.clearFailedAuthAttempts();
      }

      // Inject secure HttpOnly Cookie
      setRefreshTokenCookie(res, loginDetails.refreshToken);

      return new ApiResponse(
        200,
        MESSAGES.AUTH.LOGIN_SUCCESS,
        {
          user: loginDetails.user,
          accessToken: loginDetails.accessToken,
        }
      ).send(res);
    } catch (error) {
      // Record failed authentication attempt to slide rate limit window
      if (req.recordFailedAuthAttempt) {
        req.recordFailedAuthAttempt();
      }
      return next(error);
    }
  });

  // POST /logout
  logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    
    await authService.logoutUser(refreshToken);
    clearRefreshTokenCookie(res);

    return new ApiResponse(
      200,
      MESSAGES.AUTH.LOGOUT_SUCCESS
    ).send(res);
  });

  // POST /refresh-token
  refresh = asyncHandler(async (req, res) => {
    const oldRefreshToken = req.cookies.refreshToken;
    
    const { accessToken, refreshToken } = await authService.rotateTokens(oldRefreshToken);
    
    // Set rotated cookie
    setRefreshTokenCookie(res, refreshToken);

    return new ApiResponse(
      200,
      'Session token rotated successfully.',
      { accessToken }
    ).send(res);
  });

  // POST /verify-email OR /verify-email/:token
  verifyEmail = asyncHandler(async (req, res) => {
    const token = req.params.token || req.body.token;
    
    if (!token) {
      throw new (require('../utils/appError'))('Verification token is required.', 400, require('../constants/errorCodes').VALIDATION_ERROR);
    }

    await authService.verifyEmail(token);

    return new ApiResponse(
      200,
      MESSAGES.AUTH.EMAIL_VERIFIED
    ).send(res);
  });

  // POST /forgot-password
  forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    
    await authService.forgotPassword(email);

    return new ApiResponse(
      200,
      MESSAGES.AUTH.PASSWORD_RESET_SENT
    ).send(res);
  });

  // POST /reset-password OR /reset-password/:token
  resetPassword = asyncHandler(async (req, res) => {
    const token = req.params.token || req.body.token;
    const { password } = req.body;
    
    if (!token) {
      throw new (require('../utils/appError'))('Reset token is required.', 400, require('../constants/errorCodes').VALIDATION_ERROR);
    }

    await authService.resetPassword(token, password);

    return new ApiResponse(
      200,
      MESSAGES.AUTH.PASSWORD_RESET_SUCCESS
    ).send(res);
  });

  // PATCH /change-password
  changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    await authService.changePassword(req.user._id, currentPassword, newPassword);

    return new ApiResponse(
      200,
      MESSAGES.AUTH.PASSWORD_CHANGED
    ).send(res);
  });

  // DELETE /delete-account
  deleteAccount = asyncHandler(async (req, res) => {
    await authService.deleteAccount(req.user._id);
    clearRefreshTokenCookie(res);

    return new ApiResponse(
      200,
      MESSAGES.AUTH.ACCOUNT_DELETED
    ).send(res);
  });

  // GET /me
  getMe = asyncHandler(async (req, res) => {
    const userProfile = {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      isVerified: req.user.isVerified,
      isPremium: req.user.isPremium,
      subscriptionExpiry: req.user.subscriptionExpiry,
      profilePicture: req.user.profilePicture || '',
      themePreference: req.user.themePreference || 'light',
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    };

    return new ApiResponse(
      200,
      'User profile retrieved successfully.',
      { user: userProfile }
    ).send(res);
  });
}

module.exports = new AuthController();
