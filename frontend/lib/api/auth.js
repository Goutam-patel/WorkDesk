import apiClient, { clearAccessToken, setAccessToken } from './client';

export async function login(payload) {
  const { data } = await apiClient.post('/auth/login', payload, { withCredentials: true });
  setAccessToken(data.accessToken || data.token);
  return data;
}

export async function register(payload) {
  const { data } = await apiClient.post('/auth/register', payload, { withCredentials: true });
  setAccessToken(data.accessToken || data.token);
  return data;
}

export async function refreshSession() {
  const { data } = await apiClient.post('/auth/refresh', undefined, { withCredentials: true });
  setAccessToken(data.accessToken || data.token);
  return data;
}

export async function getCurrentUser() {
  const { data } = await apiClient.get('/auth/me');
  return data;
}

export async function logout() {
  try {
    await apiClient.post('/auth/logout', undefined, { withCredentials: true });
  } catch {
    // Ignore logout network failures and clear client state anyway.
  }

  if (typeof window !== 'undefined') {
    clearAccessToken();
    localStorage.removeItem('workdesk_user');
  }
}
