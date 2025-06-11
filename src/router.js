import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { 
    path: '/', 
    component: () => import('./views/HomePage.vue'),
  },
  { 
    path: '/login', 
    component: () => import('./views/LoginPage.vue'),
  },
  { 
    path: '/register', 
    component: () => import('./views/RegisterPage.vue'),
  },
  { 
    path: '/Profile', 
    component: () => import('./views/ProfilePage.vue'),
  },
  { 
    path: '/trips', 
    component: () => import('./views/TripsPage.vue'),
  },
  { 
    path: '/alerts', 
    component: () => import('./views/AlertsPage.vue'),
  },
  { 
    path: '/allergies', 
    component: () => import('./views/AllergiesPage.vue'),
  },
  { 
    path: '/export', 
    component: () => import('./views/ExportPage.vue'),
  },
  { 
    path: '/admin-dashboard', 
    component: () => import('./views/AdminDashboard.vue'),
  },

  // Wildcard route to redirect to '/' if path does not exist
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

export default router;
