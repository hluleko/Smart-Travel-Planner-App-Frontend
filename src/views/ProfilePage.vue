<template>
  <div class="main-page">
  <div class="main-header">
    <div class="header-content">
      <h1><span class="material-symbols-outlined">person</span>My Profile</h1>
    </div>
  </div>

  <div v-if="isLoading" class="loading">
    <span class="material-symbols-outlined spin">progress_activity</span>
    Loading profile...
  </div>

  <div v-else-if="!user" class="no-content">
    <span class="material-symbols-outlined">public_off</span>
    <p>Please login</p>
  </div>

  <div v-else class="grid-list">

          <div class="profile-header">
        <span class="material-symbols-outlined header-icon">person</span>
        <h2>Welcome, {{ user.username || user.email }}</h2>

     
        <div v-if="user.user_role == 'admin'" class="admin-dashboard">
        <div class="admin-header">
            <span class="material-symbols-outlined">admin_panel_settings</span>
            <h2>Admin</h2>
        </div>
        
        <div class="admin-stats-grid">
            <div class="stat-card success">
                <div class="stat-content">
                    <span class="material-symbols-outlined">group_add</span>
                    <div class="stat-text">
                        <h3>User Registrations</h3>
                        <p class="stat-value">{{ adminStats?.number_of_users_registered }}</p>
                    </div>
                </div>
            </div>
            
            <div class="stat-card danger">
                <div class="stat-content">
                    <span class="material-symbols-outlined">person_remove</span>
                    <div class="stat-text">
                        <h3>Account Deletions</h3>
                        <p class="stat-value">{{ adminStats?.number_of_users_deleted }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>




      </div>

      <div class="profile-details">
        <div class="detail-card">
          <span class="material-symbols-outlined">mail</span>
          <div>
            <h3>Email Address</h3>
            <p>{{ user.email }}</p>
          </div>
        </div>
        
        <div class="detail-card">
          <span class="material-symbols-outlined">badge</span>
          <div>
            <h3>Username</h3>
            <p>{{ user.username || 'Not set' }}</p>
          </div>
        </div>

        <div class="detail-card">
          <span class="material-symbols-outlined">verified_user</span>
          <div>
            <h3>Role</h3>
            <p>{{ user.user_role || 'Not set' }}</p>
          </div>
        </div>


      </div>

      <div class="action-grid">
        <button @click="$router.push('/trips')" class="action-btn primary"  v-if="user.user_role != 'admin'">
          <span class="material-symbols-outlined">luggage</span>
          My Trips
        </button>
        <button @click="$router.push('/alerts')" class="action-btn" v-if="user.user_role != 'admin'">
          <span class="material-symbols-outlined">notifications</span>
          My Alerts
        </button>
        <button @click="$router.push('/admin-dashboard')" class="action-btn primary" v-if="user.user_role == 'admin'">
          <span class="material-symbols-outlined">admin_panel_settings</span>
          Admin Dashboard
        </button>
        <button @click="$router.push('/export')" class="action-btn" v-if="user.user_role == 'admin'">
          <span class="material-symbols-outlined">cloud_download</span>
          Export Tables
        </button>
          <button @click="openUpdateModal" class="action-btn">
          <span class="material-symbols-outlined">edit</span>
          Update Profile
        </button>
        <button @click="handleLogout" class="action-btn warning">
          <span class="material-symbols-outlined">logout</span>
          Logout
        </button>
        <button @click="confirmDelete" class="action-btn danger">
          <span class="material-symbols-outlined">delete_forever</span>
          Delete Account
        </button>
      </div>

      <!-- Update Modal -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h3><span class="material-symbols-outlined">manage_accounts</span> Update Profile</h3>
            <button @click="closeModal" class="modal-close">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <form @submit.prevent="updateProfile">
            <div class="form-group">
              <label><span class="material-symbols-outlined">badge</span> Username</label>
              <input v-model="form.username" type="text" required />
            </div>
            <div class="form-group">
              <label><span class="material-symbols-outlined">mail</span> Email</label>
              <input v-model="form.email" type="email" required />
            </div>
            <div class="form-actions">
              <button type="button" @click="closeModal" class="btn secondary">
                Cancel
              </button>
              <button type="submit" :disabled="loading" class="btn primary">
                <span v-if="loading" class="material-symbols-outlined spin">progress_activity</span>
                {{ loading ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>

  </div>
</div>

</template>

<script>
import { mapState, mapMutations } from "vuex";
import { updateUserProfile, deleteUserProfile, logAdminActivity, createAlert, getAdminStats } from "@/api/BackendApi";

export default {
name: "ProfilePage",
data() {
return {
  showModal: false,
  isLoading: false,
  loading: false,
  form: {
    username: "",
    email: "",
  },
  adminStats: {},
};
},
created() {
   this.getStats();
},
computed: {
...mapState(["user", "token"]),
},
methods: {

  async getStats() {
  try {
    const response = await getAdminStats(); 
    const stats = response.data;
    this.adminStats = stats;
    console.log("Registered users:", stats.number_of_users_registered);
    console.log("Deleted users:", stats.number_of_users_deleted);
  } catch (error) {
    console.error("Failed to fetch user stats:", error.message);
  }
},
...mapMutations(["logout", "setUser"]),

openUpdateModal() {
  this.form.username = this.user.username || "";
  this.form.email = this.user.email || "";
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
max-width: 800px;
margin: 2rem auto;
padding: 2rem;
background: white;
border-radius: 16px;
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.profile-header {
text-align: center;
margin-bottom: 3rem;
}

.header-icon {
font-size: 3.5rem;
color: #0071c2;
margin-bottom: 1rem;
}

h2 {
font-size: 2rem;
color: #262626;
margin: 0;
}

.profile-details {
display: grid;
gap: 1.5rem;
margin-bottom: 3rem;
}

.detail-card {
display: flex;
align-items: center;
gap: 1.5rem;
padding: 1.5rem;
background: var(--base-200);
border-radius: 12px;
transition: transform 0.2s ease;
}

.detail-card:hover {
transform: translateY(-2px);
}

.detail-card span {
font-size: 2rem;
color: #0071c2;
}

.detail-card h3 {
margin: 0 0 0.25rem;
font-size: 1.1rem;
color: #666;
}

.detail-card p {
margin: 0;
font-size: 1.25rem;
color: #262626;
font-weight: 500;
}


.grid-list {
background: white;
border-radius: 12px;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
transition: transform 0.2s ease, box-shadow 0.2s ease;
overflow: hidden;
padding: 20px;
}


.action-grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 1rem;
}

.action-btn {
display: flex;
align-items: center;
gap: 0.75rem;
padding: 1.25rem;
border: none;
border-radius: 8px;
background: #f1f3f5;
color: #262626;
font-weight: 500;
cursor: pointer;
transition: all 0.2s ease;
}

.action-btn:hover {
background: #e9ecef;
transform: translateY(-2px);
}

.action-btn.primary {
background: #0071c2;
color: white;
}

.action-btn.primary:hover {
background: #005699;
}

.action-btn.warning {
background: #ffb700;
color: white;
}

.action-btn.warning:hover {
background: #cc9200;
}

.action-btn.danger {
background: #dc3545;
color: white;
}

.action-btn.danger:hover {
background: #bb2d3b;
}

.modal-overlay {
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: rgba(0, 0, 0, 0.4);
display: flex;
align-items: center;
justify-content: center;
backdrop-filter: blur(3px);
}

.modal {
background: white;
padding: 2rem;
border-radius: 16px;
width: 90%;
max-width: 500px;
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.modal-header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 2rem;
}

.modal-header h3 {
display: flex;
align-items: center;
gap: 0.5rem;
margin: 0;
}

.modal-close {
background: none;
border: none;
padding: 0.5rem;
border-radius: 50%;
cursor: pointer;
transition: all 0.2s ease;
}

.modal-close:hover {
background: #f8f9fa;
}

.form-group {
margin-bottom: 1.5rem;
}

.form-group label {
display: flex;
align-items: center;
gap: 0.5rem;
margin-bottom: 0.5rem;
color: #666;
}

input {
width: 100%;
padding: 0.75rem 1rem;
border: 1px solid #e0e0e0;
border-radius: 8px;
font-size: 1rem;
transition: border-color 0.2s ease;
box-sizing: border-box;
}

input:focus {
outline: none;
border-color: #0071c2;
box-shadow: 0 0 0 2px rgba(0, 113, 194, 0.1);
}

.form-actions {
display: flex;
gap: 1rem;
margin-top: 2rem;
}

.btn {
flex: 1;
padding: 0.75rem 1rem;
border: none;
border-radius: 8px;
font-weight: 500;
cursor: pointer;
transition: all 0.2s ease;
}

.btn.primary {
background: #0071c2;
color: white;
}

.btn.primary:hover {
background: #005699;
}

.btn.secondary {
background: #f1f3f5;
color: #262626;
}

.btn.secondary:hover {
background: #e9ecef;
}

.loading-state {
display: flex;
align-items: center;
justify-content: center;
gap: 1rem;
padding: 4rem;
color: #666;
}

.spin {
animation: spin 1s linear infinite;
}

@keyframes spin {
from { transform: rotate(0deg); }
to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
.profile-container {
padding: 1.5rem;
margin: 1rem;
}

.action-grid {
grid-template-columns: 1fr;
}

.detail-card {
padding: 1rem;
gap: 1rem;
}

.detail-card span {
font-size: 1.5rem;
}
}


button{
box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}

.admin-dashboard {
    background: #f8fafc;
    border-radius: 16px;
    padding: 2rem;
    margin: 2rem 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.admin-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
}

.admin-header h2 {
    font-size: 1.75rem;
    color: #1e293b;
    margin: 0;
}

.admin-header .material-symbols-outlined {
    font-size: 2.5rem;
    color: #3b82f6;
}

.admin-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.stat-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.stat-content {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.stat-card .material-symbols-outlined {
    font-size: 2.2rem;
    padding: 1rem;
    border-radius: 8px;
}

.stat-card.success .material-symbols-outlined {
    background: #dbeafe;
    color: #2563eb;
}

.stat-card.danger .material-symbols-outlined {
    background: #fee2e2;
    color: #dc2626;
}

.stat-text h3 {
    margin: 0 0 0.25rem;
    font-size: 1.1rem;
    color: #64748b;
    font-weight: 500;
}

.stat-value {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e293b;
}

@media (max-width: 768px) {
    .admin-dashboard {
        padding: 1.5rem;
    }
    
    .admin-header h2 {
        font-size: 1.5rem;
    }
}

</style>