<template>
  <div id="app">
    <AppHeader />
    <router-view />
    <BackButton/>
    <footer class="footer">
        <p>&copy; 2025 Smart Travel Planner. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import AppHeader from './components/common/AppHeader.vue';
import './global.css';
import BackButton from './components/common/BackButton.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    BackButton,
  },
  created() {
    console.log('Here is the token right now: ', localStorage.getItem("authToken"));
    // Only try to fetch user if there is a token
    if (this.$store.state.token) {
      this.$store.dispatch('fetchUser')
        .then(user => {
          console.log('User fetched:', user); // Log user data
        })
        .catch(err => {
          console.warn('Failed to fetch user:', err); // Log any errors
          // Handle invalid token or failed user fetch
          this.$store.dispatch('logout'); // Optionally, log out if fetching fails
        });
    } else {
      console.log('No token found. Skipping fetchUser.');
    }
  }
};
</script>

