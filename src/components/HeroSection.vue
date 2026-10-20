<template>
  <section class="hero" id="hero">
    <!-- Background -->
    <div class="hero-bg" aria-hidden="true">
      <div class="aurora aurora-left"></div>
      <div class="aurora aurora-center"></div>
      <div class="aurora aurora-right"></div>
      <div class="hero-grid"></div>
      <div class="hero-noise"></div>
    </div>

    <div class="container hero-inner">
      <!-- Label -->
      <div class="hero-label reveal">
        <span class="label-line"></span>
        <span>{{ rolesLabel }}</span>
        <span class="label-line"></span>
      </div>

      <!-- STAGE: nama raksasa + foto lengkung di tengah + kartu kiri/kanan -->
      <div class="stage reveal">
        <h1 class="hero-title">
          <span class="hero-name">{{ hero.firstName }}</span>
          <span class="hero-dot">.</span>
        </h1>

        <!-- Kartu kiri -->
        <div class="side-card side-left">
          <span class="side-eyebrow">Founder of</span>
          <span class="agency-chip mementa">{{ hero.agency1 || 'Mementa' }}</span>
        </div>

        <!-- Foto tengah -->
        <div class="arch">
          <div class="arch-glow"></div>
          <div class="arch-ring">
            <div class="arch-inner">
              <img
                :src="hero.photo"
                :alt="`${hero.firstName} — Fotografer dan Creative Director`"
                class="hero-img"
                loading="eager"
              />
              <div class="arch-overlay"></div>
            </div>
          </div>
        </div>

        <!-- Kartu kanan -->
        <div class="side-card side-right">
          <span class="side-eyebrow">Founder of</span>
          <span class="agency-chip agency-404">{{ hero.agency2 || '404' }}</span>
        </div>
      </div>

      <!-- Badge ketersediaan (di luar stage agar tidak tertimpa) -->
      <div class="hero-image-badge reveal" v-if="hero.isAvailable">
        <span class="badge-dot"></span>
        {{ hero.availabilityText || 'Available for projects' }}
      </div>

      <!-- Founder tag (khusus mobile, menggantikan kartu samping) -->
      <div class="founder-tag reveal">
        <span class="founder-sep">Founder of</span>
        <span class="agency-chip mementa">{{ hero.agency1 || 'Mementa' }}</span>
        <span class="agency-amp">&amp;</span>
        <span class="agency-chip agency-404">{{ hero.agency2 || '404' }}</span>
      </div>

      <!-- Tagline -->
      <p class="hero-tagline reveal" v-html="taglineHtml"></p>

      <!-- CTAs -->
      <div class="hero-ctas reveal">
        <a href="#works" @click.prevent="scrollTo('works')" class="btn btn-primary" id="hero-view-works-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Lihat Karya
        </a>
        <a href="#contact" @click.prevent="scrollTo('contact')" class="btn btn-outline" id="hero-contact-btn">
          Hubungi Saya
        </a>
      </div>

      <!-- Stats -->
      <div class="hero-stats reveal">
        <div class="stat-item" v-for="(stat, i) in stats" :key="stat.label">
          <span class="stat-value">{{ counts[i] }}{{ stat.suffix }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <!-- Marquee -->
    <div class="marquee" aria-hidden="true">
      <div class="marquee-track">
        <template v-for="n in 2" :key="n">
          <span v-for="item in marquee" :key="item + n" class="marquee-item">
            {{ item }}<i class="marquee-star">✦</i>
          </span>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import profileData from '@/data/profile.json'

// Reactive profile — will be refreshed from API when server is running
const hero = ref({ ...profileData.hero })

// Derived
const stats = computed(() => hero.value.stats || [])
const marquee = computed(() => hero.value.marqueeItems || [])
const rolesLabel = computed(() => (hero.value.roles || []).join(' · '))
const taglineHtml = computed(() =>
  (hero.value.tagline || '').replace(/\n/g, '<br />')
)

const counts = ref([])
const syncCounts = () => { counts.value = stats.value.map(() => 0) }
syncCounts()

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function countUp() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    counts.value = stats.value.map(s => s.value)
    return
  }
  const duration = 1600
  const start = performance.now()
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - p, 4)
    counts.value = stats.value.map(s => Math.round(s.value * eased))
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

onMounted(async () => {
  // Try to fetch latest data from CMS API
  try {
    const res = await fetch('http://localhost:3001/api/profile/hero')
    if (res.ok) {
      const data = await res.json()
      hero.value = data
      syncCounts()
    }
  } catch {
    // Fallback to static JSON — silently ignore
  }

  const reveals = document.querySelectorAll('.hero .reveal')
  reveals.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 100 + i * 140)
  })
  setTimeout(countUp, 700)
})
</script>

<style scoped>
.hero {
  min-height: 100vh;
  padding-top: var(--navbar-h);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

/* ---------- Reveal ---------- */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.8s ease, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ---------- Background ---------- */
.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.aurora {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.55;
  animation: drift 14s ease-in-out infinite alternate;
}
.aurora-center {
  width: 46vw; height: 46vw; max-width: 720px; max-height: 720px;
  top: -12%; left: 50%; transform: translateX(-50%);
  background: radial-gradient(circle, rgba(167, 139, 250, 0.55), transparent 65%);
}
.aurora-left {
  width: 32vw; height: 32vw; max-width: 480px; max-height: 480px;
  bottom: 5%; left: -8%;
  background: radial-gradient(circle, rgba(167, 139, 250, 0.35), transparent 65%);
  animation-delay: -4s;
}
.aurora-right {
  width: 32vw; height: 32vw; max-width: 480px; max-height: 480px;
  bottom: 5%; right: -8%;
  background: radial-gradient(circle, rgba(244, 114, 182, 0.35), transparent 65%);
  animation-delay: -8s;
}

@keyframes drift {
  from { translate: 0 0; scale: 1; }
  to { translate: 0 -30px; scale: 1.08; }
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 65% 60% at 50% 40%, black 0%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 65% 60% at 50% 40%, black 0%, transparent 100%);
}

[data-theme="light"] .hero-grid {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
}

.hero-noise {
  position: absolute;
  inset: 0;
  opacity: 0.05;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}

/* ---------- Layout ---------- */
.hero-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: clamp(1.5rem, 4vh, 3rem);
  padding-bottom: clamp(2rem, 5vh, 3.5rem);
}

.hero-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: clamp(1rem, 3vh, 2rem);
}

.label-line {
  display: block;
  width: 40px;
  height: 1px;
  flex-shrink: 0;
  background: linear-gradient(90deg, transparent, var(--accent));
}
.label-line:last-child {
  background: linear-gradient(270deg, transparent, var(--accent));
}

/* ---------- Stage ---------- */
.stage {
  position: relative;
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: clamp(1.25rem, 3vh, 2rem);
}

/* Urutan vertikal: nama depan → foto → nama belakang (tanpa saling menimpa) */
.hero-title {
  display: contents;
  font-family: var(--font-display);
}

.hero-name,
.hero-surname {
  position: relative;
  white-space: nowrap;
  font-family: var(--font-display);
  font-size: clamp(2.75rem, 9vw, 7.5rem);
  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 1;
}

.hero-name {
  order: 1;
  z-index: 0;
  margin-bottom: 0.5rem;
  color: transparent;
  -webkit-text-stroke: 1.5px var(--text-muted);
}

/* Hanya menimpa bagian bawah foto yang sudah digelapkan */
.hero-surname {
  order: 3;
  z-index: 3;
  margin-top: -0.55em;
  color: var(--text-primary);
  text-shadow: 0 8px 40px rgba(0, 0, 0, 0.6);
}

.hero-dot { color: var(--accent); }

/* Foto lengkung */
.arch {
  order: 2;
  position: relative;
  z-index: 1;
  width: clamp(190px, 24vw, 280px);
  height: clamp(260px, 32vw, 380px);
}

.arch-glow {
  position: absolute;
  inset: 8%;
  border-radius: 50%;
  background: conic-gradient(from 180deg, #a78bfa, #f472b6, #34d399, #a78bfa);
  filter: blur(60px);
  opacity: 0.45;
  animation: spin 18s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.arch-ring {
  position: relative;
  height: 100%;
  padding: 3px;
  border-radius: 999px 999px 28px 28px;
  background: linear-gradient(160deg, #a78bfa, rgba(255, 255, 255, 0.08) 45%, #f472b6);
  box-shadow: 0 40px 90px -30px rgba(0, 0, 0, 0.7);
}

.arch-inner {
  position: relative;
  height: 100%;
  border-radius: 996px 996px 25px 25px;
  overflow: hidden;
  background: var(--bg);
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  display: block;
  transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.arch:hover .hero-img { transform: scale(1.05); }

.arch-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 50%, rgba(10, 10, 10, 0.75) 100%);
}

.hero-image-badge {
  white-space: nowrap;
  margin-bottom: 1.25rem;
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--border);
  border-radius: 100px;
  padding: 8px 18px;
  font-size: 0.8125rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
}

.badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.6);
  animation: ping 2s ease-out infinite;
}

@keyframes ping {
  0% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.6); }
  100% { box-shadow: 0 0 0 10px rgba(52, 211, 153, 0); }
}

/* Kartu samping (cermin kiri-kanan) */
.side-card {
  position: absolute;
  top: 56%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 18px 26px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 25px 60px -25px rgba(0, 0, 0, 0.6);
  animation: float 6s ease-in-out infinite;
}

.side-left { left: 3%; --rot: -4deg; }
.side-right { right: 3%; --rot: 4deg; animation-delay: -3s; }

@keyframes float {
  0%, 100% { transform: translateY(-50%) rotate(var(--rot)); }
  50% { transform: translateY(calc(-50% - 12px)) rotate(var(--rot)); }
}

.side-eyebrow {
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.agency-chip {
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 1rem;
  font-weight: 700;
  font-family: var(--font-display);
  letter-spacing: 0.02em;
}

.agency-chip.mementa {
  background: rgba(167, 139, 250, 0.15);
  color: #a78bfa;
  border: 1px solid rgba(167, 139, 250, 0.35);
}

.agency-chip.agency-404 {
  background: rgba(244, 114, 182, 0.15);
  color: #f472b6;
  border: 1px solid rgba(244, 114, 182, 0.35);
}

/* Founder tag (mobile) */
.founder-tag {
  display: none;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}
.founder-sep { font-size: 0.9375rem; color: var(--text-muted); }
.agency-amp { color: var(--text-muted); font-size: 0.9rem; }

/* ---------- Tagline & CTA ---------- */
.hero-tagline {
  font-family: var(--font-body);
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 2rem;
  max-width: 540px;
}

.hero-ctas {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: clamp(2rem, 5vh, 3rem);
  flex-wrap: wrap;
}

/* ---------- Stats ---------- */
.hero-stats {
  width: 100%;
  max-width: 880px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 1.4rem 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.stat-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 0 0.75rem;
}

.stat-item + .stat-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10%;
  bottom: 10%;
  width: 1px;
  background: var(--border);
}

.stat-value {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.6vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, var(--text-primary) 30%, #a78bfa 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 0.6875rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-align: center;
}

/* ---------- Marquee ---------- */
.marquee {
  position: relative;
  z-index: 1;
  overflow: hidden;
  border-top: 1px solid var(--border);
  padding: 14px 0;
  background: rgba(255, 255, 255, 0.02);
  mask-image: linear-gradient(90deg, transparent, black 12%, black 88%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, black 12%, black 88%, transparent);
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 28s linear infinite;
}

.marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 28px;
  padding-right: 28px;
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
  white-space: nowrap;
}

.marquee-star {
  font-style: normal;
  color: var(--accent);
}

@keyframes marquee {
  to { transform: translateX(-50%); }
}

.hidden-mobile { display: inline; }

/* ---------- Responsive ---------- */
@media (max-width: 900px) {
  .side-card { display: none; }
  .founder-tag { display: flex; }
  .arch { width: clamp(180px, 46vw, 260px); height: clamp(240px, 62vw, 340px); }
}

@media (max-width: 640px) {
  .hero-stats { grid-template-columns: repeat(2, 1fr); row-gap: 1.25rem; }
  .stat-item:nth-child(3)::before { display: none; }
  .label-line { width: 20px; }
  .hero-label { font-size: 0.6875rem; letter-spacing: 0.08em; }
  .hero-ctas { flex-direction: column; width: 100%; }
  .hero-ctas .btn { width: 100%; justify-content: center; }
  .hidden-mobile { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .reveal { transition: none; opacity: 1; transform: none; }
  .aurora, .arch-glow, .badge-dot, .marquee-track { animation: none; }
  .side-card { animation: none; transform: translateY(-50%); }
}
</style>