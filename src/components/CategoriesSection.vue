<template>
  <section class="section categories-section" id="categories">
    <div class="container">
      <div class="section-header">
        <div class="section-label">Kategori Karya</div>
        <h2 class="section-title">Bidang Keahlian</h2>
      </div>

      <div class="categories-grid">
        <router-link
          v-for="(cat, i) in categories"
          :key="cat.slug"
          :to="`/gallery/${cat.slug}`"
          class="category-card"
          :style="{ '--cat-color': cat.color }"
          :id="`category-card-${cat.slug}`"
        >
          <div class="cat-icon">{{ cat.icon }}</div>
          <div class="cat-content">
            <h3 class="cat-title">{{ cat.title }}</h3>
            <p class="cat-desc">{{ cat.description }}</p>
          </div>
          <div class="cat-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
          </div>
          <div class="cat-glow"></div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import categories from '@/data/services.json'
</script>

<style scoped>
.categories-section {
  background: var(--bg-2);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.category-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  text-decoration: none;
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition);
}

.category-card:hover {
  border-color: var(--cat-color);
  transform: translateY(-6px);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.3), 0 0 0 1px var(--cat-color);
}

.cat-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, var(--cat-color), transparent 70%);
  opacity: 0;
  transition: opacity var(--transition);
}

.category-card:hover .cat-glow {
  opacity: 0.08;
}

.cat-icon {
  font-size: 2rem;
  line-height: 1;
  position: relative;
  z-index: 1;
}

.cat-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.cat-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}

.cat-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.cat-arrow {
  color: var(--text-muted);
  transition: all var(--transition);
  position: relative;
  z-index: 1;
  align-self: flex-end;
}

.category-card:hover .cat-arrow {
  color: var(--cat-color);
  transform: translate(4px, -4px);
}

@media (max-width: 1024px) {
  .categories-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .categories-grid { grid-template-columns: 1fr; }
}
</style>
