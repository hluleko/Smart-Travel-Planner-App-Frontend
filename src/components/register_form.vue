<template>
  <div class="container">
    <h2>Register</h2>
    <form @submit.prevent="register" class="register-form">
      <div class="form-group">
        <input v-model="user.username" placeholder="Username" required @input="validateUsername" />
        <p v-if="errors.username" class="error">{{ errors.username }}</p>
      </div>

      <div class="form-group">
        <input v-model="user.email" type="email" placeholder="Email" required @input="validateEmail" />
        <p v-if="errors.email" class="error">{{ errors.email }}</p>
      </div>

      <div class="form-group">
        <input v-model="user.password" type="password" placeholder="Password" required @input="validatePassword" />
        <p v-if="errors.password" class="error">{{ errors.password }}</p>
      </div>

      <div class="form-group">
        <input v-model="user.destination" placeholder="Where do you want to go?" required />
      </div>

      <div class="form-group">
        <input v-model="user.budget" type="number" placeholder="Enter budget" required @input="validateBudget" />
        <p v-if="errors.budget" class="error">{{ errors.budget }}</p>
      </div>

      <div class="form-group">
        <input v-model="user.dietary_restrictions" placeholder="E.g., Vegetarian, Halal" />
      </div>

      <div class="form-group">
        <input v-model="user.accessibility_needs" placeholder="E.g., Wheelchair access" />
      </div>

      <div class="form-group">
        <input v-model="user.language_preferences" placeholder="E.g., English, Zulu" />
      </div>

      <button type="submit" class="register-btn" :disabled="hasErrors">Register</button>
    </form>
    <p class="message">{{ message }}</p>
  </div>
</template>

<script>
import { registerUser } from "../api";

export default {
  data() {
    return {
      user: {
        username: "",
        email: "",
        password: "",
        destination: "",
        budget: "",
        dietary_restrictions: "",
        accessibility_needs: "",
        language_preferences: "",
      },
      errors: {
        username: "",
        email: "",
        password: "",
        budget: "",
      },
      message: "",
    };
  },
  computed: {
    hasErrors() {
      return Object.values(this.errors).some((error) => error !== "");
    },
  },
  methods: {
    async register() {
      if (this.hasErrors) return;
      try {
        await registerUser(this.user);
        this.message = "Registered successfully!";
        this.$router.push('/login');
      } catch (error) {
        this.message = error.response?.data?.error || "Registration failed.";
      }
    },
    validateUsername() {
      const regex = /^[a-zA-Z0-9]+$/;
      this.errors.username = regex.test(this.user.username)
        ? ""
        : "Username should only contain letters and numbers.";
    },
    validateEmail() {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.errors.email = regex.test(this.user.email)
        ? ""
        : "Enter a valid email address.";
    },
    validatePassword() {
      this.errors.password = this.user.password.length >= 6
        ? ""
        : "Password must be at least 6 characters long.";
    },
    validateBudget() {
      this.errors.budget = this.user.budget > 0
        ? ""
        : "Budget must be a positive number.";
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: auto;
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  font-size: 2rem;
  color: #007bff;
  margin-bottom: 1.5rem;
}

.register-form {
  text-align: left;
}

.form-group {
  margin-bottom: 1.5rem;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

.register-btn {
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  background: linear-gradient(135deg, #007bff, #00bfff);
  color: white;
  width: 100%;
  margin-top: 1rem;
}

.register-btn:disabled {
  background: gray;
  cursor: not-allowed;
}

.error {
  color: red;
  font-size: 0.875rem;
}
</style>
