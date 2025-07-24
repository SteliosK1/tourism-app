import axios from 'axios';

// Βάση του backend σου (μην ξεχάσεις να αλλάξεις port αν αλλάξει!)
const API_BASE = 'http://localhost:5050/api';

// 📍 Destinations
export const getDestinations = () => axios.get(`${API_BASE}/destinations`);
export const getDestinationById = (id) =>
  axios.get(`${API_BASE}/destinations/${id}`);

// ✈ Trips
export const getTrips = () => axios.get(`${API_BASE}/trips`);
// export const addTrip = (tripData) => axios.post(`${API_BASE}/trips`, tripData);
export const updateTrip = (id, updatedData) =>
  axios.put(`${API_BASE}/trips/${id}`, updatedData);
export const deleteTrip = (id) => axios.delete(`${API_BASE}/trips/${id}`);

export async function createTrip(tripData) {
  const res = await axios.post(`${API_BASE}/trips`, tripData);
  return res.data;
}
