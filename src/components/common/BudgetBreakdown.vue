<template>
  <div class="budget-breakdown">
    <button class="toggle-btn" @click="isOpen = !isOpen">
      <span class="material-symbols-outlined">{{ isOpen ? 'expand_less' : 'expand_more' }}</span>
      {{ isOpen ? 'Hide Cost Details' : 'Show Cost Details' }}
    </button>
    
    <div v-if="isOpen" class="breakdown-content">
      <div class="breakdown-chart">
        <div class="chart-item accommodation" :style="{ width: getPercentage('accommodation') + '%' }">
          <div class="chart-item-label">Accommodation</div>
        </div>
        <div class="chart-item transport" :style="{ width: getPercentage('transport') + '%' }">
          <div class="chart-item-label">Transport</div>
        </div>
        <div class="chart-item food" :style="{ width: getPercentage('food') + '%' }">
          <div class="chart-item-label">Food</div>
        </div>
        <div class="chart-item activities" :style="{ width: getPercentage('activities') + '%' }">
          <div class="chart-item-label">Activities</div>
        </div>
      </div>
      
      <div class="breakdown-details">
        <div class="breakdown-section">
          <h4>Accommodation</h4>
          <p class="breakdown-amount">R{{ breakdown.accommodation.min.toLocaleString() }} - R{{ breakdown.accommodation.max.toLocaleString() }}</p>
          <p class="breakdown-description">{{ numPeople }} {{ numPeople > 1 ? 'persons' : 'person' }} for {{ days }} {{ days > 1 ? 'days' : 'day' }}</p>
        </div>
        
        <div class="breakdown-section">
          <h4>Transport</h4>
          <p class="breakdown-amount">R{{ totalTransport.toLocaleString() }}</p>
          <div class="sub-breakdown">
            <div class="sub-item">
              <span>Petrol:</span>
              <span>R{{ breakdown.transport.petrol.toLocaleString() }}</span>
            </div>
            <div class="sub-item">
              <span>Toll Fees:</span>
              <span>R{{ breakdown.transport.tolls.toLocaleString() }}</span>
            </div>
          </div>
        </div>
        
        <div class="breakdown-section">
          <h4>Food</h4>
          <p class="breakdown-amount">R{{ breakdown.food.toLocaleString() }}</p>
          <p class="breakdown-description">Approx. R250 per meal per person</p>
        </div>
        
        <div class="breakdown-section">
          <h4>Activities</h4>
          <p class="breakdown-amount">R{{ breakdown.activities.toLocaleString() }}</p>
          <p class="breakdown-description">R350 per day per person</p>
        </div>
      </div>
      
      <div class="breakdown-total">
        <div>Total Estimated Cost:</div>
        <div class="total-amount">R{{ breakdown.totalMin.toLocaleString() }} - R{{ breakdown.totalMax.toLocaleString() }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BudgetBreakdown",
  props: {
    breakdown: {
      type: Object,
      required: true
    },
    numPeople: {
      type: Number,
      default: 1
    },
    days: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      isOpen: false
    };
  },
  computed: {
    totalTransport() {
      return this.breakdown.transport.petrol + this.breakdown.transport.tolls;
    },
    totalAmount() {
      return this.breakdown.totalMin;
    }
  },
  methods: {
    getPercentage(category) {
      let amount = 0;
      
      switch(category) {
        case 'accommodation':
          amount = this.breakdown.accommodation.min;
          break;
        case 'transport':
          amount = this.totalTransport;
          break;
        case 'food':
          amount = this.breakdown.food;
          break;
        case 'activities':
          amount = this.breakdown.activities;
          break;
      }
      
      return Math.round((amount / this.totalAmount) * 100);
    }
  }
};
</script>

<style scoped>
.budget-breakdown {
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
}

.toggle-btn {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--secondary);
  font-weight: 500;
  padding: 0;
  cursor: pointer;
  font-size: 0.95rem;
}

.breakdown-content {
  margin-top: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
}

.breakdown-chart {
  height: 30px;
  display: flex;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.chart-item {
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 5%; /* Ensure very small percentages are still visible */
  transition: width 0.3s ease;
}

.chart-item-label {
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  text-shadow: 0 0 2px rgba(0,0,0,0.5);
  white-space: nowrap;
}

.accommodation {
  background: #4caf50;
}

.transport {
  background: #2196f3;
}

.food {
  background: #ff9800;
}

.activities {
  background: #9c27b0;
}

.breakdown-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.breakdown-section {
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.breakdown-section h4 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.accommodation h4::before {
  content: "";
  display: block;
  width: 12px;
  height: 12px;
  background: #4caf50;
  border-radius: 50%;
}

.transport h4::before {
  content: "";
  display: block;
  width: 12px;
  height: 12px;
  background: #2196f3;
  border-radius: 50%;
}

.food h4::before {
  content: "";
  display: block;
  width: 12px;
  height: 12px;
  background: #ff9800;
  border-radius: 50%;
}

.activities h4::before {
  content: "";
  display: block;
  width: 12px;
  height: 12px;
  background: #9c27b0;
  border-radius: 50%;
}

.breakdown-amount {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0.5rem 0;
  color: #333;
}

.breakdown-description {
  font-size: 0.8rem;
  color: #666;
  margin: 0;
}

.sub-breakdown {
  font-size: 0.9rem;
}

.sub-item {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.breakdown-total {
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  font-weight: 500;
}

.total-amount {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary);
}

@media (max-width: 768px) {
  .breakdown-details {
    grid-template-columns: 1fr;
  }
  
  .chart-item-label {
    display: none;
  }
}
</style>
