<template>
  <div class="location-search">
    <h2>Explore Nearby Sites</h2>

    <input
      type="text"
      id="from-input"
      class="search-input"
      v-model="fromQuery"
      placeholder="From where are you travelling?"
    />

    <input
      type="text"
      id="location-input"
      class="search-input"
      v-model="searchQuery"
      placeholder="Enter a destination city..."
    />

    <div class="date-people-inputs">
      <input type="date" v-model="startDate" class="date-input" />
      <input type="date" v-model="endDate" class="date-input" />
      <input type="number" v-model.number="numPeople" min="1" class="people-input" placeholder="People" />
    </div>

    <button @click="handleSearch" class="search-button">Search</button>

    <div v-if="loading" class="loading">Loading sites near you...</div>

    <div v-if="tripCreatedMessage" class="trip-created-msg">
      {{ tripCreatedMessage }}
    </div>

    <div v-if="places.length" class="places-list">
      <div v-for="(place, index) in places" :key="index" class="place-card">
        <img :src="place.photo || defaultImage" alt="Place" class="place-image" />
        <div class="place-info">
          <h3>{{ place.name }}</h3>
          <p>{{ place.address }}</p>
          <p v-if="place.rating">Rating: {{ place.rating }} ⭐</p>
          <p>
            Est. Budget for {{ numPeople }} {{ numPeople > 1 ? "people" : "person" }}:
            <strong>{{ place.budget }}</strong>
          </p>
          <p v-if="distance">Distance: {{ distance }} km</p>
          <button @click="createTrip(place)" class="create-trip-button">Create Trip</button>
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
      fromQuery: "",
      map: null,
      selectedLocation: null,
      fromLocation: null,
      startDate: "",
      endDate: "",
      numPeople: 1,
      distance: 0,
      places: [],
      loading: false,
      defaultImage: "https://via.placeholder.com/150?text=No+Image",
      apiKey: googleMapsApiKey,
      tripCreatedMessage: "",
    };
  },
  mounted() {
    this.loadGoogleMaps();
  },
  computed: {
    numDays() {
      if (!this.startDate || !this.endDate) return 1;
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 1;
    },
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
      const toInput = document.getElementById("location-input");
      const fromInput = document.getElementById("from-input");

      const toAutocomplete = new google.maps.places.Autocomplete(toInput, {
        componentRestrictions: { country: "ZA" },
        fields: ["geometry", "name"],
      });
      const fromAutocomplete = new google.maps.places.Autocomplete(fromInput, {
        componentRestrictions: { country: "ZA" },
        fields: ["geometry", "name"],
      });

      toAutocomplete.addListener("place_changed", () => {
        const place = toAutocomplete.getPlace();
        if (place.geometry) {
          this.selectedLocation = place.geometry.location;
        }
      });

      fromAutocomplete.addListener("place_changed", () => {
        const place = fromAutocomplete.getPlace();
        if (place.geometry) {
          this.fromLocation = place.geometry.location;
        }
      });
    },
    handleSearch() {
      if (!this.selectedLocation || !this.fromLocation) {
        alert("Please select both a 'from' and 'to' location.");
        return;
      }

      this.calculateDistance().then(() => {
        this.fetchNearbyPlaces(this.selectedLocation);
      });
    },
    calculateDistance() {
      console.log("Calculating distance...");
      return new Promise((resolve) => {
        const service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
          {
            origins: [this.fromLocation],
            destinations: [this.selectedLocation],
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (response, status) => {
            if (status === "OK") {
              const distanceMeters = response.rows[0].elements[0].distance.value;
              this.distance = (distanceMeters / 1000).toFixed(1);
              resolve();
            } else {
              console.error("Distance Matrix Error:", status);
              this.distance = 0;
              resolve();
            }
          }
        );
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
                  const budget = this.calculateBudgetForPlace();
                  resolve({
                    name: details.name,
                    rating: details.rating,
                    address: details.formatted_address,
                    photo: details.photos?.[0]?.getUrl({ maxWidth: 300 }) || null,
                    budget: budget,
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
    calculateBudgetForPlace() {
      const basePerPersonPerDay = 1000;
      const travelRatePerKm = 5;

      const base = this.numPeople * this.numDays * basePerPersonPerDay;
      const travel = this.distance * travelRatePerKm;
      const randomVariation = Math.floor(Math.random() * 2000);

      const minBudget = base + travel;
      const maxBudget = minBudget + randomVariation + 1000;

      return `R${Math.floor(minBudget).toLocaleString()} - R${Math.floor(maxBudget).toLocaleString()}`;
    },
    createTrip(place) {
      const trip = {
        location: place.name,
        address: place.address,
        rating: place.rating || "N/A",
        photoUrl: place.photo || this.defaultImage,
        budget: place.budget,
        numPeople: this.numPeople,
        numDays: this.numDays,
        startDate: this.startDate,
        endDate: this.endDate,
        distance: this.distance + " km",
      };

      console.log("Trip Created:", trip);

      this.tripCreatedMessage = "🎉 Trip created successfully!";
      setTimeout(() => {
        this.tripCreatedMessage = "";
      }, 3000);
    },
  },
};
</script>

<style scoped>
.create-trip-button {
  background-color: #28a745;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  margin-top: 10px;
  cursor: pointer;
}
.create-trip-button:hover {
  background-color: #218838;
}
.trip-created-msg {
  background-color: #d4edda;
  color: #155724;
  padding: 10px;
  border-radius: 8px;
  margin: 20px 0;
  text-align: center;
}
</style>



<style scoped>
.location-search {
  max-width: 700px;
  margin: auto;
  padding: 2rem;
  text-align: center;
}

.search-input,
.date-input,
.people-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.date-people-inputs {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.people-input {
  flex: 1;
}

.search-button {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  background-color: #007BFF;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
}

.search-button:hover {
  background-color: #0056b3;
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
  width: 100%;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
}

.place-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.place-info {
  text-align: left;
  flex: 1;
}
</style>
