<template>
    <div class="trips-page">
      <div class="trips-header">
        <h1>My Trips</h1>
        <button @click="goToCreateTrip" class="create-btn">Create New Trip</button>
      </div>
  
      <div v-if="isLoading" class="loading">Loading trips...</div>
  
      <div v-else-if="trips.length === 0" class="no-trips">
        You have no trips yet.
      </div>
  
      <div v-else class="trip-list">
        <div v-for="trip in trips" :key="trip.trip_id" class="trip-card">
          <img
            :src="trip.destination?.photo_url || defaultImage"
            alt="Destination"
            class="trip-image"
          />
          <div class="trip-info">
            <h2>{{ trip.title }}</h2>
            <p class="description">{{ trip.description }}</p>
            <p class="location">
              Location: {{ trip.destination?.location || "Unknown" }}<br />
              Rating: {{ trip.destination?.rating || "N/A" }}
            </p>
            <p class="dates">{{ trip.start_date }} - {{ trip.end_date }}</p>
            <p class="budget">
              Budget: R{{ trip.budget?.min_amount || "N/A" }} - R{{ trip.budget?.max_amount || "N/A" }}
            </p>
            <button @click="deleteTripById(trip.trip_id)" class="delete-btn">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import {
    getTripsByUserId,
    deleteTrip,
    getDestinationById,
    getBudgetByTripId,
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
      async deleteTripById(tripId) {
        if (!confirm("Are you sure you want to delete this trip?")) return;
  
        try {
          await deleteTrip(this.authToken, tripId);
          this.trips = this.trips.filter((trip) => trip.trip_id !== tripId);
        } catch (error) {
          console.error("Failed to delete trip:", error.response?.data || error.message);
          alert("Error deleting trip.");
        }
      },
      goToCreateTrip() {
        this.$router.push("/");
      },
    },
    mounted() {
      this.fetchTrips();
    },
  };
  </script>
  
  
  <style scoped>
  .trips-page {
    padding: 24px;
    font-family: Arial, sans-serif;
  }
  
  .trips-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  
  .trips-header h1 {
    font-size: 28px;
    margin: 0;
  }
  
  .create-btn {
    background-color: #1976d2;
    color: white;
    padding: 10px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  
  .create-btn:hover {
    background-color: #125ea7;
  }
  
  .no-trips {
    color: #888;
    font-size: 16px;
  }
  
  .trip-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
  
  .trip-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    background-color: #fafafa;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s;
  }
  
  .trip-card:hover {
    transform: scale(1.01);
  }
  
  .trip-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }
  
  .trip-info {
    padding: 16px;
  }
  
  .trip-info h2 {
    margin: 0 0 8px;
    font-size: 20px;
  }
  
  .description {
    font-size: 14px;
    color: #555;
    margin-bottom: 10px;
  }
  
  .location {
    font-size: 13px;
    color: #444;
    margin-bottom: 8px;
  }
  
  .dates {
    font-size: 13px;
    color: #777;
    margin-bottom: 8px;
  }
  
  .budget {
    font-size: 13px;
    color: #333;
    margin-bottom: 12px;
  }
  
  .delete-btn {
    background-color: #d32f2f;
    color: white;
    border: none;
    padding: 8px 14px;
    border-radius: 6px;
    cursor: pointer;
  }
  
  .delete-btn:hover {
    background-color: #b71c1c;
  }

  .loading {
    font-size: 16px;
    color: #555;
    }

  </style>
  