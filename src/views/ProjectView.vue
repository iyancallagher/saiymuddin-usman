<template>
  <main class="project-page" v-if="work">
    <div class="project-hero">
      <div class="project-hero-bg">
        <img :src="work.cover" :alt="work.title" class="project-hero-bg-img" />
        <div class="project-hero-overlay"></div>
      </div>
      <div class="container project-hero-content">
        <router-link :to="`/gallery/${work.category}`" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Kembali ke Galeri
        </router-link>
        <div class="project-meta-row">
          <span :class="`badge badge-${work.origin}`">{{ work.origin }}</span>
          <span class="project-year">{{ work.year }}</span>
        </div>
        <h1 class="project-title">{{ work.title }}</h1>
        <p class="project-desc">{{ work.description }}</p>
      </div>
    </div>

    <div class="container project-body">
      <!-- Project info -->
      <div class="project-info-grid">
        <div class="info-item">
          <span class="info-label">Klien</span>
          <span class="info-value">{{ work.client }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Peran</span>
          <span class="info-value">{{ work.role }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Kategori</span>
          <span class="info-value">{{ categoryLabel(work.category) }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Tahun</span>
          <span class="info-value">{{ work.year }}</span>
        </div>
        <div class="info-item" v-if="work.tags?.length">
          <span class="info-label">Tags</span>
          <div class="info-tags">
            <span class="skill-tag" v-for="tag in work.tags" :key="tag">{{ tag }}</span>
          </div>
        </div>
      </div>

      <!-- Media -->
      <div class="project-media">
        <div v-for="(item, i) in work.media" :key="i" class="media-item" :id="`media-item-${i}`">
          <!-- Image -->
          <img
            v-if="item.type === 'image'"
            :src="item.src"
            :alt="item.alt || work.title"
            loading="lazy"
            class="media-img"
          />

          <!-- Video embed -->
          <div v-else-if="item.type === 'video'" class="video-embed-wrap">
            <div class="video-embed" v-if="!playing[i]">
              <img :src="item.thumbnail || work.cover" :alt="work.title" class="video-embed-thumb" />
              <button class="video-play-btn" @click="playing[i] = true" :id="`play-video-${i}`">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </button>
            </div>
            <iframe
              v-else
              :src="`https://www.youtube.com/embed/${item.id}?autoplay=1`"
              :title="work.title"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              class="video-embed-frame"
            ></iframe>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="project-nav">
        <router-link v-if="prevWork" :to="`/project/${prevWork.id}`" class="project-nav-link" id="prev-project-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          <div class="nav-link-content">
            <span class="nav-link-label">Sebelumnya</span>
            <span class="nav-link-title">{{ prevWork.title }}</span>
          </div>
        </router-link>
        <div v-else></div>
        <router-link v-if="nextWork" :to="`/project/${nextWork.id}`" class="project-nav-link next" id="next-project-link">
          <div class="nav-link-content" style="text-align: right;">
            <span class="nav-link-label">Berikutnya</span>
            <span class="nav-link-title">{{ nextWork.title }}</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </router-link>
      </div>
    </div>
  </main>

  <!-- 404 state -->
  <main v-else class="not-found">
    <div class="container" style="text-align: center; padding: 8rem 0;">
      <h1 class="section-title">Project tidak ditemukan.</h1>
      <router-link to="/" class="btn btn-primary" style="margin-top: 2rem; display: inline-flex;">Kembali ke Home</router-link>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import works from '@/data/works.json'

const props = defineProps({ id: String })
const playing = ref({})

const work = computed(() => works.find(w => w.id === props.id))
const currentIndex = computed(() => works.findIndex(w => w.id === props.id))
const prevWork = computed(() => currentIndex.value > 0 ? works[currentIndex.value - 1] : null)
const nextWork = computed(() => currentIndex.value < works.length - 1 ? works[currentIndex.value + 1] : null)

function categoryLabel(cat) {
  const map = { photography: 'Photography', videography: 'Videography', 'graphic-design': 'Graphic Design', editing: 'Editing' }
  return map[cat] || cat
}
</script>

<style scoped>
.project-page {
  padding-top: var(--navbar-h);
  min-height: 100vh;
}

/* Hero */
.project-hero {
  position: relative;
  height: clamp(400px, 60vh, 600px);
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.project-hero-bg {
  position: absolute;
  inset: 0;
}

.project-hero-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(10, 10, 10, 0.3) 0%,
    rgba(10, 10, 10, 0.9) 100%
  );
}

.project-hero-content {
  position: relative;
  z-index: 1;
  padding-bottom: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  transition: color var(--transition);
  margin-bottom: 0.5rem;
}

.back-link:hover { color: white; }

.project-meta-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.project-year {
  font-size: 0.875rem;
  color: rgba(255,255,255,0.5);
}

.project-title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  color: white;
  line-height: 1.1;
}

.project-desc {
  font-size: 1.0625rem;
  color: rgba(255,255,255,0.7);
  max-width: 600px;
  line-height: 1.7;
}

/* Body */
.project-body {
  padding-top: 3rem;
  padding-bottom: 6rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* Info grid */
.project-info-grid {
  display: flex;
  gap: 2.5rem;
  padding: 2rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.info-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.info-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 2px;
}

.skill-tag {
  padding: 3px 10px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 100px;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Media */
.project-media {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.media-item { border-radius: var(--radius-lg); overflow: hidden; }

.media-img {
  width: 100%;
  display: block;
  border-radius: var(--radius-lg);
}

.video-embed-wrap {
  aspect-ratio: 16/9;
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: #000;
}

.video-embed {
  position: relative;
  width: 100%;
  height: 100%;
}

.video-embed-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7);
}

.video-play-btn {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent;
  border: none;
  transition: background var(--transition);
}

.video-play-btn:hover { background: rgba(0,0,0,0.2); }

.video-play-btn svg {
  width: 72px;
  height: 72px;
  filter: drop-shadow(0 8px 24px rgba(0,0,0,0.5));
  transition: transform var(--transition);
}

.video-play-btn:hover svg { transform: scale(1.1); }

.video-embed-frame {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
}

/* Navigation */
.project-nav {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
}

.project-nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: inherit;
  padding: 1.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  flex: 1;
  max-width: 280px;
  transition: all var(--transition);
}

.project-nav-link:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}

.project-nav-link.next { justify-content: flex-end; }

.nav-link-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-link-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.nav-link-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
}
</style>
