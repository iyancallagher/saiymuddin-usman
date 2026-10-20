<template>
  <section class="section agencies-section" id="agencies">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-label" style="justify-content: center;">Agencies</div>
        <h2 class="section-title">Dua Agency, Satu Visi</h2>
        <p class="agencies-subtitle">
          Lebih dari portofolio pribadi — Saiynuddin mengelola dua agency kreatif<br class="hidden-sm" />
          yang melayani klien dari berbagai industri.
        </p>
      </div>

      <div class="agencies-grid">
        <div
          v-for="agency in agencies"
          :key="agency.name"
          class="agency-card"
          :style="{ '--agency-color': agency.accentColor }"
          :id="`agency-card-${agency.name.toLowerCase()}`"
        >
          <!-- Header -->
          <div class="agency-header">
            <div class="agency-logo" :style="{ background: `rgba(${hexToRgb(agency.accentColor)}, 0.15)`, color: agency.accentColor }">
              {{ agency.name.charAt(0) }}
            </div>
            <div class="agency-identity">
              <h3 class="agency-name">{{ agency.name }}</h3>
              <span class="agency-tagline">{{ agency.tagline }}</span>
            </div>
          </div>

          <!-- Description -->
          <p class="agency-desc">{{ agency.description }}</p>

          <!-- Stats -->
          <div class="agency-stats">
            <div class="agency-stat" v-for="(val, key) in agency.stats" :key="key">
              <span class="agency-stat-value">{{ val }}</span>
              <span class="agency-stat-label">{{ statLabel(key) }}</span>
            </div>
          </div>

          <!-- Services -->
          <div class="agency-services">
            <span class="service-pill" v-for="svc in agency.services" :key="svc">{{ svc }}</span>
          </div>

          <!-- CTA -->
          <a
            :href="agency.url"
            target="_blank"
            rel="noopener noreferrer"
            class="agency-cta"
            :id="`agency-link-${agency.name.toLowerCase()}`"
            @click="trackClick(agency.name)"
          >
            Kunjungi {{ agency.name }}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
          </a>

          <div class="agency-glow"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import agencies from '@/data/agencies.json'

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '255, 255, 255'
}

function statLabel(key) {
  const map = { projects: 'Proyek', clients: 'Klien', years: 'Tahun' }
  return map[key] || key
}

function trackClick(agencyName) {
  // Simple click tracking - can be extended with analytics
  console.log(`Agency click: ${agencyName}`)
}
</script>

<style scoped>
.agencies-section {
  background: var(--bg-3);
}

.agencies-subtitle {
  color: var(--text-secondary);
  margin-top: 1rem;
  line-height: 1.7;
}

.agencies-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 3rem;
}

/* Agency Card */
.agency-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all var(--transition);
}

.agency-card:hover {
  border-color: var(--agency-color);
  box-shadow: 0 0 0 1px var(--agency-color), var(--shadow-lg);
  transform: translateY(-4px);
}

.agency-glow {
  position: absolute;
  top: -50%;
  right: -30%;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: var(--agency-color);
  opacity: 0;
  filter: blur(80px);
  pointer-events: none;
  transition: opacity var(--transition-slow);
}

.agency-card:hover .agency-glow {
  opacity: 0.08;
}

/* Header */
.agency-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.agency-logo {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 900;
  flex-shrink: 0;
}

.agency-identity {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.agency-name {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.04em;
}

.agency-tagline {
  font-size: 0.8125rem;
  color: var(--text-muted);
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* Description */
.agency-desc {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* Stats */
.agency-stats {
  display: flex;
  gap: 2rem;
  padding: 1.25rem 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.agency-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.agency-stat-value {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--agency-color);
  letter-spacing: -0.03em;
}

.agency-stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Services */
.agency-services {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.service-pill {
  padding: 5px 14px;
  background: var(--bg-3);
  border: 1px solid var(--border);
  border-radius: 100px;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

/* CTA */
.agency-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--agency-color);
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  transition: all var(--transition);
  width: fit-content;
}

.agency-cta:hover {
  background: var(--agency-color);
  color: #0a0a0a;
  gap: 10px;
}

.hidden-sm { display: inline; }

@media (max-width: 768px) {
  .agencies-grid { grid-template-columns: 1fr; }
  .hidden-sm { display: none; }
}

@media (max-width: 480px) {
  .agency-card { padding: 1.5rem; }
  .agency-stats { gap: 1rem; }
}
</style>
