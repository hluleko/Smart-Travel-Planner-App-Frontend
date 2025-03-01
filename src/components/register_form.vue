<template>
  <div class="container">
    <h2>Register</h2>
    <form @submit.prevent="register" class="register-form">
      <div class="form-group">
        <input v-model="user.username" placeholder="Username" required />
      </div>
      <div class="form-group">
        <input v-model="user.email" type="email" placeholder="Email" required />
      </div>
      <div class="form-group">
        <input v-model="user.password" type="password" placeholder="Password" required />
      </div>
      <div class="form-group">
        <label>Destination:</label>
        <input v-model="user.destination" placeholder="Where do you want to go?" required />
      </div>
      <div class="form-group">
        <label>Budget (ZAR):</label>
        <input v-model="user.budget" type="number" placeholder="Enter budget" required />
      </div>
      <div class="form-group">
        <label>Dietary Restrictions:</label>
        <input v-model="user.dietary_restrictions" placeholder="E.g., Vegetarian, Halal" />
      </div>
      <div class="form-group">
        <label>Accessibility Needs:</label>
        <input v-model="user.accessibility_needs" placeholder="E.g., Wheelchair access" />
      </div>
      <div class="form-group">
        <label>Preferred Language:</label>
        <input v-model="user.language_preferences" placeholder="E.g., English, Zulu" />
      </div>
      <button type="submit" class="register-btn">Register</button>
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
      message: "",
    };
  },
  methods: {
    async register() {
      try {
        await registerUser(this.user);
        this.message = "Registered successfully!";
        this.$router.push('/login');
      } catch (error) {
        this.message = error.response?.data?.error || "Registration failed.";
      }
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

label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
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

.register-btn {
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

.register-btn:hover {
  background: linear-gradient(135deg, #00bfff, #007bff);
  transform: translateY(-2px);
}

.message {
  margin-top: 1.5rem;
  color: #007bff;
  color: red;
  font-weight: 500;
}
</style>