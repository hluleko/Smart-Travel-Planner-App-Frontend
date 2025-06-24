<!-- TripPlanner.vue -->
<template>
  <div class="location-search">
    <TripForm
      ref="tripForm"
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
      @fromLocationSelected="handleFromLocationSelected"
      @toLocationSelected="handleToLocationSelected"
    />

    <div v-if="places.length && places.length > 0">
      <AllergyWarning 
        v-if="allergyWarning !== null"
        :warning="allergyWarning"
        :userAllergyMatches="userAllergyMatches"
        :hasNoAllergies="!allergyWarning"
      />
      <StopSelector :value="stops" @input="updateStops" @stop-added="onStopAdded" />
    </div>

    <div v-if="loading" class="loading">
      <span class="material-symbols-outlined spin">progress_activity</span>
         <b>Loading sites near you...</b>
    </div>

    <!-- Login Required Popup -->
    <Popup v-if="showLoginPrompt" :visible="showLoginPrompt" title="Login Required" @close="closeLoginPrompt">
      <template #actions>
        <div class="notification-container">
          <div class="message-content">
            <p>You need to sign in to create a trip.</p>
          </div>
        </div>
        <div class="popup-actions">
          <button @click="redirectToLogin" class="login-btn">
            <span class="material-symbols-outlined">login</span>
            Sign in
          </button>
          <button @click="closeLoginPrompt" class="cancel-btn">Cancel</button>
        </div>
      </template>
    </Popup>

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

    <!-- Add Confirmation Dialog for overlapping trips -->
    <ConfirmationDialog
      :visible="showOverlapConfirmation"
      title="Trip Date Overlap Detected"
      :message="overlapMessage"
      confirmText="Continue Anyway"
      cancelText="Cancel"
      @confirm="proceedWithTripCreation"
      @cancel="cancelTripCreation"
    >
      <div class="overlap-details">
        <p>You already have trips scheduled for these dates:</p>
        <ul class="overlap-trip-list">
          <li v-for="trip in overlappingTrips" :key="trip.trip_id">
            <div class="overlap-trip-title">{{ trip.title }}</div>
            <div class="overlap-trip-dates">
              {{ formatDate(trip.start_date) }} - {{ formatDate(trip.end_date) }}
            </div>
          </li>
        </ul>
      </div>
    </ConfirmationDialog>

    <div v-if="tripCreatedMessage" class="trip-created-msg">{{ tripCreatedMessage }}</div>

    <PlaceList
      v-if="places.length"
      :places="places"
      :numPeople="numPeople"
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
import { createTrip, addDestination, addCost, createAlert, createStop, getUserAllergies, getTripsByUserId } from "@/api/BackendApi";
import Popup from "@/components/common/PopUp.vue";
import StopSelector from "./StopSelector.vue";
import AllergyWarning from "./AllergyWarning.vue";
import { generateAllergyWarning, checkUserAllergies } from "@/utils/AllergyWarningService";
import ConfirmationDialog from "@/components/common/ConfirmationDialog.vue";

export default {
  name: "TripPlanner",
  components: { TripForm, PlaceList, Popup, StopSelector, AllergyWarning, ConfirmationDialog },
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
      stops: [],
      allergyWarning: null,
      userAllergies: [],
      userAllergyMatches: [],
      
      // Add new properties for trip overlap handling
      showOverlapConfirmation: false,
      overlappingTrips: [],
      overlapMessage: "",
      pendingTripCreation: null,
      userTrips: [],
      showLoginPrompt: false,
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
    console.log("Component mounted, stops:", this.stops);
    if (this.userId) {
      this.fetchUserAllergies();
      // Fetch user's trips for overlap checking
      this.fetchUserTrips();
    }
  },
  watch: {
    stops: {
      handler(newStops) {
        console.log("Stops changed:", newStops.length, newStops);
      },
      deep: true
    }
  },
  methods: {
    loadGoogleMaps() {
      if (!window.google || !window.google.maps) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          this.initMap();
          // After Google Maps is loaded, initialize autocomplete in the TripForm component
          if (this.$refs.tripForm && typeof this.$refs.tripForm.initAutocomplete === 'function') {
            this.$refs.tripForm.initAutocomplete();
          }
        };
        document.head.appendChild(script);
      } else {
        this.initMap();
        // If Google Maps is already loaded, initialize autocomplete in the TripForm component
        if (this.$refs.tripForm && typeof this.$refs.tripForm.initAutocomplete === 'function') {
          this.$refs.tripForm.initAutocomplete();
        }
      }
    },
    initMap() {
      const dummyDiv = document.createElement("div");
      this.map = new google.maps.Map(dummyDiv);
      // Remove the call to initAutocomplete here as it's now handled in TripForm
    },
    handleFromLocationSelected(location) {
      console.log("From location selected:", location);
      this.fromLocation = location;
    },
    
    handleToLocationSelected(location) {
      console.log("To location selected:", location);
      this.selectedLocation = location;
      
      // Generate allergy warning for the selected location
      if (this.searchQuery) {
        this.checkLocationForAllergyWarnings(this.searchQuery);
      }
    },
    
    checkLocationForAllergyWarnings(location) {
      // Generate a warning or return null if no allergies found
      const warning = generateAllergyWarning(location);
      
      if (warning) {
        this.allergyWarning = warning;
        
        // If we have user allergies and a warning, check for matches
        if (this.userAllergies.length > 0) {
          this.userAllergyMatches = checkUserAllergies(this.userAllergies, warning);
          
          // Create an alert if there are matches
          if (this.userAllergyMatches.length > 0 && this.userId && this.token) {
            this.createAllergyAlert(location);
          }
        } else {
          this.userAllergyMatches = [];
        }
      } else {
        // Set allergyWarning to false to indicate no allergies were found
        this.allergyWarning = false;
        this.userAllergyMatches = [];
      }
    },
    
    async createAllergyAlert(location) {
      try {
        const matchText = this.userAllergyMatches.map(m => m.userAllergy.name).join(", ");
        
        await createAlert(this.token, {
          user_id: this.userId,
          type: "warning",
          message: `Allergy Warning: ${location} may trigger your ${matchText} allergies.`,
          created_at: new Date().toISOString(),
          seen: false,
        });
      } catch (error) {
        console.error("Failed to create allergy alert:", error);
      }
    },
    
    handleSearch() {
      console.log("Search triggered, from:", this.fromLocation, "to:", this.selectedLocation);
      if (!this.selectedLocation || !this.fromLocation) {
        alert("Please select both a 'from' and 'to' location.");
        return;
      }

      // Check for allergy warnings when search is performed
      if (this.searchQuery) {
        this.checkLocationForAllergyWarnings(this.searchQuery);
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
    calculateDistanceToPlace(placeLocation) {
      return new Promise((resolve) => {
        if (!this.fromLocation) {
          console.error("From location is not set");
          resolve("N/A");
          return;
        }

        const service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
          {
            origins: [this.fromLocation],
            destinations: [placeLocation],
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (response, status) => {
            if (status === "OK" && response.rows[0].elements[0].status === "OK") {
              const distanceMeters = response.rows[0].elements[0].distance.value;
              resolve((distanceMeters / 1000).toFixed(1)); // Return distance in km
            } else {
              console.error("Distance Matrix Error:", status);
              resolve("N/A");
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

          const placePromises = results.map(async (place) => {
            return new Promise((resolve) => {
              service.getDetails(
                {
                  placeId: place.place_id,
                  fields: ["name", "formatted_address", "rating", "photos", "geometry"],
                },
                async (details, status) => {
                  if (status === google.maps.places.PlacesServiceStatus.OK) {
                    // Calculate individual distance for this place from the from location
                    const distance = await this.calculateDistanceToPlace(details.geometry.location);
                    
                    // Calculate budget based on the individual distance
                    const budget = this.calculateBudgetForPlace(distance);

                    resolve({
                      name: details.name,
                      rating: details.rating,
                      address: details.formatted_address,
                      photo: details.photos?.[0]?.getUrl({ maxWidth: 300 }) || null,
                      distance: distance, // Fix: Properly assign the distance value
                      budget: budget // Fix: Properly assign the budget object
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
    calculateBudgetForPlace(distance) {
      // Use the unique distance for each place to calculate its budget
      
      // Base calculations
      const basePerPersonPerDay = 1000;
      const travelRatePerKm = 5;
      
      // Convert distance to number to ensure proper calculations
      const distanceValue = typeof distance === 'string' ? 
                           parseFloat(distance) || 0 : 
                           distance || 0;
      
      // Calculate number of people and days
      const people = this.numPeople;
      const days = this.numDays;
      
      // Calculate accommodation base cost
      const accommodationBase = people * days * basePerPersonPerDay;
      
      // Calculate travel costs
      const petrolCost = distanceValue * travelRatePerKm * 1.2;
      
      // Calculate food costs - based on R250 per person per meal, 3 meals per day
      const foodCostPerDay = people * 250 * 3;
      const totalFoodCost = foodCostPerDay * days;
      
      // Estimate toll gate fees - based on R40 per 100km
      const estimatedTollFees = Math.ceil(distanceValue / 100) * 40;
      
      // Calculate activities cost - R350 per person per day
      const activitiesCost = people * days * 350;
      
      // Add some random variation to make budgets realistic
      const randomVariation = Math.floor(Math.random() * 2000);
      
      // Calculate totals
      const minBudget = accommodationBase + petrolCost + totalFoodCost + estimatedTollFees + activitiesCost;
      const maxBudget = minBudget + randomVariation + 1000;
      
      // Create budget breakdown object for detailed display
      const budgetBreakdown = {
        accommodation: {
          min: Math.floor(accommodationBase),
          max: Math.floor(accommodationBase * 1.1) // 10% variation for accommodation
        },
        transport: {
          petrol: Math.floor(petrolCost),
          tolls: estimatedTollFees
        },
        food: Math.floor(totalFoodCost),
        activities: Math.floor(activitiesCost),
        totalMin: Math.floor(minBudget),
        totalMax: Math.floor(maxBudget)
      };
      
      // Return both a simple string for backward compatibility and a detailed breakdown
      return {
        simple: `R${Math.floor(minBudget).toLocaleString()} - R${Math.floor(maxBudget).toLocaleString()}`,
        breakdown: budgetBreakdown
      };
    },
    
    async createTrip(place) {
      // Check if user is logged in first
      if (!this.token || !this.userId) {
        this.showLoginPrompt = true;
        return;
      }
      
      // Store place for later use if we need to proceed after confirmation
      this.pendingTripCreation = place;
      
      // Check for overlapping trips before proceeding
      const overlappingTrips = this.checkForTripOverlap(this.startDate, this.endDate);
      
      if (overlappingTrips.length > 0) {
        // Found overlapping trips, show confirmation dialog
        this.overlappingTrips = overlappingTrips;
        this.overlapMessage = `You have ${overlappingTrips.length} existing trip(s) that overlap with your selected dates (${this.formatDate(this.startDate)} - ${this.formatDate(this.endDate)}).`;
        this.showOverlapConfirmation = true;
      } else {
        // No overlaps, proceed with trip creation
        this.proceedWithTripCreation();
      }
    },
    
    cancelTripCreation() {
      this.showOverlapConfirmation = false;
      this.pendingTripCreation = null;
      this.overlappingTrips = [];
    },
    
    async proceedWithTripCreation() {
      // Hide the confirmation dialog if it was shown
      this.showOverlapConfirmation = false;
      
      // If there's no pending trip, something went wrong
      if (!this.pendingTripCreation) {
        console.error("No pending trip to create");
        return;
      }
      
      const place = this.pendingTripCreation;
      this.pendingTripCreation = null; // Clear the reference
      
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
        
        // Create the trip
        const tripResponse = await createTrip(token, tripPayload);
        const tripId = tripResponse.data.trip_id;
        
        // Add stops to the trip if any
        this.popupMessage = "Adding stops to trip...";
        console.log("Current stops before adding to trip:", this.stops);
        console.log("Stops length:", this.stops ? this.stops.length : 0);
        console.log("Stops type:", Object.prototype.toString.call(this.stops));
        
        // Force the stops array to be treated as a regular array
        const stopsArray = Array.isArray(this.stops) ? [...this.stops] : [];
        
        if (stopsArray.length > 0) {
          console.log("Creating stops:", stopsArray.length);
          
          // Process each stop with proper error handling
          for (const stop of stopsArray) {
            try {
              const stopPayload = {
                trip_id: tripId,
                name: stop.name,
                address: stop.address,
                location: stop.location,
                photo_url: stop.photo_url || null,
                order_index: stop.order_index
              };
              
              console.log("Sending stop data:", stopPayload);
              const stopResponse = await createStop(token, stopPayload);
              console.log("Stop created successfully:", stopResponse.data);
            } catch (stopError) {
              console.error("Error creating stop:", stopError.response?.data || stopError.message);
            }
          }
        } else {
          console.log("No stops to add to the trip");
        }
        
        this.popupMessage = "Now creating cost...";

        // Extract the budget/cost object
        const budgetData = place.budget;
        let amount, costBreakdown;
        
        // Handle both old string format and new object format
        if (typeof budgetData === 'string') {
          const budgetRange = budgetData
            .replace(/R/g, "")
            .replace(/\s/g, "")
            .split("-")
            .map((b) => parseInt(b.replace(/,/g, ""), 10));
          // For simplicity, take the average of min and max as the single amount
          amount = Math.floor((budgetRange[0] + budgetRange[1]) / 2);
          costBreakdown = null;
        } else {
          // Use totalMax as the total cost amount
          amount = budgetData.breakdown.totalMax;
          costBreakdown = JSON.stringify(budgetData.breakdown);
        }
        
        const costPayload = {
          trip_id: tripId,
          amount: amount,
          breakdown: costBreakdown
        };
        
        await addCost(token, costPayload);

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
    async fetchUserAllergies() {
      try {
        if (!this.token || !this.userId) return;
        
        const response = await getUserAllergies(this.token, this.userId);
        this.userAllergies = response.data;
        console.log("User allergies loaded:", this.userAllergies);
      } catch (error) {
        console.error("Failed to fetch user allergies:", error);
      }
    },
    async fetchUserTrips() {
      try {
        if (!this.token || !this.userId) return;
        
        const response = await getTripsByUserId(this.token, this.userId);
        this.userTrips = response.data;
        console.log("User trips loaded:", this.userTrips.length);
      } catch (error) {
        console.error("Failed to fetch user trips:", error);
      }
    },
    checkForTripOverlap(startDate, endDate) {
      // Convert string dates to Date objects for comparison
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Clear start/end times for proper comparison (we only care about the date)
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      
      // Find any trips that overlap with the date range
      const overlapping = this.userTrips.filter(trip => {
        const tripStart = new Date(trip.start_date);
        const tripEnd = new Date(trip.end_date);
        
        tripStart.setHours(0, 0, 0, 0);
        tripEnd.setHours(23, 59, 59, 999);
        
        // Check for any overlap between the date ranges
        return (
          (start <= tripEnd && start >= tripStart) || // New start date falls within existing trip
          (end <= tripEnd && end >= tripStart) ||     // New end date falls within existing trip
          (start <= tripStart && end >= tripEnd)      // New trip completely encompasses existing trip
        );
      });
      
      return overlapping;
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
    },
    closeLoginPrompt() {
      this.showLoginPrompt = false;
    },
    
    redirectToLogin() {
      this.showLoginPrompt = false;
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
/* Add styles for the overlap details in the confirmation dialog */
.overlap-details {
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  margin-top: 12px;
}

.overlap-trip-list {
  list-style: none;
  padding: 0;
  margin: 10px 0 0;
}

.overlap-trip-list li {
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.overlap-trip-title {
  font-weight: 600;
  color: #333;
}

.overlap-trip-dates {
  font-size: 0.9rem;
  color: #666;
  margin-top: 4px;
}

/* Login popup styles */
.popup-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 16px;
}

.login-btn, .cancel-btn {
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  border: none;
}

.login-btn {
  background: var(--secondary);
  color: white;
}

.login-btn:hover {
  background: #2e7d32;
}

.cancel-btn {
  background: #f1f3f5;
  color: #495057;
}

.cancel-btn:hover {
  background: #e9ecef;
}
</style>

