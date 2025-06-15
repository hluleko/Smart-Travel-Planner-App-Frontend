<template>
  <div class="stop-selector">
    <h3 class="stop-title">
      <span class="material-symbols-outlined">add_location</span>
      Add Stops
    </h3>
    <p class="stop-description">
      Add places to visit on your way to the final destination
    </p>
    
    <div class="stops-container">
      <div v-for="(stop, index) in stops" :key="index" class="stop-item">
        <div class="stop-content">
          <div class="stop-icon">{{ index + 1 }}</div>
          <div class="stop-details">
            <h4>{{ stop.name }}</h4>
            <p>{{ stop.address }}</p>
          </div>
        </div>
        <button @click="removeStop(index)" class="remove-stop-btn">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      
      <div class="add-stop-container">
        <input
          ref="stopInput"
          type="text"
          id="stop-location"
          v-model="stopQuery"
          class="stop-input"
          placeholder="Search for a place to stop by..."
          @focus="showStopSearch = true"
        />
        
        <button @click="addStop" class="add-stop-btn" :disabled="!selectedStop">
          <span class="material-symbols-outlined">add</span>
          Add Stop
        </button>
      </div>
    </div>
  </div>
</template>

<script>
/* global google */
import { googleMapsApiKey } from "@/config";

export default {
  name: "StopSelector",
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      stopQuery: '',
      stops: this.value,
      showStopSearch: false,
      selectedStop: null,
      stopAutocomplete: null
    };
  },
  watch: {
    stops: {
      handler(newStops) {
        this.$emit('input', newStops);
      },
      deep: true
    },
    value: {
      handler(newValue) {
        if (JSON.stringify(newValue) !== JSON.stringify(this.stops)) {
          this.stops = newValue;
        }
      },
      deep: true
    }
  },
  mounted() {
    this.loadGoogleMaps();
  },
  methods: {
    loadGoogleMaps() {
      if (!window.google || !window.google.maps) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = this.initAutocomplete;
        document.head.appendChild(script);
      } else {
        this.initAutocomplete();
      }
    },
    initAutocomplete() {
      const stopInput = this.$refs.stopInput;
      if (!stopInput) return;
      
      this.stopAutocomplete = new google.maps.places.Autocomplete(stopInput, {
        componentRestrictions: { country: "ZA" },
        fields: ["name", "formatted_address", "geometry", "photos"]
      });
      
      this.stopAutocomplete.addListener("place_changed", () => {
        const place = this.stopAutocomplete.getPlace();
        if (!place.geometry) return;
        
        // Update the input field with the selected place name
        if (place.formatted_address) {
          this.stopQuery = place.formatted_address;
        } else if (place.name) {
          this.stopQuery = place.name;
        }
        
        this.selectedStop = {
          name: place.name,
          address: place.formatted_address,
          location: `${place.geometry.location.lat()},${place.geometry.location.lng()}`,
          photo_url: place.photos && place.photos[0] ? place.photos[0].getUrl({ maxWidth: 400 }) : null
        };
        
        console.log("Selected stop location:", this.stopQuery);
        console.log("Selected stop data:", this.selectedStop);
      });
      
      // Prevent form submission when pressing enter
      stopInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (this.selectedStop) this.addStop();
        }
      });
    },
    addStop() {
      if (this.selectedStop) {
        const newStop = {
          ...this.selectedStop,
          order_index: this.stops.length
        };
        
        console.log("Adding stop to list:", newStop);
        this.stops.push(newStop);
        this.$emit('stop-added', newStop);
        
        // Clear the input and selected stop after adding
        this.stopQuery = '';
        this.selectedStop = null;
      }
    },
    removeStop(index) {
      this.stops.splice(index, 1);
      
      // Update order_index for remaining stops
      this.stops.forEach((stop, idx) => {
        stop.order_index = idx;
      });
    }
  }
};
</script>

<style scoped>
.stop-selector {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;

    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 32px;
    max-width: 600px;
    margin: 20px auto;
}

.stop-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  color: #262626;
}

.stop-description {
  margin: 0 0 1.25rem;
  color: #666;
  font-size: 0.9rem;
}

.stops-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stop-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #0071c2;
}

.stop-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stop-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #0071c2;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
}

.stop-details h4 {
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
}

.stop-details p {
  margin: 0;
  font-size: 0.8rem;
  color: #666;
}

.remove-stop-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-stop-btn:hover {
  color: #d32f2f;
}

.add-stop-container {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.stop-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
}

.add-stop-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #0071c2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 1rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.add-stop-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}
</style>