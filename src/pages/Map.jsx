import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../utils/supabase";
import { Link } from "react-router-dom";
import Menu from "../components/Menu";
import { useAuth } from "../context/AuthContext";
import TripMenu from "../components/TripMenu";
import { useTrip } from "../context/TripContext";
import Spinner from "../components/Spinner";
import UpdateLocation from "../components/UpdateLocation";

function Map({ darkMode, setDarkMode }) {
  const { user } = useAuth();
  const { currentTrip, endTrip, updateLocation, loading: tripLoading } = useTrip();
  const [current, setCurrent] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [buses, setBuses] = useState([]);
  const [menuToggle, setMenuToggle] = useState(false);
  const [tripToggle, setTripToggle] = useState(false);
  const timerRef = useRef(null);
  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    function success(pos) {
      const crd = pos.coords;
      setCurrent(crd);
      setLoading(false);
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
      setLoadError(err.message);
    }

    navigator.geolocation.watchPosition(success, error, options);
  }, []);

  const getBuses =  async () => {
    try {
      const { data: coords, error } = await supabase
        .from("coords")
        .select("*")
        .eq("active", true);

      if (error) {
        throw error;
      }

      setBuses(coords);
    } catch (err) {
      setLoadError(err.message);
      console.error(err);
    }
  };

  useEffect(() => {
    getBuses();
  }, [currentTrip]);
  
  useEffect(() => {
    const reloadBuses = setInterval(getBuses, 15000);
    
    return () => clearInterval(reloadBuses);
  }, []);

  return (
    <div className="relative flex items-center justify-center h-screen w-full">
      {menuToggle && <Menu close={() => setMenuToggle(false)} />}
      {tripToggle && <TripMenu close={() => setTripToggle(false)} />}

      <button
        onClick={() => setMenuToggle(true)}
        type="button"
        className="group fixed top-5 right-5 p-2.5 z-500 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out border text-stone-700 bg-white/80 border-stone-200/60 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:scale-105 active:scale-95 hover:bg-white hover:text-accblue2 dark:bg-stone-900/60 dark:border-stone-800/80 dark:text-stone-300 dark:hover:bg-stone-900 dark:hover:text-accsage dark:shadow-[0_4px_12px_-5px_rgba(0,0,0,0.3)] group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6 md:size-8 lg:size-10 group-hover:rotate-180 transition-transform duration-200 ease-in-out"
        >
          <path
            fillRule="evenodd"
            d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {user && !currentTrip && (
        <button
          onClick={() => setTripToggle(true)}
          type="button"
          className="group fixed top-5 right-18 md:right-22 lg:right-24 p-2.5 z-500 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out border text-stone-700 bg-white/80 border-stone-200/60 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:scale-105 active:scale-95 hover:bg-white hover:text-accblue2 dark:bg-stone-900/60 dark:border-stone-800/80 dark:text-stone-300 dark:hover:bg-stone-900 dark:hover:text-accsage dark:shadow-[0_4px_12px_-5px_rgba(0,0,0,0.3)] group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6 md:size-8 lg:size-10 group-hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            <path
              fillRule="evenodd"
              d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
      {user && currentTrip && (
        <button
          onClick={endTrip}
          type="button"
          className="group fixed top-5 right-18 md:right-22 lg:right-24 p-2.5 z-500 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out border text-stone-700 bg-white/80 border-stone-200/60 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:scale-105 active:scale-95 hover:bg-white hover:text-accblue2 dark:bg-stone-900/60 dark:border-stone-800/80 dark:text-stone-300 dark:hover:bg-stone-900 dark:hover:text-accsage dark:shadow-[0_4px_12px_-5px_rgba(0,0,0,0.3)] group"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="size-6 md:size-8 lg:size-10 group-hover:scale105 transition-transform duration-200 ease-in-out"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M15.7806 20.9809C14.7206 22.0009 13.3606 22.5109 12.0006 22.5109C10.6406 22.5109 9.28063 21.9909 8.22063 20.9709C7.86063 20.6309 7.50063 20.2509 7.14062 19.8609L20.0406 6.96094C20.2906 7.50094 20.4806 8.07094 20.6206 8.70094C21.7906 13.8609 18.6306 18.2209 15.7806 20.9809Z"
                fill="currentColor"
              ></path>{" "}
              <path
                d="M21.7689 2.22891C21.4689 1.92891 20.9789 1.92891 20.6789 2.22891L2.22891 20.6889C1.92891 20.9889 1.92891 21.4789 2.22891 21.7789C2.37891 21.9189 2.56891 21.9989 2.76891 21.9989C2.96891 21.9989 3.15891 21.9189 3.30891 21.7689L21.7689 3.30891C22.0789 3.00891 22.0789 2.52891 21.7689 2.22891Z"
                fill="currentColor"
              ></path>{" "}
              <path
                d="M8.84865 10.31C8.84865 8.57 10.2586 7.16 11.9986 7.16C13.3086 7.16 14.4286 7.96 14.9086 9.1L18.8886 5.12C17.1186 2.98 14.4387 2 11.9986 2C10.2286 2 8.33865 2.52 6.75865 3.61C5.17865 4.71 3.89865 6.38 3.37865 8.69C2.53865 12.36 3.89865 15.64 5.78865 18.21L10.7886 13.21C9.64865 12.74 8.84865 11.61 8.84865 10.31Z"
                fill="currentColor"
              ></path>{" "}
            </g>
          </svg>
        </button>
      )}
      <button
        onClick={() => setDarkMode(!darkMode)}
        type="button"
        className="group fixed bottom-5 right-5 p-2.5 z-500 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out border text-stone-700 bg-white/80 border-stone-200/60 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:scale-105 active:scale-95 hover:bg-white hover:text-accblue2 dark:bg-stone-900/60 dark:border-stone-800/80 dark:text-stone-300 dark:hover:bg-stone-900 dark:hover:text-accsage dark:shadow-[0_4px_12px_-5px_rgba(0,0,0,0.3)]"
        aria-label="Toggle theme"
      >
        {darkMode ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6 md:size-8 lg:size-10 transition-transform duration-500 rotate-0 group-hover:rotate-45 text-accsage"
          >
            <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6 md:size-8 lg:size-10 transition-transform duration-500 -rotate-12 group-hover:rotate-0 text-accblue2"
          >
            <path
              fillRule="evenodd"
              d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
      {loading && !loadError ? (
        <div className="w-20 h-20 rounded-full border-6 border-gray-500 border-t-blue-600 animate-spin"></div>
      ) : !loadError ? (
        <MapContainer
          center={[current.latitude, current.longitude]}
          zoom={13}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={
              darkMode
                ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
          />
          {!currentTrip && <CircleMarker
            center={[current.latitude, current.longitude]}
            radius={8}
            pathOptions={{
              color: "#ffffff",
              fillColor: "#3b82f6",
              fillOpacity: 1,
              weight: 2,
            }}
          ></CircleMarker>}
          {buses.length > 0 &&
            buses.map((bus) => (
              <CircleMarker
                key={bus.name}
                center={[bus.latitude, bus.longitude]}
                radius={10}
                pathOptions={{
                  color: "#ffffff",
                  fillColor: currentTrip && bus.user_id === user.id ? "#f0b100" :"#fb2c36",
                  fillOpacity: 1,
                  weight: 2,
                }}
              ></CircleMarker>
            ))}
        </MapContainer>
      ) : (
        <p>{loadError}</p>
      )}
      {currentTrip && <UpdateLocation current={current}/>}
    </div>
  );
}

export default Map;
