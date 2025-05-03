<template>
  <header class="app-header fixed-header">
    <div class="logo">
      <h1 @click="$router.push('/')">Smart Travel Planner</h1>
    </div>
    <nav>
      <ul>
        <li v-if="isLoggedIn">
          <img @click="$router.push('/profile')" src="@/assets/profileIcon.png" alt="User Icon" class="user-icon" />
          <button @click="logout" class="logout-button">Logout</button>
        </li>
        <li v-else>
          <button @click="goToLogin" class="sign-in-button">Sign In</button>
          <button @click="$router.push('/register')" class="sign-in-button">Register</button>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: "AppHeader",
  computed: {
    ...mapGetters(['userData']),
    isLoggedIn() {
      return !!this.userData; // Check if there's user data in store
    },
  },
  methods: {
    ...mapMutations(['setUser', 'setToken']), // Map mutations for setting user and token
    logout() {
      // Clear user data and token from Vuex and localStorage
      this.setUser(null);
      this.setToken(null); // Clear token from Vuex
      localStorage.removeItem('auth_token'); // Remove token from localStorage
      this.$router.push('/login'); // Redirect to login page
    },
    goToLogin() {
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
}

nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
}

nav li {
  margin-left: 15px;
}

.user-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.sign-in-button,
.logout-button {
  background-color: white;
  color: #007bff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.sign-in-button:hover,
.logout-button:hover {
  background-color: #0056b3;
  color: white;
}
</style>
