<template>
    <div class="main-page">
            <div class="main-header">
              <div class="header-content">
                <h1><span class="material-symbols-outlined">login</span>Login</h1>
              </div>
            </div>
        
        
            <div  class="grid-list">
                <div class="login-container">
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
            </div>
        </div>

</template>

<script>
import { loginUser, getUserProfile } from "@/api/BackendApi";
import { mapMutations } from "vuex";

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
      error: "",
      loading: false,
    };
  },
  methods: {
    ...mapMutations(["setToken", "setUser"]),
    async handleLogin() {
        this.error = "";
        this.loading = true;

        try {
          const response = await loginUser({
            email: this.email,
            password: this.password,
          });

          const token = response.data.token;
          const userId = response.data.user_id; // assuming backend returns this

          if (!userId) {
            throw new Error("User ID not found in login response.");
          }

          this.setToken(token);

          // Fetch and store user profile
          const profileRes = await getUserProfile(token, userId);
          this.setUser(profileRes.data);

          this.$router.push("/Profile");
        } catch (err) {
          this.error = err.response?.data?.error || "Login failed. Please try again.";
        } finally {
          this.loading = false;
        }
      }
  },
};
</script>

<style scoped>
.login-container {
  text-align: left;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  padding: 20px;
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
  box-sizing: border-box;
}

button {
  background: #0071c2;
    background: #0077B5;
    background: #003b95;
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



</style>
