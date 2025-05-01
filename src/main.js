// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // ✅ import the Vuex store

const app = createApp(App);

app.use(router);
app.use(store); // ✅ inject the store into the app

app.mount('#app');

console.log(localStorage.getItem('auth_token'));