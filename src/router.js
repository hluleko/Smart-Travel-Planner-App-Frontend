import { createRouter, createWebHistory } from "vue-router";

import Register from "./components/register_form.vue";
import Login from "./components/login_form.vue";
import Profile from "./components/user_profile.vue";
import FindLocations from "./components/find_locations.vue";
import LandingPage from "./components/landing_page.vue";

const routes = [
  { path: "/", component: LandingPage },       // Landing page for "/"
  { path: "/login", component: Login },        // Login page
  { path: "/register", component: Register },  // Register page
  { path: "/profile", component: Profile },    // User profile
  { path: "/findlocations", component: FindLocations }, // Find locations
  { path: "/home", redirect: "/" },            // Redirect /home to /
  { path: "/:pathMatch(.*)*", redirect: "/" }, // Catch-all 404 redirect
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, left: 0, behavior: "instant" }; // Always scroll top
  },
});

export default router;
