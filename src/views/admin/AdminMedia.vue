<template>
  <div class="admin-media">
    <!-- Upload zone -->
    <div
      class="upload-zone"
      :class="{ dragging }"
      @dragover.prevent="dragging = true"
      @dragleave="dragging = false"
      @drop.prevent="onDrop"
      id="media-upload-zone"
    >
      <label for="file-input" class="upload-label" id="media-upload-label">
        <div class="upload-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        </div>
        <span class="upload-text">Drag & drop gambar atau <span class="upload-browse">klik untuk browse</span></span>
        <span class="upload-hint">JPG, PNG, WebP, AVIF — maks 10MB per file</span>
        <input type="file" id="file-input" accept="image/*" multiple @change="onFileInput" class="hidden-input" />
      </label>
    </div>

    <!-- Upload progress -->
    <div v-if="uploading" class="upload-progress-bar">
      <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
      <span class="progress-text">Mengupload {{ uploadProgress }}%</span>
    </div>

    <!-- Stats & controls -->
    <div class="media-controls">
      <span class="file-count">{{ files.length }} file tersimpan</span>
      <div class="controls-right">
        <input v-model="search" type="text" placeholder="Cari file..." class="search-input" id="media-search" />
      </div>
    </div>

    <!-- Grid -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div><span>Memuat media...</span>
    </div>

    <div v-else-if="filteredFiles.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      <span>{{ search ? 'Tidak ada file yang cocok' : 'Belum ada gambar yang diupload' }}</span>
    </div>

    <div v-else class="media-grid">
      <div
        v-for="file in filteredFiles"
        :key="file.filename"
        class="media-card"
        :id="`media-card-${file.filename}`"
        :class="{ selected: selectedFiles.has(file.filename) }"
        @click="toggleSelect(file.filename)"
      >
        <div class="media-img-wrap">
          <img
            :src="`http://localhost:3001${file.url}`"
            :alt="file.filename"
            loading="lazy"
          />
          <div class="media-overlay">
            <button class="copy-url-btn" @click.stop="copyUrl(file)" :id="`copy-${file.filename}`" title="Copy URL">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
            <button class="delete-file-btn" @click.stop="deleteFile(file)" :id="`del-${file.filename}`" title="Hapus">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
          <div class="selected-check" v-if="selectedFiles.has(file.filename)">✓</div>
        </div>
        <div class="media-info">
          <span class="media-name">{{ file.filename }}</span>
          <span class="media-size">{{ formatSize(file.size) }}</span>
        </div>
      </div>
    </div>

    <!-- Toast notification -->
    <transition name="toast">
      <div v-if="toast" class="toast" :class="toast.type" id="media-toast">{{ toast.msg }}</div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { uploadApi } from '@/services/api.js'

const files = ref([])
const loading = ref(true)
const search = ref('')
const dragging = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const selectedFiles = ref(new Set())
const toast = ref(null)

const filteredFiles = computed(() =>
  search.value
    ? files.value.filter(f => f.filename.toLowerCase().includes(search.value.toLowerCase()))
    : files.value
)

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function showToast(msg, type = 'success') {
  toast.value = { msg, type }
  setTimeout(() => { toast.value = null }, 3000)
}

function toggleSelect(filename) {
  const s = new Set(selectedFiles.value)
  if (s.has(filename)) s.delete(filename)
  else s.add(filename)
  selectedFiles.value = s
}

function copyUrl(file) {
  navigator.clipboard.writeText(`http://localhost:3001${file.url}`)
  showToast('URL disalin ke clipboard!')
}

async function deleteFile(file) {
  if (!confirm(`Hapus file "${file.filename}"?`)) return
  try {
    await uploadApi.deleteFile(file.filename)
    files.value = files.value.filter(f => f.filename !== file.filename)
    showToast('File berhasil dihapus')
  } catch (e) {
    showToast('Gagal menghapus: ' + e.message, 'error')
  }
}

async function uploadFiles(fileList) {
  uploading.value = true
  uploadProgress.value = 0
  const total = fileList.length
  let done = 0
  for (const file of fileList) {
    try {
      const res = await uploadApi.uploadImage(file)
      files.value.unshift({ url: res.url, filename: res.filename, size: res.size })
    } catch (e) {
      showToast(`Gagal upload ${file.name}: ${e.message}`, 'error')
    }
    done++
    uploadProgress.value = Math.round((done / total) * 100)
  }
  uploading.value = false
  showToast(`${done} file berhasil diupload`)
}

async function onDrop(e) {
  dragging.value = false
  const fileList = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
  if (fileList.length) await uploadFiles(fileList)
}

async function onFileInput(e) {
  const fileList = Array.from(e.target.files)
  if (fileList.length) await uploadFiles(fileList)
  e.target.value = ''
}

async function loadFiles() {
  loading.value = true
  try { files.value = await uploadApi.listFiles() } catch {}
  loading.value = false
}

onMounted(loadFiles)
</script>

<style scoped>
.admin-media { display: flex; flex-direction: column; gap: 1.5rem; }

/* Upload zone */
.upload-zone {
  border: 2px dashed rgba(255,255,255,0.1);
  border-radius: 16px;
  transition: all 0.2s;
}
.upload-zone.dragging {
  border-color: #A78BFA;
  background: rgba(167,139,250,0.06);
}
.upload-label {
  display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
  padding: 2.5rem; cursor: pointer;
}
.upload-icon { color: #404040; }
.upload-text { font-size: 0.9375rem; color: #a0a0a0; }
.upload-browse { color: #A78BFA; }
.upload-hint { font-size: 0.8125rem; color: #404040; }
.hidden-input { display: none; }

/* Progress */
.upload-progress-bar {
  height: 4px; background: rgba(255,255,255,0.06);
  border-radius: 100px; overflow: hidden; position: relative;
}
.progress-fill { height: 100%; background: #A78BFA; border-radius: 100px; transition: width 0.3s; }
.progress-text { position: absolute; top: 8px; right: 0; font-size: 0.75rem; color: #A78BFA; }

/* Controls */
.media-controls { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.file-count { font-size: 0.875rem; color: #606060; }
.controls-right { display: flex; gap: 0.75rem; align-items: center; }
.search-input {
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px; padding: 8px 14px; font-size: 0.875rem; color: #f0f0f0;
  outline: none; width: 220px; transition: border-color 0.2s;
}
.search-input:focus { border-color: #A78BFA; }
.search-input::placeholder { color: #404040; }

/* Loading & empty */
.loading-state { display: flex; align-items: center; gap: 1rem; padding: 3rem; color: #606060; }
.spinner { width: 24px; height: 24px; border: 2px solid rgba(255,255,255,0.1); border-top-color: #A78BFA; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 4rem; color: #404040; }

/* Media grid */
.media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }

.media-card {
  border-radius: 12px; overflow: hidden;
  background: rgba(255,255,255,0.04);
  border: 2px solid transparent;
  cursor: pointer; transition: all 0.2s;
}
.media-card:hover { border-color: rgba(255,255,255,0.15); }
.media-card.selected { border-color: #A78BFA; }

.media-img-wrap { position: relative; aspect-ratio: 1; overflow: hidden; }
.media-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s; }
.media-card:hover .media-img-wrap img { transform: scale(1.05); }

.media-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: flex-end; justify-content: flex-end;
  gap: 6px; padding: 8px;
  opacity: 0; transition: opacity 0.2s;
}
.media-card:hover .media-overlay { opacity: 1; }

.copy-url-btn, .delete-file-btn {
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 8px; border: none; cursor: pointer; transition: all 0.2s;
}
.copy-url-btn { background: rgba(255,255,255,0.15); color: #fff; }
.copy-url-btn:hover { background: rgba(255,255,255,0.3); }
.delete-file-btn { background: rgba(248,113,113,0.2); color: #F87171; }
.delete-file-btn:hover { background: rgba(248,113,113,0.4); }

.selected-check {
  position: absolute; top: 8px; left: 8px;
  width: 22px; height: 22px; border-radius: 50%;
  background: #A78BFA; color: #0a0a0a;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; font-weight: 700;
}

.media-info { padding: 8px 10px; }
.media-name { display: block; font-size: 0.7rem; color: #a0a0a0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
.media-size { font-size: 0.65rem; color: #404040; }

/* Toast */
.toast {
  position: fixed; bottom: 2rem; right: 2rem;
  padding: 12px 20px; border-radius: 12px;
  font-size: 0.875rem; font-weight: 500;
  z-index: 9999; box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}
.toast.success { background: rgba(52,211,153,0.15); border: 1px solid rgba(52,211,153,0.3); color: #34D399; }
.toast.error { background: rgba(248,113,113,0.15); border: 1px solid rgba(248,113,113,0.3); color: #F87171; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
</style>
