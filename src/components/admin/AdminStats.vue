<template>
  <div class="stats-grid">
    <div class="stat-card users">
      <div class="stat-icon">
        <span class="material-symbols-outlined">person</span>
      </div>
      <div class="stat-info">
        <h3>{{ stats.userCount || 0 }}</h3>
        <p>Total Users</p>
      </div>
    </div>
    <div class="stat-card trips">
      <div class="stat-icon">
        <span class="material-symbols-outlined">flight_takeoff</span>
      </div>
      <div class="stat-info">
        <h3>{{ stats.tripCount || 0 }}</h3>
        <p>Total Trips</p>
      </div>
    </div>
    <div class="stat-card admins">
      <div class="stat-icon">
        <span class="material-symbols-outlined">admin_panel_settings</span>
      </div>
      <div class="stat-info">
        <h3>{{ stats.adminCount || 0 }}</h3>
        <p>Admins</p>
      </div>
    </div>
    <div class="stat-card active">
      <div class="stat-icon">
        <span class="material-symbols-outlined">calendar_month</span>
      </div>
      <div class="stat-info">
        <h3>{{ stats.activeTrips || 0 }}</h3>
        <p>Active Trips</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminStats',
  props: {
    stats: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.25rem;
}

.stat-icon .material-symbols-outlined {
  font-size: 24px;
}

.stat-info h3 {
  margin: 0 0 0.25rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
}

.stat-info p {
  margin: 0;
  color: #64748b;
  font-weight: 500;
}

.users .stat-icon {
  background: #e0f2fe;
  color: #0284c7;
}

.trips .stat-icon {
  background: #f0fdf4;
  color: #16a34a;
}

.admins .stat-icon {
  background: #fef3c7;
  color: #d97706;
}

.active .stat-icon {
  background: #f1f5f9;
  color: #475569;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 500px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
