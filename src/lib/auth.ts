import { hash, compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { prisma } from './prisma';
import { User, UserRole } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface AuthToken {
  userId: string;
  email: string;
  role: UserRole;
}

export interface RegisterUserData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

/**
 * Generate JWT token
 */
export function generateToken(payload: AuthToken): string {
  return sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): AuthToken | null {
  try {
    return verify(token, JWT_SECRET) as AuthToken;
  } catch (error) {
    return null;
  }
}

/**
 * Register a new user
 */
export async function registerUser(data: RegisterUserData) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Hash password
  const passwordHash = await hashPassword(data.password);

  // Create user with transaction
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
      },
    });

    // Create profile based on role
    if (data.role === 'BUYER') {
      await tx.buyerProfile.create({
        data: {
          userId: newUser.id,
        },
      });
    }
    // Note: Seller profile created separately during onboarding

    return newUser;
  });

  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { user, token };
}

/**
 * Login user
 */
export async function loginUser(credentials: LoginCredentials) {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
    include: {
      buyerProfile: true,
      sellerProfile: true,
    },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isValidPassword = await verifyPassword(credentials.password, user.passwordHash);

  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { user, token };
}

/**
 * Get user by ID with profiles
 */
export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      buyerProfile: true,
      sellerProfile: true,
    },
  });
}

/**
 * Middleware helper to extract user from request
 */
export async function authenticateRequest(authHeader: string | null): Promise<User | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  if (!payload) {
    return null;
  }

  const user = await getUserById(payload.userId);
  return user;
}

/**
 * Check if user has required role
 */
export function hasRole(user: User, ...roles: UserRole[]): boolean {
  return roles.includes(user.role);
}
