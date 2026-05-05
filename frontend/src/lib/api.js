const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

function getToken() {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem('bmg_token'); } catch { return null; }
}

async function request(path, { method = 'GET', body, headers = {}, token: tokenOverride, cache, next } = {}) {
  const token = tokenOverride ?? getToken();
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);
  if (cache) opts.cache = cache;
  if (next) opts.next = next;

  const res = await fetch(`${API_BASE}${path}`, opts);
  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) {
    const err = new Error(data?.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  base: API_BASE,
  get:  (path, opts) => request(path, { ...opts }),
  post: (path, body, opts) => request(path, { method: 'POST', body, ...opts }),
  put:  (path, body, opts) => request(path, { method: 'PUT',  body, ...opts }),
  del:  (path, opts) => request(path, { method: 'DELETE', ...opts }),
};
