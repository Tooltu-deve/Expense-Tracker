const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:3000/api');

const api = {
  async request(method, path, body, headers = {}) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || data.message || 'Request failed');
    return data;
  },
  get(path) {
    return this.request('GET', path);
  },
  post(path, body) {
    return this.request('POST', path, body);
  },
  put(path, body) {
    return this.request('PUT', path, body);
  },
  delete(path) {
    return this.request('DELETE', path);
  },
};

export default api;
