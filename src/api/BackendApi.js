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
  
  export const updateTripStatus = (token, tripId, statusData) =>
    axios.put(`${API_URL}/trips/${tripId}`, statusData, { headers: { Authorization: `Bearer ${token}` } });
  
  export const deleteTrip = (token, tripId) =>
    axios.delete(`${API_URL}/trips/${tripId}`, { headers: { Authorization: `Bearer ${token}` } });
  
  // Costs
  export const getCosts = (token) =>
  axios.get(`${API_URL}/costs`, { headers: { Authorization: `Bearer ${token}` } });

export const getCostByTripId = (token, tripId) =>
  axios.get(`${API_URL}/costs/${tripId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
export const addCost = (token, costData) =>
  axios.post(`${API_URL}/costs`, costData, { headers: { Authorization: `Bearer ${token}` } });
  

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
  
  
// Admin
export const getAdminStats = (token) =>
    axios.get(`${API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  
  // No token needed for logging activity 
  export const logAdminActivity = (activityData) =>
    axios.post(`${API_URL}/admin/activity`, activityData);

export const getAllUsers = (token) =>
    axios.get(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

export const getAllTripsForAdmin = (token) =>
    axios.get(`${API_URL}/admin/trips`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
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


// ===== Allergies =====
export const addAllergy = (token, allergyData) =>
  axios.post(`${API_URL}/allergies`, allergyData, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Ensure this function is properly exported
export const getUserAllergies = (token, userId) =>
  axios.get(`${API_URL}/allergies/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteAllergy = (token, allergyId) =>
  axios.delete(`${API_URL}/allergies/${allergyId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Stops
export const createStop = (token, stopData) => {
  console.log("API call - Creating stop:", stopData);
  return axios.post(`${API_URL}/stops`, stopData, { 
    headers: { Authorization: `Bearer ${token}` } 
  }).then(response => {
    console.log("Stop created response:", response.data);
    return response;
  }).catch(error => {
    console.error("Stop creation error:", error.response?.data || error.message);
    throw error;
  });
};

export const getStopsByTripId = (token, tripId) =>
  axios.get(`${API_URL}/stops/trip/${tripId}`, { headers: { Authorization: `Bearer ${token}` } });

export const updateStop = (token, stopId, stopData) =>
  axios.put(`${API_URL}/stops/${stopId}`, stopData, { headers: { Authorization: `Bearer ${token}` } });

export const deleteStop = (token, stopId) =>
  axios.delete(`${API_URL}/stops/${stopId}`, { headers: { Authorization: `Bearer ${token}` } });

// Export functions
export const getTablePreview = (tableName) => {
  console.log(`Getting preview for table: ${tableName} from ${API_URL}/preview/${tableName}`);
  return axios.get(`${API_URL}/preview/${tableName}`);
};

export const exportTable = (tableName, format = 'excel') => {
  console.log(`Exporting table: ${tableName} in format: ${format} from ${API_URL}/export/${tableName}/${format}`);
  return axios.get(`${API_URL}/export/${tableName}/${format}`, { 
    responseType: 'blob',
    headers: {
      'Accept': '*/*'
    }
  });
};

