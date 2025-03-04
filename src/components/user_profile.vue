<template>
  <div class="container">
    <h2>My Profile</h2>
    <div class="profile-pic">
      <img :src="user.profileImage || defaultProfileImage" alt="Profile Picture" />
    </div>
    <form @submit.prevent="updateProfile" class="profile-form">
      <div class="form-group">
        <label>Username:</label>
        <input v-model="user.username" disabled />
      </div>
      <div class="form-group">
        <label>Email:</label>
        <input v-model="user.email" disabled />
      </div>
      <div class="form-group">
        <label>Destination:</label>
        <input v-model="user.destination" placeholder="Enter your destination" />
      </div>
      <div class="form-group">
        <label>Budget (ZAR):</label>
        <input v-model="user.budget" type="number" placeholder="Enter budget" />
      </div>
      <div class="form-group">
        <label>Dietary Restrictions:</label>
        <input v-model="user.dietary_restrictions" placeholder="E.g., Vegetarian, Halal" />
      </div>
      <div class="form-group">
        <label>Accessibility Needs:</label>
        <input v-model="user.accessibility_needs" placeholder="E.g., Wheelchair access" />
      </div>
      <div class="form-group">
        <label>Preferred Language:</label>
        <input v-model="user.language_preferences" placeholder="E.g., English, Zulu" />
      </div>
      <button type="submit" class="update-btn">Update Profile</button>
    </form>

    <div class="action-buttons">
      <button @click="deleteProfile" class="delete-btn">Delete Profile</button>
      <button @click="logOut" class="logout-btn">Log Out</button>
    </div>

    <br/>
        <button @click="$router.push('/findlocations')" >Find Locations</button>
    <br/>

    <p class="message">{{ message }}</p>
  </div>
</template>

<script>
import { getUserProfile, updateUserProfile, deleteUserProfile } from "../api";
import default_profile_pic from '../assets/profileicon.png';

export default {
  data() {
    return {
      user: {
        username: "",
        email: "",
        destination: "",
        budget: "",
        dietary_restrictions: "",
        accessibility_needs: "",
        language_preferences: "",
        profileImage: "" // Placeholder for profile image URL
      },
      message: "",
      defaultProfileImage: default_profile_pic // Placeholder profile image
    };
  },
  async mounted() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.message = "You need to log in first.";
      return;
    }

    try {
      const response = await getUserProfile(token);
      this.user = response.data;
      console.log('User details here : ', this.user);
    } catch (error) {
      this.message = error.response?.data?.error || "Failed to load profile.";
    }
  },
  methods: {
    async updateProfile() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        await updateUserProfile(token, this.user);
        this.message = "Profile updated successfully!";
      } catch (error) {
        this.message = error.response?.data?.error || "Update failed.";
      }
    },

    async deleteProfile() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        await deleteUserProfile(token);
        this.message = "Profile deleted successfully!";
        localStorage.removeItem("token");
        this.$router.push("/login"); // Redirect to register page after deletion
      } catch (error) {
        this.message = error.response?.data?.error || "Failed to delete profile.";
      }
    },

    logOut() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: auto;
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  font-size: 2rem;
  color: #007bff;
  margin-bottom: 1.5rem;
}

.profile-pic img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #007bff;
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease;
}

.profile-pic img:hover {
  transform: scale(1.1);
}

.profile-form {
  text-align: left;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;

}

input:focus {
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
  outline: none;
}

button {
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.update-btn {
  background: linear-gradient(135deg, #007bff, #00bfff);
  color: white;
  width: 100%;
  margin-top: 1rem;
}

.update-btn:hover {
  background: linear-gradient(135deg, #00bfff, #007bff);
  transform: translateY(-2px);
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 1.5rem;
}

.delete-btn {
  background: linear-gradient(135deg, #ff4d4d, #ff1a1a);
  color: white;
  flex: 1;
}

.delete-btn:hover {
  background: linear-gradient(135deg, #ff1a1a, #ff4d4d);
  transform: translateY(-2px);
}

.logout-btn {
  background: linear-gradient(135deg, #666, #333);
  color: white;
  flex: 1;
}

.logout-btn:hover {
  background: linear-gradient(135deg, #333, #666);
  transform: translateY(-2px);
}

.message {
  margin-top: 1.5rem;
  color: #007bff;
  color: red;
  font-weight: 500;
}
</style>