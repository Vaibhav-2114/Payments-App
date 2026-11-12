import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:3000";
export let user = '';

const Signup = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  user = username;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/user/signup", {
        firstName: firstname,
        lastName: lastname,
        username,
        password,
      });

      const data = await response.data;

      localStorage.setItem("token", data.token);
      window.location.assign("/");
    } catch (error) {
      setError(error.response?.data?.message || "Sign up failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F3EF] px-4 py-8">
      <div className="w-full max-w-xl rounded-xl p-8 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6 text-[#171717]">Sign Up</h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full max-w-md"
          >
            {/* First Name and Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 font-semibold text-[#171717]">
                First Name
                <input
                  type="text"
                  value={firstname}
                  onChange={(event) => setFirstname(event.target.value)}
                  required
                  className="w-full border border-[#D6D3D1] p-3 rounded-lg outline-none focus:border-black transition"
                />
              </label>

              <label className="flex flex-col gap-1 font-semibold text-[#171717]">
                Last Name
                <input
                  type="text"
                  value={lastname}
                  onChange={(event) => setLastname(event.target.value)}
                  required
                  className="w-full border border-[#D6D3D1] p-3 rounded-lg outline-none focus:border-black transition"
                />
              </label>
            </div>

            {/* Username */}
            <label className="flex flex-col gap-1 font-semibold text-[#171717]">
              Set Username
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                className="w-full border border-[#D6D3D1] p-3 rounded-lg outline-none focus:border-black transition"
              />
            </label>

            {/* Password */}
            <label className="flex flex-col gap-1 font-semibold text-[#171717]">
              Set Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full border border-[#D6D3D1] p-3 rounded-lg outline-none focus:border-black transition"
              />
            </label>

            {error && (
              <p role="alert" className="text-red-600 text-sm">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-black text-white rounded-lg p-3 mt-2 font-semibold hover:bg-[#262626] active:scale-[0.98] transition"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-5 text-[#44403C]">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-black font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
