import React, { useState, useEffect } from "react";
import axios from "axios";
import ConsultantNavbar from "../../src/components/ConsultantNavbar";

const ConsultantDashboard = () => {
  const [consultantInfo, setConsultantInfo] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const consultantId = localStorage.getItem("consultantId");
    const token = localStorage.getItem("token");

    if (!consultantId || !token) {
      setError("Consultant ID or token is missing.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        console.log("🔍 Fetching consultant data...");
        
        const consultantRes = await axios.get(`http://localhost:7777/api/consultants/data/${consultantId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setConsultantInfo(consultantRes.data);

        const requestsRes = await axios.get(`http://localhost:7777/api/consultants/requests/${consultantId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRequests(requestsRes.data);
      } catch (error) {
        console.error("❌ Error fetching data:", error.response?.data || error.message);
        setError(error.response?.data?.error || "Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <ConsultantNavbar />
      <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-3xl">
          <h1 className="text-2xl font-bold text-center mb-4">Consultant Dashboard</h1>

          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading...</p>
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <>
              <div className="flex flex-col items-center">
                <img
                  src="https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"
                  alt="Consultant Profile"
                  className="w-24 h-24 rounded-full mb-4 border"
                  onError={(e) => (e.target.src = "https://www.gravatar.com/avatar/?d=mp")}
                />
                <h2 className="text-lg font-semibold">{consultantInfo?.name || "Unknown Consultant"}</h2>
                <p className="text-gray-600">{consultantInfo?.specialization || "No specialization provided"}</p>
              </div>

              <div className="mt-6 w-full">
                <h2 className="text-lg font-semibold mb-4 text-center">Consultation Requests</h2>
                {requests.length > 0 ? (
                  <ul className="space-y-4">
                    {requests.map((req) => (
                      <li key={req.id} className="p-4 bg-gray-50 border rounded-lg">
                        <p><strong>Requested By:</strong> {req.user_name || "Unknown User"}</p>
                        <p><strong>Status:</strong> {req.status}</p>
                        <p><strong>Requested At:</strong> {new Date(req.request_date).toLocaleString()}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center">No consultation requests available.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultantDashboard;
