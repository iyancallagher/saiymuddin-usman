import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth', top: 80 }
    }
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/gallery/:category',
      name: 'gallery',
      component: () => import('@/views/GalleryView.vue'),
      props: true
    },
    {
      path: '/project/:id',
      name: 'project',
      component: () => import('@/views/ProjectView.vue'),
      props: true
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue')
    },

    // ── Admin ──────────────────────────────────────────────
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/AdminLogin.vue'),
      meta: { isAdminAuth: true }
    },
    {
      path: '/admin',
      component: () => import('@/views/admin/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/admin/dashboard'
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/AdminDashboard.vue')
        },
        {
          path: 'works',
          name: 'admin-works',
          component: () => import('@/views/admin/AdminWorks.vue')
        },
        {
          path: 'works/new',
          name: 'admin-work-new',
          component: () => import('@/views/admin/AdminWorkForm.vue')
        },
        {
          path: 'works/:id',
          name: 'admin-work-edit',
          component: () => import('@/views/admin/AdminWorkForm.vue')
        },
        {
          path: 'testimonials',
          name: 'admin-testimonials',
          component: () => import('@/views/admin/AdminTestimonials.vue')
        },
        {
          path: 'agencies',
          name: 'admin-agencies',
          component: () => import('@/views/admin/AdminAgencies.vue')
        },
        {
          path: 'services',
          name: 'admin-services',
          component: () => import('@/views/admin/AdminServices.vue')
        },
        {
          path: 'media',
          name: 'admin-media',
          component: () => import('@/views/admin/AdminMedia.vue')
        },
        {
          path: 'profile',
          name: 'admin-profile',
          component: () => import('@/views/admin/AdminProfile.vue')
        }
      ]
    }
  ]
})

// Navigation guard — protect admin routes
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('cms_token')
  if (to.meta.requiresAuth && !token) {
    next({ name: 'admin-login' })
  } else if (to.meta.isAdminAuth && token) {
    next({ name: 'admin-dashboard' })
  } else {
    next()
  }
})

export default router
