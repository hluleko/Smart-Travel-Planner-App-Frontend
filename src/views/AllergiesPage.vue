<template>
  <div class="main-page">
    <div class="main-header">
      <div class="header-content">
        <h1><span class="material-symbols-outlined">medication</span> My Allergies</h1>
        <button @click="showAddForm = true" class="main-btn">
          <span class="material-symbols-outlined">add</span>
          Add Allergy
        </button>
      </div>
    </div>

    <div v-if="showAddForm" class="add-allergy-form">
      <input v-model="newAllergy.name" placeholder="Allergy Name" />
      <select v-model="newAllergy.severity">
        <option disabled value="">Select Severity</option>
        <option value="Low">Low</option>
        <option value="Moderate">Moderate</option>
        <option value="High">High</option>
      </select>
      
      <div class="category-section">
        <h4>Allergy Category</h4>
        <div class="checkbox-grid">
          <label class="checkbox-container">
            <input type="checkbox" v-model="newAllergy.categories" value="Food">
            <span class="checkbox-label">Food</span>
          </label>
          <label class="checkbox-container">
            <input type="checkbox" v-model="newAllergy.categories" value="Pollen">
            <span class="checkbox-label">Pollen</span>
          </label>
          <label class="checkbox-container">
            <input type="checkbox" v-model="newAllergy.categories" value="Pet">
            <span class="checkbox-label">Pet</span>
          </label>
          <label class="checkbox-container">
            <input type="checkbox" v-model="newAllergy.categories" value="Insect">
            <span class="checkbox-label">Insect</span>
          </label>
          <label class="checkbox-container">
            <input type="checkbox" v-model="newAllergy.categories" value="Medication">
            <span class="checkbox-label">Medication</span>
          </label>
          <label class="checkbox-container">
            <input type="checkbox" v-model="newAllergy.categories" value="Other">
            <span class="checkbox-label">Other</span>
          </label>
        </div>
      </div>
      
      <div class="form-buttons">
        <button @click="submitNewAllergy">Submit</button>
        <button @click="showAddForm = false" class="cancel-btn">Cancel</button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <span class="material-symbols-outlined spin">progress_activity</span>
      Loading allergies...
    </div>

    <div v-else-if="allergies.length === 0" class="no-allergies">
      <span class="material-symbols-outlined">disabled_by_default</span>
      <p>No allergies found</p>
    </div>

    <div v-else class="grid-list-2">
      <div v-for="allergy in allergies" :key="allergy.allergy_id" class="allergy-card">
        <div class="allergy-icon">
          <span class="material-symbols-outlined">sick</span>
        </div>
        <div class="allergy-content">
          <div class="allergy-name">{{ allergy.name }}</div>
          <div class="allergy-meta">
            <span class="severity">Severity: {{ allergy.severity }}</span>
            <span class="added">
              <span class="material-symbols-outlined">schedule</span>
              {{ formatDate(allergy.added_at) }}
            </span>
          </div>
          <div class="allergy-categories" v-if="allergy.categories && allergy.categories.length > 0">
            <div class="category-chips">
              <span class="category-chip" v-for="(category, idx) in allergy.categories" :key="idx">
                {{ category }}
              </span>
            </div>
          </div>
        </div>
        <div class="allergy-actions">
          <button @click="deleteAllergyRecord(allergy.allergy_id)" class="delete-btn">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getUserAllergies, deleteAllergy, addAllergy, createAlert } from "@/api/BackendApi";

export default {
  name: "AllergiesPage",
  data() {
    return {
      allergies: [],
      loading: false,
      showAddForm: false,
      newAllergy: {
        name: "",
        severity: "",
        categories: []
      },
    };
  },
  computed: {
    ...mapState(["user", "token"]),
  },
  methods: {
    async fetchAllergies() {
      this.loading = true;
      try {
        const response = await getUserAllergies(this.token, this.user.user_id);
        this.allergies = response.data.sort(
          (a, b) => new Date(b.added_at) - new Date(a.added_at)
        );
      } catch (err) {
        console.error("Error fetching allergies:", err);
        alert("Failed to load allergies.");
      } finally {
        this.loading = false;
      }
    },

    async deleteAllergyRecord(allergyId) {
      try {
        await deleteAllergy(this.token, allergyId);
        this.fetchAllergies();

        //Create alert
        await createAlert(this.token, {
          user_id: this.user.user_id,
          type: 'error',
          message: `You deleted an allergy`,
          created_at: new Date().toISOString(),
          seen: false,
        });

      } catch (err) {
        console.error("Error deleting allergy:", err);
        alert("Failed to delete allergy.");
      }
    },

    async submitNewAllergy() {
      if (!this.newAllergy.name || !this.newAllergy.severity) {
        alert("Please enter both allergy name and severity.");
        return;
      }

      try {
        const allergyData = {
          ...this.newAllergy,
          user_id: this.user.user_id,
        };

        await addAllergy(this.token, allergyData);
        this.newAllergy = { name: "", severity: "", categories: [] };
        this.showAddForm = false;
        this.fetchAllergies();

        //Create alert
        await createAlert(this.token, {
          user_id: this.user.user_id,
          type: 'warning',
          message: `You added a new allergy`,
          created_at: new Date().toISOString(),
          seen: false,
        });

      } catch (err) {
        console.error("Error adding allergy:", err);
        alert("Failed to add allergy.");
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
  },
  mounted() {
    if (this.user && this.token) {
      this.fetchAllergies();
    }
  },
};
</script>

<style scoped>
/* Allergy Page Styling */
.main-page {
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.main-header {
  margin-bottom: 1.5rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  font-size: 1.8rem;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.main-btn {
  background-color: var(--secondary);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.main-btn:hover {
  background-color: var(--secondary-dark);
}

.add-allergy-form {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.add-allergy-form input,
.add-allergy-form select {
  padding: 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  width: 100%;
  font-size: 1rem;
}

.category-section {
  margin-top: 0.5rem;
}

.category-section h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #4a5568;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-container input[type="checkbox"] {
  width: auto;
  cursor: pointer;
}

.checkbox-label {
  font-size: 0.9rem;
  color: #4a5568;
}

.form-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.add-allergy-form button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.add-allergy-form .cancel-btn {
  background-color: #edf2f7;
  color: #4a5568;
}

.add-allergy-form button:not(.cancel-btn) {
  background-color: var(--secondary);
  color: white;
}

.grid-list-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.allergy-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.allergy-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #ffe5e5;
}

.allergy-icon .material-symbols-outlined {
  color: #e53e3e;
  font-size: 1.8rem;
}

.allergy-content {
  flex: 1;
}

.allergy-name {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.allergy-meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: #718096;
}

.allergy-categories {
  margin-top: 0.75rem;
}

.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-chip {
  background: #e6fffa;
  color: #319795;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

.severity {
  font-weight: 500;
}

.added {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.allergy-actions {
  display: flex;
  gap: 0.5rem;
}

.delete-btn {
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  background: #fed7d7;
  color: #f56565;
  cursor: pointer;
  transition: all 0.2s ease;
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

.no-allergies {
  text-align: center;
  padding: 3rem;
  color: #a0aec0;
}

.no-allergies .material-symbols-outlined {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .allergy-card {
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .allergy-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .checkbox-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .grid-list-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
