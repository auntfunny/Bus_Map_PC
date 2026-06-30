import React, { useState } from "react";
import Spinner from "./Spinner";
import { useTrip } from "../context/TripContext";

const TripMenu = ({ close }) => {
  const { startTrip, loading } = useTrip();
  const [tripInfo, setTripInfo] = useState({ destination: "", departure: "" });

  const handleChange = (event) => {
    setTripInfo({ ...tripInfo, [event.target.name]: event.target.value });
  };

  const handleDestinationSelect = (route) => {
    setTripInfo({ ...tripInfo, destination: route });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await startTrip(tripInfo);
    close();
  };

  const routes = [
    "To Puerto",
    "To RioMar",
    "To Pichiquillaipe",
    "To Quillaipe",
    "To La Arena",
    "To Lago Chapo",
  ];

  return (
    <div
      onClick={close}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-md transition-opacity"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-72 overflow-hidden rounded-2xl bg-white shadow-xl border border-stone-100 dark:bg-stone-900 dark:border-stone-800/80 dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
      >
        <div className="bg-accgreen p-4 text-center">
          <h3 className="text-sm font-semibold tracking-wider text-white uppercase">
            New Trip
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-3">
          <ul className="space-y-1 max-h-60 overflow-y-auto">
            {routes.map((route) => {
              const isSelected = tripInfo.destination === route;
              return (
                <li key={route}>
                  <button
                    type="button"
                    onClick={() => handleDestinationSelect(route)}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-between cursor-pointer 
                      ${
                        isSelected
                          ? "bg-accblue1/20 text-accblue2 dark:text-accblue1"
                          : "text-stone-700 hover:bg-accblue1/10 hover:text-accblue2 dark:text-stone-300 dark:hover:bg-accblue1/20 dark:hover:text-accblue1"
                      }`}
                  >
                    <span>{route}</span>
                    {isSelected && (
                      <span className="text-xs font-bold uppercase tracking-wide opacity-70">
                        Selected
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <hr className="my-3 border-stone-100 dark:border-stone-800" />

          <div className="px-1 mb-3">
            <label
              htmlFor="departure"
              className="block text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5 pl-1"
            >
              Departure Time
            </label>
            <input
              type="time"
              name="departure"
              id="departure"
              required
              onChange={handleChange}
              value={tripInfo.departure}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accgreen/20 focus:border-accgreen dark:border-stone-800 dark:bg-stone-950 dark:text-stone-200 dark:focus:border-accgreen"
            />
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={loading || !tripInfo.destination || !tripInfo.departure}
              className="flex items-center justify-center mx-1 px-4 py-2.5 rounded-xl w-[calc(100%-8px)] text-white font-semibold transition-colors cursor-pointer shadow-sm bg-accsage hover:bg-accgreen dark:bg-accsage dark:hover:bg-accgreen disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Spinner /> : "Start Trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripMenu;
