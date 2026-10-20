import { API_URL, API_BASE } from './config.js'

export { API_BASE }

function getToken() {
  return localStorage.getItem('cms_token')
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`
  }
}

async function request(method, path, body = null) {
  const opts = { method, headers: authHeaders() }
  if (body) opts.body = JSON.stringify(body)

  const res = await fetch(`${API_URL}${path}`, opts)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

// ── Auth ───────────────────────────────────────────────────
export const authApi = {
  login: (username, password) =>
    fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    }).then(async r => {
      const d = await r.json()
      if (!r.ok) throw new Error(d.error)
      return d
    }),
  verify: () => request('POST', '/auth/verify')
}

// ── Works ──────────────────────────────────────────────────
export const worksApi = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return request('GET', `/works${q ? '?' + q : ''}`)
  },
  getOne: id => request('GET', `/works/${id}`),
  create: data => request('POST', '/works', data),
  update: (id, data) => request('PUT', `/works/${id}`, data),
  delete: id => request('DELETE', `/works/${id}`),
  toggleFeatured: id => request('PATCH', `/works/${id}/featured`, {})
}

// ── Services ───────────────────────────────────────────────
export const servicesApi = {
  getAll: () => request('GET', '/services'),
  updateOne: (index, data) => request('PUT', `/services/${index}`, data),
  updateAll: data => request('PUT', '/services', data)
}

// ── Agencies ───────────────────────────────────────────────
export const agenciesApi = {
  getAll: () => request('GET', '/agencies'),
  updateOne: (index, data) => request('PUT', `/agencies/${index}`, data)
}

// ── Testimonials ───────────────────────────────────────────
export const testimonialsApi = {
  getAll: () => request('GET', '/testimonials'),
  create: data => request('POST', '/testimonials', data),
  update: (id, data) => request('PUT', `/testimonials/${id}`, data),
  delete: id => request('DELETE', `/testimonials/${id}`)
}

// ── Profile (Hero + About) ─────────────────────────────────
export const profileApi = {
  getAll: () => request('GET', '/profile'),
  getHero: () => request('GET', '/profile/hero'),
  getAbout: () => request('GET', '/profile/about'),
  updateHero: data => request('PUT', '/profile/hero', data),
  updateAbout: data => request('PUT', '/profile/about', data)
}

// ── Upload ─────────────────────────────────────────────────
export const uploadApi = {
  uploadImage: async (file) => {
    const fd = new FormData()
    fd.append('image', file)
    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: fd
    })
    const d = await res.json()
    if (!res.ok) throw new Error(d.error)
    return d
  },
  listFiles: () => request('GET', '/upload/list'),
  deleteFile: filename => request('DELETE', `/upload/${filename}`)
}
