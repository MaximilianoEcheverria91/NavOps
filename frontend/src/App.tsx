import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login/Login';
import { DashboardAdmin } from './pages/Dashboard/DashboardAdmin';
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword';
import { VerifyToken } from './pages/VerifyToken/VerifyToken';
import { ResetPassword } from './pages/ResetPassword/ResetPassword';
//import { MainLayout } from './layouts/MainLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardAdmin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-code" element={<VerifyToken />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
