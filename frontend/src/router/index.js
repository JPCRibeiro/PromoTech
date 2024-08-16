import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import ProductView from '@/views/ProductView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import LoginView from '@/views/LoginView.vue';
import CadastroView from '@/views/RegisterView.vue';
import Cart from '@/views/CartView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { hideLayout: true }
    },
    {
      path: '/cadastro',
      name: 'cadastro',
      component: CadastroView,
      meta: { hideLayout: true }
    },
    {
      path: '/produto/:slug',
      name: 'produto',
      component: ProductView
    },
    {
      path: '/carrinho',
      name: 'carrinho',
      component: Cart
    },
    {
      path: '/:catchAll(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
});

export default router;