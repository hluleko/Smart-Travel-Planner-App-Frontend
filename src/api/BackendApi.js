import axios from "axios";

const API_URL = "https://smart-travel-planner-app-backend-production.up.railway.app/api";

// ===== User Authentication =====
export const registerUser = (user) => axios.post(`${API_URL}/users/register`, user);
export const loginUser = (user) => axios.post(`${API_URL}/users/login`, user);

// ===== Profile =====
export const getUserProfile = (token, userId) =>
    axios.get(`${API_URL}/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
  export const updateUserProfile = (token, userId, userData) =>
    axios.put(`${API_URL}/profile/${userId}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
  export const deleteUserProfile = (token, userId) =>
    axios.delete(`${API_URL}/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });  

// Trips
export const getAllTrips = (token) =>
    axios.get(`${API_URL}/trips`, { headers: { Authorization: `Bearer ${token}` } });
  
  export const getTripsByUserId = (token, userId) =>
    axios.get(`${API_URL}/trips/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
  
  export const getTripById = (token, tripId) =>
    axios.get(`${API_URL}/trips/${tripId}`, { headers: { Authorization: `Bearer ${token}` } });
  
  export const createTrip = (token, tripData) =>
    axios.post(`${API_URL}/trips`, tripData, { headers: { Authorization: `Bearer ${token}` } });
  
  export const updateTrip  = (token, tripId, tripData) =>
    axios.put(`${API_URL}/trips/${tripId}`, tripData, { headers: { Authorization: `Bearer ${token}` } });
  
  export const deleteTrip = (token, tripId) =>
    axios.delete(`${API_URL}/trips/${tripId}`, { headers: { Authorization: `Bearer ${token}` } });
  
  // Budgets
  export const getBudgets = (token) =>
    axios.get(`${API_URL}/budgets`, { headers: { Authorization: `Bearer ${token}` } });
  
  export const getBudgetByTripId = (token, tripId) =>
    axios.get(`${API_URL}/budgets/${tripId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  export const addBudget = (token, budgetData) =>
    axios.post(`${API_URL}/budgets`, budgetData, { headers: { Authorization: `Bearer ${token}` } });
  

  // Destinations
  export const addDestination = (token, destinationData) =>
    axios.post(`${API_URL}/destinations`, destinationData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
  export const getDestinationsByUserId = (token, userId) =>
    axios.get(`${API_URL}/destinations/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
  export const getDestinationById = (token, destinationId) =>
    axios.get(`${API_URL}/destinations/${destinationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
  export const deleteDestination = (token, destinationId) =>
    axios.delete(`${API_URL}/destinations/${destinationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
  
  // Reviews
  export const addReview = (token, reviewData) =>
    axios.post(`${API_URL}/reviews`, reviewData, { headers: { Authorization: `Bearer ${token}` } });
  
// Admin
export const getAdminStats = (token) =>
    axios.get(`${API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  
  // No token needed for logging activity 
  export const logAdminActivity = (activityData) =>
    axios.post(`${API_URL}/admin/activity`, activityData);


  
// ===== Alerts =====
export const createAlert = (token, alertData) =>
    axios.post(`${API_URL}/alerts`, alertData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
  export const getUserAlerts = (token, userId) =>
    axios.get(`${API_URL}/alerts/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
  export const markAlertAsSeen = (token, alertId) =>
    axios.patch(`${API_URL}/alerts/seen/${alertId}`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
  export const deleteAlert = (token, alertId) =>
    axios.delete(`${API_URL}/alerts/${alertId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
  export const getUnseenAlertCount = (token, userId) =>
    axios.get(`${API_URL}/alerts/user/${userId}/unseen-count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  