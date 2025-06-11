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
          <tr v-for="trip in trips" :key="trip.trip_id">
            <td>{{ trip.trip_id }}</td>
            <td>{{ trip.title }}</td>
            <td>{{ trip.username || trip.email }}</td>
            <td>{{ trip.location || 'N/A' }}</td>
            <td>{{ formatDate(trip.start_date) }} - {{ formatDate(trip.end_date) }}</td>
            <td>{{ formatDate(trip.created_at) }}</td>
          </tr>
          <tr v-if="trips.length === 0">
            <td colspan="6" class="no-data">No trips found</td>
          </tr>
        </tbody>
      </table>
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

.table-container {
  overflow-x: auto;
  margin-top: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
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
  background: #f8fafc;
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
</style>
