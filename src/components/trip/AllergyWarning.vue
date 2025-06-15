<template>
  <div v-if="warning" class="allergy-warning" :class="severityClass">
    <div class="allergy-warning-header">
      <span class="material-symbols-outlined">health_and_safety</span>
      <h4>Allergy Alert</h4>
    </div>
    <p>{{ warningMessage }}</p>
    
    <div v-if="userAllergyMatches.length > 0" class="personal-warning">
      <strong>Warning: Your allergies may be affected</strong>
      <ul>
        <li v-for="(match, index) in userAllergyMatches" :key="index">
          Your {{ match.userAllergy.name }} allergy ({{ match.userAllergy.severity }}) - 
          {{ match.warningAllergen }} levels are {{ match.severity }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { formatAllergyWarning } from '@/utils/AllergyWarningService';

export default {
  name: 'AllergyWarning',
  props: {
    warning: {
      type: Object,
      default: null
    },
    userAllergyMatches: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    warningMessage() {
      return formatAllergyWarning(this.warning);
    },
    severityClass() {
      if (!this.warning || this.warning.warnings.length === 0) return '';
      
      // Get the highest severity level
      const severities = {
        'Low': 1,
        'Moderate': 2,
        'High': 3,
        'Very High': 4
      };
      
      let maxSeverity = 0;
      this.warning.warnings.forEach(warn => {
        const severityValue = severities[warn.severity] || 0;
        maxSeverity = Math.max(maxSeverity, severityValue);
      });
      
      switch(maxSeverity) {
        case 1: return 'low';
        case 2: return 'moderate';
        case 3: return 'high';
        case 4: return 'very-high';
        default: return '';
      }
    }
  }
}
</script>

<style scoped>
.allergy-warning {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
  background-color: #f1f8e9;
}

.allergy-warning-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.allergy-warning-header h4 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.allergy-warning p {
  margin: 0 0 0.5rem;
  line-height: 1.5;
}

.personal-warning {
  margin-top: 0.75rem;
  padding: 0.75rem;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.5);
}

.personal-warning strong {
  display: block;
  margin-bottom: 0.5rem;
}

.personal-warning ul {
  margin: 0;
  padding-left: 1.5rem;
}

.personal-warning li {
  margin-bottom: 0.25rem;
}

/* Severity-based styling */
.low {
  border-color: #4caf50;
  background-color: #f1f8e9;
}

.moderate {
  border-color: #ff9800;
  background-color: #fff3e0;
}

.high {
  border-color: #f44336;
  background-color: #ffebee;
}

.very-high {
  border-color: #9c27b0;
  background-color: #f3e5f5;
}

.low .material-symbols-outlined {
  color: #4caf50;
}

.moderate .material-symbols-outlined {
  color: #ff9800;
}

.high .material-symbols-outlined {
  color: #f44336;
}

.very-high .material-symbols-outlined {
  color: #9c27b0;
}
</style>
