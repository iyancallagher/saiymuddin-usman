<template>
  <section class="section services-section" id="services">
    <div class="container">
      <div class="section-header">
        <div class="section-label">Services</div>
        <div class="services-header-row">
          <h2 class="section-title">Layanan Tersedia</h2>
          <p class="services-subtitle">
            Setiap project dikerjakan dengan detail dan dedikasi penuh.
          </p>
        </div>
      </div>

      <div class="services-list">
        <div
          v-for="(service, i) in serviceItems"
          :key="service.title"
          class="service-item"
          :id="`service-item-${i}`"
        >
          <div class="service-number">{{ String(i + 1).padStart(2, '0') }}</div>
          <div class="service-content">
            <div class="service-header">
              <h3 class="service-title">{{ service.title }}</h3>
              <div class="service-tags">
                <span class="service-tag" v-for="tag in service.tags" :key="tag">{{ tag }}</span>
              </div>
            </div>
            <p class="service-desc">{{ service.description }}</p>
          </div>
          <a
            href="#contact"
            @click.prevent="scrollTo('contact')"
            class="service-cta"
            :id="`service-ask-${i}`"
          >
            Tanya Layanan
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const serviceItems = [
  {
    title: 'Photography',
    description: 'Sesi foto profesional untuk kebutuhan komersial, portrait, editorial, product, dan event. Hasilnya telah diedit dan siap pakai dalam format yang Anda butuhkan.',
    tags: ['Commercial', 'Portrait', 'Event', 'Product']
  },
  {
    title: 'Videography & Editing',
    description: 'Produksi video dari konsep hingga final cut. Termasuk perencanaan shot, syuting, color grading, dan audio mixing. Format untuk YouTube, Instagram, hingga broadcast.',
    tags: ['Cinematic', 'Wedding', 'Corporate', 'Social Media']
  },
  {
    title: 'Graphic Design',
    description: 'Desain identitas visual yang konsisten — logo, brand guideline, template media sosial, poster, packaging, hingga materi cetak dan digital.',
    tags: ['Branding', 'Logo', 'Social Media', 'Print']
  },
  {
    title: 'Color Grading',
    description: 'Post-production color grading untuk foto dan video. Koreksi warna profesional, LUT custom, dan konsistensi visual lintas format untuk tampilan yang sinematik.',
    tags: ['Photo', 'Video', 'LUT Custom', 'Batch']
  }
]

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
.services-section {
  background: var(--bg-2);
}

.services-header-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.services-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  max-width: 280px;
  text-align: right;
}

.services-list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--border);
}

.service-item {
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: 2rem;
  align-items: center;
  padding: 2rem 0;
  border-bottom: 1px solid var(--border);
  transition: all var(--transition);
}

.service-item:hover {
  padding-left: 1rem;
}

.service-item:hover .service-number {
  color: var(--accent);
}

.service-number {
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  transition: color var(--transition);
}

.service-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.service-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.service-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.service-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.service-tag {
  padding: 3px 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 100px;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.service-desc {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.65;
  max-width: 600px;
}

.service-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 100px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  text-decoration: none;
  white-space: nowrap;
  transition: all var(--transition);
}

.service-cta:hover {
  background: var(--accent);
  color: #0a0a0a;
  border-color: var(--accent);
  gap: 10px;
}

@media (max-width: 900px) {
  .service-item {
    grid-template-columns: 48px 1fr;
    grid-template-rows: auto auto;
  }
  .service-cta {
    grid-column: 2;
    width: fit-content;
  }
  .services-subtitle { text-align: left; }
}

@media (max-width: 640px) {
  .service-item {
    grid-template-columns: 1fr;
    padding: 1.5rem 0;
  }
  .service-number { display: none; }
  .service-cta { grid-column: 1; }
}
</style>
