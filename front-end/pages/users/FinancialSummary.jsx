import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../src/components/NavBar";

const FinancialSummary = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTransactionId, setEditTransactionId] = useState(null);

  const [formData, setFormData] = useState({
    description: "",
    category: "",
    amount: "",
    payment_method: "",
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchSummaryData(storedUserId);
    } else {
      setError("User ID not found. Please log in.");
    }
  }, []);

  const fetchSummaryData = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:7777/api/user/summary/${id}`);
      setData(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("User ID is missing. Please log in.");
      return;
    }

    try {
      setLoading(true);

      if (isEditing) {
        await axios.put(`http://localhost:7777/api/user/summary/update/${editTransactionId}`, { ...formData, userId });
      } else {
        await axios.post("http://localhost:7777/api/user/summary/add", { ...formData, userId });
      }

      setShowModal(false);
      fetchSummaryData(userId);
      resetForm();
    } catch (error) {
      console.error("Error submitting transaction:", error.response?.data || error);
      alert(error.response?.data?.error || "Failed to process transaction!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!userId) {
      alert("User ID is missing. Please log in.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:7777/api/user/summary/delete/${id}`, { data: { userId } });
        fetchSummaryData(userId);
      } catch (error) {
        console.error("Error deleting transaction:", error);
        alert("Failed to delete transaction.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (transaction) => {
    setFormData({
      description: transaction.description,
      category: transaction.category,
      amount: transaction.amount,
      payment_method: transaction.payment_method,
    });
    setEditTransactionId(transaction.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      description: "",
      category: "",
      amount: "",
      payment_method: "",
    });
    setIsEditing(false);
    setEditTransactionId(null);
  };

  return (
    <div className="">
      <Navbar />
      <h1 className="text-3xl font-bold text-green-600 text-center mb-6">Financial Summary</h1>

      {error && <p className="text-red-600 text-center">{error}</p>}

      {userId && (
        <>
        <div className="flex justify-center">
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ">
            Add Payment
          </button>
        </div>

          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold text-green-600 mb-4">
                  {isEditing ? "Edit Transaction" : "Add Transaction"}
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                  <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="border p-2 rounded" />
                  <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} required className="border p-2 rounded" />
                  
                  <select name="category" value={formData.category} onChange={handleChange} required className="border p-2 rounded">
                    <option value="">Select Category</option>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Study">Study</option>
                    <option value="Others">Others</option>
                  </select>

                  <select name="payment_method" value={formData.payment_method} onChange={handleChange} required className="border p-2 rounded">
                    <option value="">Select Payment Method</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Others">Others</option>
                  </select>

                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex justify-center">
                    {loading ? "Processing..." : isEditing ? "Update" : "Add"}
                  </button>
                </form>
              </div>
            </div>
          )}


          <div className="mt-6">
            {loading ? (
              <p className="text-center text-gray-600">Loading transactions...</p>
            ) : (
              <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border">Description</th>
                    <th className="p-2 border">Category</th>
                    <th className="p-2 border">Amount</th>
                    <th className="p-2 border">Payment</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((transaction) => (
                    <tr key={transaction.id} className="border">
                      <td className="p-2">{transaction.description}</td>
                      <td className="p-2">{transaction.category}</td>
                      <td className="p-2">${transaction.amount}</td>
                      <td className="p-2">{transaction.payment_method}</td>
                      <td className="p-2 flex space-x-2 ">
                      <button 
                        onClick={() => handleEdit(transaction)} 
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
                      >
                        Edit
                      </button>
                      
                      <button 
                        onClick={() => handleDelete(transaction.id)} 
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
                      >
                        Delete
                      </button>
                    </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FinancialSummary;