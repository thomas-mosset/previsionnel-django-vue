import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (Login.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/FormLoginView.vue'),
    },
    {
      path: '/registration',
      name: 'registration',
      // route level code-splitting
      // this generates a separate chunk (Registration.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/FormRegistrationView.vue'),
    },
    {
      path: '/profil',
      name: 'profil',
      // route level code-splitting
      // this generates a separate chunk (Profil.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ProfilView.vue'),
    },
    {
      path: '/profil/categories',
      name: 'categories',
      // route level code-splitting
      // this generates a separate chunk (Categories.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/CategoriesView.vue'),
    },
    {
      path: '/profil/incomes',
      name: 'incomes',
      // route level code-splitting
      // this generates a separate chunk (Incomes.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/IncomesView.vue'),
    },
    {
      path: '/profil/expenses',
      name: 'expenses',
      // route level code-splitting
      // this generates a separate chunk (Expenses.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ExpensesView.vue'),
    },
    {
      path: '/profil/budgets',
      name: 'budgets',
      // route level code-splitting
      // this generates a separate chunk (Budgets.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/BudgetsView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
