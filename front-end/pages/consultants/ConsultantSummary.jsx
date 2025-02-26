import React, { useEffect, useState } from "react";
import axios from "axios";
import ConsultantNavbar from "../../src/components/ConsultantNavbar";

const ConsultantSummary = () => {
  const [summary, setSummary] = useState([]);
  const consultantId = localStorage.getItem("consultantId"); // Get from localStorage

  useEffect(() => {
    const fetchSummary = async () => {
      if (!consultantId) {
        console.error("❌ Consultant ID is missing!");
        return;
      }

      try {
        console.log("🔍 Fetching completed consultations for consultant ID:", consultantId);
        const response = await axios.get(
          `http://localhost:7777/api/consultants/summary/${consultantId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        console.log("✅ Summary API Response:", response.data);
        setSummary(response.data.filter((item) => item.status === "completed"));
      } catch (error) {
        console.error("❌ Error fetching summary:", error);
      }
    };

    fetchSummary();
  }, [consultantId]);

  return (
    <div className="">
      <ConsultantNavbar />
      <h1 className="text-2xl font-bold mb-4">Completed Consultations</h1>

      {summary.length === 0 ? (
        <p className="text-gray-500">No completed consultations.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summary.map((item) => (
            <div key={item.id} className="p-4 bg-white shadow-md rounded-lg">
              <h2 className="text-lg font-semibold">{item.userName}</h2>
              <p className="text-gray-600">
                Consulted on: {new Date(item.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultantSummary;
