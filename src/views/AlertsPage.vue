<template>

<div class="main-page">
      <div class="main-header">
        <div class="header-content">
          <h1><span class="material-symbols-outlined">notifications</span>My Alerts</h1>
        </div>
      </div>
  
      <div v-if="loading" class="loading-state">
        <span class="material-symbols-outlined spin">progress_activity</span>
        Loading alerts...
      </div>
  
      <div v-else-if="alerts.length === 0" class="no-alerts">
          <span class="material-symbols-outlined">notifications_off</span>
          <p>No alerts to display</p>
       </div>
  
      <div v-else class="grid-list-2">

          <div v-for="alert in alerts" :key="alert.alert_id" class="alert-card" :class="alert.type">
            <div class="alert-icon">
              <span class="material-symbols-outlined">{{ getIcon(alert.type) }}</span>
            </div>
            <div class="alert-content">
              <div class="alert-message">{{ alert.message }}</div>
              <div class="alert-meta">
                <span class="timestamp">
                  <span class="material-symbols-outlined">schedule</span>
                  {{ formatDate(alert.created_at) }}
                </span>
                <span class="status" :class="{ seen: alert.seen }">
                  {{ alert.seen ? 'Viewed' : 'New' }}
                </span>
              </div>
            </div>
            <div class="alert-actions">
              <button 
                @click="markAsSeen(alert.alert_id)" 
                :disabled="alert.seen"
                class="seen-btn"
              >
                <span class="material-symbols-outlined">{{ alert.seen ? 'check_circle' : 'mark_as_unread' }}</span>
              </button>
              <button @click="deleteAlert(alert.alert_id)" class="delete-btn">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>

      </div>
    </div>


  </template>
  
  <script>
  import { mapState } from "vuex";
  import { getUserAlerts, markAlertAsSeen, deleteAlert } from "@/api/BackendApi";
  
  export default {
    name: "AlertsPage",
    data() {
      return {
        alerts: [],
        loading: false,
      };
    },
    computed: {
      ...mapState(["user", "token"]),
    },
    methods: {
      // Fetch all alerts for the user
      async fetchAlerts() {
        this.loading = true;
        try {
          const response = await getUserAlerts(this.token, this.user.user_id);
          this.alerts = response.data;
        } catch (err) {
          console.error("Error fetching alerts:", err);
          alert("Failed to fetch alerts.");
        } finally {
          this.loading = false;
        }
      },
  
      // Mark alert as seen
      async markAsSeen(alertId) {
        try {
          // Call API to mark the alert as seen
          await markAlertAsSeen(this.token, alertId);
          // After marking, update the alerts list to reflect the change
          this.fetchAlerts(); // Refresh alerts after update
        } catch (err) {
          console.error("Error marking alert as seen:", err);
          alert("Failed to mark alert as seen.");
        }
      },
  
      // Delete an alert
      async deleteAlert(alertId) {
        try {
          await deleteAlert(this.token, alertId);
          this.fetchAlerts(); // Refresh alerts after deletion
        } catch (err) {
          console.error("Error deleting alert:", err);
          alert("Failed to delete alert.");
        }
      },
  
      // Format the date (e.g., from ISO string to readable format)
      formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString();
      },

      getIcon(type) {
            const icons = {
            info: 'info',
            error: 'warning',
            warning: 'report'
            };
            return icons[type] || 'notification_important';
        },
      
    },
    mounted() {
      if (this.user && this.token) {
        this.fetchAlerts(); // Fetch alerts when the component is mounted
      }
    },
  };
  </script>
  
<style scoped>
.alerts-container {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.alerts-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.alerts-header h2 {
  font-size: 1.8rem;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alert-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
}

.alert-card:hover {
  transform: translateY(-2px);
}

.alert-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.alert-icon .material-symbols-outlined {
  font-size: 1.8rem;
}

/* Type-specific styling */
.alert-card.info {
  border-left: 4px solid #28a745;
}
.alert-card.info .alert-icon {
  background: #e6f4ea;
}
.alert-card.info .material-symbols-outlined {
  color: #28a745;
}

.alert-card.error {
  border-left: 4px solid #dc3545;
}
.alert-card.error .alert-icon {
  background: #fde8e8;
}
.alert-card.error .material-symbols-outlined {
  color: #dc3545;
}

.alert-card.warning {
  border-left: 4px solid #ffb700;
}
.alert-card.warning .alert-icon {
  background: #fff4e5;
}
.alert-card.warning .material-symbols-outlined {
  color: #ffb700;
}

.alert-content {
  flex: 1;
}

.alert-message {
  font-size: 1rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.alert-meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-size: 0.875rem;
}

.timestamp {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #718096;
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.status:not(.seen) {
  background: #f56565;
  color: white;
}

.status.seen {
  background: #cbd5e0;
  color: #4a5568;
}

.alert-actions {
  display: flex;
  gap: 0.5rem;
}

button {
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.seen-btn {
  background: #e2e8f0;
  color: #4a5568;
}

.seen-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.seen-btn:not(:disabled):hover {
  background: #cbd5e0;
}

.delete-btn {
  background: #fed7d7;
  color: #f56565;
}

.delete-btn:hover {
  background: #feb2b2;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: #4a5568;
}

.no-alerts {
  text-align: center;
  padding: 3rem;
  color: #a0aec0;
}

.no-alerts .material-symbols-outlined {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .alert-card {
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
  }
  
  .alert-icon {
    width: 40px;
    height: 40px;
  }
}
</style>
