<template>
  <div class="profile-container" v-if="user">
    <h2>Welcome, {{ user.username || user.email }}</h2>

    <div class="profile-details">
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Name:</strong> {{ user.username || 'Not set' }}</p>
      <p><strong>Language Preferences:</strong> {{ user.language_preferences || 'Not set' }}</p>
    </div>

    <div class="actions">
      <button @click="openUpdateModal">Update Profile</button>
      <button @click="handleLogout" class="logout">Logout</button>
      <button @click="confirmDelete" class="delete">Delete Account</button>
      <button @click="$router.push('/trips')">My Trips</button>
      <button @click="$router.push('/alerts')">My Alerts</button>
    </div>

    <!-- Update Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>Update Profile</h3>
        <form @submit.prevent="updateProfile">
          <label>Username</label>
          <input v-model="form.username" type="text" required />

          <label>Email</label>
          <input v-model="form.email" type="email" required />

          <label>Language Preferences</label>
          <input v-model="form.language_preferences" type="text" />

          <button type="submit" :disabled="loading">
            {{ loading ? 'Updating...' : 'Save' }}
          </button>
          <button type="button" @click="closeModal">Cancel</button>
        </form>
      </div>
    </div>
  </div>

  <div v-else class="loading">Loading user data...</div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { updateUserProfile, deleteUserProfile, logAdminActivity, createAlert } from "@/api/BackendApi";

export default {
  name: "ProfilePage",
  data() {
    return {
      showModal: false,
      loading: false,
      form: {
        username: "",
        email: "",
        language_preferences: "",
      },
    };
  },
  computed: {
    ...mapState(["user", "token"]),
  },
  methods: {
    ...mapMutations(["logout", "setUser"]),

    openUpdateModal() {
      this.form.username = this.user.username || "";
      this.form.email = this.user.email || "";
      this.form.language_preferences = this.user.language_preferences || "";
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },

    async updateProfile() {
        this.loading = true;
        try {
          const updatedData = {
            username: this.form.username,
            email: this.form.email,
            language_preferences: this.form.language_preferences,
          };

          await updateUserProfile(this.token, this.user.user_id, updatedData);
          this.setUser({ ...this.user, ...updatedData });

          //Create alert
          await createAlert(this.token, {
            user_id: this.user.user_id,
            type: 'warning',
            message: `You updated your profile.`,
            created_at: new Date().toISOString(),
            seen: false,
          });

          this.closeModal();
        } catch (err) {
          console.error("Error updating profile:", err);
          alert("Failed to update profile.");
        } finally {
          this.loading = false;
        }
      },

    handleLogout() {
      this.logout();
      this.$router.push("/login");
    },

    confirmDelete() {
      if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        this.deleteAccount();
      }
    },

    async deleteAccount() {
      try {
        await deleteUserProfile(this.token, this.user.user_id);
        await logAdminActivity({ type: 'account_deleted' });
        console.log('Admin activity logged successfully.');
        this.logout();
        this.$router.push("/signup");
      } catch (err) {
        console.error("Error deleting profile:", err);
        alert("Failed to delete account.");
      }
    },
  },
};
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
}

button {
  padding: 0.5rem 1rem;
  font-weight: bold;
  cursor: pointer;
}

.logout {
  background-color: #6c757d;
  color: white;
}

.delete {
  background-color: #dc3545;
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 6px;
  min-width: 300px;
}

.loading {
  text-align: center;
  margin-top: 4rem;
}
</style>
