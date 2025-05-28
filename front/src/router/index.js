import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Accueil' }
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (Login.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/FormLoginView.vue'),
      meta: { title: 'Se connecter' }
    },
    {
      path: '/registration',
      name: 'registration',
      // route level code-splitting
      // this generates a separate chunk (Registration.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/FormRegistrationView.vue'),
      meta: { title: 'S\'inscrire' }
    },
    {
      path: '/profil',
      name: 'profil',
      // route level code-splitting
      // this generates a separate chunk (Profil.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ProfilView.vue'),
      meta: { title: 'Mon profil' }
    },
    {
      path: '/profil/categories',
      name: 'categories',
      // route level code-splitting
      // this generates a separate chunk (Categories.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/CategoriesView.vue'),
      meta: { title: 'Mes catégories' }
    },
    {
      path: '/profil/incomes',
      name: 'incomes',
      // route level code-splitting
      // this generates a separate chunk (Incomes.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/IncomesView.vue'),
      meta: { title: 'Mes revenus' }
    },
    {
      path: '/profil/expenses',
      name: 'expenses',
      // route level code-splitting
      // this generates a separate chunk (Expenses.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ExpensesView.vue'),
      meta: { title: 'Mes dépenses' }
    },
    {
      path: '/profil/budgets',
      name: 'budgets',
      // route level code-splitting
      // this generates a separate chunk (Budgets.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/BudgetsView.vue'),
      meta: { title: 'Mes budgets' }
    },
  ],
});

router.afterEach((to) => {
  const defaultTitle = 'Mon Prévisionnel'; // Global application name
  document.title = to.meta.title ? `${to.meta.title} - ${defaultTitle}` : defaultTitle;
});

export default router
