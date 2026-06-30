import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import Spinner from "../components/Spinner";

export default function Login() {
  const { login, loading } = useAuth();
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState({email: "", password: ""});
  const navigate = useNavigate();

  const handleChange = (event) => {
    setCredentials({...credentials, [event.target.name]: event.target.value.trim()})
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    if(!credentials.email || !credentials.password){
      setError("Please enter your email and password");
      return;
    }
    try {
      const {success, error: loginError } = await login(credentials.email, credentials.password);
      if(!success){
        throw loginError;
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 px-4 transition-colors duration-300">
  <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-100 dark:border-stone-800/80 p-8 dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5">
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accblue1/10 text-accblue2 dark:bg-accblue1/20 dark:text-accblue1 mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 tracking-tight">
        Welcome Back
      </h2>
      <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
        Please enter your details to sign in
      </p>
    </div>

    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-2"
        >
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={credentials.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="w-full px-4 py-3 rounded-xl border text-base border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-100 bg-stone-50/50 dark:bg-stone-950/40 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-hidden focus:border-accblue1 focus:bg-white dark:focus:bg-stone-950 transition-all shadow-inner"
          required
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider"
          >
            Password
          </label>
        </div>
        <input
          id="password"
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-xl border text-base border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-100 bg-stone-50/50 dark:bg-stone-950/40 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-hidden focus:border-accblue1 focus:bg-white dark:focus:bg-stone-950 transition-all shadow-inner"
          required
        />
      </div>

      <div className="flex items-center">
        <input
          id="remember"
          type="checkbox"
          className="h-4 w-4 rounded-sm border-stone-300 dark:border-stone-700 text-accgreen focus:ring-accgreen/20 accent-accgreen cursor-pointer bg-white dark:bg-stone-950"
        />
        <label
          htmlFor="remember"
          className="ml-2 text-sm text-stone-600 dark:text-stone-400 select-none cursor-pointer"
        >
          Remember me
        </label>
      </div>

      {error && <p className="italic text-red-500 dark:text-red-400 text-center text-sm">{error}</p>}

      <button
        type="submit"
        className="flex justify-center items-center w-full py-3 px-4 rounded-xl bg-accsage text-white font-semibold hover:bg-accgreen shadow-md shadow-accsage/10 dark:shadow-none transition-colors cursor-pointer mt-2"
      >
        {loading ? <Spinner /> : "Sign In"}
      </button>
    </form>
  </div>
</div>

  );
}
