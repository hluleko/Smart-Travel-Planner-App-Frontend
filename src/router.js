// src/router.js
import { createRouter, createWebHistory } from "vue-router";
import Register from "./components/register_form.vue";
import Login from "./components/login_form.vue";
import Profile from "./components/user_profile.vue";

const routes = [
 { path: "/", component: Login },
  { path: "/register", component: Register },
  { path: "/login", component: Login },
  { path: "/profile", component: Profile },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
