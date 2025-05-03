<template>
  <div id="app">
    <AppHeader />
    <router-view />
  </div>
</template>

<script>
import AppHeader from './components/common/AppHeader.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
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

<style>
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
