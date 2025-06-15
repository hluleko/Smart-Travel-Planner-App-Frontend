<template>
  <div class="place-list">
    <!-- Fix: Use conditional rendering and ensure places array exists -->
    <h2 class="places-title">{{ places && places.length > 0 ? `Destinations Near ${places[0].address || 'Your Location'}` : 'Destinations' }}</h2>
    
    <div class="places-grid">
      <div
        v-for="place in places"
        :key="place.name"
        class="place-card"
        @mouseenter="setHoveredPlace(place)"
        @mouseleave="clearHoveredPlace()"
      >
        <div class="place-image">
          <img :src="place.photo || defaultImage" alt="Place image" />
          <div class="rating" v-if="place.rating">
            <span class="material-symbols-outlined">star</span>
            {{ place.rating.toFixed(1) }}
          </div>
        </div>

        <div class="place-info">
          <h3 class="place-title">{{ place.name }}</h3>
          <p class="address">{{ place.address || 'Address not available' }}</p>
          
          <div class="stats">
            <div class="stat">
              <span class="material-symbols-outlined">directions_car</span>
              {{ place.distance || 'N/A' }} km
            </div>
            <div class="stat">
              <span class="material-symbols-outlined">people</span>
              {{ numPeople }} {{ numPeople > 1 ? "travelers" : "traveler" }}
            </div>
          </div>

          <!-- Budget section with breakdown toggle -->
          <div class="budget-section">
            <div class="budget-header">
              <div class="budget-simple">
                <span class="material-symbols-outlined">payments</span>
                <span>{{ getBudgetDisplay(place) }}</span>
              </div>
              
              <!-- Only show toggle button if budget has breakdown -->
              <button 
                v-if="hasBudgetBreakdown(place)"
                @click="toggleBreakdown(place.name)" 
                class="breakdown-toggle"
                :aria-label="expanded[place.name] ? 'Hide budget details' : 'Show budget details'"
              >
                <span class="material-symbols-outlined">
                  {{ expanded[place.name] ? 'expand_less' : 'expand_more' }}
                </span>
              </button>
            </div>
            
            <!-- Fix: Remove dynamic class binding that was causing issues with animation -->
            <div v-if="expanded[place.name] && hasBudgetBreakdown(place) && getBudgetBreakdown(place)" 
                class="budget-breakdown expanded">
              
              <div class="breakdown-item" v-if="getBudgetBreakdown(place).accommodation">
                <div class="breakdown-label">
                  <span class="material-symbols-outlined">hotel</span>
                  <span>Accommodation:</span>
                </div>
                <div class="breakdown-value">
                  {{ formatCurrency(getBudgetBreakdown(place).accommodation.min) }} - 
                  {{ formatCurrency(getBudgetBreakdown(place).accommodation.max) }}
                </div>
              </div>
              
              <div class="breakdown-item" v-if="getBudgetBreakdown(place).transport">
                <div class="breakdown-label">
                  <span class="material-symbols-outlined">directions_car</span>
                  <span>Transport:</span>
                </div>
                <div class="breakdown-value breakdown-transport">
                  <div class="transport-item">
                    <span>Petrol:</span> 
                    {{ formatCurrency(getBudgetBreakdown(place).transport.petrol || 0) }}
                  </div>
                  <div class="transport-item">
                    <span>Tolls:</span> 
                    {{ formatCurrency(getBudgetBreakdown(place).transport.tolls || 0) }}
                  </div>
                </div>
              </div>
              
              <div class="breakdown-item" v-if="getBudgetBreakdown(place).food !== undefined">
                <div class="breakdown-label">
                  <span class="material-symbols-outlined">restaurant</span>
                  <span>Food:</span>
                </div>
                <div class="breakdown-value">
                  {{ formatCurrency(getBudgetBreakdown(place).food || 0) }}
                </div>
              </div>
              
              <div class="breakdown-item" v-if="getBudgetBreakdown(place).activities !== undefined">
                <div class="breakdown-label">
                  <span class="material-symbols-outlined">attractions</span>
                  <span>Activities:</span>
                </div>
                <div class="breakdown-value">
                  {{ formatCurrency(getBudgetBreakdown(place).activities || 0) }}
                </div>
              </div>
              
              <div class="breakdown-total" v-if="getBudgetBreakdown(place).totalMin !== undefined && getBudgetBreakdown(place).totalMax !== undefined">
                <div class="breakdown-label">
                  <span class="material-symbols-outlined">calculate</span>
                  <span>Total:</span>
                </div>
                <div class="breakdown-value">
                  {{ formatCurrency(getBudgetBreakdown(place).totalMin) }} - 
                  {{ formatCurrency(getBudgetBreakdown(place).totalMax) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button class="create-trip-btn" @click="createTrip(place)">
          Create Trip
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
    
    <!-- Empty state when no places are found -->
    <div v-if="places && places.length === 0" class="empty-state">
      <span class="material-symbols-outlined">travel_explore</span>
      <p>No destinations found. Try a different search.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlaceList",
  props: {
    places: {
      type: Array,
      required: true,
    },
    numPeople: {
      type: Number,
      default: 1,
    },
    defaultImage: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      expanded: {}, // Track which places have expanded budget details
      hoveredPlace: null,
    };
  },
  methods: {
    createTrip(place) {
      this.$emit("createTrip", place);
    },
    setHoveredPlace(place) {
      this.hoveredPlace = place;
    },
    clearHoveredPlace() {
      this.hoveredPlace = null;
    },
    toggleBreakdown(placeId) {
      // Vue 3 reactive way to update an object property
      this.expanded = {
        ...this.expanded,
        [placeId]: !this.expanded[placeId]
      };
    },
    // Format a number as a currency string with fallback to 0
    formatCurrency(amount) {
      if (amount === undefined || amount === null) {
        amount = 0;
      }
      return `R${Number(amount).toLocaleString()}`;
    },
    // Get the simple budget display or the detailed breakdown based on state
    getBudgetDisplay(place) {
      // Check if budget is valid
      if (!place || !place.budget) {
        return 'Budget not available';
      }
      
      // Check if budget is an object with breakdown or just a string
      if (typeof place.budget === 'object' && place.budget.simple) {
        return place.budget.simple;
      }
      return place.budget; // Return the original budget string
    },
    // Get budget breakdown with safety checks
    getBudgetBreakdown(place) {
      if (!place || !place.budget || typeof place.budget !== 'object' || !place.budget.breakdown) {
        return null;
      }
      return place.budget.breakdown;
    },
    // Check if a place has a budget breakdown
    hasBudgetBreakdown(place) {
      return place && 
             place.budget && 
             typeof place.budget === 'object' && 
             place.budget.breakdown;
    }
  },
};
</script>

<style scoped>
.place-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

.places-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
  background-color: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  position: relative;
}

.places-title:after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  border-radius: 3px;
}

.places-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.place-card {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.place-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
  border-color: rgba(0, 0, 0, 0.1);
}

.place-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.place-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.place-card:hover .place-image img {
  transform: scale(1.05);
}

.rating {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 2rem;
  padding: 0.4rem 0.8rem;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.rating .material-symbols-outlined {
  color: #FFD700;
  margin-right: 4px;
}

.place-info {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.place-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.address {
  font-size: 0.9rem;
  color: #718096;
  margin-bottom: 1.2rem;
  line-height: 1.5;
}

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.2rem;
  padding: 0.8rem 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.stat {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #4a5568;
  background: #f9fafb;
  padding: 0.4rem 0.8rem;
  border-radius: 1rem;
}

.stat .material-symbols-outlined {
  margin-right: 6px;
  font-size: 1.1rem;
}

.budget-section {
  margin-top: 1rem;
  padding-top: 0.5rem;
}

.budget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.budget-simple {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #2d3748;
  font-size: 1.1rem;
}

.budget-simple .material-symbols-outlined {
  color: var(--primary);
}

.breakdown-toggle {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  color: #718096;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.breakdown-toggle:hover {
  background-color: #f7fafc;
  color: var(--primary);
}

.budget-breakdown {
  /* Remove max-height and opacity from initial state */
  padding: 1rem;
  margin-top: 0.5rem;
  background-color: #f8fafc;
  border-radius: 8px;
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.05);
}

/* Remove the .budget-breakdown.expanded class as it's no longer needed */

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.8rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px dashed #e2e8f0;
}

.breakdown-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  color: #4a5568;
  font-size: 0.9rem;
}

.breakdown-label .material-symbols-outlined {
  font-size: 1rem;
}

.breakdown-value {
  font-weight: 500;
  color: #2d3748;
  font-size: 0.9rem;
  text-align: right;
}

.breakdown-transport {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.transport-item {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
  font-size: 0.85rem;
}

.transport-item span {
  color: #718096;
}

.breakdown-total {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 0.5rem;
  border-top: 2px solid #e2e8f0;
}

.breakdown-total .breakdown-label,
.breakdown-total .breakdown-value {
  font-weight: 700;
  color: #2d3748;
  font-size: 1rem;
}

.breakdown-total .material-symbols-outlined {
  color: var(--primary);
}

.create-trip-btn {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: #fff;
  padding: 1rem;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: auto;
}

.create-trip-btn:hover {
  filter: brightness(1.1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.create-trip-btn .material-symbols-outlined {
  transition: transform 0.2s;
}

.create-trip-btn:hover .material-symbols-outlined {
  transform: translateX(4px);
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  margin-top: 2rem;
}

.empty-state .material-symbols-outlined {
  font-size: 4rem;
  color: #a0aec0;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1.1rem;
  color: #718096;
}

@media (max-width: 768px) {
  .places-grid {
    grid-template-columns: 1fr;
  }
  
  .place-card {
    max-width: 100%;
  }
  
  .places-title {
    font-size: 1.5rem;
    padding: 0.8rem;
  }
  
  .place-image {
    height: 180px;
  }
  
  .budget-simple {
    font-size: 1rem;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .places-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
