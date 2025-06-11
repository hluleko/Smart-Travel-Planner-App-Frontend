// src/store.js
import { createStore } from "vuex";
import { getUserProfile, getAllUsers, getAllTripsForAdmin } from "@/api/BackendApi";

const store = createStore({
  state: {
    token: localStorage.getItem("authToken") || null,
    userId: localStorage.getItem("userId") || null,
    user: JSON.parse(localStorage.getItem("userData")) || null,
    adminUsers: [],
    adminTrips: [],
    adminDataLoading: false
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      if (token) {
        localStorage.setItem("authToken", token);
        console.log("Token set in localStorage:", token);
      } else {
        localStorage.removeItem("authToken");
        console.log("Token removed from localStorage");
      }
    },
    setUserId(state, userId) {
      state.userId = userId;
      if (userId) {
        localStorage.setItem("userId", userId);
        console.log("User ID set in localStorage:", userId);
      } else {
        localStorage.removeItem("userId");
        console.log("User ID removed from localStorage");
      }
    },
    setUser(state, user) {
      state.user = user;
      if (user) {
        localStorage.setItem("userData", JSON.stringify(user));
        console.log("User data set in localStorage:", user);
      } else {
        localStorage.removeItem("userData");
        console.log("User data removed from localStorage");
      }
    },
    logout(state) {
      state.token = null;
      state.userId = null;
      state.user = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("userData");
      console.log("User logged out and data removed from localStorage");
    },
    setAdminUsers(state, users) {
      state.adminUsers = users;
    },
    setAdminTrips(state, trips) {
      state.adminTrips = trips;
    },
    setAdminDataLoading(state, isLoading) {
      state.adminDataLoading = isLoading;
    }
  },
  actions: {
    async fetchUser({ commit, state }) {
      try {
        if (!state.token || !state.userId) {
          console.warn("Token or userId missing. Skipping fetch.");
          //commit("logout");
          return;
        }
        const res = await getUserProfile(state.token, state.userId); // Ensure this function accepts userId
        commit("setUser", res.data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        commit("logout");
      }
    },
    async fetchAdminData({ commit, state }) {
      if (!state.token || !state.user || state.user.user_role !== 'admin') {
        console.warn("Not authorized for admin data");
        return;
      }
      
      commit("setAdminDataLoading", true);
      try {
        const [usersResponse, tripsResponse] = await Promise.all([
          getAllUsers(state.token),
          getAllTripsForAdmin(state.token)
        ]);
        commit("setAdminUsers", usersResponse.data);
        commit("setAdminTrips", tripsResponse.data);
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      } finally {
        commit("setAdminDataLoading", false);
      }
    }
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    userData: (state) => state.user,
    isAdmin: (state) => state.user && state.user.user_role === 'admin'
  },
});

export default store;
