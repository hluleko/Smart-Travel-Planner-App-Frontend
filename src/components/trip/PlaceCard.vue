<template>
  <div class="place-card">
    <img :src="place.photo || defaultImage" alt="Place" class="place-image" />
    <div class="place-info">
      <h3>{{ place.name }}</h3>

      <div class="info-line">
        <span class="material-symbols-outlined">location_on</span>
        <p>{{ place.address }}</p>
      </div>

      <div v-if="place.rating" class="info-line rating">
        <span class="material-symbols-outlined">star</span>
        <p>Rating: {{ place.rating }}</p>
      </div>

      <div class="info-line">
        <span class="material-symbols-outlined">wallet</span>
        <p>
          Est. Budget for {{ numPeople }} {{ numPeople > 1 ? 'people' : 'person' }}:
          <strong>{{ formatBudget(place.budget) }}</strong>
        </p>
      </div>

      <div v-if="distance" class="info-line">
        <span class="material-symbols-outlined">near_me</span>
        <p>Distance: {{ distance }} km</p>
      </div>

      <button @click="handleCreateTrip" class="create-trip-button">
        <span class="material-symbols-outlined">arrow_right_alt</span>
        Create Trip
      </button>
    </div>

    <!-- Login Required Popup -->
    <Popup v-if="showLoginPrompt" :visible="showLoginPrompt" title="Login Required" @close="showLoginPrompt = false">
      <template #actions>
        <div class="notification-container">
          <div class="message-content">
            <p>You need to sign in to create a trip.</p>
          </div>
        </div>

        <button @click="$router.push('/login')" class="start-btn">Sign in</button>
        
      </template>
    </Popup>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Popup from "@/components/common/PopUp.vue";

export default {
  name: "PlaceCard",
  components: {
    Popup,
  },
  props: {
    place: Object,
    numPeople: Number,
    distance: [String, Number],
    defaultImage: String,
  },
  emits: ["createTrip"],
  computed: {
    ...mapState(["user", "token"]),
  },
  data() {
    return {
      showLoginPrompt: false,
    };
  },
  methods: {
    handleCreateTrip() {
      if (!this.user || !this.token) {
        this.showLoginPrompt = true;
        return;
      }

      this.$emit("createTrip", this.place);
    },
    formatBudget(budget) {
      if (!budget) return 'N/A';
      
      if (typeof budget === 'string') {
        return budget;
      }
      
      if (budget.simple) {
        return budget.simple;
      }
      
      return 'N/A';
    },
  },
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
  gap: 12px;
}

h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #262626;
  margin: 0 0 4px 0;
}

.info-line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.info-line .material-symbols-outlined {
  font-size: 1.1rem;
  color: #666;
  flex-shrink: 0;
}

.rating .material-symbols-outlined {
  color: #ffb700;
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
  transition: all 0.2s ease;
  margin-top: auto;
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 8px;
}

.create-trip-button:hover {
  background: #00487a;
  transform: translateY(-1px);
}

.create-trip-button .material-symbols-outlined {
  font-size: 1.2rem;
}

/* Popup styling */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup {
  background: white;
  padding: 24px 32px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
}

/* Mobile */
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
    gap: 10px;
  }

  .info-line .material-symbols-outlined {
    font-size: 1rem;
  }
}


.start-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.start-btn {
  background: #43a047;
  color: white;
}



</style>
