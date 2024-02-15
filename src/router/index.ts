import { createRouter, createWebHistory } from 'vue-router'
import WorkshopView from '../views/WorkshopView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: WorkshopView
    }
  ]
})

export default router
