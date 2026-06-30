import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../utils/supabase";

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentTrip, setCurrentTrip] = useState(null);
  const [current, setCurrent] = useState({});
  const [loading, setLoading] = useState(false);

  const startTrip = async (trip) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("coords")
        .update({
          destination: trip.destination,
          departure: trip.departure,
          active: true,
        })
        .eq("user_id", user.id)
        .select();

      setCurrentTrip(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const endTrip = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("coords")
        .update({ active: false })
        .eq("user_id", user.id)
        .select();

      setCurrentTrip(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getTrip = async () => {
      setLoading(true);
      try {
        let { data: coords, error } = await supabase
          .from("coords")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        if (coords?.active) {
          setCurrentTrip(coords);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      getTrip();
    }
  }, [user]);

  const updateLocation = async ({ latitude, longitude }, trip, id) => {
    try {
      const { data, error } = await supabase
        .from("coords")
        .update({
          latitude: latitude,
          longitude: longitude,
        })
        .eq("user_id", id || user.id)
        .select();
      if (trip) {
        setCurrentTrip(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <TripContext.Provider
      value={{
        currentTrip,
        startTrip,
        endTrip,
        updateLocation,
        loading,
        current,
        setCurrent,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => useContext(TripContext);
