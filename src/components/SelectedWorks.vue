<template>
  <section class="section selected-works" id="works">
    <!-- Background -->
    <div class="works-bg" aria-hidden="true">
      <div class="glow glow-left"></div>
      <div class="glow glow-right"></div>
    </div>

    <div class="container">
      <!-- Header: rata tengah -->
      <header class="works-header">
        <div class="works-label">
          <span class="label-line"></span>
          <span>Selected Works</span>
          <span class="label-line"></span>
        </div>

        <h2 class="works-title">
          Karya <span class="title-outline">Pilihan</span><span class="title-dot">.</span>
        </h2>

        <p class="works-subtitle">
          Kurasi proyek terbaik — dari bidikan kamera sampai identitas visual.
        </p>
      </header>

      <!-- Grid: pola cermin (1 · 2 · 1) di setiap baris -->
      <div class="works-grid" ref="gridEl" :class="{ 'in-view': inView }">
        <WorkCard
          v-for="(work, i) in featuredWorks"
          :key="work.id"
          :work="work"
          :class="getCardClass(i)"
        />
      </div>

      <!-- Footer: CTA di tengah -->
      <footer class="works-footer">
        <span class="works-count">{{ String(featuredWorks.length).padStart(2, '0') }} proyek pilihan</span>
        <router-link to="/gallery/photography" class="btn btn-outline view-all-link" id="selected-works-view-all">
          Lihat Semua Karya
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </router-link>
      </footer>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import works from '@/data/works.json'
import WorkCard from './WorkCard.vue'

const featuredWorks = works.filter(w => w.featured).slice(0, 6)

const gridEl = ref(null)
const inView = ref(false)
let observer = null

// Baris 1: kecil · lebar · kecil — Baris 2: kecil · lebar · kecil (simetris kiri-kanan)
function getCardClass(index) {
  return index % 3 === 1 ? 'card-wide' : ''
}

onMounted(() => {
  if (!('IntersectionObserver' in window) || !gridEl.value) {
    inView.value = true
    return
  }
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        inView.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.12 }
  )
  observer.observe(gridEl.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<style scoped>
.selected-works {
  position: relative;
  background: var(--bg);
  overflow: hidden;
}

/* ---------- Background ---------- */
.works-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.glow {
  position: absolute;
  width: 36vw;
  height: 36vw;
  max-width: 520px;
  max-height: 520px;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.4;
}
.glow-left {
  top: 8%;
  left: -10%;
  background: radial-gradient(circle, rgba(167, 139, 250, 0.4), transparent 65%);
}
.glow-right {
  top: 8%;
  right: -10%;
  background: radial-gradient(circle, rgba(244, 114, 182, 0.35), transparent 65%);
}

.container {
  position: relative;
  z-index: 1;
}

/* ---------- Header ---------- */
.works-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: clamp(2.5rem, 6vw, 4rem);
}

.works-label {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 1.25rem;
}

.label-line {
  display: block;
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent));
}
.label-line:last-child {
  background: linear-gradient(270deg, transparent, var(--accent));
}

.works-title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 7vw, 5.5rem);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1;
  color: var(--text-primary);
  margin-bottom: 1.25rem;
}

.title-outline {
  color: transparent;
  -webkit-text-stroke: 1.5px var(--text-primary);
}

.title-dot {
  color: var(--accent);
}

.works-subtitle {
  max-width: 480px;
  font-size: clamp(0.95rem, 1.6vw, 1.1rem);
  line-height: 1.7;
  color: var(--text-secondary);
}

/* ---------- Grid ---------- */
.works-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: clamp(240px, 26vw, 340px);
  gap: 1.25rem;
}

.card-wide {
  grid-column: span 2;
}

/* Paksa kartu mengisi sel grid agar tinggi tiap baris seragam */
.works-grid > * {
  height: 100%;
  min-height: 0;
  border-radius: 20px;
  overflow: hidden;
  transition:
    opacity 0.7s ease,
    transform 0.8s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.4s ease;
}

.works-grid > *:hover {
  transform: translateY(-6px);
  box-shadow: 0 30px 60px -25px rgba(167, 139, 250, 0.35);
}

/* Reveal bertahap dari tengah keluar: kartu tengah dulu, lalu sisi kiri-kanan */
.works-grid:not(.in-view) > * {
  opacity: 0;
  transform: translateY(32px);
}
.works-grid.in-view > *:nth-child(3n + 2) { transition-delay: 0s; }
.works-grid.in-view > *:nth-child(3n + 1),
.works-grid.in-view > *:nth-child(3n) { transition-delay: 0.12s; }
.works-grid.in-view > *:nth-child(n + 4):nth-child(3n + 2) { transition-delay: 0.24s; }
.works-grid.in-view > *:nth-child(n + 4):nth-child(3n + 1),
.works-grid.in-view > *:nth-child(n + 4):nth-child(3n) { transition-delay: 0.36s; }

/* ---------- Footer ---------- */
.works-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: clamp(2.5rem, 6vw, 3.5rem);
}

.works-count {
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  white-space: nowrap;
  transition: gap var(--transition);
}
.view-all-link:hover {
  gap: 14px;
}

/* ---------- Responsive ---------- */
@media (max-width: 1024px) {
  /* 2 kolom, semua kartu sama besar → 3 baris × 2 kolom */
  .works-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .card-wide {
    grid-column: span 1;
  }
}

@media (max-width: 640px) {
  .works-grid {
    grid-template-columns: 1fr;
    grid-auto-rows: clamp(220px, 62vw, 300px);
  }
  .label-line { width: 24px; }
  .works-label { font-size: 0.6875rem; letter-spacing: 0.08em; }
}

@media (prefers-reduced-motion: reduce) {
  .works-grid > * { transition: none; }
  .works-grid:not(.in-view) > * { opacity: 1; transform: none; }
}
</style>