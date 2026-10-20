<template>
  <div class="admin-login">
    <!-- Background -->
    <div class="login-bg">
      <div class="login-glow glow-1"></div>
      <div class="login-glow glow-2"></div>
      <div class="login-grid"></div>
    </div>

    <div class="login-card">
      <!-- Logo -->
      <div class="login-logo">
        <div class="logo-icon">SU</div>
        <div class="login-brand">
          <span class="brand-name">Saiynuddin<span class="brand-dot">.</span></span>
          <span class="brand-sub">CMS Admin</span>
        </div>
      </div>

      <h1 class="login-title">Selamat Datang</h1>
      <p class="login-sub">Masuk untuk mengelola konten portofolio</p>

      <!-- Form -->
      <form class="login-form" @submit.prevent="handleLogin" id="login-form">
        <div class="form-group">
          <label for="login-username">Username</label>
          <div class="input-wrap">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input
              v-model="form.username"
              id="login-username"
              type="text"
              placeholder="admin"
              autocomplete="username"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="login-password">Password</label>
          <div class="input-wrap">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input
              v-model="form.password"
              id="login-password"
              :type="showPass ? 'text' : 'password'"
              placeholder="••••••••"
              autocomplete="current-password"
              required
            />
            <button type="button" class="pass-toggle" @click="showPass = !showPass" id="toggle-password">
              <svg v-if="!showPass" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="login-error">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {{ error }}
        </div>

        <button type="submit" class="btn-login" id="login-submit-btn" :disabled="loading">
          <span v-if="!loading">Masuk ke CMS</span>
          <span v-else class="loading-dots">Memverifikasi<span>.</span><span>.</span><span>.</span></span>
        </button>
      </form>

      <p class="login-hint">Default: <code>admin</code> / <code>admin123</code></p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/services/api.js'

const router = useRouter()
const form = reactive({ username: '', password: '' })
const showPass = ref(false)
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const res = await authApi.login(form.username, form.password)
    localStorage.setItem('cms_token', res.token)
    localStorage.setItem('cms_user', JSON.stringify(res.user))
    router.push('/admin/dashboard')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #080808;
  position: relative;
  overflow: hidden;
  padding: 2rem;
}

.login-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.login-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.4;
}

.glow-1 {
  width: 500px; height: 500px;
  top: -100px; left: -100px;
  background: radial-gradient(circle, rgba(167, 139, 250, 0.5), transparent 65%);
}

.glow-2 {
  width: 400px; height: 400px;
  bottom: -80px; right: -80px;
  background: radial-gradient(circle, rgba(244, 114, 182, 0.4), transparent 65%);
}

.login-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 48px 48px;
}

/* Card */
.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: clamp(2rem, 5vw, 2.75rem);
  backdrop-filter: blur(24px);
}

.login-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 2rem;
}

.logo-icon {
  width: 44px;
  height: 44px;
  background: #A78BFA;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  font-weight: 800;
  color: #0a0a0a;
}

.login-brand {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.brand-name {
  font-family: 'Outfit', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #f0f0f0;
  letter-spacing: -0.02em;
}

.brand-dot { color: #A78BFA; }

.brand-sub {
  font-size: 0.75rem;
  color: #606060;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.login-title {
  font-family: 'Outfit', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #f0f0f0;
  letter-spacing: -0.03em;
  margin-bottom: 0.5rem;
}

.login-sub {
  font-size: 0.9375rem;
  color: #606060;
  margin-bottom: 2rem;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #a0a0a0;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  color: #606060;
  pointer-events: none;
}

.input-wrap input {
  width: 100%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 13px 16px 13px 44px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9375rem;
  color: #f0f0f0;
  outline: none;
  transition: border-color 0.2s;
}

.input-wrap input:focus {
  border-color: #A78BFA;
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.2);
}

.input-wrap input::placeholder { color: #404040; }

.pass-toggle {
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  cursor: pointer;
  color: #606060;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.pass-toggle:hover { color: #a0a0a0; }

/* Error */
.login-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.3);
  border-radius: 10px;
  color: #F87171;
  font-size: 0.875rem;
}

/* Login button */
.btn-login {
  width: 100%;
  padding: 14px;
  background: #A78BFA;
  color: #0a0a0a;
  border: none;
  border-radius: 12px;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.btn-login:hover:not(:disabled) {
  background: #c4b5fd;
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(167, 139, 250, 0.4);
}

.btn-login:disabled { opacity: 0.7; cursor: not-allowed; }

.loading-dots span {
  animation: blink 1.4s infinite both;
}
.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes blink {
  0%, 80%, 100% { opacity: 0; }
  40% { opacity: 1; }
}

.login-hint {
  margin-top: 1.25rem;
  text-align: center;
  font-size: 0.8125rem;
  color: #404040;
}

.login-hint code {
  background: rgba(255,255,255,0.07);
  padding: 2px 8px;
  border-radius: 6px;
  color: #A78BFA;
  font-size: 0.875rem;
}
</style>
