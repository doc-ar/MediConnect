import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {useSelector } from 'react-redux';
import DashboardPage from './pages/DashboardPage';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Routes>
      {isAuthenticated ? (
        // If authenticated, render the dashboard
        <Route path="/dashboard" element={<DashboardPage />} />
      ) : (
        // If not authenticated, show login/signup pages
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Redirect to login by default */}
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      )}
    </Routes>
  );
}

export default App;
