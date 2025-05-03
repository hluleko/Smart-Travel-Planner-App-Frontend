<template>
    <div class="register-container">
      <h2>Register</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Username</label>
          <input v-model="username" type="text" required />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" required />
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? "Registering..." : "Register" }}
        </button>
        <p class="success" v-if="success">{{ success }}</p>
        <p class="error" v-if="error">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import { registerUser } from "@/api/BackendApi";
  
  export default {
    name: 'RegisterPage',
    data() {
      return {
        username: '',
        email: '',
        password: '',
        language_preferences: '',
        loading: false,
        error: '',
        success: '',
      };
    },
    methods: {
      async handleRegister() {
        this.error = '';
        this.success = '';
        this.loading = true;
        try {
          const payload = {
            username: this.username,
            email: this.email,
            password: this.password,
            language_preferences: this.language_preferences,
          };
          const response = await registerUser(payload);
          this.success = response.data.message || 'Registration successful!';
          this.username = this.email = this.password = this.language_preferences = '';
        } catch (err) {
          this.error = err.response?.data?.error || 'Registration failed.';
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .register-container {
    max-width: 400px;
    margin: 100px auto;
    padding: 2rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  
  h2 {
    margin-bottom: 1rem;
    color: #28a745;
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
    background: #28a745;
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
  
  .success {
    color: green;
    margin-top: 1rem;
  }
  </style>
  