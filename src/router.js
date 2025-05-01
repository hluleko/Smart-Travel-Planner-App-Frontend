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
    path: '/Profile', 
    component: () => import('./views/ProfilePage.vue'),
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
