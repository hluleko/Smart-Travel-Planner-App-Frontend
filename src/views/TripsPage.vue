<template>
  <div class="main-page">
    <div class="main-header">
      <div class="header-content">
        <h1><span class="material-symbols-outlined">flight_takeoff</span> My Trips</h1>
        <button @click="goToCreateTrip" class="main-btn">
          <span class="material-symbols-outlined">add</span>
          Create New Trip
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="loading">
      <span class="material-symbols-outlined spin">progress_activity</span>
      Loading trips...
    </div>

    <div v-else-if="trips.length === 0" class="no-content">
      <span class="material-symbols-outlined">public_off</span>
      <p>No trips found. Start planning your next adventure!</p>
    </div>

    <div v-else class="grid-list">
      <div v-for="trip in trips" :key="trip.trip_id" class="trip-card">
        <div class="trip-image-container">
          <img
            :src="trip.destination?.photo_url || defaultImage"
            alt="Destination"
            class="trip-image"
            :title="trip.destination?.location"
          />
          <div class="trip-badge">
            <span class="material-symbols-outlined">group</span>
            {{ trip.number_of_people || 1 }} travelers
          </div>
        </div>
        
        <div class="trip-info">
          <div class="trip-header">
            <h2>{{ trip.title }}</h2>
            <div class="trip-rating" v-if="trip.destination?.rating">
              <span class="material-symbols-outlined">star</span>
              {{ trip.destination.rating }}
            </div>
          </div>
          
          <p class="description">{{ trip.description }}</p>
          
          <div class="trip-details">
            <div class="detail-item">
              <span class="material-symbols-outlined">location_on</span>
              <div>
                <p class="detail-label">Destination</p>
                <p class="detail-value">{{ trip.destination?.location || "Unknown" }}</p>
              </div>
            </div>
            
            <div class="detail-item">
              <span class="material-symbols-outlined">calendar_today</span>
              <div>
                <p class="detail-label">Dates</p>
                <p class="detail-value">{{ trip.start_date }} – {{ trip.end_date }}</p>
              </div>
            </div>
            
            <div class="detail-item">
              <span class="material-symbols-outlined">wallet</span>
              <div>
                <p class="detail-label">Budget</p>
                <p class="detail-value">
                  R{{ trip.budget?.min_amount || "N/A" }} – R{{ trip.budget?.max_amount || "N/A" }}
                </p>
              </div>
            </div>
          </div>

          <div class="trip-actions">
            <button @click="startTrip(trip)" class="start-btn">
              <span class="material-symbols-outlined">directions_car</span>
              Start Trip
            </button>
            <button @click="deleteTripById(trip.trip_id, trip)" class="delete-btn">
              <span class="material-symbols-outlined">delete</span>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
///trip.title
  ///trip.number_of_people

import {
  getTripsByUserId,
  deleteTrip,
  getDestinationById,
  getBudgetByTripId,
  createAlert,
} from "@/api/BackendApi";
import { mapState } from "vuex";

export default {
  name: "TripsPage",
  data() {
    return {
      trips: [],
      isLoading: true,
      defaultImage: "https://via.placeholder.com/400x300?text=No+Image",
    };
  },
  computed: {
    ...mapState(["user", "token"]),
    authToken() {
      return this.token;
    },
    userId() {
      return this.user?.user_id;
    },
  },
  methods: {
    async fetchTrips() {
      this.isLoading = true;
      try {
        const response = await getTripsByUserId(this.authToken, this.userId);
        const tripsWithData = await Promise.all(
          response.data.map(async (trip) => {
            let destination = null;
            let budget = null;

            try {
              const destinationResponse = await getDestinationById(
                this.authToken,
                trip.destination_id
              );
              destination = destinationResponse.data;
            } catch (err) {
              console.error("Error fetching destination:", err);
            }

            try {
              const budgetResponse = await getBudgetByTripId(
                this.authToken,
                trip.trip_id
              );
              budget = budgetResponse.data;
            } catch (err) {
              console.error("Error fetching budget:", err);
            }

            return {
              ...trip,
              destination,
              budget,
            };
          })
        );

        this.trips = tripsWithData;
      } catch (error) {
        console.error("Failed to fetch trips:", error.response?.data || error.message);
      } finally {
        this.isLoading = false;
      }
    },
    async deleteTripById(tripId, trip) {
      if (!confirm("Are you sure you want to delete this trip?")) return;

      try {
        await deleteTrip(this.authToken, tripId);
        this.trips = this.trips.filter((trip) => trip.trip_id !== tripId);
          //Create alert
          await createAlert(this.token, {
              user_id: this.userId,
              type: 'error',
              message: `You deleted a trip to ${trip.destination?.location}.`,
              created_at: new Date().toISOString(),
              seen: false,
          });
          alert("Trip deleted successfully.");
      } catch (error) {
        console.error("Failed to delete trip:", error.response?.data || error.message);
        alert("Error deleting trip.");
      }
    },
    goToCreateTrip() {
      this.$router.push("/");
    },
    async startTrip(trip) {
      try {
        // Create alert for starting the trip
        await createAlert(this.token, {
          user_id: this.userId,
          type: 'info',
          message: `You started a trip to ${trip.destination?.location}.`,
          created_at: new Date().toISOString(),
          seen: false,
        });
        
        // Navigate to the directions page for this trip
        this.$router.push(`/trips/${trip.trip_id}/directions`);
      } catch (error) {
        console.error("Error starting trip:", error);
        alert("Failed to start trip. Please try again.");
      }
    },
  },
  mounted() {
    this.fetchTrips();
  },
};
</script>  


<style scoped>

.grid-list {
display: grid;
grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
gap: 1.5rem;
}

.trip-card {
background: white;
border-radius: 12px;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
transition: transform 0.2s ease, box-shadow 0.2s ease;
overflow: hidden;
}

.trip-card:hover {
transform: translateY(-4px);
box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.trip-image-container {
position: relative;
height: 220px;
}

.trip-image {
width: 100%;
height: 100%;
object-fit: cover;
}

.trip-badge {
position: absolute;
bottom: 1rem;
left: 1rem;
background: rgba(0, 0, 0, 0.7);
color: white;
padding: 0.5rem 1rem;
border-radius: 20px;
display: flex;
align-items: center;
gap: 0.5rem;
font-size: 0.9rem;
}

.trip-info {
padding: 1.5rem;
}

.trip-header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 1rem;
}

.trip-header h2 {
font-size: 1.25rem;
margin: 0;
color: #262626;
}

.trip-rating {
display: flex;
align-items: center;
gap: 0.25rem;
color: #ffb700;
font-weight: 600;
}

.description {
color: #666;
font-size: 0.9rem;
line-height: 1.4;
margin-bottom: 1.25rem;
}

.trip-details {
display: grid;
gap: 1rem;
margin-bottom: 1.5rem;
}

.detail-item {
display: flex;
gap: 0.75rem;
align-items: flex-start;
}

.detail-item .material-symbols-outlined {
color: #0071c2;
margin-top: 0.2rem;
flex-shrink: 0;
}

.detail-label {
font-size: 0.75rem;
color: #999;
margin: 0 0 0.1rem;
text-transform: uppercase;
}

.detail-value {
font-size: 0.9rem;
color: #444;
margin: 0;
font-weight: 500;
}

.trip-actions {
display: flex;
gap: 0.75rem;
margin-top: 1rem;
}

.start-btn, .delete-btn {
flex: 1;
padding: 0.75rem;
border: none;
border-radius: var(--border-radius-main);
font-weight: 600;
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
gap: 0.5rem;
transition: all 0.2s ease;
}

.start-btn {
background: var(--secondary);
color: white;
}

.start-btn:hover {
background: #2e7d32;
}

.delete-btn {
background: #fff;
color: #d32f2f;
border: 1px solid #eee;
}

.delete-btn:hover {
background: #ffebee;
}

</style>