<template>
  <div class="container">
    <h2>Login</h2>
    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <input v-model="user.email" placeholder="Email" required />
      </div>
      <div class="form-group">
        <input v-model="user.password" type="password" placeholder="Password" required />
      </div>
      <button type="submit" class="login-btn">Login</button>
    </form>

    <!-- Register Button -->
    <button @click="goToRegister" class="register-link-btn">Don't have an account? Register here</button>

    <p class="message">{{ message }}</p>
  </div>
</template>

<script>
import { loginUser } from "../api";

export default {
  data() {
    return {
      user: { email: "", password: "" },
      message: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await loginUser(this.user);
        localStorage.setItem("token", response.data.token);
        this.message = "Login successful!";
        this.$router.push("/profile");
      } catch (error) {
        this.message = error.response?.data?.error || "Login failed.";
      }
    },

    // Navigate to the register page
    goToRegister() {
      this.$router.push("/register"); // Redirects to the Register page
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

.login-form {
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
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
}

input:focus {
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
  outline: none;
}

.login-btn {
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  background: linear-gradient(135deg, #007bff, #00bfff);
  color: white;
  width: 100%;
  margin-top: 1rem;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.login-btn:hover {
  background: linear-gradient(135deg, #00bfff, #007bff);
  transform: translateY(-2px);
}

.register-link-btn {
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  color: #007bff;
  width: 100%;
  margin-top: 1rem;
  transition: color 0.3s ease, transform 0.3s ease;
}

.register-link-btn:hover {
  color: #0056b3;
  transform: translateY(-2px);
}

.message {
  margin-top: 1.5rem;
  color: #007bff;
  color: red;
  font-weight: 500;
}
</style>