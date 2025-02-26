// import axios from "axios";
// import React, { useEffect, useState } from "react";

// const Summary = () => {
//   const [des, setDes] = useState("");
//   const [amount, setAmount] = useState("");
//   const [category, setCategory] = useState("");
//   const [pay, setPay] = useState("");
//   const [data, setData] = useState([]);
//   const [editId, setEditId] = useState(null);

//   const fetchSummaryData = async () => {
//     try {
//       const response = await fetch("http://localhost:7777/summary/data");
//       const fetchData = await response.json();
//       setData(fetchData);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setData([]);
//     }
//   };

//   const getTotalAmount = () => {
//     return data.reduce((sum, item) => sum + Number(item.amount), 0);
//   };

//   const postSummaryData = async () => {
//     const totalAmount = getTotalAmount() + Number(amount); 
//     if (totalAmount > 10000) {
//       alert("Total amount exceeds ₹10,000! Please consult before proceeding.");
//       return; 
//     }
//     try {
//       const response = await axios.post("http://localhost:7777/summary/add", {
//         description: des,
//         category: category,
//         amount: amount,
//         payment_method: pay,
//       });

//       if (response.status === 200) {
//         alert("Transaction Added!");
//         resetForm();
//         fetchSummaryData();
//       } else {
//         alert("Failed to add transaction.");
//       }
//     } catch (error) {
//       console.error("Error posting data:", error);
//     }
//   };

//  const handleUpdate = async () => {
//   if (!editId) return; 

//   try {
//     await axios.put(`http://localhost:7777/summary/update/${editId}`, {
//       description: des,
//       category: category,
//       amount: amount,
//       payment_method: pay,
//     });

//     alert("Transaction updated successfully!");
//     resetForm(); 
//     fetchSummaryData(); 
//   } catch (error) {
//     console.error("Error updating transaction:", error);
//   }
// };


//   const handleEdit = (transaction) => {
//     setEditId(transaction.id);
//     setAmount(transaction.amount);
//     setCategory(transaction.category);
//     setDes(transaction.description);
//     setPay(transaction.payment_method);
//   };
  

//   const handleDelete = async (id) => {
//     if(window.confirm("are you see?do you want to delete")){
//     try {
//       await axios.delete(`http://localhost:7777/summary/delete/${id}`);
//       alert("Transaction deleted!");
//       fetchSummaryData();
//     } catch (error) {
//       console.error("Error deleting transaction:", error);
//     }
//   }
//   };

//   const resetForm = () => {
//     setEditId(null);
//     setDes("");
//     setAmount("");
//     setCategory("");
//     setPay("");
//   };

//   useEffect(() => {
//     fetchSummaryData();
//   }, []);

//   return (
//     <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
//       <h1 className="text-3xl font-bold text-green-600 text-center mb-6">
//         Financial Summary
//       </h1>

//       <form className="space-y-4">
//         <div>
//           <label className="block text-gray-700 font-semibold mb-1">
//             Description
//           </label>
//           <input
//             type="text"
//             value={des}
//             placeholder="Enter Description"
//             onChange={(e) => setDes(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
//           />
//         </div>

//         <div>
//           <label className="block text-gray-700 font-semibold mb-1">Amount</label>
//           <input
//             type="number"
//             value={amount}
//             placeholder="Enter Amount"
//             onChange={(e) => setAmount(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
//           />
//         </div>

//         <div>
//           <label className="block text-gray-700 font-semibold mb-1">Category</label>
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
//           >
//             <option value="">Select Category</option>
//             <option value="Food">Food</option>
//             <option value="Transport">Transport</option>
//             <option value="Entertainment">Entertainment</option>
//             <option value="Utilities">Utilities</option>
//             <option value="Study">Study</option>
//             <option value="Others">Others</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-gray-700 font-semibold mb-1">
//             Payment Method
//           </label>
//           <select
//             value={pay}
//             onChange={(e) => setPay(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
//           >
//             <option value="">Select Payment Method</option>
//             <option value="Cash">Cash</option>
//             <option value="Credit Card">Credit Card</option>
//             <option value="Debit Card">Debit Card</option>
//             <option value="Bank Transfer">Bank Transfer</option>
//             <option value="Others">Others</option>
//           </select>
//         </div>
//       </form>

//       <button
//   onClick={editId ? handleUpdate : postSummaryData} // ✅ Correct function call
//   className="bg-green-600 text-white px-4 py-2 my-5 rounded-lg flex justify-center mx-auto hover:bg-green-700 transition duration-300"
// >
//   {editId ? "UPDATE" : "ADD"}
// </button>


//       <h2 className="text-3xl font-bold text-green-600 text-center mb-6">
//         Transaction History
//       </h2>

//       <div className="overflow-x-auto">
//         <table className="w-full border border-gray-300 rounded-lg">
//           <thead className="bg-green-600 text-white">
//             <tr>
//               <th className="px-4 py-2 text-left">Description</th>
//               <th className="px-4 py-2 text-left">Category</th>
//               <th className="px-4 py-2 text-left">Amount</th>
//               <th className="px-4 py-2 text-left">Payment</th>
//               <th className="px-4 py-2 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.length > 0 ? (
//               data.map((d) => (
//                 <tr key={d.id} className="border-b border-gray-200 hover:bg-gray-100">
//                   <td className="px-4 py-2">{d.description}</td>
//                   <td className="px-4 py-2">{d.category}</td>
//                   <td className="px-4 py-2">₹{d.amount}</td>
//                   <td className="px-4 py-2">{d.payment_method}</td>
//                   <td className="px-4 py-2 flex space-x-2">
//                     <button
//                       onClick={() => handleEdit(d)}
//                       className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                     >
//                       EDIT
//                     </button>
//                     <button
//                       onClick={() => handleDelete(d.id)}
//                       className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//                     >
//                       DELETE
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
//                   No transactions found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Summary;
