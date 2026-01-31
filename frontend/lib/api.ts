export type AuthUser = { id: number; email: string; role: string };

export type AuthMeResponse = {
  user: AuthUser;
  member: null | {
    id: number;
    name: string;
    email: string;
    company: string | null;
    role: string | null;
    profileImageUrl: string | null;
    joinDate: string;
  };
};

export type MembersListResponse = {
  items: Array<{
    id: number;
    name: string;
    email: string;
    company: string | null;
    role: string | null;
    profileImageUrl: string | null;
    joinDate: string;
    isApproved?: boolean;
    createdAt?: string;
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

function isBrowser() {
  return typeof window !== 'undefined';
}

export function getToken() {
  return isBrowser() ? window.localStorage.getItem('amd_token') : null;
}

export function setToken(token: string) {
  if (!isBrowser()) return;
  window.localStorage.setItem('amd_token', token);
}

export function clearToken() {
  if (!isBrowser()) return;
  window.localStorage.removeItem('amd_token');
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const firstValidationMsg =
      data && Array.isArray(data.errors) && data.errors.length ? String(data.errors[0]?.msg ?? '') : '';
    const msg =
      (data && (data.error || data.message)) ||
      (firstValidationMsg ? firstValidationMsg : null) ||
      `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

export async function login(email: string, password: string) {
  return await apiFetch<{ token: string; user: AuthUser; member: any }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(payload: {
  email: string;
  password: string;
  name: string;
  company?: string;
  role?: string;
}) {
  return await apiFetch<{ token: string; user: AuthUser; member: any }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function me(token: string) {
  return await apiFetch<AuthMeResponse>('/api/auth/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function listMembersPublic(params?: { page?: number; limit?: number; search?: string; company?: string }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  if (params?.search) qs.set('search', params.search);
  if (params?.company) qs.set('company', params.company);
  const url = `/api/members${qs.toString() ? `?${qs.toString()}` : ''}`;
  return await apiFetch<MembersListResponse>(url, { method: 'GET' });
}

export async function listMembersAdminAll(token: string, params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  const url = `/api/members/admin/all${qs.toString() ? `?${qs.toString()}` : ''}`;
  return await apiFetch<MembersListResponse>(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function approveMember(token: string, memberId: number) {
  return await apiFetch(`/api/members/${memberId}/approve`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateMyMember(
  token: string,
  updates: { name?: string; company?: string | null; role?: string | null; profileImageUrl?: string | null }
) {
  return await apiFetch('/api/members/me', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(updates),
  });
}

