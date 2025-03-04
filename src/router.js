import { createRouter, createWebHistory } from "vue-router";
import Register from "./components/register_form.vue";
import Login from "./components/login_form.vue";
import Profile from "./components/user_profile.vue";
import findlocations from "./components/find_locations.vue";

const routes = [
  { path: "/", component: Login },
  { path: "/register", component: Register },
  { path: "/login", component: Login },
  { path: "/profile", component: Profile },
  { path: "/findlocations", component: findlocations },
  { path: "/:pathMatch(.*)*", redirect: "/" }, // Redirect unknown paths to "/"
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, left: 0, behavior: "instant" }; // Scroll to top smoothly
  },
});

export default router;
