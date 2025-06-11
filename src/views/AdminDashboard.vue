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
      <!-- Admin Stats Overview -->
      <AdminStats :stats="adminStats" />

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
        <UsersTable :users="filteredUsers" @search="userSearchQuery = $event" />
      </div>

      <!-- Trips Tab -->
      <div v-if="activeTab === 'trips'" class="tab-content">
        <TripsTable :trips="filteredTrips" @search="tripSearchQuery = $event" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import UsersTable from '@/components/admin/UsersTable.vue';
import TripsTable from '@/components/admin/TripsTable.vue';
import AdminStats from '@/components/admin/AdminStats.vue';

export default {
  name: 'AdminDashboard',
  components: {
    UsersTable,
    TripsTable,
    AdminStats
  },
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
    },
    
    adminStats() {
      return {
        userCount: this.adminUsers.length,
        tripCount: this.adminTrips.length,
        adminCount: this.adminUsers.filter(user => user.user_role === 'admin').length,
        activeTrips: this.adminTrips.filter(trip => {
          const endDate = new Date(trip.end_date);
          const today = new Date();
          return endDate >= today;
        }).length
      };
    }
  },
  methods: {
    ...mapActions(['fetchAdminData'])
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
