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
.place-card {
    display: flex;
    gap: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    overflow: hidden;
    margin-bottom: 16px;
}

.place-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.place-image {
    width: 40%;
    height: 220px;
    object-fit: cover;
    border-radius: 8px 0 0 8px;
}

.place-info {
    padding: 16px 24px 24px 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

h3 {
    font-size: 1.4rem;
    font-weight: 700;
    color: #262626;
    margin: 0 0 4px 0;
}

p {
    margin: 0;
    font-size: 0.95rem;
    color: #666666;
}

.place-info strong {
    color: #262626;
    font-size: 1.1rem;
}

.create-trip-button {
    background: #0071c2;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
    margin-top: auto;
    align-self: flex-start;
}

.create-trip-button:hover {
    background: #00487a;
}

p[data-v-if="place.rating"] {
    color: #ffb700;
    font-weight: 500;
}

.distance {
    font-size: 0.9rem;
    color: #888888;
}

@media (max-width: 768px) {
    .place-card {
        flex-direction: column;
        gap: 0;
    }

    .place-image {
        width: 100%;
        height: 180px;
        border-radius: 8px 8px 0 0;
    }

    .place-info {
        padding: 16px;
    }
}
</style>