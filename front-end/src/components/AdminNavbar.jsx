import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("adminId"); 
    navigate("/login"); 
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-white text-lg font-bold">Admin Panel</h1>
        <div className="flex space-x-4 items-center">
          <Link to="/admin/dashboard" className="text-white hover:underline">
            Dashboard
          </Link>
          <Link to="/admin/users" className="text-white hover:underline">
            Users
          </Link>
          <Link to="/admin/consultants" className="text-white hover:underline">
            Consultants
          </Link>
          <Link to="/admin/consultation-summary" className="text-white hover:underline">
            Consultation Summary
          </Link>
          <button 
            onClick={handleLogout} 
            className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
