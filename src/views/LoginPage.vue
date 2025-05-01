<template>
    <div class="login-container">
      <h2>Sign In</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" required />
        </div>
        <button :disabled="loading" type="submit">
          {{ loading ? 'Signing In...' : 'Sign In' }}
        </button>
        <p class="error" v-if="error">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  
  export default {
    name: 'LoginPage',
    data() {
      return {
        email: '',
        password: '',
        error: '',
        loading: false,
      };
    },
    methods: {
      ...mapActions(['login']),
      async handleLogin() {
        this.error = '';
        this.loading = true;
        try {
          await this.login({ email: this.email, password: this.password });
          this.$router.push('/Profile');
        } catch (err) {
          this.error = err.response?.data?.message || 'Login failed. Try again.';
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 100px auto;
    padding: 2rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    text-align: left;
  }
  
  h2 {
    margin-bottom: 1rem;
    color: #007bff;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  input {
    width: 100%;
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  
  button {
    width: 100%;
    padding: 0.75rem;
    background: #007bff;
    border: none;
    color: white;
    font-weight: bold;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:disabled {
    background: #6c757d;
  }
  
  .error {
    color: red;
    margin-top: 1rem;
  }
  </style>
  