<template>
  <div class="place-card">
    <img :src="place.photo || defaultImage" alt="Place" class="place-image" />
    <div class="place-info">
      <h3>{{ place.name }}</h3>
      <p>{{ place.address }}</p>
      <p v-if="place.rating">Rating: {{ place.rating }} ⭐</p>
      <p>
        Est. Budget for {{ numPeople }} {{ numPeople > 1 ? 'people' : 'person' }}:
        <strong>{{ place.budget }}</strong>
      </p>
      <p v-if="distance">Distance: {{ distance }} km</p>
      <button @click="$emit('createTrip', place)" class="create-trip-button">Create Trip</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlaceCard",
  props: {
    place: Object,
    numPeople: Number,
    distance: [String, Number],
    defaultImage: String,
  },
  emits: ["createTrip"],
};
</script>

<style scoped>
/* Reuse styles from original */
</style>
