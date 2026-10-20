<template>
  <main class="gallery-page">
    <div class="gallery-hero">
      <div class="container">
        <router-link to="/" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Kembali
        </router-link>
        <div class="section-label">{{ categoryInfo.title }}</div>
        <h1 class="gallery-title">{{ categoryInfo.title }}<span class="text-accent">.</span></h1>
        <p class="gallery-subtitle">{{ categoryInfo.description }}</p>
      </div>
    </div>

    <div class="container gallery-content">
      <!-- Filter by origin -->
      <div class="gallery-filters">
        <button
          v-for="f in filters"
          :key="f.value"
          class="filter-btn"
          :class="{ active: activeFilter === f.value }"
          @click="activeFilter = f.value"
          :id="`filter-${f.value}`"
        >
          {{ f.label }}
        </button>
      </div>

      <!-- Grid -->
      <div v-if="filteredWorks.length > 0" class="gallery-grid" :class="isVideo ? 'video-grid' : 'photo-grid'">
        <!-- Photo / Design cards -->
        <template v-if="!isVideo">
          <div
            v-for="work in filteredWorks"
            :key="work.id"
            class="gallery-item"
            @click="openLightbox(work)"
            :id="`gallery-item-${work.id}`"
          >
            <div class="gallery-item-img-wrap">
              <img :src="work.cover" :alt="work.title" loading="lazy" class="gallery-item-img" />
              <div class="gallery-item-overlay">
                <span class="gallery-item-title">{{ work.title }}</span>
                <span :class="`badge badge-${work.origin}`">{{ work.origin }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- Video cards -->
        <template v-else>
          <router-link
            v-for="work in filteredWorks"
            :key="work.id"
            :to="`/project/${work.id}`"
            class="video-card"
            :id="`video-card-${work.id}`"
          >
            <div class="video-thumb">
              <img :src="work.cover" :alt="work.title" loading="lazy" />
              <div class="play-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </div>
            </div>
            <div class="video-info">
              <span :class="`badge badge-${work.origin}`">{{ work.origin }}</span>
              <h3 class="video-title">{{ work.title }}</h3>
              <p class="video-meta">{{ work.role }} · {{ work.year }}</p>
            </div>
          </router-link>
        </template>
      </div>

      <div v-else class="gallery-empty">
        <p>Belum ada karya di kategori ini.</p>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div v-if="lightbox.open" class="lightbox" @click.self="closeLightbox" role="dialog" aria-modal="true" id="lightbox-modal">
        <div class="lightbox-inner">
          <button class="lightbox-close" @click="closeLightbox" aria-label="Tutup lightbox" id="lightbox-close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>

          <button v-if="canGoPrev" class="lightbox-nav lightbox-prev" @click="prevItem" aria-label="Sebelumnya" id="lightbox-prev-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>

          <img
            v-if="lightbox.work"
            :src="lightbox.work.media[lightbox.mediaIndex]?.src || lightbox.work.cover"
            :alt="lightbox.work.title"
            class="lightbox-img"
          />

          <button v-if="canGoNext" class="lightbox-nav lightbox-next" @click="nextItem" aria-label="Berikutnya" id="lightbox-next-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>

          <div class="lightbox-info">
            <span class="lightbox-title">{{ lightbox.work?.title }}</span>
            <router-link :to="`/project/${lightbox.work?.id}`" class="lightbox-detail-link" id="lightbox-detail-link">
              Lihat Detail →
            </router-link>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import works from '@/data/works.json'
import services from '@/data/services.json'

const props = defineProps({ category: String })

const categoryInfo = computed(() =>
  services.find(s => s.slug === props.category) || { title: 'Gallery', description: '' }
)

const isVideo = computed(() => props.category === 'videography')

const categoryWorks = computed(() =>
  works.filter(w => w.category === props.category)
)

const filters = [
  { label: 'Semua', value: 'all' },
  { label: 'Personal', value: 'personal' },
  { label: 'Mementa', value: 'mementa' },
  { label: '404', value: '404' }
]

const activeFilter = ref('all')

const filteredWorks = computed(() => {
  if (activeFilter.value === 'all') return categoryWorks.value
  return categoryWorks.value.filter(w => w.origin === activeFilter.value)
})

// Lightbox
const lightbox = ref({ open: false, work: null, mediaIndex: 0 })

const canGoPrev = computed(() => lightbox.value.mediaIndex > 0)
const canGoNext = computed(() => {
  const imgs = lightbox.value.work?.media?.filter(m => m.type === 'image') || []
  return lightbox.value.mediaIndex < imgs.length - 1
})

function openLightbox(work) {
  lightbox.value = { open: true, work, mediaIndex: 0 }
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightbox.value.open = false
  document.body.style.overflow = ''
}

function prevItem() { if (canGoPrev.value) lightbox.value.mediaIndex-- }
function nextItem() { if (canGoNext.value) lightbox.value.mediaIndex++ }

function handleKey(e) {
  if (!lightbox.value.open) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') prevItem()
  if (e.key === 'ArrowRight') nextItem()
}

onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => {
  window.removeEventListener('keydown', handleKey)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.gallery-page {
  padding-top: var(--navbar-h);
  min-height: 100vh;
}

/* Hero */
.gallery-hero {
  padding: clamp(3rem, 6vw, 5rem) 0 clamp(2rem, 4vw, 3rem);
  background: var(--bg);
  border-bottom: 1px solid var(--border);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: var(--text-muted);
  text-decoration: none;
  margin-bottom: 1.5rem;
  transition: color var(--transition);
}

.back-link:hover { color: var(--text-primary); }

.gallery-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  margin-bottom: 1rem;
}

.gallery-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 480px;
}

/* Content */
.gallery-content {
  padding-top: 3rem;
  padding-bottom: 6rem;
}

/* Filters */
.gallery-filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 20px;
  border-radius: 100px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--surface);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all var(--transition);
}

.filter-btn:hover,
.filter-btn.active {
  background: var(--accent);
  color: #0a0a0a;
  border-color: var(--accent);
  font-weight: 600;
}

/* Photo grid - masonry-like */
.photo-grid {
  columns: 3;
  gap: 1rem;
}

.photo-grid .gallery-item {
  break-inside: avoid;
  margin-bottom: 1rem;
}

/* Video grid */
.video-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

/* Gallery item */
.gallery-item {
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
}

.gallery-item-img-wrap {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
}

.gallery-item-img {
  width: 100%;
  display: block;
  transition: transform var(--transition-slow);
}

.gallery-item:hover .gallery-item-img {
  transform: scale(1.04);
}

.gallery-item-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 6px;
  opacity: 0;
  transition: opacity var(--transition);
}

.gallery-item:hover .gallery-item-overlay {
  opacity: 1;
}

.gallery-item-title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: white;
}

/* Video card */
.video-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-decoration: none;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--surface);
  border: 1px solid var(--border);
  transition: all var(--transition);
}

.video-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--border-hover);
}

.video-thumb {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
  background: var(--bg-3);
}

.video-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.video-card:hover .video-thumb img {
  transform: scale(1.04);
}

.play-btn {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: rgba(0,0,0,0.3);
  transition: background var(--transition);
}

.play-btn svg {
  width: 48px;
  height: 48px;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5));
  transition: transform var(--transition);
}

.video-card:hover .play-btn { background: rgba(0,0,0,0.1); }
.video-card:hover .play-btn svg { transform: scale(1.1); }

.video-info {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.video-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.video-meta {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

/* Empty */
.gallery-empty {
  text-align: center;
  padding: 4rem;
  color: var(--text-muted);
}

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-inner {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-img {
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: var(--radius-md);
}

.lightbox-close {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  width: 48px;
  height: 48px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all var(--transition);
  z-index: 10000;
}

.lightbox-close:hover {
  background: rgba(255,255,255,0.2);
}

.lightbox-nav {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 52px;
  height: 52px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all var(--transition);
  z-index: 10000;
}

.lightbox-nav:hover {
  background: rgba(255,255,255,0.25);
}

.lightbox-prev { left: 1.5rem; }
.lightbox-next { right: 1.5rem; }

.lightbox-info {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 100px;
  padding: 10px 20px;
}

.lightbox-title {
  color: white;
  font-size: 0.9375rem;
  font-weight: 500;
}

.lightbox-detail-link {
  color: var(--accent);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
}

@media (max-width: 768px) {
  .photo-grid { columns: 2; }
  .video-grid { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .photo-grid { columns: 1; }
}
</style>
