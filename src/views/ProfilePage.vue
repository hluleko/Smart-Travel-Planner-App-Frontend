<template>
  <div class="profile-container">
    <h2>User Profile</h2>

    <form @submit.prevent="handleUpdateProfile" v-if="user">
      <div class="form-group">
        <label>Username:</label>
        <input type="text" :value="user.username" disabled />
      </div>

      <div class="form-group">
        <label>Email:</label>
        <input type="email" :value="user.email" disabled />
      </div>

      <div class="form-group">
        <label>Destination:</label>
        <input v-model="form.destination" type="text" />
      </div>

      <div class="form-group">
        <label>Budget:</label>
        <input v-model="form.budget" type="number" step="0.01" />
      </div>

      <div class="form-group">
        <label>Dietary Restrictions:</label>
        <input v-model="form.dietary_restrictions" type="text" />
      </div>

      <div class="form-group">
        <label>Accessibility Needs:</label>
        <input v-model="form.accessibility_needs" type="text" />
      </div>

      <div class="form-group">
        <label>Language Preferences:</label>
        <input v-model="form.language_preferences" type="text" />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Updating...' : 'Update Profile' }}
      </button>

      <button class="delete-btn" @click.prevent="handleDeleteProfile" :disabled="loading">
        Delete Profile
      </button>

      <p class="message success" v-if="successMessage">{{ successMessage }}</p>
      <p class="message error" v-if="errorMessage">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ProfilePage',
  data() {
    return {
      form: {
        destination: '',
        budget: '',
        dietary_restrictions: '',
        accessibility_needs: '',
        language_preferences: '',
      },
      loading: false,
      successMessage: '',
      errorMessage: '',
    };
  },
  computed: {
    ...mapState(['user']),
  },
  created() {
    console.log('User data on creation:', this.user); // Log user data for debugging
    if (this.user) {
      this.initForm(this.user);
      console.log('User data after refresh :', this.user); // Log user data for debugging
    }
  },
  methods: {
    ...mapActions(['updateProfile', 'deleteProfile', 'fetchUser']),
    
    initForm(user) {
      if (user) {
        this.form = {
          destination: user.destination || '',
          budget: user.budget || '',
          dietary_restrictions: user.dietary_restrictions || '',
          accessibility_needs: user.accessibility_needs || '',
          language_preferences: user.language_preferences || '',
        };
      }
    },

    async handleUpdateProfile() {
      this.loading = true;
      this.successMessage = '';
      this.errorMessage = '';
      try {
        await this.updateProfile(this.form);
        await this.fetchUser();
        this.successMessage = 'Profile updated successfully!';
      } catch (err) {
        console.error('Update failed:', err);
        this.errorMessage = err.response?.data?.error || 'Failed to update profile.';
      } finally {
        this.loading = false;
      }
    },

    async handleDeleteProfile() {
      if (!confirm('Are you sure you want to delete your profile? This action cannot be undone.')) return;
      this.loading = true;
      try {
        await this.deleteProfile();
        this.$router.push('/login');
      } catch (err) {
        this.errorMessage = 'Failed to delete profile.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.profile-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
h2 {
  margin-bottom: 1.5rem;
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
  padding: 0.6rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
button {
  width: 100%;
  padding: 0.8rem;
  background: #007bff;
  border: none;
  color: white;
  font-weight: bold;
  border-radius: 4px;
  margin-top: 1rem;
  cursor: pointer;
}
button.delete-btn {
  background: #dc3545;
  margin-top: 0.5rem;
}
button:disabled {
  background: #6c757d;
}
.message {
  margin-top: 1rem;
  font-weight: bold;
}
.success {
  color: green;
}
.error {
  color: red;
}
</style>
