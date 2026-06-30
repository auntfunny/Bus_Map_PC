import React, { useEffect } from 'react';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';

const UpdateLocation = () => {
    const { user } = useAuth();
    const { current, currentTrip, updateLocation } = useTrip();
    useEffect(() => {
    if (user && currentTrip) {
      updateLocation(current, true);
      const loadLocation = setInterval(async () => {
        updateLocation(current);
      }, 15000);

      return () => clearInterval(loadLocation);
    }
  }, []);
}

export default UpdateLocation;
