<template>
  <div class="admin-profile">
    <!-- Tabs -->
    <div class="profile-tabs">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'hero' }"
        @click="activeTab = 'hero'"
        id="tab-hero"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Hero Section
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'about' }"
        @click="activeTab = 'about'"
        id="tab-about"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        About Me
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div><span>Memuat profil...</span>
    </div>

    <!-- ─── HERO TAB ──────────────────────────────────────────── -->
    <div v-else-if="activeTab === 'hero'" class="tab-content">
      <div class="form-layout">
        <!-- Left: Form fields -->
        <div class="form-main">

          <!-- Preview card -->
          <div class="preview-card">
            <div class="preview-label">Preview Hero</div>
            <div class="preview-hero">
              <div class="ph-photo-wrap">
                <img :src="hero.photo" alt="Hero photo" class="ph-photo" />
              </div>
              <div class="ph-info">
                <div class="ph-name">{{ hero.firstName }}<span class="ph-dot">.</span></div>
                <div class="ph-roles">{{ (hero.roles || []).join(' · ') }}</div>
                <div class="ph-tagline">{{ hero.tagline }}</div>
                <div class="ph-avail" :class="{ on: hero.isAvailable }">
                  <span class="avail-dot"></span>
                  {{ hero.availabilityText || 'Available for projects' }}
                </div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-label">Identitas</h3>

            <div class="field-row">
              <div class="field">
                <label for="hero-firstname">Nama Depan (Besar)</label>
                <input v-model="hero.firstName" id="hero-firstname" type="text" placeholder="Saiynuddin" />
              </div>
            </div>

            <div class="field">
              <label for="hero-roles">Peran <span class="field-hint">(pisahkan dengan koma)</span></label>
              <input v-model="rolesInput" id="hero-roles" type="text" placeholder="Fotografer, Videografer, Desainer, Editor" />
            </div>

            <div class="field-row">
              <div class="field">
                <label for="hero-agency1">Agency Kiri</label>
                <input v-model="hero.agency1" id="hero-agency1" type="text" placeholder="Mementa" />
              </div>
              <div class="field">
                <label for="hero-agency2">Agency Kanan</label>
                <input v-model="hero.agency2" id="hero-agency2" type="text" placeholder="404" />
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-label">Tagline & Status</h3>

            <div class="field">
              <label for="hero-tagline">Tagline <span class="field-hint">(gunakan Enter untuk baris baru)</span></label>
              <textarea v-model="hero.tagline" id="hero-tagline" rows="3" placeholder="Membekukan momen. Merancang identitas.&#10;Bercerita melalui gambar dan gerak."></textarea>
            </div>

            <div class="field-row">
              <div class="field-check">
                <input type="checkbox" v-model="hero.isAvailable" id="hero-available" />
                <label for="hero-available">Tampilkan badge Available</label>
              </div>
              <div class="field" style="flex:1">
                <label for="hero-avail-text">Teks Badge</label>
                <input v-model="hero.availabilityText" id="hero-avail-text" type="text" placeholder="Available for projects" :disabled="!hero.isAvailable" />
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-label">Foto Hero</h3>
            <div class="field">
              <label for="hero-photo">URL Foto</label>
              <div class="url-input-row">
                <input v-model="hero.photo" id="hero-photo" type="url" placeholder="https://..." />
                <button type="button" class="btn-pick" @click="openPicker" id="pick-hero-photo-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  Pilih dari Library
                </button>
              </div>
            </div>
            <div class="photo-preview" v-if="hero.photo">
              <img :src="hero.photo" alt="preview" />
            </div>
          </div>

          <div class="form-section">
            <div class="section-row">
              <h3 class="section-label">Statistik</h3>
              <button type="button" class="btn-add-sm" @click="addStat" id="add-stat-btn">+ Tambah</button>
            </div>

            <div class="stats-editor">
              <div v-for="(stat, idx) in (hero.stats || [])" :key="idx" class="stat-row" :id="`stat-row-${idx}`">
                <div class="field">
                  <label>Nilai</label>
                  <input v-model.number="stat.value" type="number" :id="`stat-value-${idx}`" />
                </div>
                <div class="field field-sm">
                  <label>Suffix</label>
                  <input v-model="stat.suffix" type="text" :id="`stat-suffix-${idx}`" placeholder="+" />
                </div>
                <div class="field" style="flex:2">
                  <label>Label</label>
                  <input v-model="stat.label" type="text" :id="`stat-label-${idx}`" placeholder="Project Selesai" />
                </div>
                <button type="button" class="rm-btn" @click="removeStat(idx)" :id="`rm-stat-${idx}`">✕</button>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-label">Marquee Items <span class="field-hint">(teks berjalan)</span></h3>
            <div class="field">
              <label for="hero-marquee">Items <span class="field-hint">(pisahkan dengan koma)</span></label>
              <input v-model="marqueeInput" id="hero-marquee" type="text" placeholder="Fotografi, Videografi, Desain Grafis..." />
            </div>
            <div class="marquee-preview">
              <span v-for="item in (hero.marqueeItems || [])" :key="item" class="marquee-tag">{{ item }} ✦</span>
            </div>
          </div>
        </div>

        <!-- Right sidebar -->
        <div class="form-sidebar">
          <div class="submit-panel">
            <h3 class="section-label">Simpan Hero</h3>
            <p class="panel-hint">Perubahan akan langsung tercermin di homepage setelah disimpan.</p>
            <div class="success-msg" v-if="heroSuccess">✓ Hero section diperbarui!</div>
            <div class="error-msg" v-if="heroError">{{ heroError }}</div>
            <button class="btn-publish" @click="saveHero" id="save-hero-btn" :disabled="savingHero">
              {{ savingHero ? 'Menyimpan...' : 'Simpan Hero Section' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── ABOUT TAB ──────────────────────────────────────────── -->
    <div v-else-if="activeTab === 'about'" class="tab-content">
      <div class="form-layout">
        <div class="form-main">

          <!-- Preview -->
          <div class="preview-card">
            <div class="preview-label">Preview About</div>
            <div class="preview-about">
              <div class="pa-photo-wrap">
                <img :src="about.photo" alt="About photo" class="pa-photo" />
                <div class="pa-exp-badge">
                  <span class="exp-n">{{ about.yearsExperience || '5+' }}</span>
                  <span class="exp-l">Tahun<br />Berkarya</span>
                </div>
              </div>
              <div class="pa-info">
                <div class="pa-heading">
                  {{ about.heading }}
                  <span class="pa-accent"> {{ about.headingAccent }}</span>
                  {{ about.headingSuffix }}
                </div>
                <div class="pa-bio" v-for="(p, i) in (about.bio || [])" :key="i" v-html="p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')"></div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-label">Heading</h3>
            <div class="field-row">
              <div class="field" style="flex:2">
                <label for="about-heading">Teks Heading</label>
                <input v-model="about.heading" id="about-heading" type="text" placeholder="Kreator dengan" />
              </div>
              <div class="field" style="flex:2">
                <label for="about-heading-accent">Bagian Berwarna (Accent)</label>
                <input v-model="about.headingAccent" id="about-heading-accent" type="text" placeholder="visi visual" />
              </div>
              <div class="field" style="flex:2">
                <label for="about-heading-suffix">Suffix</label>
                <input v-model="about.headingSuffix" id="about-heading-suffix" type="text" placeholder="yang kuat." />
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-label">Foto & Pengalaman</h3>
            <div class="field">
              <label for="about-photo">URL Foto About</label>
              <div class="url-input-row">
                <input v-model="about.photo" id="about-photo" type="url" placeholder="https://..." />
                <button type="button" class="btn-pick" @click="openPickerAbout" id="pick-about-photo-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  Library
                </button>
              </div>
            </div>
            <div class="field field-sm">
              <label for="about-exp">Tahun Pengalaman</label>
              <input v-model="about.yearsExperience" id="about-exp" type="text" placeholder="5+" style="max-width:100px" />
            </div>
          </div>

          <div class="form-section">
            <div class="section-row">
              <h3 class="section-label">Bio Paragraf</h3>
              <button type="button" class="btn-add-sm" @click="addBio" id="add-bio-btn">+ Tambah Paragraf</button>
            </div>
            <p class="field-hint" style="margin-bottom:0.75rem">Gunakan **teks** untuk teks tebal</p>
            <div v-for="(para, idx) in (about.bio || [])" :key="idx" class="bio-row">
              <textarea v-model="about.bio[idx]" rows="3" :id="`bio-para-${idx}`" :placeholder="`Paragraf ${idx + 1}...`"></textarea>
              <button type="button" class="rm-btn" @click="removeBio(idx)" :id="`rm-bio-${idx}`">✕</button>
            </div>
          </div>

          <div class="form-section">
            <div class="section-row">
              <h3 class="section-label">Keahlian & Tools</h3>
              <button type="button" class="btn-add-sm" @click="addSkillGroup" id="add-skill-group-btn">+ Tambah Grup</button>
            </div>

            <div v-for="(group, gi) in (about.skillGroups || [])" :key="gi" class="skill-group-editor" :id="`skill-group-${gi}`">
              <div class="sg-header">
                <input v-model="group.name" type="text" placeholder="Photography" class="sg-name" :id="`sg-name-${gi}`" />
                <button type="button" class="rm-btn" @click="removeSkillGroup(gi)" :id="`rm-sg-${gi}`">✕</button>
              </div>
              <div class="sg-skills">
                <div v-for="(skill, si) in group.skills" :key="si" class="sg-skill-row">
                  <input v-model="group.skills[si]" type="text" :id="`skill-${gi}-${si}`" placeholder="Adobe Lightroom" />
                  <button type="button" class="rm-btn-sm" @click="group.skills.splice(si, 1)" :id="`rm-skill-${gi}-${si}`">✕</button>
                </div>
                <button type="button" class="btn-add-skill" @click="group.skills.push('')" :id="`add-skill-${gi}`">+ Tambah Skill</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="form-sidebar">
          <div class="submit-panel">
            <h3 class="section-label">Simpan About</h3>
            <p class="panel-hint">Perubahan akan tercermin di section About Me di homepage.</p>
            <div class="success-msg" v-if="aboutSuccess">✓ About section diperbarui!</div>
            <div class="error-msg" v-if="aboutError">{{ aboutError }}</div>
            <button class="btn-publish" @click="saveAbout" id="save-about-btn" :disabled="savingAbout">
              {{ savingAbout ? 'Menyimpan...' : 'Simpan About Me' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Media Picker Modal -->
    <div v-if="pickerOpen" class="modal-overlay" @click.self="pickerOpen = false">
      <div class="media-picker-modal" id="profile-media-picker">
        <div class="mp-header">
          <h3>Pilih Gambar</h3>
          <button @click="pickerOpen = false" class="mp-close" id="mp-close">✕</button>
        </div>
        <div class="mp-upload-zone">
          <label for="mp-upload" class="upload-label" id="mp-upload-label">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span>Upload gambar baru</span>
            <input type="file" id="mp-upload" accept="image/*" @change="uploadFromInput" class="hidden-input" />
          </label>
          <span v-if="uploading" class="upload-hint" style="color:#A78BFA">Mengupload...</span>
        </div>
        <div class="mp-grid">
          <div
            v-for="file in mediaFiles"
            :key="file.filename"
            class="mp-file"
            @click="selectFromPicker(file.url)"
            :id="`mp-pick-${file.filename}`"
          >
            <img :src="`${apiBase}${file.url}`" :alt="file.filename" />
          </div>
          <div v-if="mediaFiles.length === 0" class="mp-empty">Belum ada gambar</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { profileApi, uploadApi, API_BASE } from '@/services/api.js'
const apiBase = API_BASE

const activeTab = ref('hero')
const loading = ref(true)

// Hero state
const hero = reactive({
  firstName: '', tagline: '', availabilityText: 'Available for projects',
  isAvailable: true, photo: '', roles: [], agency1: 'Mementa', agency2: '404',
  stats: [], marqueeItems: []
})
const savingHero = ref(false)
const heroSuccess = ref(false)
const heroError = ref('')

// About state
const about = reactive({
  photo: '', heading: '', headingAccent: '', headingSuffix: '',
  yearsExperience: '5+', bio: [], skillGroups: []
})
const savingAbout = ref(false)
const aboutSuccess = ref(false)
const aboutError = ref('')

// Media picker
const pickerOpen = ref(false)
const pickerTarget = ref('hero') // 'hero' | 'about'
const mediaFiles = ref([])
const uploading = ref(false)

// Computed two-way bindings for comma-separated fields
const rolesInput = computed({
  get: () => (hero.roles || []).join(', '),
  set: v => { hero.roles = v.split(',').map(s => s.trim()).filter(Boolean) }
})

const marqueeInput = computed({
  get: () => (hero.marqueeItems || []).join(', '),
  set: v => { hero.marqueeItems = v.split(',').map(s => s.trim()).filter(Boolean) }
})

// Stat helpers
function addStat() { hero.stats.push({ value: 0, suffix: '+', label: '' }) }
function removeStat(idx) { hero.stats.splice(idx, 1) }

// Bio helpers
function addBio() { about.bio.push('') }
function removeBio(idx) { about.bio.splice(idx, 1) }

// Skill group helpers
function addSkillGroup() { about.skillGroups.push({ name: '', skills: [] }) }
function removeSkillGroup(gi) { about.skillGroups.splice(gi, 1) }

// Save hero
async function saveHero() {
  heroError.value = ''
  heroSuccess.value = false
  savingHero.value = true
  try {
    await profileApi.updateHero({ ...hero })
    heroSuccess.value = true
    setTimeout(() => { heroSuccess.value = false }, 3500)
  } catch (e) {
    heroError.value = 'Gagal menyimpan: ' + e.message
  } finally {
    savingHero.value = false
  }
}

// Save about
async function saveAbout() {
  aboutError.value = ''
  aboutSuccess.value = false
  savingAbout.value = true
  try {
    await profileApi.updateAbout({ ...about })
    aboutSuccess.value = true
    setTimeout(() => { aboutSuccess.value = false }, 3500)
  } catch (e) {
    aboutError.value = 'Gagal menyimpan: ' + e.message
  } finally {
    savingAbout.value = false
  }
}

// Media picker
async function openPicker() {
  pickerTarget.value = 'hero'
  pickerOpen.value = true
  try { mediaFiles.value = (await uploadApi.listFiles()).filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f.filename)) }
  catch { mediaFiles.value = [] }
}
async function openPickerAbout() {
  pickerTarget.value = 'about'
  pickerOpen.value = true
  try { mediaFiles.value = (await uploadApi.listFiles()).filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f.filename)) }
  catch { mediaFiles.value = [] }
}

function selectFromPicker(url) {
  const full = `${apiBase}${url}`
  if (pickerTarget.value === 'hero') hero.photo = full
  else about.photo = full
  pickerOpen.value = false
}

async function uploadFromInput(e) {
  const file = e.target.files[0]
  if (!file) return
  uploading.value = true
  try {
    const res = await uploadApi.uploadImage(file)
    mediaFiles.value.unshift(res)
    selectFromPicker(res.url)
  } catch (err) {
    alert('Upload gagal: ' + err.message)
  } finally {
    uploading.value = false
  }
}

// Load data
onMounted(async () => {
  try {
    const data = await profileApi.getAll()
    if (data.hero) Object.assign(hero, data.hero)
    if (data.about) Object.assign(about, data.about)
  } catch (e) {
    heroError.value = 'Server offline — memuat dari data lokal'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.admin-profile { display: flex; flex-direction: column; gap: 1.5rem; }

/* Tabs */
.profile-tabs { display: flex; gap: 4px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 4px; width: fit-content; }
.tab-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 20px; border-radius: 9px; border: none;
  font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 600;
  cursor: pointer; color: #606060; background: none; transition: all 0.2s;
}
.tab-btn:hover { color: #f0f0f0; }
.tab-btn.active { background: rgba(167,139,250,0.15); color: #A78BFA; }

/* Loading */
.loading-state { display: flex; align-items: center; gap: 1rem; padding: 3rem; color: #606060; }
.spinner { width: 24px; height: 24px; border: 2px solid rgba(255,255,255,0.1); border-top-color: #A78BFA; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Tab content */
.tab-content { display: flex; flex-direction: column; gap: 1.25rem; }
.form-layout { display: grid; grid-template-columns: 1fr 280px; gap: 1.5rem; align-items: start; }
.form-main { display: flex; flex-direction: column; gap: 1.25rem; }

/* Preview card */
.preview-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(167,139,250,0.15); border-radius: 14px; padding: 1.25rem; }
.preview-label { font-size: 0.7rem; font-weight: 700; color: #A78BFA; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem; }
.preview-hero { display: flex; gap: 1.25rem; align-items: center; }
.ph-photo-wrap { width: 80px; height: 100px; border-radius: 12px; overflow: hidden; flex-shrink: 0; }
.ph-photo { width: 100%; height: 100%; object-fit: cover; }
.ph-info { flex: 1; }
.ph-name { font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 800; color: #f0f0f0; letter-spacing: -0.04em; }
.ph-dot { color: #A78BFA; }
.ph-roles { font-size: 0.75rem; color: #606060; margin: 4px 0; text-transform: uppercase; letter-spacing: 0.05em; }
.ph-tagline { font-size: 0.875rem; color: #a0a0a0; line-height: 1.5; margin-bottom: 8px; }
.ph-avail { display: inline-flex; align-items: center; gap: 6px; font-size: 0.75rem; color: #606060; }
.ph-avail.on { color: #34D399; }
.avail-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

.preview-about { display: flex; gap: 1.25rem; align-items: flex-start; }
.pa-photo-wrap { position: relative; width: 90px; flex-shrink: 0; }
.pa-photo { width: 90px; height: 112px; object-fit: cover; border-radius: 12px; display: block; }
.pa-exp-badge { position: absolute; bottom: -8px; right: -8px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 4px 8px; display: flex; align-items: center; gap: 6px; }
.exp-n { font-family: 'Outfit', sans-serif; font-size: 1rem; font-weight: 800; color: #A78BFA; }
.exp-l { font-size: 0.6rem; color: #a0a0a0; line-height: 1.3; }
.pa-info { flex: 1; }
.pa-heading { font-family: 'Outfit', sans-serif; font-size: 1rem; font-weight: 700; color: #f0f0f0; line-height: 1.4; margin-bottom: 0.5rem; }
.pa-accent { color: #A78BFA; }
.pa-bio { font-size: 0.8125rem; color: #a0a0a0; line-height: 1.6; margin-bottom: 4px; }

/* Form section */
.form-section { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.section-label { font-family: 'Outfit', sans-serif; font-size: 0.8rem; font-weight: 700; color: #A78BFA; text-transform: uppercase; letter-spacing: 0.08em; }
.section-row { display: flex; align-items: center; justify-content: space-between; }
.field { display: flex; flex-direction: column; gap: 0.4rem; flex: 1; }
.field-row { display: flex; gap: 1rem; }
.field-sm { max-width: 140px; }
.field label { font-size: 0.8125rem; font-weight: 600; color: #a0a0a0; }
.field-hint { font-weight: 400; color: #606060; font-size: 0.75rem; }
.field input, .field textarea, .field select {
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px; padding: 10px 12px; font-family: 'Inter', sans-serif;
  font-size: 0.875rem; color: #f0f0f0; outline: none; transition: border-color 0.2s; width: 100%;
}
.field input:focus, .field textarea:focus { border-color: #A78BFA; }
.field input::placeholder, .field textarea::placeholder { color: #404040; }
.field input:disabled { opacity: 0.4; }
.field textarea { resize: vertical; }
.field-check { display: flex; align-items: center; gap: 10px; }
.field-check input[type="checkbox"] { width: 16px; height: 16px; accent-color: #A78BFA; cursor: pointer; flex-shrink: 0; }
.field-check label { font-size: 0.875rem; color: #a0a0a0; cursor: pointer; }

.url-input-row { display: flex; gap: 8px; }
.url-input-row input { flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 12px; font-size: 0.875rem; color: #f0f0f0; outline: none; }
.url-input-row input:focus { border-color: #A78BFA; }
.btn-pick { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; background: rgba(167,139,250,0.12); border: 1px solid rgba(167,139,250,0.25); border-radius: 10px; color: #A78BFA; font-size: 0.8rem; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
.btn-pick:hover { background: rgba(167,139,250,0.2); }

.photo-preview { border-radius: 10px; overflow: hidden; max-height: 200px; }
.photo-preview img { width: 100%; height: 200px; object-fit: cover; display: block; }

/* Stats editor */
.stats-editor { display: flex; flex-direction: column; gap: 0.75rem; }
.stat-row { display: flex; gap: 0.75rem; align-items: flex-end; }
.stat-row .field input { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 8px 10px; color: #f0f0f0; font-size: 0.875rem; outline: none; width: 100%; }

.btn-add-sm { padding: 6px 14px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #a0a0a0; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-add-sm:hover { background: rgba(255,255,255,0.1); color: #f0f0f0; }

.rm-btn { background: rgba(248,113,113,0.1); border: none; border-radius: 8px; color: #F87171; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.75rem; flex-shrink: 0; align-self: flex-end; }
.rm-btn:hover { background: rgba(248,113,113,0.2); }
.rm-btn-sm { background: rgba(248,113,113,0.1); border: none; border-radius: 6px; color: #F87171; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.65rem; flex-shrink: 0; }

/* Marquee preview */
.marquee-preview { display: flex; flex-wrap: wrap; gap: 6px; }
.marquee-tag { padding: 4px 10px; background: rgba(255,255,255,0.06); border-radius: 100px; font-size: 0.75rem; color: #a0a0a0; }

/* Bio rows */
.bio-row { display: flex; gap: 0.75rem; align-items: flex-start; }
.bio-row textarea { flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 12px; font-size: 0.875rem; color: #f0f0f0; outline: none; resize: vertical; width: 100%; font-family: 'Inter', sans-serif; line-height: 1.6; }
.bio-row textarea:focus { border-color: #A78BFA; }

/* Skill group editor */
.skill-group-editor { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; }
.sg-header { display: flex; gap: 0.75rem; align-items: center; }
.sg-name { flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(167,139,250,0.2); border-radius: 8px; padding: 8px 12px; font-size: 0.9rem; font-weight: 600; color: #A78BFA; outline: none; }
.sg-skills { display: flex; flex-direction: column; gap: 6px; }
.sg-skill-row { display: flex; gap: 6px; }
.sg-skill-row input { flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 7px 10px; font-size: 0.8125rem; color: #f0f0f0; outline: none; }
.btn-add-skill { align-self: flex-start; padding: 5px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: #606060; font-size: 0.75rem; cursor: pointer; transition: all 0.2s; }
.btn-add-skill:hover { color: #f0f0f0; }

/* Sidebar */
.form-sidebar { position: sticky; top: calc(64px + 2rem); }
.submit-panel { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.panel-hint { font-size: 0.8125rem; color: #606060; line-height: 1.6; }
.success-msg { padding: 10px 14px; background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.25); border-radius: 10px; color: #34D399; font-size: 0.8125rem; }
.error-msg { padding: 10px 14px; background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.25); border-radius: 10px; color: #F87171; font-size: 0.8125rem; }
.btn-publish { width: 100%; padding: 13px; background: #A78BFA; color: #0a0a0a; border: none; border-radius: 12px; font-family: 'Outfit', sans-serif; font-size: 0.9375rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn-publish:hover:not(:disabled) { background: #c4b5fd; }
.btn-publish:disabled { opacity: 0.6; cursor: not-allowed; }

/* Media picker modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem; }
.media-picker-modal { background: #141414; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; width: 100%; max-width: 640px; max-height: 80vh; display: flex; flex-direction: column; overflow: hidden; }
.mp-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.07); }
.mp-header h3 { font-family: 'Outfit', sans-serif; font-size: 1rem; font-weight: 700; color: #f0f0f0; }
.mp-close { background: rgba(255,255,255,0.08); border: none; border-radius: 8px; color: #a0a0a0; width: 28px; height: 28px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.mp-close:hover { background: rgba(255,255,255,0.15); }
.mp-upload-zone { padding: 1rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
.upload-label { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 1rem; border: 2px dashed rgba(255,255,255,0.1); border-radius: 10px; color: #606060; font-size: 0.875rem; cursor: pointer; transition: all 0.2s; }
.upload-label:hover { border-color: #A78BFA; color: #A78BFA; }
.upload-hint { font-size: 0.75rem; }
.hidden-input { display: none; }
.mp-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; padding: 1rem 1.5rem; overflow-y: auto; flex: 1; }
.mp-file { cursor: pointer; border-radius: 8px; overflow: hidden; border: 2px solid transparent; transition: all 0.2s; aspect-ratio: 1; }
.mp-file:hover { border-color: #A78BFA; }
.mp-file img { width: 100%; height: 100%; object-fit: cover; display: block; }
.mp-empty { grid-column: 1 / -1; text-align: center; padding: 2rem; color: #404040; font-size: 0.875rem; }

@media (max-width: 900px) { .form-layout { grid-template-columns: 1fr; } .form-sidebar { position: static; } }
</style>
