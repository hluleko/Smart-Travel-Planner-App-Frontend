<template>
    <div class="main-page">
            <div class="main-header">
                <div class="header-content">
                <h1><span class="material-symbols-outlined">home</span> Home</h1>
                </div>
            </div>
        
            <div v-if="isLoading" class="loading">
                <span class="material-symbols-outlined spin">progress_activity</span>
                Loading...
            </div>
        
            <div v-else class="grid-list-2">
                            
                    <TripPlanner />
                    <section class="features">
                        <div class="feature">
                            <div class="feature-icon">
                                <span class="material-symbols-outlined">map</span>
                            </div>
                            <h3>Discover</h3>
                            <p>Find the best places to visit</p>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">
                                <span class="material-symbols-outlined">event</span>
                            </div>
                            <h3>Plan</h3>
                            <p>Organize your itinerary</p>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">
                                <span class="material-symbols-outlined">local_activity</span>
                            </div>
                            <h3>Track</h3>
                            <p>Reserve activities all in one place.</p>
                        </div>
                    </section>

            </div>
    </div>

    <footer class="footer">
        <p>&copy; 2025 Smart Travel Planner. All rights reserved.</p>
    </footer>
</template>

<script>
//import LocationSearch from "@/components/maps/LocationSearch.vue";
import TripPlanner from "@/components/trip/TripPlanner.vue";

export default {
    components: {
        TripPlanner,
    },
    data() {
        return {
            isLoading: false,
            defaultImage: "https://via.placeholder.com/300",
        };
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
    padding: 10px;
    margin-top: 20px;
    text-align: center;
}





.features {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2 in 1 row */
    gap: 1.5rem;
    padding: 2rem 1rem;
    max-width: 900px;
    margin: 0 auto;
}

.feature {
    text-align: center;
    padding: 1.5rem;
    border-radius: 12px;
    background: white;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 28px rgba(0, 113, 194, 0.1);
}

.feature-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.2rem;
}

.features .feature:nth-child(1) .feature-icon {
    background: #e3f2fd; /* Blue */
    color: #0071c2;
}

.features .feature:nth-child(2) .feature-icon {
    background: #fce4ec; /* Pink */
    color: palevioletred;
}

.features .feature:nth-child(3) .feature-icon {
    background: #e8f5e9; /* Green */
    color: green;
}

.feature-icon .material-symbols-outlined {
    font-size: 2rem;
}

h3 {
    color: #262626;
    margin: 0 0 0.8rem;
    font-size: 1.2rem;
}

p {
    color: #666;
    line-height: 1.5;
    margin: 0;
    font-size: 0.95rem;
}

@media (max-width: 768px) {
    .features {
        grid-template-columns: 1fr;
        padding: 1.5rem 1rem;
    }

    .feature {
        padding: 1.2rem;
    }
}

</style>