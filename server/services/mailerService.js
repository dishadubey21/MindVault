const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

/**
 * Transactional Email Dispatcher Service
 * Integrates Nodemailer with local logger fallback.
 */
class MailerService {
  constructor() {
    this.transporter = null;
    this.fromHeader = process.env.EMAIL_FROM || `MindVault <${process.env.SMTP_USER || 'mindvault.app2026@gmail.com'}>`;

    // Verify presence of SMTP credentials
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      logger.warn('SMTP parameters incomplete. MailerService running in mock logging fallback mode.');
    }
  }

  /**
   * Dispatches email payload
   * @param {Object} mailOptions
   * @param {string} mailOptions.to - Target recipient email
   * @param {string} mailOptions.subject - Mail subject line
   * @param {string} [mailOptions.text] - Plain text body
   * @param {string} [mailOptions.html] - HTML rich formatting template
   * @returns {Promise<boolean>} True if sent successfully
   */
  async sendMail({ to, subject, html, text }) {
    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: this.fromHeader,
          to,
          subject,
          text,
          html,
        });
        logger.info(`Email dispatched to ${to} (Subject: "${subject}")`);
        return true;
      } catch (err) {
        logger.error(`Failed to send email to ${to}: ${err.message}`);
        this.logFallback(to, subject, text || html);
        return false;
      }
    } else {
      this.logFallback(to, subject, text || html);
      return true;
    }
  }

  /**
   * Log fallback to Winston console/file streams in case of SMTP defaults
   */
  logFallback(to, subject, content) {
    logger.info(`
======================================================================
[EMAIL LOGGER FALLBACK / NOTIFICATION]
To: ${to}
Subject: ${subject}
Message Details:
${content.replace(/<[^>]*>/g, '')}
======================================================================
    `);
  }

  /**
   * Sends registration confirmation token
   */
  async sendVerificationEmail(email, token, username) {
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 600px; background-color: #0f172a; color: #f8fafc; border-radius: 8px;">
        <h2 style="color: #6366f1;">Welcome to MindVault, ${username}!</h2>
        <p style="color: #cbd5e1; font-size: 16px;">Thank you for registering. Please verify your email address to activate your account and unlock your digital vault.</p>
        <div style="margin: 32px 0;">
          <a href="${verificationUrl}" style="background-color: #6366f1; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email Address</a>
        </div>
        <p style="color: #94a3b8; font-size: 14px;">Or paste this link into your browser:</p>
        <p style="word-break: break-all;"><a href="${verificationUrl}" style="color: #818cf8;">${verificationUrl}</a></p>
        <hr style="border: none; border-top: 1px solid #334155; margin: 32px 0;" />
        <p style="color: #64748b; font-size: 12px;">This verification link will expire in 24 hours.</p>
      </div>
    `;
    const text = `Welcome to MindVault, ${username}! Verify your email address by visiting this link: ${verificationUrl}`;
    
    return await this.sendMail({
      to: email,
      subject: 'Verify your MindVault Email Address',
      html,
      text,
    });
  }

  /**
   * Sends password reset request token
   */
  async sendPasswordResetEmail(email, token, username) {
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 600px; background-color: #0f172a; color: #f8fafc; border-radius: 8px;">
        <h2 style="color: #6366f1;">Password Reset Request</h2>
        <p style="color: #cbd5e1; font-size: 16px;">Hi ${username}, we received a request to reset your password. Click below to specify a new password:</p>
        <div style="margin: 32px 0;">
          <a href="${resetUrl}" style="background-color: #6366f1; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #94a3b8; font-size: 14px;">Or paste this link into your browser:</p>
        <p style="word-break: break-all;"><a href="${resetUrl}" style="color: #818cf8;">${resetUrl}</a></p>
        <hr style="border: none; border-top: 1px solid #334155; margin: 32px 0;" />
        <p style="color: #64748b; font-size: 12px;">This link will expire in 1 hour. If you did not request this, please ignore this email.</p>
      </div>
    `;
    const text = `Hi ${username}, reset your password by visiting this link: ${resetUrl}`;

    return await this.sendMail({
      to: email,
      subject: 'Reset your MindVault Password',
      html,
      text,
    });
  }

  /**
   * Sends welcome email upon successful email verification
   */
  async sendWelcomeEmail(email, username) {
    const loginUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/login`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 600px; background-color: #0f172a; color: #f8fafc; border-radius: 8px;">
        <h2 style="color: #10b981;">Account Verified Successfully! 🎉</h2>
        <p style="color: #cbd5e1; font-size: 16px;">Hi ${username}, your email address has been verified. Your MindVault is now fully accessible.</p>
        <div style="margin: 32px 0;">
          <a href="${loginUrl}" style="background-color: #10b981; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Sign In to MindVault</a>
        </div>
        <hr style="border: none; border-top: 1px solid #334155; margin: 32px 0;" />
        <p style="color: #64748b; font-size: 12px;">MindVault Knowledge Management System</p>
      </div>
    `;
    const text = `Hi ${username}, your MindVault email address has been verified. You can now log in at ${loginUrl}`;

    return await this.sendMail({
      to: email,
      subject: 'Welcome to MindVault - Email Verified!',
      html,
      text,
    });
  }
}

module.exports = new MailerService();
