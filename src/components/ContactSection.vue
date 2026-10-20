<template>
  <section class="section contact-section" id="contact">
    <div class="container">
      <div class="contact-layout">
        <!-- Left: Info -->
        <div class="contact-info">
          <div class="section-label">Contact</div>
          <h2 class="section-title contact-title">
            Ada project<br />
            di pikiran?<br />
            <span class="text-accent">Cerita ke saya.</span>
          </h2>
          <p class="contact-subtitle">
            Siap menerima project baru. Balas dalam 24 jam kerja.
          </p>

          <!-- Quick contacts -->
          <div class="quick-contacts">
            <a
              href="https://wa.me/6281520428270"
              target="_blank"
              rel="noopener noreferrer"
              class="quick-contact-item"
              id="whatsapp-link"
              @click="trackContact('whatsapp')"
            >
              <div class="qc-icon" style="background: rgba(37, 211, 102, 0.15); color: #25D366;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>
              <div class="qc-info">
                <span class="qc-label">WhatsApp</span>
                <span class="qc-value">+62 81520428270</span>
              </div>
              <svg class="qc-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
            </a>

            <a
              href="mailto:saiymuddinusman@mail.com"
              class="quick-contact-item"
              id="email-link"
              @click="trackContact('email')"
            >
              <div class="qc-icon" style="background: rgba(167, 139, 250, 0.15); color: #A78BFA;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <div class="qc-info">
                <span class="qc-label">Email</span>
                <span class="qc-value">saiymuddinusman@mail.com</span>
              </div>
              <svg class="qc-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
            </a>
          </div>

          <!-- Social Media -->
          <div class="social-links">
            <span class="social-label">Sosial Media</span>
            <div class="social-icons">
              <a v-for="s in socials" :key="s.name" :href="s.url" target="_blank" rel="noopener noreferrer" class="social-icon" :id="`social-${s.name.toLowerCase()}`" :aria-label="s.name" @click="trackContact(s.name)">
                <span v-html="s.icon"></span>
              </a>
            </div>
          </div>
        </div>

        <!-- Right: Form -->
        <div class="contact-form-wrap">
          <form class="contact-form" @submit.prevent="submitForm" id="contact-form" novalidate>
            <div class="form-group">
              <label for="name">Nama</label>
              <input
                v-model="form.name"
                id="name"
                type="text"
                placeholder="Nama lengkap Anda"
                required
                :class="{ error: errors.name }"
              />
              <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                v-model="form.email"
                id="email"
                type="email"
                placeholder="email@anda.com"
                required
                :class="{ error: errors.email }"
              />
              <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
            </div>

            <div class="form-group">
              <label for="subject">Kebutuhan</label>
              <select v-model="form.subject" id="subject" required>
                <option value="">Pilih kebutuhan...</option>
                <option value="photography">Photography</option>
                <option value="videography">Videography</option>
                <option value="design">Graphic Design</option>
                <option value="editing">Editing / Color Grading</option>
                <option value="other">Lainnya</option>
              </select>
            </div>

            <div class="form-group">
              <label for="message">Pesan</label>
              <textarea
                v-model="form.message"
                id="message"
                rows="5"
                placeholder="Ceritakan detail projectnya..."
                required
                :class="{ error: errors.message }"
              ></textarea>
              <span v-if="errors.message" class="field-error">{{ errors.message }}</span>
            </div>

            <button type="submit" class="btn btn-primary form-submit" id="form-submit-btn" :disabled="submitting">
              <span v-if="!submitting">Kirim Pesan</span>
              <span v-else>Mengirim...</span>
              <svg v-if="!submitting" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>

            <!-- Success message -->
            <div v-if="submitted" class="form-success">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Pesan berhasil dikirim! Saya akan membalas segera.
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue'

const form = reactive({ name: '', email: '', subject: '', message: '' })
const errors = reactive({ name: '', email: '', message: '' })
const submitting = ref(false)
const submitted = ref(false)

const socials = [
  {
    name: 'Instagram',
    url: 'https://instagram.com/saiynuddin',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com/@saiynuddin',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>`
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/saiynuddin',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`
  },
  {
    name: 'Behance',
    url: 'https://behance.net/saiynuddin',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6h7.5a3.5 3.5 0 0 1 0 7H1z"/><path d="M1 13h8.5a3.5 3.5 0 0 1 0 7H1z"/><path d="M14 6h8"/><path d="M22 13H14c0 3.3 2 5 4.5 5S22 16.5 22 13z"/></svg>`
  }
]

function validate() {
  let valid = true
  errors.name = ''
  errors.email = ''
  errors.message = ''

  if (!form.name.trim()) {
    errors.name = 'Nama wajib diisi'
    valid = false
  }
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Email tidak valid'
    valid = false
  }
  if (!form.message.trim() || form.message.trim().length < 10) {
    errors.message = 'Pesan minimal 10 karakter'
    valid = false
  }
  return valid
}

async function submitForm() {
  if (!validate()) return
  submitting.value = true
  // Simulate sending (replace with actual API call)
  await new Promise(resolve => setTimeout(resolve, 1500))
  submitting.value = false
  submitted.value = true
  form.name = ''
  form.email = ''
  form.subject = ''
  form.message = ''
  setTimeout(() => { submitted.value = false }, 5000)
}

function trackContact(type) {
  console.log(`Contact click: ${type}`)
}
</script>

<style scoped>
.contact-section {
  background: var(--bg-3);
}

.contact-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(3rem, 8vw, 7rem);
  align-items: start;
}

/* Info */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: sticky;
  top: calc(var(--navbar-h) + 2rem);
}

.contact-title {
  line-height: 1.15;
  font-size: clamp(2rem, 4vw, 3rem);
}

.contact-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.7;
}

/* Quick contacts */
.quick-contacts {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.quick-contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: inherit;
  transition: all var(--transition);
}

.quick-contact-item:hover {
  border-color: var(--border-hover);
  transform: translateX(4px);
  box-shadow: var(--shadow-sm);
}

.qc-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.qc-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.qc-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.qc-value {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-primary);
}

.qc-arrow {
  color: var(--text-muted);
  transition: all var(--transition);
}

.quick-contact-item:hover .qc-arrow {
  color: var(--text-primary);
  transform: translate(2px, -2px);
}

/* Social */
.social-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.social-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.social-icons {
  display: flex;
  gap: 0.5rem;
}

.social-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  text-decoration: none;
  transition: all var(--transition);
}

.social-icon:hover {
  background: var(--accent);
  color: #0a0a0a;
  border-color: var(--accent);
  transform: translateY(-3px);
}

/* Form */
.contact-form-wrap {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: clamp(1.5rem, 4vw, 2.5rem);
}

.contact-form {
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
  color: var(--text-secondary);
}

.form-group input,
.form-group select,
.form-group textarea {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 14px 16px;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--text-primary);
  transition: border-color var(--transition);
  outline: none;
  width: 100%;
  appearance: none;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.form-group input.error,
.form-group textarea.error {
  border-color: #F87171;
}

.form-group select {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23606060' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 48px;
}

.form-group textarea {
  resize: vertical;
  min-height: 140px;
}

.field-error {
  font-size: 0.8125rem;
  color: #F87171;
}

.form-submit {
  width: 100%;
  padding: 16px;
  font-size: 1rem;
}

.form-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-success {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 1rem 1.25rem;
  background: rgba(52, 211, 153, 0.1);
  border: 1px solid rgba(52, 211, 153, 0.3);
  border-radius: var(--radius-md);
  color: #34D399;
  font-size: 0.9375rem;
  font-weight: 500;
}

::placeholder {
  color: var(--text-muted);
}

@media (max-width: 900px) {
  .contact-layout { grid-template-columns: 1fr; }
  .contact-info { position: static; }
}
</style>
