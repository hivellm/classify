import { Request, Response, NextFunction } from 'express';
import { AuthService } from './AuthService.js';
import { UserService } from './UserService.js';
import { ValidationError } from './errors/ValidationError.js';

/**
 * User Controller
 * Handles HTTP requests for user management
 */
export class UserController {
  private authService: AuthService;
  private userService: UserService;

  constructor(authService: AuthService, userService: UserService) {
    this.authService = authService;
    this.userService = userService;
  }

  /**
   * POST /api/users/register
   * Register a new user
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, name } = req.body;

      // Validate input
      if (!email || !password || !name) {
        throw new ValidationError('Email, password, and name are required');
      }

      if (password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters');
      }

      // Register user
      const user = await this.authService.register(email, password);
      await this.userService.updateProfile(user.id, { name });

      res.status(201).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/users/login
   * Authenticate user and return JWT token
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ValidationError('Email and password are required');
      }

      const token = await this.authService.login(email, password);

      res.json({
        success: true,
        data: { token },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/profile
   * Get current user profile (requires authentication)
   */
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ValidationError('Authentication required');
      }

      const profile = await this.userService.getProfile(userId);

      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/profile
   * Update user profile
   */
  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ValidationError('Authentication required');
      }

      const { name, bio, avatar } = req.body;
      const updated = await this.userService.updateProfile(userId, {
        name,
        bio,
        avatar,
      });

      res.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/users/change-password
   * Change user password
   */
  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ValidationError('Authentication required');
      }

      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        throw new ValidationError('Old and new passwords are required');
      }

      await this.authService.changePassword(userId, oldPassword, newPassword);

      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/users/:id
   * Delete user account (admin only)
   */
  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const adminId = req.user?.id;

      if (!adminId) {
        throw new ValidationError('Authentication required');
      }

      await this.userService.deleteUser(id, adminId);

      res.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

