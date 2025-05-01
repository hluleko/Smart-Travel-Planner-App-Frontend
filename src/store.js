// src/store.js
import { createStore } from 'vuex';
import {
  loginUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  deleteUserProfile
} from './api/BackendApi';

export default createStore({
  state: {
    user: null,
    token: localStorage.getItem('auth_token') || null,  // Get token from localStorage on app load
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
      if (token) {
        localStorage.setItem('auth_token', token); // Save token in localStorage
        console.log('Token set in localStorage');
      } else {
        localStorage.removeItem('auth_token'); // Remove token from localStorage on logout
        console.log('Token removed from localStorage');
      }
    },
  },
  actions: {
    // Login action
    async login({ commit }, credentials) {
      try {
        const res = await loginUser(credentials);
        const token = res.data.token;
        console.log('Token received:', token);
        commit('setToken', token); // Store token in Vuex and localStorage
        const profileRes = await getUserProfile(token);
        commit('setUser', profileRes.data);
        return true;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },

    // Fetch user on app startup if token exists
    async fetchUser({ state, commit }) {
      if (!state.token) return null; // If no token, return null
      try {
        const res = await getUserProfile(state.token); // Use token to fetch profile
        commit('setUser', res.data);
        console.log('User profile fetched:', res.data);
        return res.data;
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        commit('setUser', null);
        commit('setToken', null); // Clear token if fetch fails
        return null;
      }
    },

    // Logout action
    logout({ commit }) {
      commit('setUser', null);
      commit('setToken', null); // Clear token from localStorage and Vuex
    },

    // Register action
    async register({ dispatch }, userData) {
      await registerUser(userData);
      return dispatch('login', {
        email: userData.email,
        password: userData.password,
      });
    },

    // Update user profile action
    async updateProfile({ state }, userData) {
      console.log('Updating user profile with data:', userData);
      if (!state.token) throw new Error('No token found. User must be logged in to update profile.');
      return await updateUserProfile(state.token, userData);
    },

    // Delete user profile action
    async deleteProfile({ state, dispatch }) {
      await deleteUserProfile(state.token);
      dispatch('logout');
    },
  },
  getters: {
    userData: (state) => state.user,
    isAuthenticated: (state) => !!state.token,  // Check if there's a token
  },
});
