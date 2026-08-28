const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function request(path, options = {}) {
  const { method, body, headers } = options;
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body,
  });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
}

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const authAPI = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  verifyOTP: (email, codigo) =>
    request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, codigo }) }),

  verify2FA: (tempToken, totpCode) =>
    request('/auth/verify-2fa', { method: 'POST', body: JSON.stringify({ tempToken, totpCode }) }),

  refresh: (refreshToken) =>
    request('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) }),

  logout: (refreshToken, accessToken) =>
    request('/auth/logout', {
      method: 'POST',
      headers: authHeaders(accessToken),
      body: JSON.stringify({ refreshToken }),
    }),

  me: (accessToken) =>
    request('/auth/me', { headers: authHeaders(accessToken) }),

  setup2FA: (accessToken) =>
    request('/auth/setup-2fa', {
      method: 'POST',
      headers: authHeaders(accessToken),
    }),

  confirm2FA: (token, accessToken) =>
    request('/auth/confirm-2fa', {
      method: 'POST',
      headers: authHeaders(accessToken),
      body: JSON.stringify({ token }),
    }),

  supabaseSync: (password, accessToken) =>
    request('/auth/supabase-sync', {
      method: 'POST',
      headers: authHeaders(accessToken),
      body: JSON.stringify({ password }),
    }),

  panelGrants: (accessToken) =>
    request('/auth/panel-grants', { headers: authHeaders(accessToken) }),

  setPanelGrant: (payload, accessToken) =>
    request('/auth/panel-grants', {
      method: 'POST',
      headers: authHeaders(accessToken),
      body: JSON.stringify(payload),
    }),
};

export const contactAPI = {
  send: (payload) =>
    request('/contact', { method: 'POST', body: JSON.stringify(payload) }),
};
