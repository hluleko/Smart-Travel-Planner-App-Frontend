// src/api.js
import axios from "axios";

const API_URL = "https:smart-travel-planner-app-backend-production.up.railway.app"; 

export const registerUser = (user) => axios.post(`${API_URL}/register`, user);
export const loginUser = (user) => axios.post(`${API_URL}/login`, user);
export const getUserProfile = (token) =>
    axios.get(`${API_URL}/profile`, { headers: { Authorization: token } });
export const updateUserProfile = (token, userData) =>
    axios.put(`${API_URL}/profile`, userData, { headers: { Authorization: token } });
export const deleteUserProfile = (token) =>
    axios.delete(`${API_URL}/profile`, { headers: { Authorization: token } });
