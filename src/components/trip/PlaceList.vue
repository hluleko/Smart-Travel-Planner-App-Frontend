<template>
  <div class="place-list">
    <!-- Fix: Use conditional rendering and ensure places array exists -->
    <h2 style="background-color: white;" >{{ places && places.length > 0 ? `Destinations Near ${places[0].address || 'Your Location'}` : 'Destinations' }}</h2>
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
          <h3>{{ place.name }}</h3>
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
              >
                <span class="material-symbols-outlined">
                  {{ expanded[place.name] ? 'expand_less' : 'expand_more' }}
                </span>
              </button>
            </div>
            
            <!-- Budget breakdown section with additional checks for undefined -->
            <div v-if="expanded[place.name] && hasBudgetBreakdown(place) && getBudgetBreakdown(place)" class="budget-breakdown">
              <div class="breakdown-item" v-if="getBudgetBreakdown(place).accommodation">
                <span>Accommodation:</span>
                <span>{{ formatCurrency(getBudgetBreakdown(place).accommodation.min) }} - 
                       {{ formatCurrency(getBudgetBreakdown(place).accommodation.max) }}</span>
              </div>
              <div class="breakdown-item" v-if="getBudgetBreakdown(place).transport">
                <span>Transport:</span>
                <span>
                  <div>Petrol: {{ formatCurrency(getBudgetBreakdown(place).transport.petrol || 0) }}</div>
                  <div>Tolls: {{ formatCurrency(getBudgetBreakdown(place).transport.tolls || 0) }}</div>
                </span>
              </div>
              <div class="breakdown-item" v-if="getBudgetBreakdown(place).food !== undefined">
                <span>Food:</span>
                <span>{{ formatCurrency(getBudgetBreakdown(place).food || 0) }}</span>
              </div>
              <div class="breakdown-item" v-if="getBudgetBreakdown(place).activities !== undefined">
                <span>Activities:</span>
                <span>{{ formatCurrency(getBudgetBreakdown(place).activities || 0) }}</span>
              </div>
              <div class="breakdown-total" v-if="getBudgetBreakdown(place).totalMin !== undefined && getBudgetBreakdown(place).totalMax !== undefined">
                <span>Total:</span>
                <span>{{ formatCurrency(getBudgetBreakdown(place).totalMin) }} - 
                       {{ formatCurrency(getBudgetBreakdown(place).totalMax) }}</span>
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

.list-title {
  font-size: 1.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.places-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.place-card {
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s;
}

.place-card:hover {
  transform: translateY(-4px);
}

.place-image {
  position: relative;
  width: 100%;
  padding-top: 75%;
}

.place-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rating {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1rem;
  padding: 0.25rem 0.5rem;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
}

.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "OPSZ" 24;
  display: inline-block;
  font-size: 1.125rem;
  margin-right: 0.25rem;
  vertical-align: middle;
}

.place-info {
  padding: 1.25rem;
}

.place-info h3 {
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.address {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 1rem;
}

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #333;
}

.budget-section {
  margin-top: 10px;
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.budget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.budget-simple {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
  color: #4a5568;
}

.breakdown-toggle {
  background: none;
  border: none;
  cursor: pointer;
  color: #718096;
  padding: 2px;
  border-radius: 4px;
}

.breakdown-toggle:hover {
  background-color: #f7fafc;
}

.budget-breakdown {
  margin-top: 8px;
  padding: 8px;
  background-color: #f7fafc;
  border-radius: 4px;
  font-size: 0.85rem;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.breakdown-item span:first-child {
  font-weight: 500;
  color: #4a5568;
}

.breakdown-total {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  padding-top: 4px;
  border-top: 1px dashed #cbd5e0;
  font-weight: 600;
}

.create-trip-btn {
  background: var(--primary);
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.create-trip-btn:hover {
  background: var(--primary-dark);
}


.breakdown-toggle {
  background: none;
  border: none;
  cursor: pointer;
  color: #718096;
  padding: 2px;
  border-radius: 4px;
}

.breakdown-toggle:hover {
  background-color: #f7fafc;
}

.budget-breakdown {
  margin-top: 8px;
  padding: 8px;
  background-color: #f7fafc;
  border-radius: 4px;
  font-size: 0.85rem;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.breakdown-item span:first-child {
  font-weight: 500;
  color: #4a5568;
}

.breakdown-total {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  padding-top: 4px;
  border-top: 1px dashed #cbd5e0;
  font-weight: 600;
}


</style>
