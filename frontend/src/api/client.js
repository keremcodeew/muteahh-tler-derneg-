const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

export async function api(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText || 'Request failed');
  return data;
}

export const newsApi = {
  list: (page = 1, limit = 10) => api(`/news?page=${page}&limit=${limit}`),
  adminList: (page = 1, limit = 20) => api(`/news/admin/all?page=${page}&limit=${limit}`),
  slider: () => api('/news/slider'),
  get: (id) => api(`/news/${id}`),
  create: (body) => api('/news', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => api(`/news/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => api(`/news/${id}`, { method: 'DELETE' }),
};

export const announcementsApi = {
  list: (page = 1, limit = 10) => api(`/announcements?page=${page}&limit=${limit}`),
  adminList: (page = 1, limit = 20) => api(`/announcements/admin/all?page=${page}&limit=${limit}`),
  recent: () => api('/announcements/recent'),
  upcoming: () => api('/announcements/upcoming'),
  get: (id) => api(`/announcements/${id}`),
  create: (body) => api('/announcements', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => api(`/announcements/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => api(`/announcements/${id}`, { method: 'DELETE' }),
};

export const membersApi = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api(`/members${q ? `?${q}` : ''}`);
  },
  get: (id) => api(`/members/${id}`),
  adminList: (page = 1) => api(`/members/admin/all?page=${page}&limit=20`),
  create: (body) => api('/members', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => api(`/members/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => api(`/members/${id}`, { method: 'DELETE' }),
};

export const authApi = {
  login: (email, password) => api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (body) => api('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  me: () => api('/auth/me'),
};
