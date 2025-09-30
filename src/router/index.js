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
      path: '/hold',
      name: 'HoldView',
      component: () => import('@/views/HoldFad.vue'),
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
      meta: { requiresAuth: true },
    },
    {
      path: '/tps',
      name: 'dashboard-tps',
      component: () => import('@/views/DashboardTps.vue'),
      meta: { requiresAuth: true, allowedRoles: ['ADMIN', 'INTERNAL'] },
    },
    {
      path: '/tps/area/:id',
      name: 'area-detail',
      component: () => import('@/views/AreaDetail.vue'),
      meta: { requiresAuth: true, allowedRoles: ['ADMIN', 'INTERNAL'] },
    },
    {
      path: '/tps/area/:areaId/groups/:groupId',
      name: 'group-detail',
      component: () => import('@/views/GroupDetail.vue'),
      meta: { requiresAuth: true, allowedRoles: ['ADMIN', 'INTERNAL'] },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Jika route membutuhkan authentication
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return next({ name: 'login' }) // Redirect ke login jika belum login
  }

  // Handle dashboard redirect logic berdasarkan user role
  if (to.name === 'dashboard' && authStore.isLoggedIn) {
    const userRole = authStore.user?.role

    if (userRole === 'ADMIN') {
      // Admin langsung ke admin panel
      return next({ name: 'admin' })
    } else if (userRole === 'EXTERNAL') {
      // External hanya bisa akses FAD
      return next({ name: 'dashboard-fad' })
    } else if (userRole === 'INTERNAL') {
      // Internal bisa pilih FAD atau TPS
      return next({ name: 'dashboard-select' })
    }
  }

  // Cek jika route memiliki specific role requirement
  if (to.meta.role && to.meta.role !== authStore.user.role) {
    return next({ name: 'dashboard' }) // Redirect ke dashboard jika user tidak punya required role
  }

  // Cek jika route memiliki allowed roles requirement
  if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(authStore.user.role)) {
    return next({ name: 'dashboard' }) // Redirect ke dashboard jika user tidak punya required role
  }

  next()
})

export default router
