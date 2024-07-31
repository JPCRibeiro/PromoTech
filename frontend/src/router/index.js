import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import ProductView from '@/views/ProductView.vue';
import NotFoundView from '@/views/NotFoundView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/produto/:slug',
      name: 'produto',
      component: ProductView
    },
    {
      path: '/:catchAll(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
});

export default router;