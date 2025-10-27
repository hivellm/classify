import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from './models/User.js';
import { Database } from './database.js';

/**
 * Authentication Service
 * Handles user authentication, password hashing, and JWT token generation
 */
export class AuthService {
  private db: Database;
  private readonly saltRounds = 10;
  private readonly jwtSecret: string;

  constructor(database: Database, jwtSecret: string) {
    this.db = database;
    this.jwtSecret = jwtSecret;
  }

  /**
   * Register a new user
   * @param email - User email
   * @param password - Plain text password
   * @returns User object with hashed password
   */
  async register(email: string, password: string): Promise<User> {
    // Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    // Create user in database
    const user = await this.db.users.create({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return user;
  }

  /**
   * Authenticate user with email and password
   * @param email - User email
   * @param password - Plain text password
   * @returns JWT token if authentication succeeds
   */
  async login(email: string, password: string): Promise<string> {
    // Find user by email
    const user = await this.db.users.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      this.jwtSecret,
      { expiresIn: '24h' }
    );

    return token;
  }

  /**
   * Verify JWT token and extract user info
   * @param token - JWT token
   * @returns Decoded user info
   */
  async verifyToken(token: string): Promise<{ userId: string; email: string }> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as {
        userId: string;
        email: string;
      };
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Change user password
   * @param userId - User ID
   * @param oldPassword - Current password
   * @param newPassword - New password
   */
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.db.users.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      throw new Error('Invalid current password');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, this.saltRounds);

    // Update in database
    await this.db.users.update(userId, { password: hashedPassword });
  }
}

