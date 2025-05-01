<template>
    <div class="landing-page">

        <br/>       
        <br/>
        <br/>
        <br/>

        <LocationSearch />

        <section class="features">
            <div class="feature">
                <i class="fas fa-map-marked-alt"></i>
                <h3>Discover Destinations</h3>
                <p>Find the best places to visit, tailored to your preferences.</p>
            </div>
            <div class="feature">
                <i class="fas fa-calendar-alt"></i>
                <h3>Plan Your Trip</h3>
                <p>Organize your itinerary and make the most of your journey.</p>
            </div>
            <div class="feature">
                <i class="fas fa-plane"></i>
                <h3>Book with Ease</h3>
                <p>Reserve flights, hotels, and activities all in one place.</p>
            </div>
        </section>

        <footer class="footer">
            <p>&copy; 2025 Smart Travel Planner. All rights reserved.</p>
        </footer>
    </div>
</template>

<script>
import LocationSearch from "@/components/maps/LocationSearch.vue";

export default {
    components: {
        LocationSearch,
    },
    name: "LandingPage",
    methods: {
        navigateToExplore() {
            this.$router.push({ name: "Explore" });
        },
    },
};
</script>

<style scoped>
.landing-page {
    font-family: Arial, sans-serif;
    color: #333;
    text-align: center;
}

.hero {
    /*
    background: url('@/assets/logo.png') no-repeat center center/cover;
    */
    color: white;
    padding: 100px 20px;
}

.hero-content {
    max-width: 600px;
    margin: 0 auto;
}

.title {
    font-size: 2.5rem;
    margin-bottom: 10px;
}

.subtitle {
    font-size: 1.2rem;
    margin-bottom: 20px;
}

.cta-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 5px;
}

.cta-button:hover {
    background-color: #0056b3;
}

.features {
    display: flex;
    justify-content: space-around;
    padding: 50px 20px;
    background-color: #f9f9f9;
}

.feature {
    max-width: 300px;
    text-align: center;
}

.feature i {
    font-size: 2rem;
    color: #007bff;
    margin-bottom: 10px;
}

.feature h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
}

.footer {
    background-color: #333;
    color: white;
    padding: 20px 0;
    margin-top: 20px;
}
</style>