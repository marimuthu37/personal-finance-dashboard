import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import AdminNavbar from './../../src/components/AdminNavbar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [userStats, setUserStats] = useState([]);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await axios.get("http://localhost:7777/admin/stats");
        const formattedData = response.data.map((item) => ({
          label: item.date,
          value: item.count,
        }));
        setUserStats(formattedData);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchUserStats();
  }, []);

  const chartData = {
    labels: userStats.map((entry) => entry.label),
    datasets: [
      {
        label: "New Users",
        data: userStats.map((entry) => entry.value),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  return (
  <div>
    <AdminNavbar />
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Admin Dashboard</h1>

      <div className="bg-white shadow-lg p-6 rounded-lg max-w-4xl mx-auto">
        {userStats.length > 0 ? (
          <Bar data={chartData} />
        ) : (
          <p className="text-center text-gray-500">No user statistics available.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default AdminDashboard;
