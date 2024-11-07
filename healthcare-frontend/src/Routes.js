import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PatientVisits from './components/Patient/PatientVisits';
import FinanceVisitManagement from './components/Finance/financeManage';
import DoctorVisitsAndActions from './components/Doctor/manageVisit';

import { isAuthenticated, getUserType } from './utils/auth';

const ProtectedRoute = ({ children, userType }) => {
  const loggedInUserType = getUserType();
  return isAuthenticated() && loggedInUserType === userType ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Patient Routes */}
      <Route path="/patient/visits" element={<ProtectedRoute userType="Patient"><PatientVisits /></ProtectedRoute>} />

      {/* Doctor Routes */}
      <Route path="/doctor/visits" element={<ProtectedRoute userType="Doctor"><DoctorVisitsAndActions /></ProtectedRoute>} />

      {/* Finance Routes */}
      <Route path="/finance" element={<ProtectedRoute userType="Finance"><FinanceVisitManagement /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
