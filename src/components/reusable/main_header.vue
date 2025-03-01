<template>
  <header class="header">
    <h1>Smart Travel Planner</h1>
    <p class="tagline">Your journey, simplified.</p>
  </header>
</template>

<script>
export default {
  name: "AppHeader",
};
</script>

<style scoped>
.header {
  background-color: #007bff;
  color: white;
  text-align: center;
  padding: 2rem 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
  letter-spacing: 1px;
}

.tagline {
  font-size: 1.2rem;
  margin: 0.5rem 0 0;
  font-weight: 300;
  opacity: 0.9;
}
</style>