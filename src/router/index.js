import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/DashboardSelect.vue'), // Temporary component, will be redirected by guard
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard-select',
      name: 'dashboard-select',
      component: () => import('@/views/DashboardSelect.vue'),
      meta: { requiresAuth: true, allowedRoles: ['INTERNAL'] },
    },
    {
      path: '/dashboard-fad',
      name: 'dashboard-fad',
      component: () => import('@/views/DashboardFad.vue'),
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
      component: () => import('@/views/ViewAllFad.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/myadmin',
      name: 'admin',
      component: () => import('@/views/AdminFad.vue'),
      meta: { requiresAuth: true, module: 'FAD', requiresAdmin: true },
    },
    {
      path: '/audit-logs',
      name: 'audit-logs',
      component: () => import('@/views/AuditLog.vue'),
      meta: { requiresAuth: true, requiresSuperAdmin: true },
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
      path: '/hold',
      name: 'HoldView',
      component: () => import('@/views/HoldFad.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/vendor',
      name: 'vendor',
      component: () => import('@/views/VendorFad.vue'),
      meta: { requiresAuth: true, module: 'FAD', requiresAdmin: true },
    },
    {
      path: '/super-admin',
      name: 'super-admin',
      component: () => import('@/views/DashboardSuperAdmin.vue'),
      meta: { requiresAuth: true, requiresSuperAdmin: true },
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/userManagement.vue'),
      meta: { requiresAuth: true, requiresSuperAdmin: true },
    },
    {
      path: '/tps',
      name: 'dashboard-tps',
      component: () => import('@/views/DashboardTps.vue'),
      meta: { requiresAuth: true, module: 'TPS' },
    },
    {
      path: '/tps/area/:id',
      name: 'area-detail',
      component: () => import('@/views/AreaDetailTps.vue'),
      meta: { requiresAuth: true, module: 'TPS' },
    },
    {
      path: '/tps/area/:areaId/groups/:groupId',
      name: 'group-detail',
      component: () => import('@/views/GroupDetailTps.vue'),
      meta: { requiresAuth: true, module: 'TPS' },
    },
    {
      path: '/program-5r',
      name: 'program-info',
      component: () => import('@/views/ProgramInfoTps.vue'),
      meta: { requiresAuth: true, module: 'TPS' },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Jika route membutuhkan authentication
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return next({ name: 'login' })
  }

  // Module access check
  if (to.meta.module && !authStore.hasModule(to.meta.module)) {
    return next({ name: 'dashboard' })
  }

  // Admin check
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next({ name: 'dashboard' })
  }

  // Super Admin check
  if (to.meta.requiresSuperAdmin && !authStore.isSuperAdmin) {
    return next({ name: 'dashboard' })
  }

  // Handle dashboard redirect logic berdasarkan user role
  if (to.name === 'dashboard' && authStore.isLoggedIn) {
    const modules = authStore.accessibleModules

    if (authStore.isSuperAdmin) {
      return next({ name: 'super-admin' })
    }

    // Check if user has no modules
    if (modules.length === 0) {
      authStore.logout({ server: false, alert: true })
      return next({ name: 'login' })
    }

    // Single module - redirect based on role and module
    if (modules.length === 1) {
      const module = modules[0]

      // For ADMIN: redirect to admin panel
      if (authStore.isAdmin) {
        return next({ name: module === 'FAD' ? 'admin' : 'dashboard-tps' })
      }

      // For USER: redirect to view-only dashboard
      return next({ name: module === 'FAD' ? 'dashboard-fad' : 'dashboard-tps' })
    }

    // Multiple modules - show selector
    return next({ name: 'dashboard-select' })
  }

  next()
})

export default router
