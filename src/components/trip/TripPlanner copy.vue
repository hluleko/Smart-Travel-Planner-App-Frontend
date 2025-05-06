//TripPlanner.vue
<template>
  <div class="location-search">
    <TripForm
      :fromQuery="fromQuery"
      :searchQuery="searchQuery"
      :startDate="startDate"
      :endDate="endDate"
      :numPeople="numPeople"
      @update:fromQuery="fromQuery = $event"
      @update:searchQuery="searchQuery = $event"
      @update:startDate="startDate = $event"
      @update:endDate="endDate = $event"
      @update:numPeople="numPeople = $event"
      @search="handleSearch"
    />


    <div v-if="loading" class="loading">Loading sites near you...</div>

    <div v-if="tripCreatedMessage" class="trip-created-msg">
      {{ tripCreatedMessage }}
    </div>

    <PlaceList
      v-if="places.length"
      :places="places"
      :numPeople="numPeople"
      :distance="distance"
      :defaultImage="defaultImage"
      @createTrip="createTrip"
    />
  </div>
</template>

<script>
/* global google */
import TripForm from "./TripForm.vue";
import PlaceList from "./PlaceList.vue";
import { googleMapsApiKey } from "@/config";

export default {
  name: "TripPlanner",
  components: { TripForm, PlaceList },
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
  computed: {
    numDays() {
      if (!this.startDate || !this.endDate) return 1;
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 1;
    },
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

      const service = new google.maps.places.PlacesService(this.map);
      service.textSearch(
        {
          query: "tourist attractions, parks, restaurants, museums",
          location,
          radius: 5000,
        },
        (results, status) => {
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
        }
      );
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
      this.tripCreatedMessage = "Trip created successfully!";
      setTimeout(() => {
        this.tripCreatedMessage = "";
      }, 3000);
    },
  },
};
</script>
