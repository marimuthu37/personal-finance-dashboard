import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";

const ConsultantSummary = () => {
  const [consultantSummaries, setConsultantSummaries] = useState({});
  const [consultantIds, setConsultantIds] = useState([]);

  useEffect(() => {
    const fetchConsultantIds = async () => {
      try {
        const response = await axios.get("http://localhost:7777/api/consultants/all-ids");
        const ids = response.data.map((item) => item.id);
        setConsultantIds(ids);
      } catch (error) {
        console.error("Error fetching consultant IDs:", error);
      }
    };

    fetchConsultantIds();
  }, []);

  useEffect(() => {

    const fetchSummaries = async () => {
      try {
        const summaries = {};
        for (const id of consultantIds) {
          const response = await axios.get(`http://localhost:7777/api/consultants/summary/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          summaries[id] = response.data;
        }
        setConsultantSummaries(summaries);
      } catch (error) {
        console.error(" Error fetching consultant summaries:", error);
      }
    };

    if (consultantIds.length > 0) {
      fetchSummaries();
    }
  }, [consultantIds]);

  return (
    <div>
      <AdminNavbar />
      <div className="p-6 bg-blue-50 min-h-screen">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
          Completed Consultations
        </h1>

        {consultantIds.length === 0 ? (
          <p className="text-center text-gray-600">Loading consultant data...</p>
        ) : (
          consultantIds.map((consultantId) => (
            <div key={consultantId} className="mb-10">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                Consultant ID: {consultantId}
              </h2>

              {consultantSummaries[consultantId]?.length === 0 ? (
                <p className="text-gray-500">No completed consultations.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {consultantSummaries[consultantId]?.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 bg-white border border-blue-300 shadow-md rounded-lg transition transform hover:scale-105 hover:shadow-lg"
                    >
                      <h2 className="text-xl font-semibold text-blue-700">{item.userName}</h2>
                      <p className="text-gray-600 mt-1">
                        <span className="font-medium text-blue-600">Consulted on:</span>{" "}
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConsultantSummary;
