<template>
  <div class="trip-form">
    <h2>Explore Nearby Sites</h2>

    <input
      type="text"
      id="from-input"
      class="search-input"
      v-model="localFromQuery"
      placeholder="From where are you travelling?"
    />
    <input
      type="text"
      id="location-input"
      class="search-input"
      v-model="localSearchQuery"
      placeholder="Enter a destination city..."
    />

    <div class="date-people-inputs">
      <input type="date" v-model="localStartDate" class="date-input" />
      <input type="date" v-model="localEndDate" class="date-input" />
      <input type="number" v-model.number="localNumPeople" min="1" class="people-input" placeholder="People" />
    </div>

    <button @click="emitSearch" class="search-button">Search</button>
  </div>
</template>

<script>
export default {
  name: "TripForm",
  props: ["fromQuery", "searchQuery", "startDate", "endDate", "numPeople"],
  emits: ["update:fromQuery", "update:searchQuery", "update:startDate", "update:endDate", "update:numPeople", "search"],
  data() {
    return {
      localFromQuery: this.fromQuery,
      localSearchQuery: this.searchQuery,
      localStartDate: this.startDate,
      localEndDate: this.endDate,
      localNumPeople: this.numPeople,
    };
  },
  watch: {
    localFromQuery(val) {
      this.$emit("update:fromQuery", val);
    },
    localSearchQuery(val) {
      this.$emit("update:searchQuery", val);
    },
    localStartDate(val) {
      this.$emit("update:startDate", val);
    },
    localEndDate(val) {
      this.$emit("update:endDate", val);
    },
    localNumPeople(val) {
      this.$emit("update:numPeople", val);
    },
  },
  methods: {
    emitSearch() {
      this.$emit("search");
    },
  },
};
</script>
