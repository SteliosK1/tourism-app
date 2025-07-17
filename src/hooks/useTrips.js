import { useState, useEffect } from 'react';

export function useTrips() {
  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('myTrips');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('myTrips', JSON.stringify(trips));
  }, [trips]);

  const addTrip = (destination) => {
    if (!trips.find((t) => t.id === destination.id)) {
      setTrips([...trips, { ...destination, addedAt: new Date().toISOString() }]);
    }
  };

  const removeTrip = (id) => {
    setTrips(trips.filter((t) => t.id !== id));
  };
  const updateTrip = (updatedTrip) => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === updatedTrip.id ? { ...trip, ...updatedTrip } : trip
      )
    );
  };
  const removePlannedTrip = (tripId) => {
    const updatedTrips = trips.filter((trip) => trip.id !== tripId);
    setTrips(updatedTrips);
  };
  
  

  return { trips, addTrip, removeTrip, updateTrip,removePlannedTrip };
}
