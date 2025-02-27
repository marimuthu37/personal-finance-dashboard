import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ConsultantNavbar from "../../components/ConsultantNavbar";

const ConsultantReq = () => {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");
  
  let consultantId = null;
  if (token) {
    const decoded = jwtDecode(token);
    consultantId = decoded.id; 
  }

  useEffect(() => {
    if (consultantId) {
      fetchRequests();
    }
  }, [consultantId]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7777/api/consultants/requests/${consultantId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(response.data.filter((item) => item.status === "pending"));
    } catch (error) {
      console.error("Error fetching consultant requests:", error);
    }
  };

  const acceptRequest = async (requestId) => {
    console.log("Accepting request ID:", requestId);

    try {
      const response = await axios.put(
        `http://localhost:7777/api/consultants/requests/${requestId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setRequests((prevRequests) => prevRequests.filter((item) => item.id !== requestId));
      }
    } catch (error) {
      console.error("Error accepting request:", error.response?.data || error.message);
    }
  };

  return (
    <div className="">
      <ConsultantNavbar />
      <h1 className="text-2xl font-bold mb-4">Pending Consultation Requests</h1>

      {requests.length === 0 ? (
        <p className="text-gray-500">No pending consultation requests.</p>
      ) : (
        requests.map((item) => (
          <div key={item.id} className="p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-semibold">{item.user_name}</h2>
            <button
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => acceptRequest(item.id)}
            >
              Accept
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ConsultantReq;
