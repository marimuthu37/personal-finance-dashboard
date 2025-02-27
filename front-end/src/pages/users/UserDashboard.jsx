import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/NavBar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [financialData, setFinancialData] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetchTransactions(storedUser.id);
      fetchFinancialData();
    }
  }, []);

  const fetchTransactions = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:7777/api/user/summary/last-three/${userId}`);
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchFinancialData = async () => {
    try {
      const response = await axios.get("http://localhost:7777/api/user/financial-data");
      setFinancialData(response.data);
    } catch (error) {
      console.error("Error fetching financial data:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
          Welcome, {user ? user.name : "User"}!
        </h1>

        {/* Salary vs Expenses Bar Graph */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">Salary vs Expenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={financialData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="salary" fill="#4CAF50" name="Salary" />
              <Bar dataKey="expenses" fill="#F44336" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Last 3 Transactions Table */}
        <h2 className="text-2xl font-bold text-green-700">Last 3 Transactions</h2>
        <table className="w-full border mt-4">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <tr key={t.id} className="border-b">
                  <td className="px-4 py-2">{t.description}</td>
                  <td className="px-4 py-2">₹{t.amount}</td>
                  <td className="px-4 py-2">{t.payment_method}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-3 text-gray-500">
                  No recent transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDashboard;