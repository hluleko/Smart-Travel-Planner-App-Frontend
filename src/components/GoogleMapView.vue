<template>
  <div class="google-map-container">
    <div ref="mapRef" class="map-element"></div>
    <div v-if="loading" class="loading-overlay">
      <span class="material-symbols-outlined spin">progress_activity</span>
      <p>Loading map...</p>
    </div>
  </div>
</template>

<script>
/* global google */
import { googleMapsApiKey } from "@/config";

export default {
  name: "GoogleMapView",
  props: {
    startPoint: {
      type: String,
      default: ""
    },
    destination: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      loading: true,
      map: null,
      directionsService: null,
      directionsRenderer: null,
      scriptLoaded: false,
      mapInitialized: false,
      routeCalculated: false
    };
  },
  emits: ["route-calculated", "loading-changed", "map-error"],
  watch: {
    startPoint() {
      if (this.mapInitialized && this.startPoint && this.destination) {
        this.calculateRoute();
      }
    },
    destination() {
      if (this.mapInitialized && this.startPoint && this.destination) {
        this.calculateRoute();
      }
    }
  },
  methods: {
    loadGoogleMapsScript() {
      // Check if script is already loaded
      if (window.google && window.google.maps) {
        this.scriptLoaded = true;
        this.initializeMap();
        return;
      }

      // Generate a unique callback name to avoid conflicts
      const callbackName = `initGoogleMap_${Date.now()}`;
      
      // Create global callback function
      window[callbackName] = () => {
        this.scriptLoaded = true;
        this.initializeMap();
        // Clean up global callback
        delete window[callbackName];
      };

      // Create script element
      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&callback=${callbackName}&libraries=places`;
      
      script.onerror = () => {
        this.loading = false;
        this.$emit('map-error', 'Failed to load Google Maps. Please check your internet connection.');
      };
      
      document.head.appendChild(script);
    },
    
    initializeMap() {
      if (!this.scriptLoaded || !this.$refs.mapRef) {
        return;
      }
      
      try {
        // Create map instance
        this.map = new google.maps.Map(this.$refs.mapRef, {
          center: { lat: -30.5595, lng: 22.9375 }, // Default center (South Africa)
          zoom: 6,
          mapTypeControl: false,
          fullscreenControl: true,
          streetViewControl: false
        });

        // Initialize directions renderer
        this.directionsRenderer = new google.maps.DirectionsRenderer({
          map: this.map,
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: "#0071c2",
            strokeWeight: 5
          }
        });

        // Initialize directions service
        this.directionsService = new google.maps.DirectionsService();
        
        this.mapInitialized = true;
        
        // Calculate route if we have both points
        if (this.startPoint && this.destination) {
          this.calculateRoute();
        } else {
          this.loading = false;
          this.$emit('loading-changed', false);
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        this.loading = false;
        this.$emit('loading-changed', false);
        this.$emit('map-error', 'Error initializing map');
      }
    },
    
    calculateRoute() {
      if (!this.mapInitialized || !this.directionsService || !this.destination) {
        return;
      }
      
      this.loading = true;
      this.$emit('loading-changed', true);
      
      const origin = this.startPoint || 'Your location';
      const destination = this.destination;
      
      this.directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        avoidTolls: false,
        avoidHighways: false
      }, (response, status) => {
        this.loading = false;
        this.$emit('loading-changed', false);
        
        if (status === 'OK') {
          this.directionsRenderer.setDirections(response);
          
          if (response.routes && response.routes.length > 0 && 
              response.routes[0].legs && response.routes[0].legs.length > 0) {
            const leg = response.routes[0].legs[0];
            
            this.$emit('route-calculated', {
              distance: leg.distance.text,
              duration: leg.duration.text
            });
            
            this.routeCalculated = true;
          }
        } else {
          console.error(`Directions request failed: ${status}`);
          this.$emit('map-error', `Could not calculate directions (${status})`);
        }
      });
    },
    
    refreshMap() {
      if (this.map) {
        google.maps.event.trigger(this.map, 'resize');
      }
    }
  },
  mounted() {
    this.loadGoogleMapsScript();
  },
  beforeUnmount() {
    // Clean up
    this.map = null;
    this.directionsService = null;
    this.directionsRenderer = null;
  }
};
</script>

<style scoped>
.google-map-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-element {
  width: 100%;
  height: 100%;
  border-radius: inherit;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-overlay .spin {
  animation: spin 1s linear infinite;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--primary);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
