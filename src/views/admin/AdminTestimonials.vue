<template>
  <div class="admin-testimonials">
    <div class="page-header">
      <p class="page-meta">{{ testimonials.length }} testimonial</p>
      <button class="btn-add" @click="openForm()" id="add-testimonial-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        Tambah Testimonial
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div><span>Memuat...</span>
    </div>

    <div v-else class="testimonials-grid">
      <div
        v-for="t in testimonials"
        :key="t.id"
        class="testi-card"
        :id="`testi-card-${t.id}`"
      >
        <div class="testi-header">
          <img v-if="t.avatar" :src="t.avatar" :alt="t.name" class="testi-avatar" />
          <div class="testi-avatar-placeholder" v-else>{{ t.name.charAt(0) }}</div>
          <div class="testi-meta">
            <span class="testi-name">{{ t.name }}</span>
            <span class="testi-role">{{ t.role }}, {{ t.company }}</span>
          </div>
          <div class="testi-stars">
            <span v-for="s in t.rating" :key="s" class="star">★</span>
          </div>
        </div>
        <p class="testi-quote">"{{ t.quote }}"</p>
        <div class="testi-actions">
          <button class="action-btn edit" @click="openForm(t)" :id="`edit-testi-${t.id}`">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </button>
          <button class="action-btn delete" @click="confirmDelete(t)" :id="`delete-testi-${t.id}`">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            Hapus
          </button>
        </div>
      </div>
    </div>

    <!-- Form Modal -->
    <div v-if="formOpen" class="modal-overlay" @click.self="formOpen = false">
      <div class="modal" id="testi-form-modal">
        <h3>{{ editing ? 'Edit Testimonial' : 'Tambah Testimonial' }}</h3>
        <form @submit.prevent="saveTestimonial" class="modal-form">
          <div class="mf-row">
            <div class="field">
              <label>Nama *</label>
              <input v-model="form.name" type="text" required placeholder="Nama klien" id="testi-name" />
            </div>
            <div class="field">
              <label>Rating</label>
              <select v-model.number="form.rating" id="testi-rating">
                <option v-for="n in 5" :key="n" :value="n">{{ n }} ★</option>
              </select>
            </div>
          </div>
          <div class="mf-row">
            <div class="field">
              <label>Jabatan</label>
              <input v-model="form.role" type="text" placeholder="Marketing Director" id="testi-role" />
            </div>
            <div class="field">
              <label>Perusahaan</label>
              <input v-model="form.company" type="text" placeholder="PT. Example" id="testi-company" />
            </div>
          </div>
          <div class="field">
            <label>URL Avatar</label>
            <input v-model="form.avatar" type="url" placeholder="https://..." id="testi-avatar" />
          </div>
          <div class="field">
            <label>Kutipan *</label>
            <textarea v-model="form.quote" rows="4" required placeholder="Kata-kata mereka tentang pekerjaan Anda..." id="testi-quote"></textarea>
          </div>
          <div class="error-msg" v-if="formError">{{ formError }}</div>
          <div class="modal-actions">
            <button type="button" @click="formOpen = false" class="btn-cancel" id="cancel-testi-btn">Batal</button>
            <button type="submit" class="btn-save" id="save-testi-btn" :disabled="saving">
              {{ saving ? 'Menyimpan...' : (editing ? 'Simpan' : 'Tambahkan') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete confirm -->
    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
      <div class="modal">
        <h3>Hapus Testimonial?</h3>
        <p>Testimonial dari <strong>{{ deleteTarget.name }}</strong> akan dihapus permanen.</p>
        <div class="modal-actions">
          <button @click="deleteTarget = null" class="btn-cancel" id="cancel-del-testi-btn">Batal</button>
          <button @click="deleteTestimonial" class="btn-del" id="confirm-del-testi-btn" :disabled="deleting">
            {{ deleting ? 'Menghapus...' : 'Hapus' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { testimonialsApi } from '@/services/api.js'

const testimonials = ref([])
const loading = ref(true)
const formOpen = ref(false)
const editing = ref(null)
const saving = ref(false)
const formError = ref('')
const deleteTarget = ref(null)
const deleting = ref(false)

const form = reactive({ name: '', role: '', company: '', avatar: '', quote: '', rating: 5 })

function openForm(t = null) {
  editing.value = t
  formError.value = ''
  if (t) Object.assign(form, t)
  else Object.assign(form, { name: '', role: '', company: '', avatar: '', quote: '', rating: 5 })
  formOpen.value = true
}

async function saveTestimonial() {
  formError.value = ''
  saving.value = true
  try {
    if (editing.value) {
      const updated = await testimonialsApi.update(editing.value.id, { ...form })
      const idx = testimonials.value.findIndex(t => t.id === editing.value.id)
      if (idx !== -1) testimonials.value[idx] = updated
    } else {
      const created = await testimonialsApi.create({ ...form })
      testimonials.value.push(created)
    }
    formOpen.value = false
  } catch (e) {
    formError.value = 'Gagal menyimpan: ' + e.message
  } finally {
    saving.value = false
  }
}

function confirmDelete(t) { deleteTarget.value = t }

async function deleteTestimonial() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await testimonialsApi.delete(deleteTarget.value.id)
    testimonials.value = testimonials.value.filter(t => t.id !== deleteTarget.value.id)
    deleteTarget.value = null
  } catch (e) {
    alert('Gagal menghapus: ' + e.message)
  } finally {
    deleting.value = false
  }
}

onMounted(async () => {
  try { testimonials.value = await testimonialsApi.getAll() } catch {}
  loading.value = false
})
</script>

<style scoped>
.admin-testimonials { display: flex; flex-direction: column; gap: 1.5rem; }
.page-header { display: flex; align-items: center; justify-content: space-between; }
.page-meta { font-size: 0.875rem; color: #606060; }
.btn-add {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 18px; background: #A78BFA; color: #0a0a0a;
  border: none; border-radius: 10px; font-size: 0.875rem; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
}
.btn-add:hover { background: #c4b5fd; }
.loading-state { display: flex; align-items: center; gap: 1rem; padding: 3rem; color: #606060; }
.spinner { width: 24px; height: 24px; border: 2px solid rgba(255,255,255,0.1); border-top-color: #A78BFA; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.testimonials-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.testi-card {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;
  transition: border-color 0.2s;
}
.testi-card:hover { border-color: rgba(255,255,255,0.12); }
.testi-header { display: flex; align-items: center; gap: 0.75rem; }
.testi-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.testi-avatar-placeholder {
  width: 44px; height: 44px; border-radius: 50%; background: rgba(167,139,250,0.2);
  color: #A78BFA; display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 1.1rem; flex-shrink: 0;
}
.testi-meta { flex: 1; }
.testi-name { display: block; font-size: 0.9375rem; font-weight: 600; color: #e0e0e0; }
.testi-role { font-size: 0.8125rem; color: #606060; }
.testi-stars { color: #A78BFA; font-size: 0.875rem; }
.testi-quote { font-size: 0.9rem; color: #a0a0a0; line-height: 1.7; font-style: italic; flex: 1; }
.testi-actions { display: flex; gap: 0.5rem; }
.action-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 8px; font-size: 0.8125rem; font-weight: 600;
  cursor: pointer; border: none; transition: all 0.2s;
}
.action-btn.edit { background: rgba(167,139,250,0.12); color: #A78BFA; }
.action-btn.edit:hover { background: rgba(167,139,250,0.22); }
.action-btn.delete { background: rgba(248,113,113,0.1); color: #F87171; }
.action-btn.delete:hover { background: rgba(248,113,113,0.2); }
/* Modal */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.75);
  display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem;
}
.modal {
  background: #141414; border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px; padding: 2rem; max-width: 500px; width: 100%;
}
.modal h3 { font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 700; color: #f0f0f0; margin-bottom: 1.5rem; }
.modal p { font-size: 0.9375rem; color: #a0a0a0; line-height: 1.6; }
.modal strong { color: #f0f0f0; }
.modal-form { display: flex; flex-direction: column; gap: 1rem; }
.mf-row { display: flex; gap: 1rem; }
.mf-row .field { flex: 1; }
.field { display: flex; flex-direction: column; gap: 0.5rem; }
.field label { font-size: 0.8125rem; font-weight: 600; color: #a0a0a0; }
.field input, .field select, .field textarea {
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px; padding: 10px 12px; font-family: 'Inter', sans-serif;
  font-size: 0.875rem; color: #f0f0f0; outline: none; transition: border-color 0.2s; width: 100%;
}
.field input:focus, .field select:focus, .field textarea:focus { border-color: #A78BFA; }
.field textarea { resize: vertical; min-height: 90px; }
.field input::placeholder, .field textarea::placeholder { color: #404040; }
.error-msg { padding: 10px 14px; background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.25); border-radius: 10px; color: #F87171; font-size: 0.8125rem; }
.modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 0.5rem; }
.btn-cancel { padding: 10px 20px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #e0e0e0; font-size: 0.875rem; cursor: pointer; transition: all 0.2s; }
.btn-cancel:hover { background: rgba(255,255,255,0.12); }
.btn-save { padding: 10px 20px; background: #A78BFA; border: none; border-radius: 10px; color: #0a0a0a; font-size: 0.875rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn-save:hover:not(:disabled) { background: #c4b5fd; }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-del { padding: 10px 20px; background: #F87171; border: none; border-radius: 10px; color: #0a0a0a; font-size: 0.875rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn-del:hover:not(:disabled) { background: #fca5a5; }
.btn-del:disabled { opacity: 0.6; cursor: not-allowed; }
@media (max-width: 768px) { .testimonials-grid { grid-template-columns: 1fr; } }
</style>
