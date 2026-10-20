<template>
  <footer class="footer">
    <div class="container">
      <!-- Top row -->
      <div class="footer-top">
        <div class="footer-brand">
          <div class="footer-logo">
            <span class="logo-initials-sm">SU</span>
            <span class="footer-logo-name">Saiynuddin<span class="logo-dot">.</span></span>
          </div>
          <p class="footer-tagline">
            Fotografer · Videografer · Desainer · Editor<br />
            Founder of Mementa & 404
          </p>
        </div>

        <div class="footer-links">
          <div class="footer-col">
            <span class="footer-col-title">Navigasi</span>
            <a href="#works" @click.prevent="scrollTo('works')">Work</a>
            <a href="#about" @click.prevent="scrollTo('about')">About</a>
            <a href="#services" @click.prevent="scrollTo('services')">Services</a>
            <a href="#agencies" @click.prevent="scrollTo('agencies')">Agencies</a>
            <a href="#contact" @click.prevent="scrollTo('contact')">Contact</a>
          </div>
          <div class="footer-col">
            <span class="footer-col-title">Galeri</span>
            <router-link to="/gallery/photography">Photography</router-link>
            <router-link to="/gallery/videography">Videography</router-link>
            <router-link to="/gallery/graphic-design">Graphic Design</router-link>
            <router-link to="/gallery/editing">Editing</router-link>
          </div>
          <div class="footer-col">
            <span class="footer-col-title">Agencies</span>
            <a href="https://mementa.id" target="_blank" rel="noopener noreferrer">Mementa →</a>
            <a href="https://studio404.id" target="_blank" rel="noopener noreferrer">404 Studio →</a>
          </div>
        </div>
      </div>

      <div class="footer-divider"></div>

      <!-- Bottom row -->
      <div class="footer-bottom">
        <span class="footer-copy">
          &copy; {{ year }} Saiynuddin Usman. All rights reserved.
        </span>
        <div class="footer-social">
          <a href="https://instagram.com/saiynuddin" target="_blank" rel="noopener noreferrer" aria-label="Instagram" id="footer-instagram">IG</a>
          <a href="https://youtube.com/@saiynuddin" target="_blank" rel="noopener noreferrer" aria-label="YouTube" id="footer-youtube">YT</a>
          <a href="https://behance.net/saiynuddin" target="_blank" rel="noopener noreferrer" aria-label="Behance" id="footer-behance">BE</a>
          <a href="https://linkedin.com/in/saiynuddin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" id="footer-linkedin">LI</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const year = new Date().getFullYear()
const router = useRouter()
const route = useRoute()

function scrollTo(id) {
  if (route.name !== 'home') {
    router.push('/').then(() => {
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    })
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<style scoped>
.footer {
  background: var(--bg-2);
  border-top: 1px solid var(--border);
  margin-top: auto;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  gap: 3rem;
  padding: clamp(3rem, 6vw, 5rem) 0;
  flex-wrap: wrap;
}

/* Brand */
.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 240px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-initials-sm {
  width: 36px;
  height: 36px;
  background: var(--accent);
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 800;
  color: #0a0a0a;
}

.footer-logo-name {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.logo-dot { color: var(--accent); }

.footer-tagline {
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* Links */
.footer-links {
  display: flex;
  gap: clamp(2rem, 5vw, 5rem);
  flex-wrap: wrap;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-col-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}

.footer-col a {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--transition);
}

.footer-col a:hover {
  color: var(--text-primary);
}

/* Divider */
.footer-divider {
  height: 1px;
  background: var(--border);
}

/* Bottom */
.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 0;
  gap: 1rem;
  flex-wrap: wrap;
}

.footer-copy {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.footer-social {
  display: flex;
  gap: 0.75rem;
}

.footer-social a {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--text-muted);
  text-decoration: none;
  transition: all var(--transition);
  letter-spacing: 0.05em;
}

.footer-social a:hover {
  background: var(--accent);
  color: #0a0a0a;
  border-color: var(--accent);
}

@media (max-width: 768px) {
  .footer-top { flex-direction: column; }
  .footer-brand { max-width: 100%; }
  .footer-bottom { flex-direction: column; align-items: flex-start; }
}
</style>
