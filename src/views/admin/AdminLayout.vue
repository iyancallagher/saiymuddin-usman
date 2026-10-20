<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <div class="logo-icon-sm">SU</div>
          <span class="sidebar-brand" v-if="!sidebarCollapsed">CMS Admin</span>
        </div>
        <button class="sidebar-toggle" @click="sidebarCollapsed = !sidebarCollapsed" id="sidebar-toggle-btn" :title="sidebarCollapsed ? 'Expand' : 'Collapse'">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path v-if="!sidebarCollapsed" d="m15 18-6-6 6-6"/>
            <path v-else d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          :id="`nav-${item.id}`"
          :title="sidebarCollapsed ? item.label : ''"
        >
          <span class="nav-icon" v-html="item.icon"></span>
          <span class="nav-label" v-if="!sidebarCollapsed">{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <router-link to="/" target="_blank" class="nav-item" id="nav-view-site" :title="sidebarCollapsed ? 'Lihat Site' : ''">
          <span class="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </span>
          <span class="nav-label" v-if="!sidebarCollapsed">Lihat Website</span>
        </router-link>
        <button class="nav-item logout-btn" @click="logout" id="logout-btn" :title="sidebarCollapsed ? 'Logout' : ''">
          <span class="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </span>
          <span class="nav-label" v-if="!sidebarCollapsed">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main -->
    <div class="admin-main">
      <!-- Top bar -->
      <header class="admin-topbar">
        <div class="topbar-left">
          <h2 class="topbar-title">{{ currentPageTitle }}</h2>
        </div>
        <div class="topbar-right">
          <div class="topbar-user">
            <div class="user-avatar">{{ user?.username?.charAt(0).toUpperCase() || 'A' }}</div>
            <span class="user-name" v-if="user">{{ user.username }}</span>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const sidebarCollapsed = ref(false)

const user = computed(() => {
  try { return JSON.parse(localStorage.getItem('cms_user')) } catch { return null }
})

const navItems = [
  {
    id: 'dashboard', to: '/admin/dashboard', label: 'Dashboard',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`
  },
  {
    id: 'works', to: '/admin/works', label: 'Karya (Works)',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`
  },
  {
    id: 'testimonials', to: '/admin/testimonials', label: 'Testimonials',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
  },
  {
    id: 'agencies', to: '/admin/agencies', label: 'Agencies',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
  },
  {
    id: 'services', to: '/admin/services', label: 'Services',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`
  },
  {
    id: 'media', to: '/admin/media', label: 'Media Upload',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`
  },
  {
    id: 'profile', to: '/admin/profile', label: 'Hero & About Me',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
  }
]

const pageNames = {
  '/admin/dashboard': 'Dashboard',
  '/admin/works': 'Kelola Karya',
  '/admin/works/new': 'Tambah Karya Baru',
  '/admin/testimonials': 'Kelola Testimonials',
  '/admin/agencies': 'Kelola Agencies',
  '/admin/services': 'Kelola Services',
  '/admin/media': 'Media Library',
  '/admin/profile': 'Hero & About Me'
}

const currentPageTitle = computed(() => {
  if (route.path.includes('/admin/works/') && route.path !== '/admin/works/new') return 'Edit Karya'
  return pageNames[route.path] || 'Admin CMS'
})

function logout() {
  localStorage.removeItem('cms_token')
  localStorage.removeItem('cms_user')
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #080808;
  color: #f0f0f0;
  font-family: 'Inter', sans-serif;
}

/* Sidebar */
.admin-sidebar {
  width: 240px;
  min-height: 100vh;
  background: #0f0f0f;
  border-right: 1px solid rgba(255,255,255,0.06);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}

.admin-sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  min-height: 64px;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
}

.logo-icon-sm {
  width: 36px;
  height: 36px;
  background: #A78BFA;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Outfit', sans-serif;
  font-size: 0.85rem;
  font-weight: 800;
  color: #0a0a0a;
  flex-shrink: 0;
}

.sidebar-brand {
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: #f0f0f0;
  white-space: nowrap;
}

.sidebar-toggle {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #606060;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;
}

.sidebar-toggle:hover { color: #f0f0f0; background: rgba(255,255,255,0.1); }

.sidebar-nav {
  flex: 1;
  padding: 0.75rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  text-decoration: none;
  color: #606060;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
}

.nav-item:hover { color: #f0f0f0; background: rgba(255,255,255,0.06); }

.nav-item.router-link-active {
  color: #A78BFA;
  background: rgba(167, 139, 250, 0.12);
}

.nav-icon { flex-shrink: 0; width: 18px; height: 18px; display: flex; align-items: center; }

.sidebar-footer {
  padding: 0.75rem;
  border-top: 1px solid rgba(255,255,255,0.06);
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.logout-btn { color: #606060; }
.logout-btn:hover { color: #F87171; background: rgba(248, 113, 113, 0.1); }

/* Main */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.admin-topbar {
  height: 64px;
  background: #0f0f0f;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 10;
}

.topbar-title {
  font-family: 'Outfit', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #f0f0f0;
  letter-spacing: -0.02em;
}

.topbar-right { display: flex; align-items: center; gap: 1rem; }

.topbar-user { display: flex; align-items: center; gap: 8px; }

.user-avatar {
  width: 34px; height: 34px;
  background: rgba(167, 139, 250, 0.2);
  border: 1px solid rgba(167, 139, 250, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: #A78BFA;
}

.user-name { font-size: 0.875rem; color: #a0a0a0; }

.admin-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}
</style>
