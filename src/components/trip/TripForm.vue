<template>
  <div class="trip-form">
    <h2>Explore Nearby Sites</h2>

    <input
      type="text"
      id="from-input"
      class="search-input"
      v-model="localFromQuery"
      placeholder="From where are you travelling?"
      ref="fromInput"
    />
    <input
      type="text"
      id="location-input"
      class="search-input"
      v-model="localSearchQuery"
      placeholder="Enter a destination city..."
      ref="locationInput"
    />

    <div class="date-people-inputs">
      <div class="input-wrapper">
        <div class="date-group">
          <div class="date-pair">
            <div class="date-input-group">
              <label for="start-date">
                <span class="material-symbols-outlined">calendar_today</span>
                Start Date
              </label>
              <input 
                type="date" 
                id="start-date"
                v-model="localStartDate" 
                class="date-input" 
                :min="today"
                placeholder="Select start date"
              />
            </div>
            
            <div class="date-input-group">
              <label for="end-date">
                <span class="material-symbols-outlined">event_available</span>
                End Date
              </label>
              <input 
                type="date" 
                id="end-date"
                v-model="localEndDate" 
                class="date-input" 
                :min="today"
                placeholder="Select end date"
              />
            </div>
          </div>
        </div>

        <br/>
        <div class="input-group">
          <label for="num-people" class="num-people">
            <span class="material-symbols-outlined">group</span>
            Travelers
          </label>
          <select
              id="num-people"
              v-model.number="localNumPeople"
              class="people-input"
            >
              <option disabled value="">Select number of travelers</option>
              <option v-for="n in 20" :key="n" :value="n">{{ n }}</option>
            </select>

        </div>
      </div>
    </div>
    
    <div class="trip-filter-options">
      <h3>Trip Preferences</h3>
      <div class="checkbox-grid">
        <label class="checkbox-container">
          <input type="checkbox" v-model="filters.familyFriendly">
          <span class="checkbox-label">Family Friendly</span>
        </label>
        <label class="checkbox-container">
          <input type="checkbox" v-model="filters.petFriendly">
          <span class="checkbox-label">Pet Friendly</span>
        </label>
        <label class="checkbox-container">
          <input type="checkbox" v-model="filters.wheelchairAccessible">
          <span class="checkbox-label">Wheelchair Accessible</span>
        </label>
        <label class="checkbox-container">
          <input type="checkbox" v-model="filters.wifi">
          <span class="checkbox-label">WiFi Available</span>
        </label>
        <label class="checkbox-container">
          <input type="checkbox" v-model="filters.parking">
          <span class="checkbox-label">Free Parking</span>
        </label>
        <label class="checkbox-container">
          <input type="checkbox" v-model="filters.outdoorActivities">
          <span class="checkbox-label">Outdoor Activities</span>
        </label>
      </div>
    </div>

    <button @click="emitSearch" class="search-button">Search</button>
  </div>
</template>

<script>
// The comment above tells ESLint that 'google' is a global variable,
// but we'll also add runtime checks for better error handling

export default {
  name: "TripForm",
  props: ["fromQuery", "searchQuery", "startDate", "endDate", "numPeople"],
  emits: [
    "update:fromQuery", 
    "update:searchQuery", 
    "update:startDate", 
    "update:endDate", 
    "update:numPeople", 
    "search",
    "fromLocationSelected",
    "toLocationSelected",
    "filtersChanged"
  ],
  data() {
    return {
      localFromQuery: this.fromQuery,
      localSearchQuery: this.searchQuery,
      localStartDate: this.startDate,
      localEndDate: this.endDate,
      localNumPeople: this.numPeople || '', // default to empty if not set
      fromAutocomplete: null,
      toAutocomplete: null,
      filters: {
        familyFriendly: false,
        petFriendly: false,
        wheelchairAccessible: false,
        wifi: false,
        parking: false,
        outdoorActivities: false
      }
    };
  },
  computed: {
  today() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    },
  },
  mounted() {
    // We'll initialize Google Places Autocomplete here if parent component hasn't already
    if (window.google && window.google.maps && window.google.maps.places) {
      this.initAutocomplete();
    }
    // Otherwise, we'll rely on TripPlanner component to initialize it
  },
  watch: {
    localFromQuery(val) {
      this.$emit("update:fromQuery", val);
    },
    localSearchQuery(val) {
      this.$emit("update:searchQuery", val);
    },
    localStartDate(val) {
      this.$emit("update:startDate", val);
    },
    localEndDate(val) {
      this.$emit("update:endDate", val);
    },
    localNumPeople(val) {
      this.$emit("update:numPeople", val);
    },
    filters: {
      handler(newFilters) {
        this.$emit("filtersChanged", newFilters);
      },
      deep: true
    }
  },
  methods: {
    emitSearch() {
      this.$emit("search");
    },
    initAutocomplete() {
      // Only initialize if it hasn't been initialized already and if Google APIs are available
      if (this.fromAutocomplete || this.toAutocomplete) return;
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        console.warn('Google Maps API not loaded yet');
        return;
      }
      
      const fromInput = this.$refs.fromInput;
      const locationInput = this.$refs.locationInput;
      
      if (!fromInput || !locationInput) return;
      
      // Initialize autocomplete for "from" input
      this.fromAutocomplete = new window.google.maps.places.Autocomplete(fromInput, {
        componentRestrictions: { country: "ZA" },
        fields: ["geometry", "name", "formatted_address"],
      });
      
      // Initialize autocomplete for "to/location" input
      this.toAutocomplete = new window.google.maps.places.Autocomplete(locationInput, {
        componentRestrictions: { country: "ZA" },
        fields: ["geometry", "name", "formatted_address"],
      });
      
      // Add listeners to update the Vue model when place is selected
      this.fromAutocomplete.addListener("place_changed", () => {
        const place = this.fromAutocomplete.getPlace();
        if (place) {
          if (place.formatted_address) {
            this.localFromQuery = place.formatted_address;
          } else if (place.name) {
            this.localFromQuery = place.name;
          }
          
          // Emit the selected location for parent component
          if (place.geometry && place.geometry.location) {
            this.$emit("fromLocationSelected", place.geometry.location);
          }
        }
      });
      
      this.toAutocomplete.addListener("place_changed", () => {
        const place = this.toAutocomplete.getPlace();
        if (place) {
          if (place.formatted_address) {
            this.localSearchQuery = place.formatted_address;
          } else if (place.name) {
            this.localSearchQuery = place.name;
          }
          
          // Emit the selected location for parent component
          if (place.geometry && place.geometry.location) {
            this.$emit("toLocationSelected", place.geometry.location);
          }
        }
      });
      
      // Prevent form submission when pressing enter in the input fields
      fromInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') e.preventDefault();
      });
      
      locationInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') e.preventDefault();
      });
    }
  },
};
</script>

<style scoped>
.trip-form {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 32px;
    max-width: 600px;
    margin: 20px auto;
}

h2 {
    color: #262626;
    font-size: 1.8rem;
    margin: 0 0 24px 0;
    font-weight: 700;
}

.search-input {
    width: 100%;
    padding: 14px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 1rem;
    margin-bottom: 16px;
    transition: border-color 0.2s ease;
    box-sizing: border-box;
}

.search-input:focus {
    outline: none;
    border-color: #0071c2;
    box-shadow: 0 0 0 2px rgba(0, 113, 194, 0.1);
}

.search-input::placeholder {
    color: #999;
}

.date-people-inputs {
    display: flex;
    gap: 16px;
    margin: 16px 0;
}

.input-wrapper{
  width: 100%;
}

.date-input,
.people-input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.2s ease;
    width: 100%;
    box-sizing: border-box;
}

.people-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.date-input:focus,
.people-input:focus {
    outline: none;
    border-color: #0071c2;
    box-shadow: 0 0 0 2px rgba(0, 113, 194, 0.1);
}

.search-button {
    background: #0071c2;
    background: #0077B5;
    background: #003b95;
    background: var(--secondary);
    color: white;
    width: 100%;
    padding: 16px;
    border: none;
    border-radius: 4px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
    margin-top: 8px;
}

.search-button:hover {
    background: #00487a;
    background: var(--secondary-dark);
}

@media (max-width: 768px) {
    .trip-form {
        padding: 24px;
        margin: 10px;
    }

    .date-people-inputs {
        flex-direction: column;
    }

    h2 {
        font-size: 1.5rem;
    }

    .search-button {
        padding: 14px;
        font-size: 1rem;
    }
}

.date-group {
  width: 100%;
}

.date-pair {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.date-input-group {
  position: relative;
}

.date-input-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.date-input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  color: #333;
}

.date-input::-webkit-calendar-picker-indicator {
  filter: invert(0.5);
  cursor: pointer;
}

.date-input:focus {
  border-color: #0071c2;
  box-shadow: 0 0 0 2px rgba(0, 113, 194, 0.1);
}

@media (max-width: 768px) {
  .date-pair {
    grid-template-columns: 1fr;
  }
  
  .input-wrapper {
    grid-template-columns: 1fr;
  }
  
  .date-input-group label {
    font-size: 0.85rem;
  }
}

.num-people{
   display: flex ;
  align-items: center;
  justify-content: flex-start;
  gap: 0.3rem;
  color: #666;
  margin-bottom: 10px;
}

/* Trip Filter Options Styling */
.trip-filter-options {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.trip-filter-options h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #333;
  font-weight: 600;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-container input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--secondary);
}

.checkbox-label {
  font-size: 0.9rem;
  color: #444;
}

@media (max-width: 768px) {
  .checkbox-grid {
    grid-template-columns: 1fr;
  }
}
</style>