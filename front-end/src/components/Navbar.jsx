import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-green-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Finance Dashboard</h1>
        <ul className="flex space-x-6">
          <li><Link to="/user/dashboard" className="hover:text-green-300 transition">Dashboard</Link></li>
          <li><Link to="/user/financial-summary" className="hover:text-green-300 transition">Financial Summary</Link></li>
          <li><Link to="/user/take-consultant" className="hover:text-green-300 transition">Take Consultant</Link></li>
          <li>
            <button 
              onClick={() => { localStorage.clear(); window.location.href = "/login"; }} 
              className="hover:text-green-300 transition"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
