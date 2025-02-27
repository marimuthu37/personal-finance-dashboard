import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/NavBar";

const ConsultantRequest = () => {
  const [consultants, setConsultants] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.id) {
          setUserId(parsedUser.id);
        } else {
          console.error("User object is missing ID:", parsedUser);
          alert("User ID not found. Please log in again.");
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    } else {
      console.warn("No user found in localStorage.");
    }


    const fetchConsultants = async () => {
      try {
        const response = await axios.get("http://localhost:7777/api/consultants");
        setConsultants(response.data);
      } catch (error) {
        console.error("Error fetching consultants:", error);
      }
    };

    fetchConsultants();
  }, []);

  const handleRequest = async (consultantId) => {
    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    try {
      const token = localStorage.getItem("token"); 
      const response = await axios.post(
        "http://localhost:7777/api/consultants/request",
        {
          user_id: userId,
          consultant_id: consultantId,
          status: "pending",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        alert("Consultation request sent successfully!");
      }
    } catch (error) {
      console.error("Error sending consultation request:", error);
      alert("Failed to send request. Please try again.");
    }
  };

  return (
    <div className="">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Available Consultants</h1>

      {consultants.length === 0 ? (
        <p className="text-gray-600">No consultants available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {consultants.map((consultant) => (
            <div key={consultant.id} className="p-4 bg-white shadow-md rounded-lg">
              <h2 className="text-lg font-semibold">{consultant.name}</h2>
              {consultant.specialization && (
                <p className="text-gray-600">Specialization: {consultant.specialization}</p>
              )}
              {consultant.experience && (
                <p className="text-gray-600">Experience: {consultant.experience} years</p>
              )}
              <button
                onClick={() => handleRequest(consultant.id)}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Request Consultation
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultantRequest ;