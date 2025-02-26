import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../src/components/NavBar";

const ConsultantRequest = () => {
  const [consultants, setConsultants] = useState([]);

  useEffect(() => {
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

  return (
    <div className="">
      <Navbar />
      <h1 className="text-3xl font-bold text-green-700 text-center mb-6">Available Consultants</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {consultants.map((consultant) => (
          <div key={consultant.id} className="p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-semibold">{consultant.name}</h2>
            <p className="text-gray-600">Specialization: {consultant.specialization}</p>
            <button className="mt-3 px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800">
              Request Consultation
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsultantRequest;
