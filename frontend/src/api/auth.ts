import { apiClient } from '@/lib/apiClient';

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    return apiClient.request<LoginResponse>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });
  },

  getProfile: () => apiClient.get<{ id: string; email: string; risk_level: string }>('/users/me'),
};
