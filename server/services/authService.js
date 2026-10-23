const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Token = require('../models/Token');
const mailerService = require('./mailerService');
const AppError = require('../utils/appError');
const ERROR_CODES = require('../constants/errorCodes');
const { MESSAGES } = require('../constants');
const logger = require('../utils/logger');

/**
 * Authentication Business Logic Service
 */
class AuthService {
  /**
   * Helper: Generates a random cryptographically secure token and its SHA256 hash.
   * Used for email verification and password resets.
   */
  _generateRandomToken() {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    return { rawToken, hashedToken };
  }

  /**
   * Helper: Computes SHA256 hash of a string.
   */
  _hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Helper: Generates a short-lived access token and a hashed long-lived refresh token saved in database.
   */
  async _generateAccessAndRefreshTokens(userId) {
    // Generate Access Token (short-lived in payload)
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
    });

    // Generate Refresh Token (cryptographically random string)
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const tokenHash = this._hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 Days

    // Save hashed session token in database
    await Token.create({
      tokenHash,
      user: userId,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Registers a new User profile and dispatches an email confirmation link.
   */
  async registerUser({ username, email, password }) {
    // Check if user credentials already exist
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'Email' : 'Username';
      throw new AppError(`${field} is already registered.`, 409, ERROR_CODES.CONFLICT);
    }

    // Create verification token and expiry
    const { rawToken, hashedToken } = this._generateRandomToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 Hours

    const newUser = await User.create({
      username,
      email,
      password,
      verificationTokenHash: hashedToken,
      verificationTokenExpiry,
    });

    // Dispatch verification link email
    await mailerService.sendVerificationEmail(newUser.email, rawToken, newUser.username);

    // Audit Logging
    logger.info(`Audit: User registered successfully. Email: ${newUser.email}, User ID: ${newUser._id}`);

    return newUser;
  }

  /**
   * Authenticates user email/password, checks email verification status, and returns session tokens.
   */
  async loginUser({ email, password }) {
    // Query User by email, explicitly fetching password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.comparePassword(password, user.password))) {
      throw new AppError(MESSAGES.ERRORS.INVALID_CREDENTIALS, 401, ERROR_CODES.UNAUTHORIZED);
    }

    // Enforce email verification check before granting entry
    if (!user.isVerified) {
      throw new AppError(
        'Your email address is unverified. Please verify your account to unlock this action.',
        403,
        ERROR_CODES.FORBIDDEN
      );
    }

    // Issue tokens
    const { accessToken, refreshToken } = await this._generateAccessAndRefreshTokens(user._id);

    // Audit Logging
    logger.info(`Audit: User logged in successfully. User ID: ${user._id}`);

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        isPremium: user.isPremium,
        subscriptionExpiry: user.subscriptionExpiry,
        profilePicture: user.profilePicture || '',
        themePreference: user.themePreference || 'light',
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Cleans up database session by deleting refresh token hash on logout.
   */
  async logoutUser(refreshToken) {
    if (!refreshToken) return;

    const tokenHash = this._hashToken(refreshToken);
    const deletedToken = await Token.findOneAndDelete({ tokenHash });
    
    if (deletedToken) {
      logger.info(`Audit: Session token revoked. User ID: ${deletedToken.user}`);
    }
  }

  /**
   * Performs Refresh Token Rotation (rotates old tokens, inserts fresh ones).
   */
  async rotateTokens(refreshToken) {
    if (!refreshToken) {
      throw new AppError('Refresh token missing.', 401, ERROR_CODES.UNAUTHORIZED);
    }

    const tokenHash = this._hashToken(refreshToken);
    const tokenDoc = await Token.findOneAndDelete({ tokenHash });

    // Reject if token hash is not in DB or expired
    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
      throw new AppError('Invalid or expired refresh token. Please sign in again.', 401, ERROR_CODES.TOKEN_EXPIRED);
    }

    // Generate fresh tokens
    const { accessToken, refreshToken: newRefreshToken } = await this._generateAccessAndRefreshTokens(tokenDoc.user);

    logger.debug(`Audit: Refresh token rotated successfully. User ID: ${tokenDoc.user}`);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Verifies email using verification token.
   */
  async verifyEmail(rawToken) {
    const hashedToken = this._hashToken(rawToken);

    const user = await User.findOne({
      verificationTokenHash: hashedToken,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      throw new AppError('Verification link is invalid or has expired.', 400, ERROR_CODES.VALIDATION_ERROR);
    }

    user.isVerified = true;
    user.verificationTokenHash = null;
    user.verificationTokenExpiry = null;
    await user.save();

    // Dispatch welcome email
    await mailerService.sendWelcomeEmail(user.email, user.username);

    // Audit Logging
    logger.info(`Audit: Account email verified. User ID: ${user._id}`);
  }

  /**
   * Schedules password reset token and dispatches reset url email.
   */
  async forgotPassword(email) {
    const user = await User.findOne({ email: email.toLowerCase() });

    // Security practice: do not leak whether email exists. Simply return success,
    // but internally dispatch email only if user matches.
    if (!user) {
      logger.warn(`Password reset requested for unregistered email: ${email}`);
      return;
    }

    const { rawToken, hashedToken } = this._generateRandomToken();
    user.resetPasswordTokenHash = hashedToken;
    user.resetPasswordTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 Hour
    await user.save();

    await mailerService.sendPasswordResetEmail(user.email, rawToken, user.username);

    // Audit Logging
    logger.info(`Audit: Password reset token issued. Email: ${user.email}, User ID: ${user._id}`);
  }

  /**
   * Overwrites old password using password reset token.
   */
  async resetPassword(rawToken, newPassword) {
    const hashedToken = this._hashToken(rawToken);

    const user = await User.findOne({
      resetPasswordTokenHash: hashedToken,
      resetPasswordTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      throw new AppError('Password reset link is invalid or has expired.', 400, ERROR_CODES.VALIDATION_ERROR);
    }

    user.password = newPassword;
    user.resetPasswordTokenHash = null;
    user.resetPasswordTokenExpiry = null;
    await user.save();

    // Audit Logging
    logger.info(`Audit: Password reset successfully completed. User ID: ${user._id}`);
  }

  /**
   * Updates user password inside authenticated session.
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');

    if (!user || !(await user.comparePassword(currentPassword, user.password))) {
      throw new AppError('The current password you entered is incorrect.', 401, ERROR_CODES.UNAUTHORIZED);
    }

    user.password = newPassword;
    await user.save();

    // Audit Logging
    logger.info(`Audit: Password modified in session. User ID: ${user._id}`);
  }

  /**
   * Deletes user document and cleans up all active session records.
   */
  async deleteAccount(userId) {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new AppError('User not found.', 404, ERROR_CODES.NOT_FOUND);
    }

    // Revoke all active session keys from DB
    await Token.deleteMany({ user: userId });

    // Audit Logging
    logger.info(`Audit: User account permanently deleted. Email: ${deletedUser.email}, User ID: ${userId}`);
  }
}

module.exports = new AuthService();
