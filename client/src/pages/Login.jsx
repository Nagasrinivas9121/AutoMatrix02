import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useUser } from "../context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { reloadUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await api.post("/auth/login", { email, password });

      // ✅ FIX 1: STORE TOKEN WITH CORRECT KEY
      localStorage.setItem("token", res.data.token);

      // ✅ FIX 2: LOAD USER INTO CONTEXT
      await reloadUser();

      // ✅ FIX 3: NAVIGATE TO APP (NOT LANDING)
      navigate("/app", { replace: true });

    } catch (err) {
      setErrorMsg("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 to-blue-500 animate-fadeIn">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl p-8 rounded-xl w-full max-w-md border border-slate-200"
      >
        <h1 className="text-3xl font-extrabold text-center mb-2 text-gray-800">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 mb-6 text-sm">
          Log in to your Automatrixx AI dashboard
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
            {errorMsg}
          </div>
        )}

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">
            Email address
          </label>
          <input
            type="email"
            className="w-full p-3 border rounded-lg mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            className="w-full p-3 border rounded-lg mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-lg text-white
            ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}
          `}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className="text-center text-sm mt-5 text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Create Account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;