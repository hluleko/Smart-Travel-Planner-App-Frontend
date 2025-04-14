<template>
  <section class="landing-page">
    <!-- Hero Section -->
    <div class="hero">
    <h2>Save up to <span class="highlight">16%</span> on your next trip</h2>
      <p>We compare hotel prices from over 100 sites</p>

      <div style="display: none;" class="search-bar">
        <input type="text" placeholder="Where to?" class="search-input" />
        <input type="text" placeholder="Check in --/--/--" class="search-input" />
        <input type="text" placeholder="Check out --/--/--" class="search-input" />
        <input type="text" placeholder="2 Guests, 1 Room" class="search-input" />
        <button class="search-button">Search</button>
      </div>
      <search_tool></search_tool>
      
    </div>

    <!-- Hot Hotel Deals -->
    <div class="deals">
      <h3>Hot hotel deals right now</h3>
      <div class="cards">
        <div class="card">
          <img src="../assets/661f29abc28e607e25d76aa64ae5cae2acfb1685645846fb9c99ba4f5ae0.avif" alt="Royal Marang Hotel" />
          <p class="card-title">Royal Marang Hotel</p>
        </div>
        <div class="card">
          <img src="../assets/1bc4683091023a08350103184a7e52b95648bf3c5feb9dd9798bcfc91076.webp" alt="DoubleTree Hilton" />
          <p class="card-title">DoubleTree by Hilton Cape Town</p>
        </div>
        <div class="card">
          <img src="../assets/1dad8cb00bb1d7897300f1023c29b0b85f24931e0345770dc2ab74798ec7.avif" alt="Cabanas Hotel" />
          <p class="card-title">The Cabanas Hotel at Sun City</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import search_tool from './reusable/search_tool.vue';

export default {
  name: "landing_page",
  components: {
    search_tool,
  },
};
</script>

<style scoped>
.landing-page {
  font-family: Arial, sans-serif;
  padding: 2rem;
  background: #fff;
  max-width: 70%;
  margin: auto;
}

.hero {
  text-align: center;
  margin-bottom: 2rem;
}

.hero h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.highlight {
  color: #007bff;
  font-weight: bold;
}

.search-bar {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.search-input {
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  min-width: 150px;
  flex: 1;
}

.search-button {
  background-color: #007bff;
  color: white;
  padding: 0.8rem 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.partners {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
}

.partners img {
  height: 32px;
  max-width: 100px;
}

.more {
  font-size: 0.9rem;
  color: #555;
}

.deals h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.cards {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 280px;
  text-align: center;
}

.card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.card-title {
  font-weight: bold;
  padding: 0.8rem;
}
</style>
