import { createRouter, createWebHistory } from 'vue-router'
import WorkshopView from '../views/WorkshopView.vue'
import WorkshopDetailsVue from '@/components/WorkshopDetails.vue'
import CreatePageVue from '@/components/CreatePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: WorkshopView
    },
    {
      path: '/workshop/:id',
      component: WorkshopDetailsVue
    },
    {
      path: '/create',
      name: 'Create',
      component: CreatePageVue
    }
  ]
})

export default router
