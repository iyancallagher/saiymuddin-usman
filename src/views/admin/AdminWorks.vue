<template>
  <div class="admin-works">
    <!-- Header -->
    <div class="page-header">
      <div>
        <p class="page-meta">{{ works.length }} karya total · {{ works.filter(w=>w.featured).length }} featured</p>
      </div>
      <div class="header-actions">
        <!-- Filter -->
        <select v-model="filterCat" class="admin-select" id="filter-category">
          <option value="">Semua Kategori</option>
          <option value="photography">Photography</option>
          <option value="videography">Videography</option>
          <option value="graphic-design">Graphic Design</option>
          <option value="editing">Editing</option>
        </select>
        <select v-model="filterOrigin" class="admin-select" id="filter-origin">
          <option value="">Semua Origin</option>
          <option value="personal">Personal</option>
          <option value="mementa">Mementa</option>
          <option value="404">404</option>
        </select>
        <router-link to="/admin/works/new" class="btn-add" id="add-work-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          Tambah Karya
        </router-link>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <span>Memuat karya...</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="loadWorks" class="btn-retry">Coba Lagi</button>
    </div>

    <!-- Table -->
    <div v-else class="works-table-wrap">
      <table class="works-table">
        <thead>
          <tr>
            <th>Karya</th>
            <th>Kategori</th>
            <th>Origin</th>
            <th>Tahun</th>
            <th>Featured</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="work in filteredWorks" :key="work.id" :id="`work-row-${work.id}`">
            <td class="work-cell">
              <img :src="work.cover" :alt="work.title" class="work-thumb" />
              <div class="work-cell-info">
                <span class="work-cell-title">{{ work.title }}</span>
                <span class="work-cell-client">{{ work.client }}</span>
              </div>
            </td>
            <td>
              <span class="cat-badge">{{ categoryLabel(work.category) }}</span>
            </td>
            <td>
              <span :class="`badge badge-${work.origin}`">{{ work.origin }}</span>
            </td>
            <td class="year-cell">{{ work.year }}</td>
            <td>
              <button
                class="featured-toggle"
                :class="{ active: work.featured }"
                @click="toggleFeatured(work)"
                :id="`featured-toggle-${work.id}`"
                :title="work.featured ? 'Hapus dari featured' : 'Jadikan featured'"
              >
                {{ work.featured ? '⭐' : '☆' }}
              </button>
            </td>
            <td>
              <div class="action-btns">
                <router-link :to="`/admin/works/${work.id}`" class="action-btn edit" :id="`edit-${work.id}`" title="Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </router-link>
                <a :href="`/project/${work.id}`" target="_blank" class="action-btn view" :id="`view-${work.id}`" title="Lihat di site">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
                <button class="action-btn delete" @click="confirmDelete(work)" :id="`delete-${work.id}`" title="Hapus">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete confirm modal -->
    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
      <div class="modal" id="delete-confirm-modal">
        <h3>Hapus Karya?</h3>
        <p>Karya <strong>{{ deleteTarget.title }}</strong> akan dihapus permanen dari data.</p>
        <div class="modal-actions">
          <button @click="deleteTarget = null" class="btn-cancel" id="cancel-delete-btn">Batal</button>
          <button @click="deleteWork" class="btn-confirm-delete" id="confirm-delete-btn" :disabled="deleting">
            {{ deleting ? 'Menghapus...' : 'Ya, Hapus' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { worksApi } from '@/services/api.js'

const works = ref([])
const loading = ref(true)
const error = ref('')
const filterCat = ref('')
const filterOrigin = ref('')
const deleteTarget = ref(null)
const deleting = ref(false)

const filteredWorks = computed(() => {
  let list = works.value
  if (filterCat.value) list = list.filter(w => w.category === filterCat.value)
  if (filterOrigin.value) list = list.filter(w => w.origin === filterOrigin.value)
  return list
})

function categoryLabel(cat) {
  const map = { photography: 'Photography', videography: 'Videography', 'graphic-design': 'Graphic Design', editing: 'Editing' }
  return map[cat] || cat
}

async function loadWorks() {
  loading.value = true
  error.value = ''
  try {
    works.value = await worksApi.getAll()
  } catch (e) {
    error.value = `Gagal memuat karya: ${e.message}`
  } finally {
    loading.value = false
  }
}

async function toggleFeatured(work) {
  try {
    const res = await worksApi.toggleFeatured(work.id)
    work.featured = res.featured
  } catch (e) {
    alert('Gagal update featured: ' + e.message)
  }
}

function confirmDelete(work) {
  deleteTarget.value = work
}

async function deleteWork() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await worksApi.delete(deleteTarget.value.id)
    works.value = works.value.filter(w => w.id !== deleteTarget.value.id)
    deleteTarget.value = null
  } catch (e) {
    alert('Gagal menghapus: ' + e.message)
  } finally {
    deleting.value = false
  }
}

onMounted(loadWorks)
</script>

<style scoped>
.admin-works { display: flex; flex-direction: column; gap: 1.5rem; }

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.page-meta { font-size: 0.875rem; color: #606060; }

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.admin-select {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 8px 12px;
  color: #e0e0e0;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}

.admin-select:focus { border-color: #A78BFA; }

.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  background: #A78BFA;
  color: #0a0a0a;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-add:hover { background: #c4b5fd; transform: translateY(-1px); }

/* Loading/error */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem;
  color: #606060;
}

.spinner {
  width: 32px; height: 32px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top-color: #A78BFA;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.btn-retry {
  padding: 8px 20px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  color: #e0e0e0;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-retry:hover { background: rgba(255,255,255,0.15); }

/* Table */
.works-table-wrap {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  overflow: hidden;
}

.works-table {
  width: 100%;
  border-collapse: collapse;
}

.works-table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #606060;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
}

.works-table td {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  vertical-align: middle;
}

.works-table tr:last-child td { border-bottom: none; }
.works-table tr:hover td { background: rgba(255,255,255,0.02); }

.work-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 220px;
}

.work-thumb {
  width: 56px; height: 40px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.work-cell-title {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #e0e0e0;
  margin-bottom: 2px;
}

.work-cell-client {
  font-size: 0.75rem;
  color: #606060;
}

.cat-badge {
  display: inline-block;
  padding: 3px 10px;
  background: rgba(255,255,255,0.06);
  border-radius: 100px;
  font-size: 0.75rem;
  color: #a0a0a0;
}

.badge {
  display: inline-flex;
  padding: 2px 10px;
  border-radius: 100px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.badge-personal { background: rgba(167,139,250,0.15); color: #A78BFA; }
.badge-mementa { background: rgba(52,211,153,0.15); color: #34D399; }
.badge-404 { background: rgba(244,114,182,0.15); color: #F472B6; }

.year-cell { font-size: 0.875rem; color: #a0a0a0; font-variant-numeric: tabular-nums; }

.featured-toggle {
  background: none;
  border: none;
  font-size: 1.125rem;
  cursor: pointer;
  opacity: 0.4;
  transition: all 0.2s;
}
.featured-toggle.active { opacity: 1; }
.featured-toggle:hover { transform: scale(1.2); }

.action-btns { display: flex; align-items: center; gap: 6px; }

.action-btn {
  width: 30px; height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
}

.action-btn.edit { background: rgba(167,139,250,0.12); color: #A78BFA; }
.action-btn.edit:hover { background: rgba(167,139,250,0.25); }
.action-btn.view { background: rgba(255,255,255,0.06); color: #a0a0a0; }
.action-btn.view:hover { background: rgba(255,255,255,0.12); color: #f0f0f0; }
.action-btn.delete { background: rgba(248,113,113,0.1); color: #F87171; }
.action-btn.delete:hover { background: rgba(248,113,113,0.2); }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal {
  background: #1a1a1a;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
}

.modal h3 {
  font-family: 'Outfit', sans-serif;
  font-size: 1.25rem;
  color: #f0f0f0;
  margin-bottom: 0.75rem;
}

.modal p { font-size: 0.9375rem; color: #a0a0a0; line-height: 1.6; }
.modal strong { color: #f0f0f0; }

.modal-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 10px 20px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  color: #e0e0e0;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-cancel:hover { background: rgba(255,255,255,0.12); }

.btn-confirm-delete {
  padding: 10px 20px;
  background: #F87171;
  border: none;
  border-radius: 10px;
  color: #0a0a0a;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-confirm-delete:hover:not(:disabled) { background: #fca5a5; }
.btn-confirm-delete:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
