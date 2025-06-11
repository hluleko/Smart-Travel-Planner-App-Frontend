<template>
  <div class="main-page">
    <div class="main-header">
      <div class="header-content">
        <h1><span class="material-symbols-outlined">admin_panel_settings</span> Admin Dashboard</h1>
        <button @click="$router.push('/profile')" class="main-btn">
          <span class="material-symbols-outlined">arrow_back</span>
          Back to Profile
        </button>
      </div>
    </div>

    <div v-if="adminDataLoading" class="loading">
      <span class="material-symbols-outlined spin">progress_activity</span>
      Loading data...
    </div>

    <div v-else-if="!isAdmin" class="no-content">
      <span class="material-symbols-outlined">security</span>
      <p>You don't have permission to access this page.</p>
    </div>

    <div v-else class="admin-container">
      <div class="admin-tabs">
        <button 
          :class="['tab-btn', { active: activeTab === 'users' }]" 
          @click="activeTab = 'users'"
        >
          <span class="material-symbols-outlined">group</span>
          All Users
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'trips' }]" 
          @click="activeTab = 'trips'"
        >
          <span class="material-symbols-outlined">luggage</span>
          All Trips
        </button>
      </div>

      <!-- Users Tab -->
      <div v-if="activeTab === 'users'" class="tab-content">
        <div class="search-container">
          <div class="search-box">
            <span class="material-symbols-outlined">search</span>
            <input v-model="userSearchQuery" placeholder="Search users..." />
            <button v-if="userSearchQuery" @click="userSearchQuery = ''" class="clear-btn">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.user_id">
                <td>{{ user.user_id }}</td>
                <td>{{ user.username || 'N/A' }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.user_role }}</td>
                <td>{{ formatDate(user.created_at) }}</td>
              </tr>
              <tr v-if="filteredUsers.length === 0">
                <td colspan="5" class="no-data">No users found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Trips Tab -->
      <div v-if="activeTab === 'trips'" class="tab-content">
        <div class="search-container">
          <div class="search-box">
            <span class="material-symbols-outlined">search</span>
            <input v-model="tripSearchQuery" placeholder="Search trips..." />
            <button v-if="tripSearchQuery" @click="tripSearchQuery = ''" class="clear-btn">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>User</th>
                <th>Destination</th>
                <th>Dates</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="trip in filteredTrips" :key="trip.trip_id">
                <td>{{ trip.trip_id }}</td>
                <td>{{ trip.title }}</td>
                <td>{{ trip.username || trip.email }}</td>
                <td>{{ trip.location || 'N/A' }}</td>
                <td>{{ formatDate(trip.start_date) }} - {{ formatDate(trip.end_date) }}</td>
                <td>{{ formatDate(trip.created_at) }}</td>
              </tr>
              <tr v-if="filteredTrips.length === 0">
                <td colspan="6" class="no-data">No trips found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      activeTab: 'users',
      userSearchQuery: '',
      tripSearchQuery: ''
    };
  },
  computed: {
    ...mapState([
      'adminUsers',
      'adminTrips',
      'adminDataLoading',
      'user'
    ]),
    ...mapGetters(['isAdmin']),
    
    filteredUsers() {
      if (!this.userSearchQuery) return this.adminUsers;
      
      const query = this.userSearchQuery.toLowerCase();
      return this.adminUsers.filter(user => 
        (user.username && user.username.toLowerCase().includes(query)) || 
        user.email.toLowerCase().includes(query) ||
        (user.user_id && String(user.user_id).includes(query))
      );
    },
    
    filteredTrips() {
      if (!this.tripSearchQuery) return this.adminTrips;
      
      const query = this.tripSearchQuery.toLowerCase();
      return this.adminTrips.filter(trip => 
        (trip.title && trip.title.toLowerCase().includes(query)) ||
        (trip.location && trip.location.toLowerCase().includes(query)) ||
        (trip.username && trip.username.toLowerCase().includes(query)) ||
        (trip.email && trip.email.toLowerCase().includes(query)) ||
        (trip.trip_id && String(trip.trip_id).includes(query))
      );
    }
  },
  methods: {
    ...mapActions(['fetchAdminData']),
    
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    }
  },
  mounted() {
    if (this.isAdmin) {
      this.fetchAdminData();
    }
  }
};
</script>

<style scoped>
.admin-container {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.admin-tabs {
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--base-300);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.tab-btn:hover:not(.active) {
  color: var(--text-primary);
  background: var(--base-100);
}

.tab-content {
  margin-top: 1.5rem;
}

.search-container {
  margin-bottom: 1.5rem;
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--base-100);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  width: 100%;
  max-width: 500px;
}

.search-box input {
  border: none;
  background: none;
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
}

.search-box input:focus {
  outline: none;
}

.clear-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: var(--text-secondary);
}

.table-container {
  overflow-x: auto;
  margin-top: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  text-align: left;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--base-200);
}

th {
  background: var(--base-100);
  font-weight: 600;
  color: var(--text-secondary);
}

tr:last-child td {
  border-bottom: none;
}

tr:hover td {
  background: var(--base-50);
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.spin {
  animation: spin 1s linear infinite;
  font-size: 2rem;
  margin-bottom: 1rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.no-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  text-align: center;
}

.no-content .material-symbols-outlined {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.no-content p {
  font-size: 1.25rem;
  color: var(--text-secondary);
}
</style>
