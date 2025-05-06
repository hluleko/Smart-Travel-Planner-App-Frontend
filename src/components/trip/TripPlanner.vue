<!-- TripPlanner.vue -->
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

    <div v-if="loading" class="loading">
      <span class="material-symbols-outlined spin">progress_activity</span>
         <b>Loading sites near you...</b>
    </div>

    <!-- Status Popup -->
    <Popup v-if="showPopup" :visible="showPopup" title="Creating Trip" @close="showPopup = false">
      <template #actions>
        <div class="notification-container">
          <div class="message-content">
            <p>{{popupMessage}}</p>
          </div>
        </div>        
      </template>
    </Popup>

    <div v-if="tripCreatedMessage" class="trip-created-msg">{{ tripCreatedMessage }}</div>

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
import { mapState } from "vuex";
import { createTrip, addDestination, addBudget, createAlert } from "@/api/BackendApi";
import Popup from "@/components/common/PopUp.vue";

export default {
  name: "TripPlanner",
  components: { TripForm, PlaceList , Popup},
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
      showPopup: false,
      popupMessage: "",
    };
  },
  computed: {
    ...mapState(["user", "token"]),
    numDays() {
      if (!this.startDate || !this.endDate) return 1;
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 1;
    },
    authToken() {
      return this.token;
    },
    userId() {
      return this.user?.user_id;
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
        if (place.geometry) this.selectedLocation = place.geometry.location;
      });

      fromAutocomplete.addListener("place_changed", () => {
        const place = fromAutocomplete.getPlace();
        if (place.geometry) this.fromLocation = place.geometry.location;
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
            } else {
              console.error("Distance Matrix Error:", status);
              this.distance = 0;
            }
            resolve();
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
                      budget,
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
    calculateBudgetForPlace() {``
      const basePerPersonPerDay = 1000;
      const travelRatePerKm = 5;
      const base = this.numPeople * this.numDays * basePerPersonPerDay;
      const travel = this.distance * travelRatePerKm;
      const randomVariation = Math.floor(Math.random() * 2000);
      const minBudget = base + travel;
      const maxBudget = minBudget + randomVariation + 1000;
      return `R${Math.floor(minBudget).toLocaleString()} - R${Math.floor(maxBudget).toLocaleString()}`;
    },
    async createTrip(place) {
      try {
        const token = this.authToken;
        const userId = this.userId;

        this.showPopup = true;
        this.popupMessage = "Creating destination...";

        const destinationPayload = {
          user_id: userId,
          location: place.name,
          address: place.address,
          rating: place.rating || "N/A",
          photo_url: place.photo || this.defaultImage,
        };
        const destResponse = await addDestination(token, destinationPayload);
        const destinationId = destResponse.data.destination_id;

        this.popupMessage = "Now creating trip...";

        const tripPayload = {
          title: `Trip to ${place.name}`,
          start_date: this.startDate,
          end_date: this.endDate,
          description: `Trip to ${place.name} from ${this.fromQuery}`,
          number_of_people: this.numPeople,
          user_id: userId,
          starting_point: this.fromQuery,
          destination_id: destinationId,
        };
        const tripResponse = await createTrip(token, tripPayload);
        const tripId = tripResponse.data.trip_id;

        this.popupMessage = "Now creating budget...";

        const budgetRange = place.budget
          .replace(/R/g, "")
          .replace(/\s/g, "")
          .split("-")
          .map((b) => parseInt(b.replace(/,/g, ""), 10));
        const budgetPayload = {
          trip_id: tripId,
          min_amount: budgetRange[0],
          max_amount: budgetRange[1],
        };
        await addBudget(token, budgetPayload);

        this.popupMessage = "Almost done, please be patient...";

        await createAlert(this.token, {
          user_id: this.userId,
          type: "info",
          message: `You created a trip to ${place.name}.`,
          created_at: new Date().toISOString(),
          seen: false,
        });

        this.popupMessage = "Trip created successfully!";
        this.$router.push("/trips");

        setTimeout(() => {
          this.showPopup = false;
        }, 2000);
      } catch (error) {
        this.showPopup = false;
        console.error("Trip creation error:", error.response?.data || error.message);
        alert("Error creating trip. See console for details.");
      }
    },

  },
};
</script>
