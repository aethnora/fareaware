import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer'; // <-- Imported the Footer
import HomePage from './pages/HomePage';
import ManualEntryPage from './pages/ManualEntryPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PricingPage from './pages/PricingPage';
import AccountPage from './pages/AccountPage';
import Dashboard from './components/dashboard/Dashboard';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/pricing" element={<PrivateRoute><PricingPage /></PrivateRoute>} />
          <Route path="/manual-entry" element={<PrivateRoute><ManualEntryPage /></PrivateRoute>} />
          <Route path="/account" element={<PrivateRoute><AccountPage /></PrivateRoute>} />

          {/* Fallback Route */}
          <Route path="*" element={<div className="p-8 text-center"><h2>404: Page Not Found</h2></div>} />
        </Routes>
      </main>
      
      {/* This comment is a trivial change for your Git commit */}
      <Footer /> 
    </div>
  );
}

export default App;