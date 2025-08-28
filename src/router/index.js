import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue'),
    },
    {
      path: '/all',
      name: 'homeView',
      component: () => import('@/views/ViewAll.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/myadmin',
      name: 'admin',
      component: () => import('@/views/Admin.vue'),
      meta: { requiresAuth: true, role: 'ADMIN' },
    },
    {
      path: '/open',
      name: 'openView',
      component: () => import('@/views/OpenFad.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/onprogress',
      name: 'progressView',
      component: () => import('@/views/ProgressFad.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/closed',
      name: 'ClosedView',
      component: () => import('@/views/ClosedFad.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/vendor',
      name: 'vendor',
      component: () => import('@/views/Vendor.vue'),
      meta: { requiresAuth: true, role: 'ADMIN' },
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/userManagement.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // If the route requires authentication
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return next({ name: 'login' }) // Redirect to login if not logged in
  }

  // Check if the route has a specific role requirement
  if (to.meta.role && to.meta.role !== authStore.user.role) {
    return next({ name: 'dashboard' }) // Redirect to dashboard if user doesn't have required role
  }

  next()
})

export default router
