<template>
  <div class="container">
    <h2>Discover Places of Interest in South Africa</h2>
    <p class="description">
      Search for a city or region to explore tourist attractions, parks, restaurants, and more.
      Locations in <span class="blue-label">blue</span> or <span class="green-label">green</span> are points of interest you can visit.
    </p>
    <br/>
    <input
      type="text"
      id="location-input"
      v-model="searchQuery"
      placeholder="Search for a city or region..."
      class="search-input"
    />

    <div id="map" class="map-container"></div>

    <div class="legend">
      <h4>Map Key</h4>
      <p><span class="blue-box"></span> Labels in Blue: Places of Interest</p>
      <p><span class="green-box"></span> Green Areas: Parks & Natural Sites</p>
    </div>

    <div v-if="places.length" class="places-list">
      <h3>Places of Interest</h3>
      <ul>
        <li v-for="(place, index) in places" :key="index">
          <strong>{{ place.name }}</strong>
          <p>{{ place.vicinity }}</p>
          <p v-if="place.rating">Rating: {{ place.rating }} ⭐</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      apiKey: "AIzaSyDxU7_6cH1hUL7Yv_IWXKJ4sVlIQAINp2E", // Replace with actual API key
      map: null,
      service: null,
      places: [],
    };
  },
  mounted() {
    this.loadGoogleMaps();
  },
  methods: {
    loadGoogleMaps() {
      if (!window.google || !window.google.maps) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => this.initMap();
        document.head.appendChild(script);
      } else {
        this.initMap();
      }
    },
    initMap() {
      this.map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: -30.5595, lng: 22.9375 }, // South Africa
        zoom: 6,
        styles: [
          { featureType: "all", elementType: "geometry", stylers: [{ visibility: "simplified" }, { saturation: -100 }, { lightness: 50 }] },
          { featureType: "road", elementType: "geometry", stylers: [{ visibility: "off" }] },
          { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ visibility: "on" }] },
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: "on" }, { color: "#007bff" }, { weight: 1 }] },
          { featureType: "landscape", elementType: "geometry", stylers: [{ visibility: "simplified" }, { color: "#eeeeee" }] },
          { featureType: "poi.park", elementType: "geometry", stylers: [{ visibility: "on" }, { color: "#c5e1a5" }] },
        ]
      });
      this.initAutocomplete();
    },
    initAutocomplete() {
      const inputElement = document.getElementById("location-input");
      const autocomplete = new window.google.maps.places.Autocomplete(inputElement, {
        componentRestrictions: { country: "ZA" },
        fields: ["geometry", "name"],
      });
      
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;
        
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(12);
        this.fetchNearbyPlaces(place.geometry.location);
      });
    },
    fetchNearbyPlaces(location) {
      this.service = new window.google.maps.places.PlacesService(this.map);
      
      const request = {
        location,
        radius: 5000,
        type: ["tourist_attraction", "restaurant", "park", "museum"],
      };
      
      this.service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          this.places = results;
        }
      });
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: auto;
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  font-size: 2rem;
  color: #007bff;
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}

.map-container {
  width: 100%;
  height: 400px;
  margin-top: 1rem;
  border-radius: 8px;
}

.legend {
  margin-top: 15px;
  padding: 10px;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.blue-box, .green-box {
  display: inline-block;
  width: 15px;
  height: 15px;
  margin-right: 5px;
}

.blue-box {
  background-color: #007bff;
}

.green-box {
  background-color: #28a745;
}

.places-list {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}
</style>