<template>
  <div class="main-page">
    <div class="main-header">
      <div class="header-content">
        <h1>
          <span class="material-symbols-outlined">directions</span> 
          Trip Directions
        </h1>
        <button @click="$router.push('/trips')" class="main-btn">
          <span class="material-symbols-outlined">arrow_back</span>
          Back to Trips
        </button>
      </div>
    </div>

    <div class="trip-directions-container">
      <div class="trip-info-panel">
        <div class="trip-detail">
          <span class="material-symbols-outlined">location_on</span>
          <div>
            <p class="detail-label">Starting Point</p>
            <p class="detail-value">{{ trip.starting_point || 'Current Location' }}</p>
          </div>
        </div>
        
        <div class="direction-arrow">
          <span class="material-symbols-outlined">arrow_downward</span>
        </div>
        
        <div class="trip-detail">
          <span class="material-symbols-outlined">flag</span>
          <div>
            <p class="detail-label">Destination</p>
            <p class="detail-value">{{ trip.destination?.location || 'Unknown Destination' }}</p>
          </div>
        </div>

        <div class="trip-stats">
          <div class="stat-item">
            <span class="material-symbols-outlined">schedule</span>
            <div>
              <p class="detail-label">Estimated Time</p>
              <p class="detail-value">{{ routeInfo.duration || 'Calculating...' }}</p>
            </div>
          </div>
          
          <div class="stat-item">
            <span class="material-symbols-outlined">straighten</span>
            <div>
              <p class="detail-label">Distance</p>
              <p class="detail-value">{{ routeInfo.distance || 'Calculating...' }}</p>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button @click="openInGoogleMaps" class="external-maps-btn">
            <span class="material-symbols-outlined">open_in_new</span>
            Open in Google Maps
          </button>
        </div>
      </div>

      <div ref="mapContainer" class="map-container">
        <div v-if="loading" class="loading-map">
          <span class="material-symbols-outlined spin">progress_activity</span>
          <p>Loading map...</p>
        </div>
      </div>
    </div>

    <div v-if="stops.length > 0" class="trip-stops">
      <h3 class="stops-title">
        <span class="material-symbols-outlined">pin_drop</span>
        Stops
      </h3>
      
      <div class="stops-list">
        <div v-for="(stop, index) in stops" :key="stop.stop_id" class="stop-item">
          <div class="stop-marker">{{ index + 1 }}</div>
          <div class="stop-info">
            <h4>{{ stop.name }}</h4>
            <p>{{ stop.address }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { getTrip, getDestinationById, createAlert, getTripById, getStopsByTripId, updateTripStatus } from "@/api/BackendApi";
import { mapState } from "vuex";
import { googleMapsApiKey } from "@/config";

export default {
  name: "TripDirectionsPage",
  data() {
    return {
      trip: {},
      loading: true,
      map: null,
      directionsService: null,
      directionsRenderer: null,
      routeInfo: {
        distance: null,
        duration: null
      },
      mapInitialized: false,
      googleMapsLoaded: false,
      googleMapsScriptElement: null,
      componentMounted: false, // Add this flag to track component mounting
      stops: []
    };
  },
  computed: {
    ...mapState(["user", "token"]),
    tripId() {
      return this.$route.params.id;
    }
  },
  watch: {
    trip: {
      deep: true,
      handler() {
        this.tryInitializeMap();
      }
    },
    'googleMapsLoaded'() {
      this.tryInitializeMap();
    },
    'componentMounted'() {
      this.tryInitializeMap();
    }
  },
  methods: {    async fetchTripDetails() {
      try {
        const tripResponse = await getTripById(this.token, this.tripId);
        this.trip = tripResponse.data;
        
        if (this.trip.destination_id) {
          const destinationResponse = await getDestinationById(
            this.token, 
            this.trip.destination_id
          );
          this.trip.destination = destinationResponse.data;
          
          // Mark trip as started if not already started
          if (this.trip && !this.trip.trip_started) {
            try {
              await updateTripStatus(this.token, this.tripId, { 
                trip_started: true,
                destination_id: this.trip.destination_id
              });
              this.trip.trip_started = true;
              
              // Create alert for starting the trip
              await createAlert(this.token, {
                user_id: this.user.user_id,
                type: 'info',
                message: `Your trip to ${this.trip.destination?.location} has started.`,
                created_at: new Date().toISOString(),
                seen: false,
              });
            } catch (err) {
              console.error("Failed to mark trip as started:", err);
            }
          }
        }
        
        // Also fetch stops for this trip
        try {
          const stopsResponse = await getStopsByTripId(this.token, this.tripId);
          this.stops = stopsResponse.data;
        } catch (err) {
          console.error("Error fetching stops:", err);
        }
        
        // Try to initialize map after data is loaded
        this.tryInitializeMap();
      } catch (error) {
        console.error("Failed to fetch trip details:", error);
        this.loading = false;
        alert("Could not load trip information.");
      }
    },
    
    loadGoogleMapsScript() {
      // If Google Maps API is already loaded
      if (window.google && window.google.maps) {
        this.googleMapsLoaded = true;
        return;
      }
      
      // Clean up existing script tag if it exists
      if (this.googleMapsScriptElement) {
        document.head.removeChild(this.googleMapsScriptElement);
      }
      
      // Create a new script element
      this.googleMapsScriptElement = document.createElement("script");
      this.googleMapsScriptElement.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&callback=googleMapsCallback`;
      this.googleMapsScriptElement.async = true;
      this.googleMapsScriptElement.defer = true;
      
      // Define the callback function in the global scope
      window.googleMapsCallback = () => {
        // Check if component is still mounted before proceeding
        if (this.componentMounted) {
          this.googleMapsLoaded = true;
        }
      };
      
      // Handle script load errors
      this.googleMapsScriptElement.onerror = () => {
        console.error("Failed to load Google Maps API");
        if (this.componentMounted) {
          this.loading = false;
          alert("Failed to load maps. Please check your internet connection and try again.");
        }
      };
      
      // Append the script to the document
      document.head.appendChild(this.googleMapsScriptElement);
    },
    
    tryInitializeMap() {
      // Only initialize when all conditions are met and component is still mounted
      if (this.googleMapsLoaded && 
          this.componentMounted &&
          !this.mapInitialized &&
          this.trip && 
          this.trip.destination &&
          this.$refs.mapContainer) {  // Check if map container exists
        this.initMap();
      } else if (this.googleMapsLoaded && 
                this.componentMounted && 
                !this.mapInitialized) {
        console.log("Map ready but waiting for destination data or map container");
      }
    },
    
    initMap() {
      try {
        // Safety checks
        if (!window.google || !window.google.maps) {
          console.error("Google Maps API not loaded");
          this.loading = false;
          return;
        }
        
        if (!this.trip.destination) {
          console.error("No destination data");
          this.loading = false;
          return;
        }
        
        if (this.mapInitialized) {
          return;
        }
        
        // Access the map container using Vue ref
        const mapElement = this.$refs.mapContainer;
        if (!mapElement) {
          console.error("Map container element not found");
          this.loading = false;
          return;
        }
        
        this.loading = true;
        
        // Create the map instance
        this.map = new window.google.maps.Map(mapElement, {
          center: { lat: -30.5595, lng: 22.9375 }, // Default to center of South Africa
          zoom: 6,
          mapTypeControl: false,
          fullscreenControl: true,
          streetViewControl: false
        });
        
        // Initialize directions services after map is created
        this.directionsService = new window.google.maps.DirectionsService();
        this.directionsRenderer = new window.google.maps.DirectionsRenderer({
          map: this.map,
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: "#0071c2",
            strokeWeight: 5
          }
        });
        
        // Mark initialization as complete
        this.mapInitialized = true;
        
        // Calculate and display route after map is initialized - use a slightly longer timeout
        if (this.componentMounted) { // Only proceed if component is still mounted
          setTimeout(() => {
            if (this.componentMounted) { // Check again inside the timeout
              this.calculateAndDisplayRoute();
            }
          }, 500);
        }
      } catch (error) {
        console.error("Error initializing map:", error);
        this.loading = false;
        if (this.componentMounted) {
          alert("There was a problem displaying the map. Please try refreshing the page.");
        }
      }
    },
    
    calculateAndDisplayRoute() {
      // Check requirements and component mount status
      if (!this.componentMounted || 
          !this.directionsService || 
          !this.directionsRenderer || 
          !window.google || 
          !window.google.maps || 
          !this.mapInitialized ||
          !this.$refs.mapContainer) { // Check if map container still exists
        this.loading = false;
        return;
      }
      
      const origin = this.trip.starting_point || "Current Location";
      const destination = this.trip.destination?.location;
      
      if (!destination) {
        this.loading = false;
        console.error("No destination specified");
        return;
      }
      
      // Create an array of waypoints from stops
      const waypoints = this.stops.map(stop => ({
        location: stop.location,
        stopover: true
      }));
      
      // Calculate and display route with waypoints
      this.directionsService.route({
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        optimizeWaypoints: false, // Keep stops in the order they were added
        travelMode: window.google.maps.TravelMode.DRIVING
      }, (response, status) => {
        // Check if component is still mounted before updating
        if (!this.componentMounted) {
          return;
        }
        
        this.loading = false;
        
        if (status === window.google.maps.DirectionsStatus.OK) {
          // Make sure renderer is still valid
          if (this.directionsRenderer && this.map) {
            this.directionsRenderer.setDirections(response);
          
            // Extract route information
            const route = response.routes[0];
            if (route && route.legs.length > 0) {
              const leg = route.legs[0];
              this.routeInfo.distance = leg.distance.text;
              this.routeInfo.duration = leg.duration.text;
            }
          }
        } else {
          console.error("Directions request failed due to " + status);
          if (this.componentMounted) {
            alert("Could not calculate directions. Please try again.");
          }
        }
      });
    },
    
    openInGoogleMaps() {
      const origin = encodeURIComponent(this.trip.starting_point || "Current+Location");
      const destination = encodeURIComponent(this.trip.destination?.location || "");
      
      if (!destination) {
        alert("Destination not available.");
        return;
      }
      
      const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
      window.open(url, "_blank");
    },
    
    cleanupGoogleMaps() {
      // Set component as unmounted first to prevent further operations
      this.componentMounted = false;
      
      // Clean up directions renderer
      if (this.directionsRenderer) {
        this.directionsRenderer.setMap(null);
        this.directionsRenderer = null;
      }
      
      // Clean up map
      this.map = null;
      this.directionsService = null;
      this.mapInitialized = false;
      
      // Remove callback from global scope
      if (window.googleMapsCallback) {
        delete window.googleMapsCallback;
      }
      
      // Remove script element from head if it exists
      if (this.googleMapsScriptElement && this.googleMapsScriptElement.parentNode) {
        this.googleMapsScriptElement.parentNode.removeChild(this.googleMapsScriptElement);
        this.googleMapsScriptElement = null;
      }
      
      // Clear other resources
      this.googleMapsLoaded = false;
    }
  },
  created() {
    // Load data first
    this.fetchTripDetails();
  },
  mounted() {
    // Load Google Maps script in mounted instead of created
    this.componentMounted = true; // Set this first
    this.loadGoogleMapsScript();
  },
  beforeUnmount() {
    // Clean up when component is destroyed
    this.cleanupGoogleMaps();
  }
};
</script>

<style scoped>
.trip-directions-container {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1.5rem;
  height: calc(100vh - 170px);
  min-height: 500px;
}

.trip-info-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.trip-detail {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.trip-detail .material-symbols-outlined {
  color: var(--primary);
  font-size: 1.5rem;
}

.detail-label {
  font-size: 0.75rem;
  color: #666;
  margin: 0 0 0.2rem;
}

.detail-value {
  font-size: 1rem;
  font-weight: 500;
  color: #262626;
  margin: 0;
}

.direction-arrow {
  display: flex;
  justify-content: center;
  margin: 0.5rem 0;
}

.direction-arrow .material-symbols-outlined {
  color: #999;
  font-size: 2rem;
}

.trip-stats {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
  display: grid;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stat-item .material-symbols-outlined {
  color: #666;
  font-size: 1.25rem;
}

.action-buttons {
  margin-top: auto;
  padding-top: 1.5rem;
}

.external-maps-btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  background: #f5f5f5;
  color: #333;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.external-maps-btn:hover {
  background: #e0e0e0;
}

.map-container {
  background: #f5f5f5;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  flex: 1;
  min-height: 400px;
}

.loading-map {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 5;
}

.loading-map .spin {
  animation: spin 1s linear infinite;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--primary);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.trip-stops {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.stops-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  margin: 0 0 1rem;
}

.stops-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stop-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stop-marker {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #0071c2;
  color: white;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: bold;
}

.stop-info h4 {
  margin: 0 0 0.25rem;
  font-size: 0.9rem;
}

.stop-info p {
  margin: 0;
  font-size: 0.8rem;
  color: #666;
}

@media (max-width: 768px) {
  .trip-directions-container {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .trip-info-panel {
    order: 1;
  }
  
  .map-container {
    order: 0;
    height: 300px;
  }
}
</style>
