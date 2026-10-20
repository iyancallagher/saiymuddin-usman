<template>
  <div class="admin-agencies">
    <div class="page-header">
      <p class="page-meta">Edit informasi 2 agency yang ditampilkan di portfolio</p>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div><span>Memuat...</span>
    </div>

    <div v-else class="agencies-grid">
      <div
        v-for="(agency, idx) in agencies"
        :key="idx"
        class="agency-editor"
        :id="`agency-editor-${idx}`"
      >
        <!-- Header chip -->
        <div class="agency-chip-header">
          <span :class="`chip chip-${idx === 0 ? 'mementa' : '404'}`">{{ agency.name }}</span>
          <span class="agency-idx">#{{ idx + 1 }}</span>
        </div>

        <form @submit.prevent="saveAgency(idx)" class="agency-form">
          <div class="field">
            <label>Nama Agency</label>
            <input v-model="agency.name" type="text" required :id="`agency-name-${idx}`" />
          </div>
          <div class="field">
            <label>Tagline</label>
            <input v-model="agency.tagline" type="text" :id="`agency-tagline-${idx}`" />
          </div>
          <div class="field">
            <label>Deskripsi</label>
            <textarea v-model="agency.description" rows="4" :id="`agency-desc-${idx}`"></textarea>
          </div>
          <div class="field-row">
            <div class="field">
              <label>Tahun Berdiri</label>
              <input v-model="agency.founded" type="text" :id="`agency-founded-${idx}`" />
            </div>
            <div class="field">
              <label>URL Website</label>
              <input v-model="agency.url" type="url" placeholder="https://..." :id="`agency-url-${idx}`" />
            </div>
          </div>

          <!-- Stats -->
          <div class="section-label">Statistik</div>
          <div v-for="(stat, si) in (agency.stats || [])" :key="si" class="stat-editor-row">
            <input v-model="stat.value" type="text" placeholder="100+" class="stat-val-input" :id="`agency-stat-val-${idx}-${si}`" />
            <input v-model="stat.label" type="text" placeholder="Projects" class="stat-lbl-input" :id="`agency-stat-lbl-${idx}-${si}`" />
          </div>

          <!-- Services list -->
          <div class="section-label" style="margin-top:0.5rem;">Layanan</div>
          <div class="services-list-editor">
            <div v-for="(svc, si) in (agency.services || [])" :key="si" class="svc-row">
              <input v-model="agency.services[si]" type="text" :id="`agency-svc-${idx}-${si}`" />
              <button type="button" @click="agency.services.splice(si, 1)" class="rm-btn" :id="`rm-svc-${idx}-${si}`">✕</button>
            </div>
            <button type="button" @click="agency.services.push('')" class="add-svc-btn" :id="`add-svc-${idx}`">+ Tambah Layanan</button>
          </div>

          <div class="success-msg" v-if="successIdx === idx">✓ Perubahan disimpan!</div>
          <div class="error-msg" v-if="errorIdx === idx">{{ saveError }}</div>

          <button type="submit" class="btn-save" :id="`save-agency-${idx}`" :disabled="saving === idx">
            {{ saving === idx ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { agenciesApi } from '@/services/api.js'

const agencies = ref([])
const loading = ref(true)
const saving = ref(null)
const successIdx = ref(null)
const errorIdx = ref(null)
const saveError = ref('')

async function saveAgency(idx) {
  saving.value = idx
  successIdx.value = null
  errorIdx.value = null
  try {
    await agenciesApi.updateOne(idx, agencies.value[idx])
    successIdx.value = idx
    setTimeout(() => { successIdx.value = null }, 3000)
  } catch (e) {
    saveError.value = e.message
    errorIdx.value = idx
  } finally {
    saving.value = null
  }
}

onMounted(async () => {
  try { agencies.value = await agenciesApi.getAll() } catch {}
  loading.value = false
})
</script>

<style scoped>
.admin-agencies { display: flex; flex-direction: column; gap: 1.5rem; }
.page-header { display: flex; align-items: center; justify-content: space-between; }
.page-meta { font-size: 0.875rem; color: #606060; }
.loading-state { display: flex; align-items: center; gap: 1rem; padding: 3rem; color: #606060; }
.spinner { width: 24px; height: 24px; border: 2px solid rgba(255,255,255,0.1); border-top-color: #A78BFA; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.agencies-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.agency-editor {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem;
}
.agency-chip-header { display: flex; align-items: center; justify-content: space-between; }
.chip { display: inline-block; padding: 4px 14px; border-radius: 100px; font-weight: 700; font-size: 0.875rem; font-family: 'Outfit', sans-serif; }
.chip-mementa { background: rgba(167,139,250,0.15); color: #A78BFA; border: 1px solid rgba(167,139,250,0.3); }
.chip-404 { background: rgba(244,114,182,0.15); color: #F472B6; border: 1px solid rgba(244,114,182,0.3); }
.agency-idx { font-size: 0.75rem; color: #404040; }
.agency-form { display: flex; flex-direction: column; gap: 1rem; }
.field { display: flex; flex-direction: column; gap: 0.5rem; }
.field-row { display: flex; gap: 1rem; }
.field-row .field { flex: 1; }
.field label { font-size: 0.8125rem; font-weight: 600; color: #a0a0a0; }
.field input, .field textarea {
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px; padding: 10px 12px; font-family: 'Inter', sans-serif;
  font-size: 0.875rem; color: #f0f0f0; outline: none; transition: border-color 0.2s; width: 100%;
}
.field input:focus, .field textarea:focus { border-color: #A78BFA; }
.field textarea { resize: vertical; }
.section-label { font-size: 0.75rem; font-weight: 700; color: #A78BFA; text-transform: uppercase; letter-spacing: 0.08em; }
.stat-editor-row { display: flex; gap: 0.5rem; }
.stat-val-input { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 8px 10px; color: #f0f0f0; font-size: 0.875rem; width: 90px; outline: none; }
.stat-lbl-input { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 8px 10px; color: #f0f0f0; font-size: 0.875rem; flex: 1; outline: none; }
.services-list-editor { display: flex; flex-direction: column; gap: 6px; }
.svc-row { display: flex; gap: 6px; }
.svc-row input { flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 8px 10px; color: #f0f0f0; font-size: 0.875rem; outline: none; }
.rm-btn { background: rgba(248,113,113,0.1); border: none; border-radius: 8px; color: #F87171; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.7rem; }
.add-svc-btn { align-self: flex-start; padding: 6px 14px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #a0a0a0; font-size: 0.8125rem; cursor: pointer; transition: all 0.2s; }
.add-svc-btn:hover { background: rgba(255,255,255,0.1); color: #f0f0f0; }
.success-msg { padding: 8px 14px; background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.25); border-radius: 8px; color: #34D399; font-size: 0.8125rem; }
.error-msg { padding: 8px 14px; background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.25); border-radius: 8px; color: #F87171; font-size: 0.8125rem; }
.btn-save { padding: 11px 20px; background: #A78BFA; border: none; border-radius: 10px; color: #0a0a0a; font-size: 0.875rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn-save:hover:not(:disabled) { background: #c4b5fd; }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
@media (max-width: 900px) { .agencies-grid { grid-template-columns: 1fr; } }
</style>
