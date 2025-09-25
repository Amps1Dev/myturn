import bcrypt from 'bcryptjs';
import db from './db.js';

export class AuthService {
  // Hash password
  static async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  // Verify password
  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Register new user
  static async registerUser(userData) {
    const { email, password, firstName, lastName, userType, phone, companyName, businessType } = userData;

    // Check if user already exists
    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create user object
    const newUser = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      userType,
      phone: phone || '',
      companyName: companyName || '',
      businessType: businessType || '',
    };

    // Save user to database
    const user = db.createUser(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Login user
  static async loginUser(email, password) {
    // Find user by email
    const user = db.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Get user by ID (for session validation)
  static getUserById(id) {
    const user = db.getUserById(id);
    if (!user) {
      return null;
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export default AuthService;