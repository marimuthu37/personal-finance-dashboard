import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const determineRole = (email) => {
    if (email.endsWith("@user.com")) return "user";
    if (email.endsWith("@admin.com")) return "admin";
    if (email.endsWith("@consultant.com")) return "consultant";
    return "user";
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const role = determineRole(formData.email);

    try {
      const response = await axios.post("http://localhost:7777/api/auth/signup", {
        ...formData,
        role,
      });

      if (response.data.id) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            role: response.data.role,
          })
        );
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.id);
        setSuccess("Signup successful! Redirecting...");

        setTimeout(() => {
          navigate(`/${response.data.role}/dashboard`);
        }, 200);
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Signup failed. Try again!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-200 to-green-400">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Sign Up</h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-3 mt-5 rounded-lg font-semibold text-lg hover:bg-green-700 transition duration-300 shadow-md"
        >
          Sign Up
        </button>

        {error && <p className="text-red-600 text-center mt-3 font-semibold">{error}</p>}
        {success && <p className="text-green-600 text-center mt-3 font-semibold">{success}</p>}

        <p className="text-center text-gray-600 mt-4">Already have an account?</p>
        <button
          onClick={() => navigate("/login")}
          className="w-full border border-green-600 text-green-600 py-3 mt-3 rounded-lg font-semibold text-lg hover:bg-green-600 hover:text-white transition duration-300 shadow-md"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Signup;
