/**
 * Base URL for the Express CMS backend.
 *
 * Development : set VITE_API_URL in .env.local  → http://localhost:3001
 * Production  : set VITE_API_URL in Vercel env  → https://your-backend.railway.app
 *
 * Falls back to localhost:3001 if the variable is not set.
 */
export const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '')
export const API_URL  = `${API_BASE}/api`
