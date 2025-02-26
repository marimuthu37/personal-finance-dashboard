import React from "react";
import { Link, useNavigate } from "react-router-dom";

const ConsultantNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <nav className="bg-green-700 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        <h1 className="text-2xl font-bold">Consultant Panel</h1>
        <div className="flex space-x-6 text-lg font-medium">
          <Link to="/consultant/dashboard" className="hover:text-green-300 transition">Dashboard</Link>
          <Link to="/consultant/requests" className="hover:text-green-300 transition">Requests</Link>
          <Link to="/consultant/summary" className="hover:text-green-300 transition">Summary</Link>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ConsultantNavbar;
