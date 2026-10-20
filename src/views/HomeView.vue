<template>
  <main>
    <HeroSection />
    <SelectedWorks />
    <CategoriesSection />
    <AboutSection />
    <AgenciesSection />
    <ServicesSection />
    <TestimonialsSection />
    <ContactSection />
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import HeroSection from '@/components/HeroSection.vue'
import SelectedWorks from '@/components/SelectedWorks.vue'
import CategoriesSection from '@/components/CategoriesSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import AgenciesSection from '@/components/AgenciesSection.vue'
import ServicesSection from '@/components/ServicesSection.vue'
import TestimonialsSection from '@/components/TestimonialsSection.vue'
import ContactSection from '@/components/ContactSection.vue'

// Intersection Observer for scroll reveal
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  )

  // Observe all reveal elements outside hero (hero handles its own)
  setTimeout(() => {
    document.querySelectorAll('.section:not(.hero) .reveal').forEach(el => {
      observer.observe(el)
    })
  }, 500)
})
</script>
