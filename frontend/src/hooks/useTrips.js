import { useState, useEffect } from 'react';
import {
  getTrips,
  createTrip as apiAddTrip,
  updateTrip as apiUpdateTrip,
  deleteTrip as apiDeleteTrip,
} from '../api';

export function useTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Φόρτωση trips από backend
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await getTrips();
        setTrips(res.data);
      } catch (err) {
        setError('Failed to load trips');
        console.error('❌ Failed to fetch trips:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const createTrip = async (tripData) => {
    try {
      const res = await apiAddTrip(tripData);
      setTrips((prev) => [...prev, res.data]);
    } catch (err) {
      console.error('❌ Failed to add trip:', err);
    }
  };

  const updateTrip = async (id, updatedData) => {
    try {
      const res = await apiUpdateTrip(id, updatedData);
      setTrips((prev) =>
        prev.map((trip) => (trip.id === id ? res.data : trip))
      );
    } catch (err) {
      console.error('❌ Failed to update trip:', err);
    }
  };

  const removeTrip = async (id) => {
    try {
      await apiDeleteTrip(id);
      setTrips((prev) => prev.filter((trip) => trip.id !== id));
    } catch (err) {
      console.error('❌ Failed to delete trip:', err);
    }
  };

  return {
    trips,
    loading,
    error,
    createTrip,
    updateTrip,
    removeTrip,
  };
}
