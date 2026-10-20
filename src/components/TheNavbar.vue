<template>
  <header class="navbar" :class="{ scrolled: isScrolled, 'nav-open': menuOpen }">
    <div class="container navbar-inner">
      <!-- Logo -->
      <router-link to="/" class="nav-logo" @click="closeMenu">
        <span class="logo-initials">SU</span>
        <span class="logo-name">Saiynuddin<span class="logo-dot">.</span></span>
      </router-link>

      <!-- Desktop Nav -->
      <nav class="nav-links" role="navigation" aria-label="Main navigation">
        <a href="/#works" @click.prevent="scrollTo('works')" class="nav-link">Work</a>
        <a href="/#about" @click.prevent="scrollTo('about')" class="nav-link">About</a>
        <a href="/#services" @click.prevent="scrollTo('services')" class="nav-link">Services</a>
        <a href="/#agencies" @click.prevent="scrollTo('agencies')" class="nav-link">Agencies</a>
      </nav>

      <!-- Right actions -->
      <div class="nav-actions">
        <!-- Theme Toggle -->
        <button
          class="theme-toggle"
          :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="$emit('toggle-theme')"
          id="theme-toggle-btn"
        >
          <svg v-if="theme === 'dark'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>

        <a href="/#contact" @click.prevent="scrollTo('contact')" class="btn btn-primary nav-cta" id="nav-contact-btn">
          Hubungi Saya
        </a>

        <!-- Hamburger -->
        <button
          class="hamburger"
          :class="{ open: menuOpen }"
          @click="toggleMenu"
          :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
          aria-controls="mobile-menu"
          id="hamburger-btn"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div class="mobile-menu" id="mobile-menu" :class="{ open: menuOpen }">
      <nav class="mobile-nav">
        <a href="/#works" @click.prevent="scrollToAndClose('works')" class="mobile-nav-link">Work</a>
        <a href="/#about" @click.prevent="scrollToAndClose('about')" class="mobile-nav-link">About</a>
        <a href="/#services" @click.prevent="scrollToAndClose('services')" class="mobile-nav-link">Services</a>
        <a href="/#agencies" @click.prevent="scrollToAndClose('agencies')" class="mobile-nav-link">Agencies</a>
        <a href="/#contact" @click.prevent="scrollToAndClose('contact')" class="btn btn-primary mobile-cta">Hubungi Saya</a>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({ theme: String })
defineEmits(['toggle-theme'])

const router = useRouter()
const route = useRoute()
const isScrolled = ref(false)
const menuOpen = ref(false)

function onScroll() {
  isScrolled.value = window.scrollY > 20
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  document.body.style.overflow = menuOpen.value ? 'hidden' : ''
}

function closeMenu() {
  menuOpen.value = false
  document.body.style.overflow = ''
}

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

function scrollToAndClose(id) {
  closeMenu()
  setTimeout(() => scrollTo(id), 300)
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: var(--navbar-h);
  transition: all var(--transition);
}

.navbar.scrolled {
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--border);
}

[data-theme="light"] .navbar.scrolled {
  background: rgba(250, 250, 250, 0.85);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  gap: 2rem;
}

/* Logo */
.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-initials {
  width: 38px;
  height: 38px;
  background: var(--accent);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 800;
  color: #0a0a0a;
  letter-spacing: -0.02em;
}

.logo-name {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.logo-dot {
  color: var(--accent);
}

/* Desktop nav */
.nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-link {
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all var(--transition);
  text-decoration: none;
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--surface);
}

/* Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.theme-toggle {
  width: 40px;
  height: 40px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all var(--transition);
}

.theme-toggle:hover {
  color: var(--text-primary);
  background: var(--surface);
  border-color: var(--border-hover);
}

.nav-cta {
  padding: 10px 22px;
  font-size: 0.875rem;
}

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 8px;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: all var(--transition);
  transform-origin: center;
}

.hamburger.open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger.open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Mobile menu */
.mobile-menu {
  position: fixed;
  top: var(--navbar-h);
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform var(--transition);
  z-index: 999;
  overflow-y: auto;
}

.mobile-menu.open {
  transform: translateX(0);
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 1rem;
}

.mobile-nav-link {
  display: block;
  padding: 1rem 0.5rem;
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
  transition: color var(--transition);
  text-decoration: none;
}

.mobile-nav-link:hover {
  color: var(--text-primary);
}

.mobile-cta {
  margin-top: 2rem;
  width: 100%;
  text-align: center;
}

@media (max-width: 768px) {
  .nav-links, .nav-cta { display: none; }
  .hamburger { display: flex; }
}
</style>
