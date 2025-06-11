<template>
  <div>
    <div class="search-container">
      <div class="search-box">
        <span class="material-symbols-outlined">search</span>
        <input v-model="searchQuery" placeholder="Search trips..." @input="$emit('search', searchQuery)" />
        <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>

    <div class="card-grid">
      <div v-for="trip in trips" :key="trip.trip_id" class="trip-card">
        <div class="trip-header">
          <div class="trip-icon">
            <span class="material-symbols-outlined">flight_takeoff</span>
          </div>
          <div class="trip-title">
            <h3>{{ trip.title || `Trip to ${trip.location}` }}</h3>
            <p class="trip-user">{{ trip.username || trip.email }}</p>
          </div>
          <div class="trip-badge" style="display: none;">
            <span class="material-symbols-outlined">today</span>
            {{ formatDate(trip.created_at) }}
          </div>
        </div>
        
        <div class="trip-details">
          <div class="detail-item">
            <span class="material-symbols-outlined">badge</span>
            <div>
              <p class="detail-label">Trip ID</p>
              <p class="detail-value">{{ trip.trip_id }}</p>
            </div>
          </div>
          
          <div class="detail-item">
            <span class="material-symbols-outlined">location_on</span>
            <div>
              <p class="detail-label">Destination</p>
              <p class="detail-value">{{ trip.location || 'Not specified' }}</p>
            </div>
          </div>
          
          <div class="detail-item">
            <span class="material-symbols-outlined">calendar_month</span>
            <div>
              <p class="detail-label">Trip Dates</p>
              <p class="detail-value">{{ formatDate(trip.start_date) }} - {{ formatDate(trip.end_date) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="trips.length === 0" class="no-data">
        <span class="material-symbols-outlined">luggage_off</span>
        <p>No trips found</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TripsTable',
  props: {
    trips: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      searchQuery: '',
    };
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    clearSearch() {
      this.searchQuery = '';
      this.$emit('search', '');
    }
  }
};
</script>

<style scoped>
.search-container {
  margin-bottom: 1.5rem;
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--base-100);
  border: 1px solid #eee;
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

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.trip-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.trip-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.trip-header {
  padding: 1.5rem;
  background: #f0f7ff;
  display: flex;
  align-items: center;
  position: relative;
}

.trip-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #0071c2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
}

.trip-icon .material-symbols-outlined {
  font-size: 24px;
  color: white;
}

.trip-title {
  flex: 1;
}

.trip-title h3 {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
}

.trip-user {
  margin: 0;
  font-size: 0.9rem;
  color: #64748b;
}

.trip-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  background: #e0f2fe;
  color: #0284c7;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.trip-details {
  padding: 1.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-item .material-symbols-outlined {
  color: #64748b;
  font-size: 1.2rem;
}

.detail-label {
  margin: 0 0 0.25rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
}

.detail-value {
  margin: 0;
  font-size: 0.95rem;
  color: #334155;
}

.no-data {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #94a3b8;
  text-align: center;
}

.no-data .material-symbols-outlined {
  font-size: 3rem;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
