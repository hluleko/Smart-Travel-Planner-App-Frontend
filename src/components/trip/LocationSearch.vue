<template>
    <div class="location-search">
      <h2>Explore Nearby Sites</h2>
  
      <input
        type="text"
        id="location-input"
        class="search-input"
        v-model="searchQuery"
        placeholder="Enter a city or location..."
      />
  
      <div v-if="loading" class="loading">Loading sites near you...</div>
  
      <div v-if="places.length" class="places-list">
        <div
          v-for="(place, index) in places"
          :key="index"
          class="place-card"
        >
          <img
            :src="place.photo || defaultImage"
            alt="Place"
            class="place-image"
          />
          <div class="place-info">
            <h3>{{ place.name }}</h3>
            <p>{{ place.address }}</p>
            <p v-if="place.rating">Rating: {{ place.rating }} ⭐</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  /* global google */
  import { googleMapsApiKey } from "@/config";
  
  export default {
    name: "LocationSearch",
    data() {
      return {
        searchQuery: "",
        map: null,
        places: [],
        loading: false,
        defaultImage: "https://via.placeholder.com/150?text=No+Image",
        apiKey: googleMapsApiKey,
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
          script.crossOrigin = "anonymous";
          script.onload = this.initMap;
          document.head.appendChild(script);
        } else {
          this.initMap();
        }
      },
      initMap() {
        const dummyDiv = document.createElement("div");
        this.map = new google.maps.Map(dummyDiv);
        this.initAutocomplete();
      },
      initAutocomplete() {
        const input = document.getElementById("location-input");
        const autocomplete = new google.maps.places.Autocomplete(input, {
          componentRestrictions: { country: "ZA" },
          fields: ["geometry", "name"],
        });
  
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.geometry) return;
  
          // Emit selected location name to parent
          this.$emit("locationSelected", place.name);
  
          this.fetchNearbyPlaces(place.geometry.location);
        });
      },
      fetchNearbyPlaces(location) {
        this.loading = true;
        this.places = [];
  
        const request = {
          query: "tourist attractions, parks, restaurants, museums",
          location,
          radius: 5000,
        };
  
        const service = new google.maps.places.PlacesService(this.map);
        service.textSearch(request, (results, status) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK || !results) {
            console.error("Error fetching places:", status);
            this.loading = false;
            return;
          }
  
          const placePromises = results.map((place) => {
            return new Promise((resolve) => {
              service.getDetails(
                {
                  placeId: place.place_id,
                  fields: ["name", "formatted_address", "rating", "photos"],
                },
                (details, status) => {
                  if (status === google.maps.places.PlacesServiceStatus.OK) {
                    resolve({
                      name: details.name,
                      rating: details.rating,
                      address: details.formatted_address,
                      photo:
                        details.photos?.[0]?.getUrl({ maxWidth: 300 }) || null,
                    });
                  } else {
                    resolve(null);
                  }
                }
              );
            });
          });
  
          Promise.all(placePromises).then((placesData) => {
            this.places = placesData.filter((p) => p !== null);
            this.loading = false;
          });
        });
      },
    },
  };
  </script>



<style scoped>
.location-search {
  max-width: 600px;
  margin: auto;
  padding: 2rem;
  text-align: center;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.loading {
  margin-top: 1rem;
  font-style: italic;
}

.places-list {
  margin-top: 2rem;
}

.place-card {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 10px;
  background: #fafafa;
  align-items: center;
  width: 70%;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
}

.place-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.place-info {
  text-align: left;
}
</style>
