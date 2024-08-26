import { useAuthStore } from '@/stores/auth'
import Chat from '@/views/Chat.vue'
import Login from '@/views/Login.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    { 
      path: '/chat', 
      component: Chat,
      meta: { requiresAuth: true }
    },

  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.userIsAuthenticated) {
    next('/')
  } else if (to.path === '/' && authStore.userIsAuthenticated) {
    next('/chat')
  } else {
    next()
  }
})

export default router
