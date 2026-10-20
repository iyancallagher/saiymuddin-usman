<template>
  <div class="dashboard">
    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card" v-for="s in stats" :key="s.label" :id="`stat-${s.id}`">
        <div class="stat-icon" :style="{ background: s.color + '20', color: s.color }">
          <span v-html="s.icon"></span>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ s.value }}</div>
          <div class="stat-label">{{ s.label }}</div>
        </div>
      </div>
    </div>

    <!-- Main content: recent works + quick actions -->
    <div class="dashboard-body">
      <!-- Recent Works -->
      <div class="dash-card">
        <div class="dash-card-header">
          <h3 class="dash-card-title">Karya Terbaru</h3>
          <router-link to="/admin/works" class="dash-link" id="dash-all-works-link">Lihat Semua →</router-link>
        </div>
        <div class="recent-list">
          <div v-if="loadingWorks" class="dash-loading">Memuat...</div>
          <div
            v-else
            v-for="work in recentWorks"
            :key="work.id"
            class="recent-item"
            :id="`recent-work-${work.id}`"
          >
            <img :src="work.cover" :alt="work.title" class="recent-thumb" />
            <div class="recent-info">
              <span class="recent-title">{{ work.title }}</span>
              <div class="recent-meta">
                <span :class="`badge badge-${work.origin}`">{{ work.origin }}</span>
                <span class="recent-cat">{{ work.category }}</span>
                <span class="recent-year">{{ work.year }}</span>
              </div>
            </div>
            <div class="recent-actions">
              <span v-if="work.featured" class="featured-star" title="Featured">⭐</span>
              <router-link :to="`/admin/works/${work.id}`" class="icon-btn" :id="`edit-recent-${work.id}`" title="Edit">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="dash-card">
        <div class="dash-card-header">
          <h3 class="dash-card-title">Aksi Cepat</h3>
        </div>
        <div class="quick-actions">
          <router-link to="/admin/works/new" class="quick-action" id="qa-add-work">
            <div class="qa-icon" style="color: #A78BFA; background: rgba(167,139,250,0.12);">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            </div>
            <span>Tambah Karya Baru</span>
            <svg class="qa-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </router-link>

          <router-link to="/admin/testimonials" class="quick-action" id="qa-testimonials">
            <div class="qa-icon" style="color: #34D399; background: rgba(52,211,153,0.12);">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <span>Kelola Testimonials</span>
            <svg class="qa-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </router-link>

          <router-link to="/admin/agencies" class="quick-action" id="qa-agencies">
            <div class="qa-icon" style="color: #F472B6; background: rgba(244,114,182,0.12);">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <span>Edit Info Agency</span>
            <svg class="qa-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </router-link>

          <router-link to="/admin/media" class="quick-action" id="qa-media">
            <div class="qa-icon" style="color: #FB923C; background: rgba(251,146,60,0.12);">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <span>Upload Gambar</span>
            <svg class="qa-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </router-link>
        </div>

        <!-- Server status -->
        <div class="server-status" :class="{ online: serverOnline, offline: !serverOnline }">
          <span class="status-dot"></span>
          <span>Server {{ serverOnline ? 'Online' : 'Offline' }} — http://localhost:3001</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { worksApi } from '@/services/api.js'

const loadingWorks = ref(true)
const recentWorks = ref([])
const serverOnline = ref(false)
const stats = ref([
  { id: 'works', label: 'Total Karya', value: '-', color: '#A78BFA', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>` },
  { id: 'featured', label: 'Karya Featured', value: '-', color: '#F472B6', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>` },
  { id: 'categories', label: 'Kategori Aktif', value: '4', color: '#34D399', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>` },
  { id: 'agencies', label: 'Agency', value: '2', color: '#FB923C', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>` }
])

onMounted(async () => {
  // Check server
  try {
    const r = await fetch('http://localhost:3001/api/health')
    serverOnline.value = r.ok
  } catch { serverOnline.value = false }

  // Load works
  try {
    const works = await worksApi.getAll()
    recentWorks.value = works.slice(0, 5)
    stats.value[0].value = works.length
    stats.value[1].value = works.filter(w => w.featured).length
    loadingWorks.value = false
  } catch (e) {
    loadingWorks.value = false
  }
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  transition: all 0.2s;
}

.stat-card:hover {
  border-color: rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
}

.stat-icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-value {
  font-family: 'Outfit', sans-serif;
  font-size: 1.75rem;
  font-weight: 800;
  color: #f0f0f0;
  letter-spacing: -0.04em;
  line-height: 1;
}

.stat-label {
  font-size: 0.8125rem;
  color: #606060;
  margin-top: 3px;
}

/* Dashboard body */
.dashboard-body {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 1.5rem;
}

.dash-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  overflow: hidden;
}

.dash-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.dash-card-title {
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #f0f0f0;
}

.dash-link {
  font-size: 0.8125rem;
  color: #A78BFA;
  text-decoration: none;
  transition: opacity 0.2s;
}
.dash-link:hover { opacity: 0.8; }

/* Recent list */
.recent-list { display: flex; flex-direction: column; }

.dash-loading {
  padding: 2rem;
  text-align: center;
  color: #606060;
  font-size: 0.875rem;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  transition: background 0.2s;
}

.recent-item:last-child { border-bottom: none; }
.recent-item:hover { background: rgba(255,255,255,0.03); }

.recent-thumb {
  width: 52px; height: 40px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.recent-info { flex: 1; min-width: 0; }

.recent-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #e0e0e0;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.recent-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}

.recent-cat, .recent-year {
  font-size: 0.75rem;
  color: #606060;
}

.recent-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.featured-star { font-size: 0.875rem; }

.badge {
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 100px;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-personal { background: rgba(167,139,250,0.15); color: #A78BFA; }
.badge-mementa { background: rgba(52,211,153,0.15); color: #34D399; }
.badge-404 { background: rgba(244,114,182,0.15); color: #F472B6; }

.icon-btn {
  width: 28px; height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #606060;
  text-decoration: none;
  transition: all 0.2s;
}
.icon-btn:hover { color: #f0f0f0; background: rgba(255,255,255,0.1); }

/* Quick actions */
.quick-actions {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.quick-action {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  text-decoration: none;
  color: #a0a0a0;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
}

.quick-action:hover {
  background: rgba(255,255,255,0.06);
  color: #f0f0f0;
}

.qa-icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.qa-arrow { margin-left: auto; color: #404040; }

/* Server status */
.server-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0.5rem 1rem 1rem;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 0.8125rem;
}

.server-status.online {
  background: rgba(52,211,153,0.1);
  color: #34D399;
  border: 1px solid rgba(52,211,153,0.2);
}

.server-status.offline {
  background: rgba(248,113,113,0.1);
  color: #F87171;
  border: 1px solid rgba(248,113,113,0.2);
}

.status-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

@media (max-width: 1200px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .dashboard-body { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .stats-grid { grid-template-columns: 1fr 1fr; }
}
</style>
