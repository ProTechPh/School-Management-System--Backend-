import nodemailer from 'nodemailer';
import { config } from '../config';
import { logger } from './logger';

let transporter: nodemailer.Transporter;

if (config.nodeEnv === 'development' || !config.email.host) {
  // Use console transport in development
  transporter = nodemailer.createTransporter({
    streamTransport: true,
    newline: 'unix',
    buffer: true,
  });
} else {
  // Use SMTP in production
  transporter = nodemailer.createTransporter({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });
}

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  try {
    const mailOptions = {
      from: config.email.from,
      to,
      subject,
      html,
    };

    if (config.nodeEnv === 'development' || !config.email.host) {
      // Log to console in development
      logger.info('Email would be sent:', {
        to,
        subject,
        html,
      });
    } else {
      const info = await transporter.sendMail(mailOptions);
      logger.info('Email sent successfully:', info.messageId);
    }
  } catch (error) {
    logger.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
};

export const sendPasswordResetEmail = async (email: string, resetToken: string): Promise<void> => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  const html = `
    <h2>Password Reset Request</h2>
    <p>You requested a password reset for your School Management System account.</p>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this reset, please ignore this email.</p>
  `;

  await sendEmail(email, 'Password Reset Request', html);
};

