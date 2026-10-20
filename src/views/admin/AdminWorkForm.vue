<template>
  <div class="work-form-page">
    <!-- Back -->
    <div class="form-back">
      <router-link to="/admin/works" class="back-btn" id="back-to-works">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Kembali ke Daftar
      </router-link>
      <span class="form-mode-badge">{{ isEdit ? 'Edit Karya' : 'Tambah Karya Baru' }}</span>
    </div>

    <div v-if="loadingData" class="loading-state">
      <div class="spinner"></div><span>Memuat data...</span>
    </div>

    <form v-else class="work-form" @submit.prevent="handleSubmit" id="work-form" novalidate>
      <div class="form-layout">
        <!-- Left: Main fields -->
        <div class="form-main">
          <!-- Cover preview -->
          <div class="cover-preview" v-if="form.cover">
            <img :src="form.cover" alt="Cover preview" />
          </div>

          <div class="form-section">
            <h3 class="section-label">Informasi Dasar</h3>

            <div class="field-row">
              <div class="field">
                <label for="f-title">Judul Karya *</label>
                <input v-model="form.title" id="f-title" type="text" placeholder="Contoh: Urban Portraits 2026" required />
              </div>
              <div class="field field-sm">
                <label for="f-year">Tahun *</label>
                <input v-model.number="form.year" id="f-year" type="number" :min="2000" :max="2099" required />
              </div>
            </div>

            <div class="field-row">
              <div class="field">
                <label for="f-category">Kategori *</label>
                <select v-model="form.category" id="f-category" required>
                  <option value="photography">Photography</option>
                  <option value="videography">Videography</option>
                  <option value="graphic-design">Graphic Design</option>
                  <option value="editing">Editing</option>
                </select>
              </div>
              <div class="field">
                <label for="f-origin">Origin *</label>
                <select v-model="form.origin" id="f-origin" required>
                  <option value="personal">Personal</option>
                  <option value="mementa">Mementa</option>
                  <option value="404">404</option>
                </select>
              </div>
            </div>

            <div class="field-row">
              <div class="field">
                <label for="f-client">Klien</label>
                <input v-model="form.client" id="f-client" type="text" placeholder="Nama klien" />
              </div>
              <div class="field">
                <label for="f-role">Peran</label>
                <input v-model="form.role" id="f-role" type="text" placeholder="Contoh: Fotografer & Art Director" />
              </div>
            </div>

            <div class="field">
              <label for="f-desc">Deskripsi</label>
              <textarea v-model="form.description" id="f-desc" rows="4" placeholder="Cerita singkat tentang project ini..."></textarea>
            </div>

            <div class="field">
              <label for="f-tags">Tags <span class="field-hint">(pisahkan dengan koma)</span></label>
              <input v-model="tagsInput" id="f-tags" type="text" placeholder="portrait, urban, natural light" />
            </div>

            <div class="field-check">
              <input type="checkbox" v-model="form.featured" id="f-featured" />
              <label for="f-featured">Tampilkan di Selected Works (Featured)</label>
            </div>
          </div>

          <!-- Cover URL -->
          <div class="form-section">
            <h3 class="section-label">Cover Image</h3>
            <div class="field">
              <label for="f-cover">URL Cover *</label>
              <div class="url-input-row">
                <input v-model="form.cover" id="f-cover" type="url" placeholder="https://... atau /uploads/..." required />
                <button type="button" class="btn-pick-media" @click="openMediaPicker('cover')" id="pick-cover-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  Pilih Gambar
                </button>
              </div>
            </div>
          </div>

          <!-- Media items -->
          <div class="form-section">
            <div class="section-row">
              <h3 class="section-label">Media Galeri</h3>
              <button type="button" class="btn-add-media" @click="addMediaItem" id="add-media-btn">+ Tambah Media</button>
            </div>

            <div class="media-list">
              <div
                v-for="(item, idx) in form.media"
                :key="idx"
                class="media-item-editor"
                :id="`media-item-editor-${idx}`"
              >
                <div class="media-item-header">
                  <select v-model="item.type" class="type-select" :id="`media-type-${idx}`">
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                  <button type="button" class="remove-media-btn" @click="removeMediaItem(idx)" :id="`remove-media-${idx}`">✕</button>
                </div>

                <template v-if="item.type === 'image'">
                  <div class="url-input-row">
                    <input v-model="item.src" type="url" placeholder="URL gambar..." :id="`media-src-${idx}`" />
                    <button type="button" class="btn-pick-media" @click="openMediaPicker('media', idx)" :id="`pick-media-${idx}`">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </button>
                  </div>
                  <input v-model="item.alt" type="text" placeholder="Alt text..." :id="`media-alt-${idx}`" class="alt-input" />
                  <div class="media-thumb" v-if="item.src">
                    <img :src="item.src" :alt="item.alt" />
                  </div>
                </template>

                <template v-else>
                  <select v-model="item.provider" class="provider-select" :id="`media-provider-${idx}`">
                    <option value="youtube">YouTube</option>
                    <option value="vimeo">Vimeo</option>
                  </select>
                  <input v-model="item.id" type="text" placeholder="Video ID (contoh: dQw4w9WgXcQ)" :id="`media-vid-${idx}`" />
                  <input v-model="item.thumbnail" type="url" placeholder="URL thumbnail (opsional)" :id="`media-thumb-${idx}`" />
                </template>
              </div>

              <div v-if="form.media.length === 0" class="no-media">
                Belum ada media. Klik "+ Tambah Media" untuk menambahkan.
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Submit panel -->
        <div class="form-sidebar">
          <div class="submit-panel">
            <h3 class="section-label">Publikasi</h3>

            <div class="publish-info">
              <div class="pi-row">
                <span>Kategori</span>
                <span class="pi-val">{{ form.category || '-' }}</span>
              </div>
              <div class="pi-row">
                <span>Origin</span>
                <span :class="`badge badge-${form.origin}`">{{ form.origin }}</span>
              </div>
              <div class="pi-row">
                <span>Featured</span>
                <span :class="form.featured ? 'pi-yes' : 'pi-no'">{{ form.featured ? '⭐ Ya' : 'Tidak' }}</span>
              </div>
            </div>

            <div class="error-msg" v-if="submitError">{{ submitError }}</div>
            <div class="success-msg" v-if="submitSuccess">✓ {{ submitSuccess }}</div>

            <button type="submit" class="btn-publish" id="submit-work-btn" :disabled="submitting">
              {{ submitting ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Terbitkan Karya') }}
            </button>

            <router-link v-if="isEdit" :to="`/project/${route.params.id}`" target="_blank" class="btn-preview">
              Lihat di Website →
            </router-link>
          </div>
        </div>
      </div>
    </form>

    <!-- Media Picker Modal -->
    <div v-if="mediaPicker.open" class="modal-overlay" @click.self="mediaPicker.open = false">
      <div class="media-picker-modal" id="media-picker-modal">
        <div class="mp-header">
          <h3>Pilih Gambar</h3>
          <button @click="mediaPicker.open = false" class="mp-close" id="mp-close-btn">✕</button>
        </div>

        <!-- Upload zone -->
        <div class="mp-upload-zone" @dragover.prevent @drop.prevent="onDrop">
          <label for="mp-file-input" class="upload-label" id="mp-upload-label">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span>Drag & drop atau klik untuk upload</span>
            <input type="file" id="mp-file-input" accept="image/*" @change="uploadFromInput" class="hidden-input" />
          </label>
          <div v-if="uploading" class="upload-progress">Mengupload...</div>
        </div>

        <!-- Uploaded files grid -->
        <div class="mp-grid">
          <div
            v-for="file in mediaFiles"
            :key="file.filename"
            class="mp-file"
            @click="selectMedia(file.url)"
            :id="`mp-file-${file.filename}`"
          >
            <img :src="`http://localhost:3001${file.url}`" :alt="file.filename" />
            <div class="mp-file-name">{{ file.filename }}</div>
          </div>
          <div v-if="mediaFiles.length === 0" class="mp-empty">
            Belum ada gambar yang diupload.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { worksApi, uploadApi } from '@/services/api.js'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => route.params.id && route.params.id !== 'new')
const loadingData = ref(false)
const submitting = ref(false)
const submitError = ref('')
const submitSuccess = ref('')

const form = reactive({
  title: '',
  category: 'photography',
  origin: 'personal',
  year: new Date().getFullYear(),
  client: '',
  role: '',
  cover: '',
  media: [],
  description: '',
  tags: [],
  featured: false
})

const tagsInput = computed({
  get: () => form.tags.join(', '),
  set: (val) => { form.tags = val.split(',').map(t => t.trim()).filter(Boolean) }
})

// Media picker state
const mediaPicker = reactive({ open: false, target: null, mediaIdx: null })
const mediaFiles = ref([])
const uploading = ref(false)

function addMediaItem() {
  form.media.push({ type: 'image', src: '', alt: '' })
}

function removeMediaItem(idx) {
  form.media.splice(idx, 1)
}

async function openMediaPicker(target, idx = null) {
  mediaPicker.target = target
  mediaPicker.mediaIdx = idx
  mediaPicker.open = true
  try {
    const files = await uploadApi.listFiles()
    mediaFiles.value = files.filter(f => /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(f.filename))
  } catch { mediaFiles.value = [] }
}

function selectMedia(url) {
  const fullUrl = `http://localhost:3001${url}`
  if (mediaPicker.target === 'cover') {
    form.cover = fullUrl
  } else if (mediaPicker.target === 'media' && mediaPicker.mediaIdx !== null) {
    form.media[mediaPicker.mediaIdx].src = fullUrl
  }
  mediaPicker.open = false
}

async function uploadFromInput(e) {
  const file = e.target.files[0]
  if (!file) return
  uploading.value = true
  try {
    const res = await uploadApi.uploadImage(file)
    mediaFiles.value.unshift({ url: res.url, filename: res.filename })
  } catch (err) {
    alert('Upload gagal: ' + err.message)
  } finally {
    uploading.value = false
  }
}

async function onDrop(e) {
  const file = e.dataTransfer.files[0]
  if (!file) return
  uploading.value = true
  try {
    const res = await uploadApi.uploadImage(file)
    mediaFiles.value.unshift({ url: res.url, filename: res.filename })
  } catch (err) {
    alert('Upload gagal: ' + err.message)
  } finally {
    uploading.value = false
  }
}

async function handleSubmit() {
  submitError.value = ''
  submitSuccess.value = ''
  if (!form.title.trim()) { submitError.value = 'Judul wajib diisi'; return }
  if (!form.cover.trim()) { submitError.value = 'Cover wajib diisi'; return }

  submitting.value = true
  try {
    if (isEdit.value) {
      await worksApi.update(route.params.id, { ...form })
      submitSuccess.value = 'Karya berhasil diperbarui!'
    } else {
      await worksApi.create({ ...form })
      submitSuccess.value = 'Karya berhasil ditambahkan!'
      setTimeout(() => router.push('/admin/works'), 1500)
    }
  } catch (e) {
    submitError.value = 'Gagal menyimpan: ' + e.message
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  if (isEdit.value) {
    loadingData.value = true
    try {
      const work = await worksApi.getOne(route.params.id)
      Object.assign(form, work)
    } catch (e) {
      submitError.value = 'Gagal memuat data: ' + e.message
    } finally {
      loadingData.value = false
    }
  }
})
</script>

<style scoped>
.work-form-page { display: flex; flex-direction: column; gap: 1.5rem; }

.form-back {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: #606060;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.2s;
}
.back-btn:hover { color: #f0f0f0; background: rgba(255,255,255,0.06); }

.form-mode-badge {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #A78BFA;
  background: rgba(167,139,250,0.12);
  padding: 4px 12px;
  border-radius: 100px;
}

/* Loading */
.loading-state {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  color: #606060;
}
.spinner {
  width: 24px; height: 24px;
  border: 2px solid rgba(255,255,255,0.1);
  border-top-color: #A78BFA;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Form layout */
.form-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 1.5rem;
  align-items: start;
}

.form-main { display: flex; flex-direction: column; gap: 1.25rem; }

/* Cover preview */
.cover-preview {
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16/7;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
}
.cover-preview img {
  width: 100%; height: 100%;
  object-fit: cover;
}

/* Form section */
.form-section {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-label {
  font-family: 'Outfit', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  color: #A78BFA;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.section-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Fields */
.field { display: flex; flex-direction: column; gap: 0.5rem; }
.field-sm { max-width: 120px; }
.field-row { display: flex; gap: 1rem; }
.field-row .field { flex: 1; }

.field label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #a0a0a0;
}

.field-hint { font-weight: 400; color: #606060; }

.field input,
.field select,
.field textarea {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 10px 12px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #f0f0f0;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  border-color: #A78BFA;
  box-shadow: 0 0 0 3px rgba(167,139,250,0.15);
}

.field input::placeholder,
.field textarea::placeholder { color: #404040; }

.field select { cursor: pointer; appearance: none; }

.field textarea { resize: vertical; min-height: 100px; }

.field-check {
  display: flex;
  align-items: center;
  gap: 10px;
}
.field-check input[type="checkbox"] {
  width: 18px; height: 18px;
  accent-color: #A78BFA;
  cursor: pointer;
}
.field-check label {
  font-size: 0.9rem;
  color: #a0a0a0;
  cursor: pointer;
}

/* URL row */
.url-input-row {
  display: flex;
  gap: 8px;
}
.url-input-row input {
  flex: 1;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 0.875rem;
  color: #f0f0f0;
  outline: none;
}
.url-input-row input:focus { border-color: #A78BFA; }

.btn-pick-media {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: rgba(167,139,250,0.12);
  border: 1px solid rgba(167,139,250,0.25);
  border-radius: 10px;
  color: #A78BFA;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.btn-pick-media:hover { background: rgba(167,139,250,0.2); }

/* Media list */
.media-list { display: flex; flex-direction: column; gap: 1rem; }

.media-item-editor {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.media-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.type-select, .provider-select {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 0.8125rem;
  color: #e0e0e0;
  outline: none;
  cursor: pointer;
}

.remove-media-btn {
  background: rgba(248,113,113,0.1);
  border: none;
  border-radius: 8px;
  color: #F87171;
  width: 28px; height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s;
}
.remove-media-btn:hover { background: rgba(248,113,113,0.2); }

.media-item-editor input[type="url"],
.media-item-editor input[type="text"] {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 0.875rem;
  color: #f0f0f0;
  outline: none;
  width: 100%;
}

.alt-input { font-size: 0.8125rem; color: #a0a0a0; }

.media-thumb {
  border-radius: 8px;
  overflow: hidden;
  max-height: 120px;
  background: #0a0a0a;
}
.media-thumb img { width: 100%; height: 120px; object-fit: cover; }

.btn-add-media {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 6px 14px;
  color: #a0a0a0;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-add-media:hover { color: #f0f0f0; background: rgba(255,255,255,0.1); }

.no-media {
  text-align: center;
  padding: 2rem;
  color: #404040;
  font-size: 0.875rem;
  border: 1px dashed rgba(255,255,255,0.08);
  border-radius: 10px;
}

/* Sidebar */
.form-sidebar { position: sticky; top: calc(64px + 2rem); }

.submit-panel {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.publish-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 1rem;
  background: rgba(255,255,255,0.03);
  border-radius: 10px;
}

.pi-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #606060;
}

.pi-val { color: #e0e0e0; font-weight: 500; }
.pi-yes { color: #34D399; font-weight: 600; }
.pi-no { color: #606060; }

.badge {
  display: inline-flex;
  padding: 2px 10px;
  border-radius: 100px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}
.badge-personal { background: rgba(167,139,250,0.15); color: #A78BFA; }
.badge-mementa { background: rgba(52,211,153,0.15); color: #34D399; }
.badge-404 { background: rgba(244,114,182,0.15); color: #F472B6; }

.error-msg {
  padding: 10px 14px;
  background: rgba(248,113,113,0.1);
  border: 1px solid rgba(248,113,113,0.25);
  border-radius: 10px;
  color: #F87171;
  font-size: 0.8125rem;
}

.success-msg {
  padding: 10px 14px;
  background: rgba(52,211,153,0.1);
  border: 1px solid rgba(52,211,153,0.25);
  border-radius: 10px;
  color: #34D399;
  font-size: 0.8125rem;
}

.btn-publish {
  width: 100%;
  padding: 13px;
  background: #A78BFA;
  color: #0a0a0a;
  border: none;
  border-radius: 12px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-publish:hover:not(:disabled) { background: #c4b5fd; }
.btn-publish:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-preview {
  display: block;
  text-align: center;
  padding: 10px;
  color: #606060;
  font-size: 0.875rem;
  text-decoration: none;
  transition: color 0.2s;
}
.btn-preview:hover { color: #A78BFA; }

/* Media Picker Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.media-picker-modal {
  background: #141414;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  width: 100%;
  max-width: 720px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.mp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  flex-shrink: 0;
}

.mp-header h3 {
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #f0f0f0;
}

.mp-close {
  background: rgba(255,255,255,0.08);
  border: none;
  border-radius: 8px;
  color: #a0a0a0;
  width: 28px; height: 28px;
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.mp-close:hover { background: rgba(255,255,255,0.15); color: #f0f0f0; }

.mp-upload-zone {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 1.25rem;
  border: 2px dashed rgba(255,255,255,0.12);
  border-radius: 12px;
  color: #606060;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}
.upload-label:hover { border-color: #A78BFA; color: #A78BFA; }

.hidden-input { display: none; }

.upload-progress {
  text-align: center;
  color: #A78BFA;
  font-size: 0.8125rem;
  margin-top: 0.5rem;
}

.mp-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.mp-file {
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.2s;
}
.mp-file:hover { border-color: #A78BFA; }

.mp-file img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
}

.mp-file-name {
  font-size: 0.65rem;
  color: #606060;
  padding: 4px 6px;
  truncate: true;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: rgba(255,255,255,0.03);
}

.mp-empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  color: #404040;
  font-size: 0.875rem;
}

@media (max-width: 900px) {
  .form-layout { grid-template-columns: 1fr; }
  .form-sidebar { position: static; }
}
</style>
