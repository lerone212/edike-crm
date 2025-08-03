// API service for authentication - ready for backend integration
import { User } from '@/types/auth';

const API_BASE_URL = 'http://localhost:8000/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

class AuthAPI {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('edike_access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // For now, mock the response. Replace with real API call:
    // const response = await fetch(`${API_BASE_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(credentials),
    // });
    
    // Mock authentication
    const MOCK_USERS = [
      {
        id: '1',
        email: 'ceo@edike.com',
        name: 'John CEO',
        role: 'super_admin' as const,
        isActive: true,
        createdAt: '2024-01-01',
        lastLogin: new Date().toISOString()
      },
      {
        id: '2', 
        email: 'it@edike.com',
        name: 'Sarah IT',
        role: 'it_support' as const,
        isActive: true,
        createdAt: '2024-01-01',
        lastLogin: new Date().toISOString()
      },
      {
        id: '3',
        email: 'emp@edike.com', 
        name: 'Mike Employee',
        role: 'employee' as const,
        isActive: true,
        assignedSchools: ['school-1', 'school-2'],
        createdAt: '2024-01-01',
        lastLogin: new Date().toISOString()
      }
    ];

    const user = MOCK_USERS.find(u => u.email === credentials.email);
    
    if (!user || credentials.password !== 'password123') {
      throw new Error('Invalid credentials');
    }

    return {
      user,
      access_token: 'mock_access_token_' + Date.now(),
      refresh_token: 'mock_refresh_token_' + Date.now(),
      expires_in: 3600
    };
  }

  async changePassword(request: ChangePasswordRequest): Promise<void> {
    // Replace with real API call:
    // const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
    //   method: 'POST',
    //   headers: this.getAuthHeaders(),
    //   body: JSON.stringify(request),
    // });
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  async resetPassword(request: ResetPasswordRequest): Promise<void> {
    // Replace with real API call:
    // const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(request),
    // });
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  async refreshToken(): Promise<LoginResponse> {
    const refreshToken = localStorage.getItem('edike_refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Replace with real API call:
    // const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ refresh_token: refreshToken }),
    // });
    
    // Mock implementation
    const savedUser = localStorage.getItem('edike_user');
    if (!savedUser) {
      throw new Error('No user data available');
    }

    return {
      user: JSON.parse(savedUser),
      access_token: 'new_mock_access_token_' + Date.now(),
      refresh_token: 'new_mock_refresh_token_' + Date.now(),
      expires_in: 3600
    };
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    // Replace with real API call:
    // const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    //   method: 'PATCH',
    //   headers: this.getAuthHeaders(),
    //   body: JSON.stringify(updates),
    // });
    
    // Mock implementation
    const savedUser = localStorage.getItem('edike_user');
    if (!savedUser) {
      throw new Error('No user data available');
    }

    const user = JSON.parse(savedUser);
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('edike_user', JSON.stringify(updatedUser));
    
    return updatedUser;
  }

  async getCurrentUser(): Promise<User | null> {
    // Replace with real API call:
    // const response = await fetch(`${API_BASE_URL}/auth/me`, {
    //   headers: this.getAuthHeaders(),
    // });
    
    // Mock implementation
    const savedUser = localStorage.getItem('edike_user');
    return savedUser ? JSON.parse(savedUser) : null;
  }

  logout(): void {
    localStorage.removeItem('edike_user');
    localStorage.removeItem('edike_access_token');
    localStorage.removeItem('edike_refresh_token');
  }
}

export const authAPI = new AuthAPI();