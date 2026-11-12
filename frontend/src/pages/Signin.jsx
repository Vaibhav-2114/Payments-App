import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:3000";
export let user = '';


const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  user = username;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/user/signin", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      window.location.assign("/");
    } catch (error) {
      setError(error.response?.data?.message || "Sign in failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F3EF] px-4">
      <div className="w-full max-w-xl rounded-xl p-8 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-5 text-[#171717]">Sign In</h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full max-w-xs"
          >
            <label className="flex flex-col gap-1 font-semibold text-[#171717]">
              Username
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                className="border border-[#D6D3D1] p-3 rounded-lg outline-none focus:border-black transition"
              />
            </label>

            <label className="flex flex-col gap-1 font-semibold text-[#171717]">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="border border-[#D6D3D1] p-3 rounded-lg outline-none focus:border-black transition"
              />
            </label>

            {error && (
              <p role="alert" className="text-red-600 text-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="bg-black text-white rounded-lg p-3 mt-2 font-semibold hover:bg-[#262626] active:scale-[0.98] transition"
            >
              Sign In
            </button>
          </form>

          <p className="mt-5 text-[#44403C]">
            Register?{" "}
            <Link
              to="/signup"
              className="text-black font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
