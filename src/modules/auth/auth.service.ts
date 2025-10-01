import crypto from 'crypto';
import { UserService } from '../users/user.service';
import { comparePassword } from '../../utils/password';
import { generateTokenPair, TokenPayload } from '../../utils/jwt';
import { sendPasswordResetEmail } from '../../utils/email';
import { CustomError } from '../../middleware/errorHandler';
import { User } from '../users/user.model';

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }): Promise<{ user: any; tokens: { accessToken: string; refreshToken: string } }> {
    // Create user
    const user = await this.userService.createUser(userData);

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokenPair(tokenPayload);

    // Update last login
    await this.userService.updateLastLogin(user._id.toString());

    return {
      user: user.toJSON(),
      tokens,
    };
  }

  async login(email: string, password: string): Promise<{ user: any; tokens: { accessToken: string; refreshToken: string } }> {
    // Find user by email
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new CustomError('Invalid email or password', 401);
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      throw new CustomError('Account is not active', 401);
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new CustomError('Invalid email or password', 401);
    }

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokenPair(tokenPayload);

    // Update last login
    await this.userService.updateLastLogin(user._id.toString());

    return {
      user: user.toJSON(),
      tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const { verifyRefreshToken, generateTokenPair } = await import('../../utils/jwt');
      const payload = verifyRefreshToken(refreshToken);

      // Verify user still exists and is active
      const user = await User.findById(payload.userId);
      if (!user || user.status !== 'ACTIVE') {
        throw new CustomError('Invalid refresh token', 401);
      }

      // Generate new token pair
      const newTokenPayload: TokenPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      return generateTokenPair(newTokenPayload);
    } catch (error) {
      throw new CustomError('Invalid refresh token', 401);
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token to user
    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry,
    });

    // Send reset email
    await sendPasswordResetEmail(email, resetToken);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new CustomError('Invalid or expired reset token', 400);
    }

    // Update password and clear reset token
    await this.userService.updateUserPassword(user._id.toString(), newPassword);
    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userService.getUserByEmail((await this.userService.getUserById(userId)).email);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new CustomError('Current password is incorrect', 400);
    }

    // Update password
    await this.userService.updateUserPassword(userId, newPassword);
  }

  async logout(): Promise<void> {
    // In a more sophisticated implementation, you might want to:
    // 1. Store refresh tokens in a blacklist
    // 2. Remove tokens from client-side storage
    // For now, we'll just return success
    return;
  }
}

