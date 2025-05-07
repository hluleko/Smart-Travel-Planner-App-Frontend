<template>
  <div class="main-background-image">
   <div class="main-page">
            <div class="main-header">
              <div class="header-content">
                <h1><span class="material-symbols-outlined">person_add</span>Register</h1>
              </div>
            </div>
        
            <div  class="grid-list">

              <div class="register-container">
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

            </div>
        </div>
      </div>

  </template>
  
  <script>
  import { registerUser, logAdminActivity } from "@/api/BackendApi";
  
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
  
          // Log activity (no token needed)
          await logAdminActivity({ type: 'account_created' });
          console.log('Admin activity logged successfully.');
  
          // Reset fields
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
      text-align: left;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      padding: 20px;
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
    box-sizing: border-box;
  }
  
  button {
    background: #0071c2;
    background: #0077B5;
    background: var(--secondary);
    color: white;
    width: 100%;
    padding: 16px;
    border: none;
    border-radius: 4px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
    margin-top: 8px;
  }
  
  button:disabled {
    background: #6c757d;
  }

  .button:hover {
    background: var(--secondary-dark);
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
  