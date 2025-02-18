import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; // Backend server URL

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function loginApi(email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function registerApi(email: string, password: string, fullName: string): Promise<ApiResponse<{ user: any }>> {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      email,
      password,
      fullName
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function verifyTokenApi(token: string): Promise<ApiResponse<{ user: any }>> {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: 'Invalid token' };
  }
} 