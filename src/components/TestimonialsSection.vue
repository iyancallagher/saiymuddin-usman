<template>
  <section class="section testimonials-section" id="testimonials">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-label" style="justify-content: center;">Testimonials</div>
        <h2 class="section-title">Kata Mereka</h2>
      </div>

      <div class="testimonials-grid">
        <div
          v-for="t in testimonials"
          :key="t.id"
          class="testimonial-card"
          :id="`testimonial-${t.id}`"
        >
          <!-- Stars -->
          <div class="stars">
            <svg v-for="s in t.rating" :key="s" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#A78BFA"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>

          <!-- Quote -->
          <blockquote class="testimonial-quote">
            "{{ t.quote }}"
          </blockquote>

          <!-- Author -->
          <div class="testimonial-author">
            <img :src="t.avatar" :alt="t.name" class="author-avatar" loading="lazy" />
            <div class="author-info">
              <span class="author-name">{{ t.name }}</span>
              <span class="author-role">{{ t.role }}, {{ t.company }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import testimonials from '@/data/testimonials.json'
</script>

<style scoped>
.testimonials-section {
  background: var(--bg);
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.testimonial-card {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 2rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition: all var(--transition);
}

.testimonial-card:hover {
  border-color: var(--border-hover);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.stars {
  display: flex;
  gap: 3px;
}

.testimonial-quote {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.75;
  font-style: italic;
  flex: 1;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.author-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-name {
  font-weight: 600;
  font-size: 0.9375rem;
  color: var(--text-primary);
}

.author-role {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .testimonials-grid { grid-template-columns: 1fr; }
}
</style>
