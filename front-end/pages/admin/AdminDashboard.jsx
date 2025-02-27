import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import AdminNavbar from "../../src/components/AdminNavbar";

const AdminDashboard = () => {

  const data = [
    { month: "Jan", users: 120, consultants: 30 },
    { month: "Feb", users: 150, consultants: 40 },
    { month: "Mar", users: 170, consultants: 35 },
    { month: "Apr", users: 200, consultants: 50 },
    { month: "May", users: 220, consultants: 55 },
    { month: "Jun", users: 250, consultants: 60 },
  ];

  return (
    <div>
      <AdminNavbar />
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-center mb-4">Users vs Consultants Per Month</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="users" fill="#4A90E2" name="Users" />
          <Bar dataKey="consultants" fill="#50C878" name="Consultants" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    </div>
  );
};

export default AdminDashboard;
