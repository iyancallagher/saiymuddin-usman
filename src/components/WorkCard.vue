<template>
  <router-link
    :to="`/project/${work.id}`"
    class="work-card"
    :id="`work-card-${work.id}`"
  >
    <!-- Cover Image -->
    <div class="work-card-image">
      <img
        :src="work.cover"
        :alt="work.title"
        loading="lazy"
        class="work-img"
      />
      <div class="work-overlay">
        <div class="work-overlay-content">
          <span class="view-project">
            Lihat Project
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
          </span>
        </div>
      </div>
    </div>

    <!-- Info -->
    <div class="work-card-info">
      <div class="work-meta">
        <span :class="`badge badge-${work.origin}`">{{ originLabel(work.origin) }}</span>
        <span class="work-year">{{ work.year }}</span>
      </div>
      <h3 class="work-title">{{ work.title }}</h3>
      <div class="work-footer">
        <span class="work-category">{{ categoryLabel(work.category) }}</span>
        <span class="work-role">{{ work.role }}</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
const props = defineProps({
  work: {
    type: Object,
    required: true
  }
})

function originLabel(origin) {
  const map = { personal: 'Personal', mementa: 'Mementa', '404': '404' }
  return map[origin] || origin
}

function categoryLabel(cat) {
  const map = {
    photography: 'Photography',
    videography: 'Videography',
    'graphic-design': 'Graphic Design',
    editing: 'Editing'
  }
  return map[cat] || cat
}
</script>

<style scoped>
.work-card {
  display: block;
  text-decoration: none;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--surface);
  border: 1px solid var(--border);
  transition: all var(--transition);
  position: relative;
  cursor: pointer;
}

.work-card:hover {
  border-color: var(--border-hover);
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}

/* Image */
.work-card-image {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
}

.work-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.work-card:hover .work-img {
  transform: scale(1.06);
}

/* Overlay */
.work-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(10, 10, 10, 0.85) 100%
  );
  display: flex;
  align-items: flex-end;
  padding: 1.25rem;
  opacity: 0;
  transition: opacity var(--transition);
}

.work-card:hover .work-overlay {
  opacity: 1;
}

.view-project {
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

/* Info */
.work-card-info {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.work-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.work-year {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.work-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  line-height: 1.3;
}

.work-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.work-category {
  font-size: 0.8125rem;
  color: var(--accent);
  font-weight: 500;
}

.work-role {
  font-size: 0.75rem;
  color: var(--text-muted);
}
</style>
