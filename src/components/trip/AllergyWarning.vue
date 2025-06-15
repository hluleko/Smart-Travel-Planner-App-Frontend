<template>
  <div class="allergy-warning" :class="{ 'no-allergies': hasNoAllergies }">
    <div v-if="hasNoAllergies" class="allergy-content safe">
      <span class="material-symbols-outlined safe-icon">check_circle</span>
      <p>No common allergies detected for this location.</p>
    </div>
    <div v-else class="allergy-content">
      <span class="material-symbols-outlined warning-icon">warning</span>
      <div>
        <h3 class="warning-title">Allergy Alert</h3>
        
        <div v-if="parsedWarning" class="warning-details">
          <p class="location">{{ parsedWarning.location }}</p>
          
          <ul class="allergen-list">
            <li v-for="(allergen, index) in parsedWarning.warnings" :key="index"
                :class="allergen.severity.toLowerCase()">
              <span class="allergen-name">{{ allergen.allergen }}</span>
              <span class="allergen-severity">{{ allergen.severity }} risk</span>
              <span class="allergen-condition" v-if="allergen.condition"> - {{ allergen.condition }}</span>
            </li>
          </ul>
          
          <p class="warning-date" v-if="parsedWarning.timestamp">
            <span class="material-symbols-outlined">schedule</span>
            {{ formatDate(parsedWarning.timestamp) }}
          </p>
        </div>
        
        <p v-else class="fallback-warning">{{ warning }}</p>
        
        <div v-if="userAllergyMatches.length > 0" class="personal-warning">
          <strong>Personal Warning:</strong> This location may affect you based on your allergy profile.
          <ul>
            <li v-for="(match, index) in userAllergyMatches" :key="index">
              {{ match.userAllergy.name }}: {{ match.reason }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AllergyWarning",
  props: {
    warning: {
      type: [String, Object],
      default: ""
    },
    userAllergyMatches: {
      type: Array,
      default: () => []
    },
    hasNoAllergies: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    parsedWarning() {
      if (!this.warning) return null;
      
      try {
        // If it's already an object, return it directly
        if (typeof this.warning === 'object') return this.warning;
        
        // Try to parse it if it's a JSON string
        return JSON.parse(this.warning);
      } catch (e) {
        // If parsing fails, return null and we'll use the original string
        return null;
      }
    }
  },
  methods: {
    formatDate(dateString) {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch (e) {
        return dateString;
      }
    }
  }
};
</script>

<style scoped>
.allergy-warning {
  margin: 15px 0;
  padding: 15px;
  border-radius: 8px;
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
}

.allergy-warning.no-allergies {
  background-color: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}

.allergy-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.warning-icon, .safe-icon {
  font-size: 24px;
  margin-top: 2px;
}

.safe-icon {
  color: #28a745;
}

.warning-icon {
  color: #dc3545;
}

.personal-warning {
  margin-top: 15px;
  font-weight: 500;
  color: #dc3545;
  padding: 0.75rem;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.5);
}

.personal-warning strong {
  display: block;
  margin-bottom: 0.5rem;
}

.personal-warning ul {
  margin: 5px 0 0 0;
  padding-left: 1.5rem;
}

.personal-warning li {
  margin-bottom: 0.25rem;
}

.warning-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #dc3545;
}

.warning-details {
  margin-top: 5px;
}

.location {
  font-weight: 500;
  margin-bottom: 10px;
}

.allergen-list {
  list-style-type: none;
  padding: 0;
  margin: 10px 0;
}

.allergen-list li {
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.6);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.allergen-name {
  font-weight: 600;
  margin-right: auto;
}

.allergen-severity {
  font-size: 0.8rem;
  padding: 2px 6px;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.1);
}

.allergen-condition {
  font-size: 0.85rem;
  font-style: italic;
  color: #666;
  width: 100%;
  margin-top: 3px;
}

.warning-date {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  color: #666;
  margin-top: 10px;
}

.warning-date .material-symbols-outlined {
  font-size: 16px;
}

.safe {
  color: #155724;
}

/* Severity-based styling */
.low {
  border-left: 3px solid #4caf50;
  background-color: #f1f8e9;
}

.moderate {
  border-left: 3px solid #ff9800;
  background-color: #fff3e0;
}

.high {
  border-left: 3px solid #f44336;
  background-color: #ffebee;
}

.very-high {
  border-left: 3px solid #9c27b0;
  background-color: #f3e5f5;
}

@media (max-width: 768px) {
  .allergen-list li {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .allergen-severity {
    margin-top: 3px;
  }
}
</style>
