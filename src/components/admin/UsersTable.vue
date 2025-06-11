<template>
  <div>
    <div class="search-container">
      <div class="search-box">
        <span class="material-symbols-outlined">search</span>
        <input v-model="searchQuery" placeholder="Search users..." @input="$emit('search', searchQuery)" />
        <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>

    <div class="card-grid">
      <div v-for="user in users" :key="user.user_id" class="user-card">
        <div class="user-header">
          <div class="avatar">
            <span class="material-symbols-outlined">{{ getUserIcon(user) }}</span>
          </div>
          <div class="user-info">
            <h3>{{ user.username || 'Unnamed User' }}</h3>
            <p class="email">{{ user.email }}</p>
          </div>
          <div class="role-badge" :class="user.user_role">
            {{ user.user_role }}
          </div>
        </div>
        <div class="user-details">
          <div class="detail-item">
            <span class="material-symbols-outlined">badge</span>
            <div>
              <p class="detail-label">User ID</p>
              <p class="detail-value">{{ user.user_id }}</p>
            </div>
          </div>
          <div class="detail-item">
            <span class="material-symbols-outlined">calendar_month</span>
            <div>
              <p class="detail-label">Joined</p>
              <p class="detail-value">{{ formatDate(user.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="users.length === 0" class="no-data">
        <span class="material-symbols-outlined">person_off</span>
        <p>No users found</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UsersTable',
  props: {
    users: {
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
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    clearSearch() {
      this.searchQuery = '';
      this.$emit('search', '');
    },
    getUserIcon(user) {
      if (user.user_role === 'admin') return 'admin_panel_settings';
      return 'person';
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

.user-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.user-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.user-header {
  padding: 1.5rem;
  background: #f8fafc;
  display: flex;
  align-items: center;
  position: relative;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #e3f2fd;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
}

.avatar .material-symbols-outlined {
  font-size: 24px;
  color: #0071c2;
}

.user-info {
  flex: 1;
}

.user-info h3 {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
}

.email {
  margin: 0;
  font-size: 0.9rem;
  color: #64748b;
}

.role-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.admin {
  background: #fef3c7;
  color: #d97706;
}

.role-badge.user {
  background: #e0f2fe;
  color: #0284c7;
}

.user-details {
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
