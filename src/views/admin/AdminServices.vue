<template>
  <div class="admin-services">
    <div class="page-header">
      <p class="page-meta">Kelola daftar layanan yang ditampilkan di homepage</p>
      <button class="btn-save-all" @click="saveAll" id="save-all-services-btn" :disabled="saving">
        {{ saving ? 'Menyimpan...' : 'Simpan Semua Perubahan' }}
      </button>
    </div>

    <div class="success-msg" v-if="success">✓ Semua layanan berhasil disimpan!</div>
    <div class="error-msg" v-if="error">{{ error }}</div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div><span>Memuat...</span>
    </div>

    <div v-else class="services-list">
      <div
        v-for="(svc, idx) in services"
        :key="idx"
        class="service-row"
        :id="`service-row-${idx}`"
      >
        <div class="row-number">{{ String(idx + 1).padStart(2, '0') }}</div>

        <div class="service-fields">
          <div class="field-group">
            <div class="field">
              <label>Nama Layanan</label>
              <input v-model="svc.name" type="text" :id="`svc-name-${idx}`" placeholder="Photography" />
            </div>
            <div class="field">
              <label>Ikon (emoji atau karakter)</label>
              <input v-model="svc.icon" type="text" :id="`svc-icon-${idx}`" placeholder="📷" style="max-width: 100px;" />
            </div>
            <div class="field">
              <label>Link Kategori</label>
              <select v-model="svc.link" :id="`svc-link-${idx}`">
                <option value="/gallery/photography">Photography</option>
                <option value="/gallery/videography">Videography</option>
                <option value="/gallery/graphic-design">Graphic Design</option>
                <option value="/gallery/editing">Editing</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label>Deskripsi</label>
            <textarea v-model="svc.description" rows="2" :id="`svc-desc-${idx}`" placeholder="Singkat tentang layanan ini..."></textarea>
          </div>
        </div>

        <button class="move-btn" @click="moveUp(idx)" :disabled="idx === 0" :id="`move-up-${idx}`" title="Pindah ke atas">↑</button>
        <button class="move-btn" @click="moveDown(idx)" :disabled="idx === services.length - 1" :id="`move-down-${idx}`" title="Pindah ke bawah">↓</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { servicesApi } from '@/services/api.js'

const services = ref([])
const loading = ref(true)
const saving = ref(false)
const success = ref(false)
const error = ref('')

function moveUp(idx) {
  if (idx === 0) return
  const arr = services.value
  ;[arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]
}

function moveDown(idx) {
  const arr = services.value
  if (idx >= arr.length - 1) return
  ;[arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]
}

async function saveAll() {
  saving.value = true
  error.value = ''
  success.value = false
  try {
    await servicesApi.updateAll(services.value)
    success.value = true
    setTimeout(() => { success.value = false }, 3000)
  } catch (e) {
    error.value = 'Gagal menyimpan: ' + e.message
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try { services.value = await servicesApi.getAll() } catch {}
  loading.value = false
})
</script>

<style scoped>
.admin-services { display: flex; flex-direction: column; gap: 1.5rem; }
.page-header { display: flex; align-items: center; justify-content: space-between; }
.page-meta { font-size: 0.875rem; color: #606060; }
.btn-save-all { padding: 10px 20px; background: #A78BFA; border: none; border-radius: 10px; color: #0a0a0a; font-size: 0.875rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn-save-all:hover:not(:disabled) { background: #c4b5fd; }
.btn-save-all:disabled { opacity: 0.6; cursor: not-allowed; }
.success-msg { padding: 10px 16px; background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.25); border-radius: 10px; color: #34D399; font-size: 0.875rem; }
.error-msg { padding: 10px 16px; background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.25); border-radius: 10px; color: #F87171; font-size: 0.875rem; }
.loading-state { display: flex; align-items: center; gap: 1rem; padding: 3rem; color: #606060; }
.spinner { width: 24px; height: 24px; border: 2px solid rgba(255,255,255,0.1); border-top-color: #A78BFA; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.services-list { display: flex; flex-direction: column; gap: 0.75rem; }
.service-row {
  display: flex; align-items: flex-start; gap: 1rem;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px; padding: 1.25rem; transition: border-color 0.2s;
}
.service-row:hover { border-color: rgba(255,255,255,0.12); }
.row-number { font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 800; color: rgba(167,139,250,0.25); letter-spacing: -0.04em; min-width: 40px; padding-top: 2px; }
.service-fields { flex: 1; display: flex; flex-direction: column; gap: 0.75rem; }
.field-group { display: flex; gap: 1rem; }
.field-group .field { flex: 1; }
.field { display: flex; flex-direction: column; gap: 0.4rem; }
.field label { font-size: 0.75rem; font-weight: 600; color: #606060; text-transform: uppercase; letter-spacing: 0.08em; }
.field input, .field select, .field textarea {
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; padding: 9px 12px; font-family: 'Inter', sans-serif;
  font-size: 0.875rem; color: #f0f0f0; outline: none; transition: border-color 0.2s; width: 100%;
}
.field input:focus, .field select:focus, .field textarea:focus { border-color: #A78BFA; }
.field textarea { resize: none; }
.move-btn {
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; width: 30px; height: 30px; display: flex; align-items: center;
  justify-content: center; cursor: pointer; color: #a0a0a0; transition: all 0.2s; flex-shrink: 0;
}
.move-btn:hover:not(:disabled) { background: rgba(255,255,255,0.12); color: #f0f0f0; }
.move-btn:disabled { opacity: 0.3; cursor: not-allowed; }
</style>
