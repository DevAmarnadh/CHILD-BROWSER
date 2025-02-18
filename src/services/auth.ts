import { loginApi, registerApi, verifyTokenApi } from './api';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

interface User {
  id: number;
  email: string;
  full_name: string;
}

export async function registerUser(email: string, password: string, fullName: string): Promise<User> {
  const response = await registerApi(email, password, fullName);
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Registration failed');
  }
  return response.data.user;
}

export async function loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
  const response = await loginApi(email, password);
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Login failed');
  }
  return response.data;
}

export async function verifyToken(token: string): Promise<User> {
  const response = await verifyTokenApi(token);
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Invalid token');
  }
  return response.data.user;
} 