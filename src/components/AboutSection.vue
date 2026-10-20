<template>
  <section class="section about-section" id="about">
    <div class="container">
      <div class="about-layout">
        <!-- Left: Image -->
        <div class="about-visual">
          <div class="about-image-wrap">
            <img
              :src="about.photo"
              :alt="about.heading || 'Saiynuddin Usman'"
              loading="lazy"
              class="about-img"
            />
            <div class="about-img-decoration"></div>
          </div>

          <!-- Floating experience card -->
          <div class="about-exp-card glass">
            <span class="exp-number">{{ about.yearsExperience || '5+' }}</span>
            <span class="exp-label">Tahun<br />Berkarya</span>
          </div>
        </div>

        <!-- Right: Content -->
        <div class="about-content">
          <div class="section-label">About Me</div>
          <h2 class="section-title about-title">
            {{ about.heading || 'Kreator dengan' }}<br />
            <span class="text-accent">{{ about.headingAccent || 'visi visual' }}</span>
            {{ about.headingSuffix ? ' ' + about.headingSuffix : ' yang kuat.' }}
          </h2>

          <div class="about-bio">
            <p v-for="(para, i) in parsedBio" :key="i" v-html="para"></p>
          </div>

          <!-- Skills -->
          <div class="about-skills">
            <div class="skills-label">Keahlian &amp; Tools</div>
            <div class="skills-grid">
              <div class="skill-group" v-for="group in (about.skillGroups || [])" :key="group.name">
                <div class="skill-group-name">{{ group.name }}</div>
                <div class="skill-tags">
                  <span class="skill-tag" v-for="skill in group.skills" :key="skill">{{ skill }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- CTA -->
          <div class="about-cta">
            <a href="#contact" @click.prevent="scrollTo('contact')" class="btn btn-primary" id="about-contact-btn">
              Mulai Kolaborasi
            </a>
            <a href="#works" @click.prevent="scrollTo('works')" class="btn btn-outline" id="about-works-btn">
              Lihat Portofolio
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import profileData from '@/data/profile.json'

const about = ref({ ...profileData.about })

// Parse **bold** markdown-style in bio paragraphs
const parsedBio = computed(() =>
  (about.value.bio || []).map(p =>
    p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  )
)

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3001/api/profile/about')
    if (res.ok) {
      about.value = await res.json()
    }
  } catch {
    // Fallback to static JSON
  }
})
</script>

<style scoped>
.about-section {
  background: var(--bg);
  overflow: hidden;
}

.about-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(3rem, 8vw, 7rem);
  align-items: center;
}

/* Visual */
.about-visual {
  position: relative;
}

.about-image-wrap {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  aspect-ratio: 4/5;
}

.about-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.about-image-wrap:hover .about-img {
  transform: scale(1.04);
}

.about-img-decoration {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-xl);
  border: 2px solid rgba(167, 139, 250, 0.2);
  pointer-events: none;
}

.about-exp-card {
  position: absolute;
  bottom: -1rem;
  right: -1.5rem;
  padding: 1.25rem 1.5rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.exp-number {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--accent);
  letter-spacing: -0.05em;
  line-height: 1;
}

.exp-label {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Content */
.about-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.about-title {
  line-height: 1.15;
}

.about-bio {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.about-bio p {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.75;
}

.about-bio strong {
  color: var(--text-primary);
  font-weight: 600;
}

/* Skills */
.skills-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.skills-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skill-group {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.skill-group-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--accent);
  width: 90px;
  flex-shrink: 0;
  padding-top: 2px;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-tag {
  padding: 4px 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 100px;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  transition: all var(--transition);
}

.skill-tag:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* CTA */
.about-cta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 900px) {
  .about-layout {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  .about-visual {
    max-width: 480px;
    margin: 0 auto;
  }
  .about-exp-card {
    right: 0;
  }
}
</style>
