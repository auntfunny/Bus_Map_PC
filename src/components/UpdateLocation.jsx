import React, { useEffect } from 'react';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';

const UpdateLocation = ({current}) => {
    const { user } = useAuth();
    const { currentTrip, updateLocation } = useTrip();
    useEffect(() => {
    if (user && currentTrip) {
      updateLocation(current);
      const loadLocation = setInterval(async () => {
        updateLocation(current);
      }, 15000);

      return () => clearInterval(loadLocation);
    }
  }, []);
}

export default UpdateLocation;
