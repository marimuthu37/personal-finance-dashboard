import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:7777/api/auth/login", { email, password });

      const { token, id, name, role } = response.data;
      if (!token || !id || !role) {
        alert("Login failed! Please try again.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userId", id);
      localStorage.setItem("user", JSON.stringify({ id, name, email, role }));

      if (role === "consultant") localStorage.setItem("consultantId", id);

      navigate(`/${role}/dashboard`);
    } catch (error) {
      alert(error.response?.data?.error || "Login failed! Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-200 to-green-400">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Welcome Back</h2>
        <p className="text-center text-gray-600 mb-6">Login to your account</p>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={isLogin}
          className="w-full bg-green-600 text-white py-3 mt-5 rounded-lg font-semibold text-lg hover:bg-green-700 transition duration-300 shadow-md"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-gray-600 mt-4">Don't have an account?</p>
        <button
          onClick={() => navigate("/signup")}
          className="w-full border border-green-600 text-green-600 py-3 mt-3 rounded-lg font-semibold text-lg hover:bg-green-600 hover:text-white transition duration-300 shadow-md"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;
