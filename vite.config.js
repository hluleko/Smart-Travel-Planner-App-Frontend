import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/', // Change this to the subdirectory where your app will be hosted, or use '/' if it's hosted at the root.
})
export default defineConfig({
  base: '/hluleko/Smart-Travel-App-Frontend/', // same as GitHub repo name
  plugins: [vue()],
});
