import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const Signup = () => {
  const [name, setName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMsg("");

    try {
      await api.post("/auth/register", {
        name,
        organizationName: orgName, // ✅ backend aligned
        email,
        password,
      });

      // ✅ clean redirect
      window.location.replace("/login");
    } catch (err) {
      setErrorMsg("Signup failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 to-blue-500 animate-fadeIn">
      <form
        onSubmit={handleSignup}
        className="bg-white shadow-xl p-8 rounded-xl w-full max-w-md border border-slate-200"
        aria-label="Signup form"
      >
        <h1 className="text-3xl font-extrabold text-center mb-2 text-gray-800">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mb-6 text-sm">
          Join Automatrixx AI platform
        </p>

        {errorMsg && (
          <div className="p-3 mb-4 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
            {errorMsg}
          </div>
        )}

        {/* Name */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">
            Your Name
          </label>
          <input
            className="w-full p-3 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>

        {/* Organization */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">
            Organization Name
          </label>
          <input
            className="w-full p-3 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Company Pvt Ltd"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            required
            autoComplete="organization"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            className="w-full p-3 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            className="w-full p-3 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-lg text-white transition shadow-sm
            ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
          `}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="mt-5 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;