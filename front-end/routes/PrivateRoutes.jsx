import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserDashboard from "../src/pages/users/UserDashboard";
import ConsultantDashboard from "../src/pages/consultants/ConsultantDashboard";
import AdminDashboard from "../src/pages/admin/AdminDashboard";
import FinancialSummary from "../src/pages/users/FinancialSummary";
import ConsultantRequests from "../src/pages/users/ConsultantRequests";
import ConsultantSummary from "../src/pages/consultants/ConsultantSummary";
import UserList from "../src/pages/admin/UserList";
import ConsultantList from "../src/pages/admin/ConsultantList";
import ConsultationSummary from "../src/pages/admin/ConsultationSummary";
import ConsultantReq from "../src/pages/consultants/ConsultantReq";

const PrivateRoute = ({ children, allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role || null;

    if (!role) {
        return <Navigate to="/login" />;
    }

    return allowedRoles.includes(role) ? children : <Navigate to="/login" />;
};

const PrivateRoutes = () => {
    return (
        <Routes>
            {/* User Routes */}
            <Route path="/user/dashboard" element={<PrivateRoute allowedRoles={["user"]}><UserDashboard /></PrivateRoute>} />
            <Route path="/user/financial-summary" element={<PrivateRoute allowedRoles={["user"]}><FinancialSummary /></PrivateRoute>} />
            <Route path="/user/take-consultant" element={<PrivateRoute allowedRoles={["user"]}><ConsultantRequests /></PrivateRoute>} />

            {/* Consultant Routes */}
            <Route path="/consultant/dashboard" element={<PrivateRoute allowedRoles={["consultant"]}><ConsultantDashboard /></PrivateRoute>} />
            <Route path="/consultant/requests" element={<PrivateRoute allowedRoles={["consultant"]}><ConsultantReq /></PrivateRoute>} />
            <Route path="/consultant/summary" element={<PrivateRoute allowedRoles={["consultant"]}><ConsultantSummary /></PrivateRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<PrivateRoute allowedRoles={["admin"]}><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/users" element={<PrivateRoute allowedRoles={["admin"]}><UserList /></PrivateRoute>} />
            <Route path="/admin/consultants" element={<PrivateRoute allowedRoles={["admin"]}><ConsultantList /></PrivateRoute>} />
            <Route path="/admin/consultation-summary" element={<PrivateRoute allowedRoles={["admin"]}><ConsultationSummary /></PrivateRoute>} />

            {/* Default Route */}
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
};

export default PrivateRoutes;
