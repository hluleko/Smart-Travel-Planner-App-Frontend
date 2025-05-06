<template>
  <div class="places-list">
    <PlaceCard
      v-for="(place, index) in places"
      :key="index"
      :place="place"
      :numPeople="numPeople"
      :distance="distance"
      :defaultImage="defaultImage"
      @createTrip="$emit('createTrip', $event)"
    />
  </div>
</template>

<script>
import PlaceCard from "./PlaceCard.vue";

export default {
  name: "PlaceList",
  props: ["places", "numPeople", "distance", "defaultImage"],
  components: { PlaceCard },
  emits: ["createTrip"],
};
</script>

<style scoped>
/* Reuse styles from original */
</style>
