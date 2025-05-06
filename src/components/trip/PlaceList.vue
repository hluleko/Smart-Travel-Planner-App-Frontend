<template>
  <div class="places-list">
    <div v-if="places.length === 0" class="no-places-found">
      <img
        src="/images/empty-state.webp"
        alt="No places found"
        class="w-[230px] mb-4"
      />
      <h3 class="text-lg font-semibold">No places found</h3>
      <p class="text-gray-600 text-sm text-center mt-2">
        Try adjusting the location or filters to see available places.
      </p>
    </div>

    <PlaceCard
      v-else
      v-for="(place, index) in places"
      :key="index"
      :place="place"
      :numPeople="numPeople"
      :distance="place.distance"
      :defaultImage="defaultImage"
      @createTrip="$emit('createTrip', $event)"
    />
  </div>
</template>

<script>
import PlaceCard from "./PlaceCard.vue";

export default {
  name: "PlaceList",
  props: ["places", "numPeople", "defaultImage"],
  components: { PlaceCard },
  emits: ["createTrip"],
};
</script>


<style scoped>
.places-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.no-places-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  width: 100%;
}
</style>
