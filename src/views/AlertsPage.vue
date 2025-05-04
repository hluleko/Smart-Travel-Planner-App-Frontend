<template>
    <div class="alerts-container">
      <h2>Your Alerts</h2>
  
      <div v-if="loading" class="loading">Loading alerts...</div>
  
      <div v-else>
        <div v-if="alerts.length === 0" class="no-alerts">
          You have no alerts at the moment.
        </div>
  
        <div v-for="alert in alerts" :key="alert.alert_id" class="alert-item">
          <div :class="['alert', alert.type]">
            <p><strong>{{ alert.type }}:</strong> {{ alert.message }}</p>
            <p><small>Created at: {{ formatDate(alert.created_at) }}</small></p>
  
            <div class="alert-actions">
              <button @click="markAsSeen(alert.alert_id)" :disabled="alert.seen">
                {{ alert.seen ? 'Seen' : 'Mark as Seen' }}
              </button>
              <button @click="deleteAlert(alert.alert_id)">Delete</button>
            </div>
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
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .alert-item {
    background-color: #f9f9f9;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }
  
  .alert {
    margin-bottom: 10px;
  }
  
  .alert-info {
    border-left: 5px solid #007bff;
  }
  
  .alert-error {
    border-left: 5px solid #dc3545;
  }
  
  .alert-warning {
    border-left: 5px solid #ffc107;
  }
  
  .alert-actions button {
    margin-right: 10px;
  }
  
  .no-alerts {
    color: #777;
    text-align: center;
  }
  </style>
  