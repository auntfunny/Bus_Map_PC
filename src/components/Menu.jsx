import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";
import { useTrip } from "../context/TripContext";

const Menu = ({ close }) => {
  const { user, logout, loading } = useAuth();
  const { endTrip } = useTrip();

  const handleLogout = async (event) => {
    event.stopPropagation();
    await endTrip();
    await logout();
    close();
  };

  return (
    <div
      onClick={close}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-md transition-opacity"
    >
      <div className="relative w-72 overflow-hidden rounded-2xl bg-white shadow-xl border border-stone-100 dark:bg-stone-900 dark:border-stone-800/80 dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5">
        <div className="bg-accgreen p-4 text-center">
          <h3 className="text-sm font-semibold tracking-wider text-white uppercase">
            Menu
          </h3>
        </div>

        <ul className="p-3 space-y-1">
          {[
            "To Puerto",
            "To RioMar",
            "To Pichiquillaipe",
            "To Quillaipe",
            "To La Arena",
            "To Lago Chapo",
          ].map((route) => (
            <li key={route}>
              <button
                type="button"
                className="w-full text-left px-4 py-3 rounded-xl text-stone-700 font-medium transition-colors flex items-center gap-3 cursor-pointer hover:bg-accblue1/10 hover:text-accblue2 dark:text-stone-300 dark:hover:bg-accblue1/20 dark:hover:text-accblue1"
              >
                {route}
              </button>
            </li>
          ))}

          <hr className="my-2 border-stone-100 dark:border-stone-800" />

          <li>
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center mx-1 px-4 py-2.5 rounded-xl w-full text-white font-semibold transition-colors cursor-pointer shadow-sm bg-accsage hover:bg-accgreen dark:bg-accsage dark:hover:bg-accgreen"
              >
                {loading ? <Spinner /> : "Logout"}
              </button>
            ) : (
              <Link
                to="/login"
                className="block text-center mx-1 px-4 py-2.5 rounded-xl text-white font-semibold transition-colors cursor-pointer shadow-sm bg-accsage hover:bg-accgreen dark:bg-accsage dark:hover:bg-accgreen"
              >
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Menu;
