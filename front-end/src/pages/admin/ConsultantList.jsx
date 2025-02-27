import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";

const ConsultantList = () => {
  const [consultants, setConsultants] = useState([]);

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const response = await axios.get("http://localhost:7777/api/admin/consultants");
        setConsultants(response.data);
      } catch (error) {
        console.error("Error fetching consultants:", error);
      }
    };

    fetchConsultants();
  }, []);

  return (
    <div>
      <AdminNavbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">All Consultants</h1>

        <div className="bg-white shadow-lg p-6 rounded-lg max-w-4xl mx-auto">
          <table className="w-full border border-gray-300 rounded-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {consultants.length > 0 ? (
                consultants.map((consultant) => (
                  <tr key={consultant.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="px-4 py-2">{consultant.name}</td>
                    <td className="px-4 py-2">{consultant.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="px-4 py-3 text-center text-gray-500">
                    No consultants found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConsultantList;
