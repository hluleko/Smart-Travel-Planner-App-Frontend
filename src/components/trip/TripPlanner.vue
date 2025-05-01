<template>
    <div class="trip-planner">
      <h1>Plan Your Trip</h1>
  
      <LocationSearch @locationSelected="handleLocation" />
      <PeopleSelector @peopleChanged="handlePeople" />
      <DateSelector @datesChanged="handleDates" />
  
      <div v-if="totalBudget !== null" class="budget-box">
        <h2>Estimated Trip Budget: R{{ totalBudget.toFixed(2) }}</h2>
      </div>
    </div>
  </template>
  
  <script>
  import LocationSearch from "./LocationSearch.vue";
  import PeopleSelector from "./PeopleSelector.vue";
  import DateSelector from "./DateSelector.vue";
  
  export default {
    name: "TripPlanner",
    components: {
      LocationSearch,
      PeopleSelector,
      DateSelector,
    },
    data() {
      return {
        location: null,
        peopleCount: 1,
        startDate: null,
        endDate: null,
      };
    },
    computed: {
      tripDays() {
        if (!this.startDate || !this.endDate) return 0;
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      },
      totalBudget() {
        if (!this.tripDays || !this.peopleCount || !this.location) return null;
  
        const costPerPersonPerDay = 500; // Customize based on location later if needed
        return this.peopleCount * this.tripDays * costPerPersonPerDay;
      },
    },
    methods: {
      handleLocation(location) {
        this.location = location;
      },
      handlePeople(count) {
        this.peopleCount = count;
      },
      handleDates({ start, end }) {
        this.startDate = start;
        this.endDate = end;
      },
    },
  };
  </script>
  
  <style scoped>
  .trip-planner {
    max-width: 800px;
    margin: auto;
    padding: 2rem;
    text-align: center;
  }
  
  .budget-box {
    margin-top: 2rem;
    background: #f0f4ff;
    padding: 1.5rem;
    border-radius: 10px;
    font-size: 1.2rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  </style>
  