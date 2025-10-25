import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { config } from '../utils/config';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { RegisterRequest, LoginRequest, AuthResponse } from '../types';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';

/**
 * Register a new user
 */
export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, name, password } = req.body as RegisterRequest;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  logger.info('User registered successfully', { userId: user.id, email: user.email });

  const response: AuthResponse = {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };

  res.status(201).json(response);
});

/**
 * Login user
 */
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as LoginRequest;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  logger.info('User logged in successfully', { userId: user.id, email: user.email });

  const response: AuthResponse = {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };

  res.status(200).json(response);
});

/**
 * Get current user info
 */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const authReq = req as AuthRequest;

  if (!authReq.user) {
    throw new AppError('User not authenticated', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: authReq.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json(user);
});
