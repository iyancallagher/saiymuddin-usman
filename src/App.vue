<template>
  <div :data-theme="theme" id="app-root">
    <!-- Hanya tampilkan Navbar & Footer di halaman non-admin -->
    <template v-if="!isAdminRoute">
      <TheNavbar :theme="theme" @toggle-theme="toggleTheme" />
    </template>

    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <template v-if="!isAdminRoute">
      <TheFooter />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import TheNavbar from '@/components/TheNavbar.vue'
import TheFooter from '@/components/TheFooter.vue'

const route = useRoute()
const theme = ref('dark')

const isAdminRoute = computed(() =>
  route.path.startsWith('/admin')
)

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved) theme.value = saved
})

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', theme.value)
}
</script>

<style scoped>
#app-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
