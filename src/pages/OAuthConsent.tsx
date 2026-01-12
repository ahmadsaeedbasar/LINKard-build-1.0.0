"use client";

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const OAuthConsent = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Redirect to dashboard or home based on role
        // For simplicity, redirect to home
        navigate('/');
      } else {
        // If not authenticated, redirect to login
        navigate('/accounts/login');
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black mx-auto"></div>
        <p className="mt-4 text-lg">Processing OAuth...</p>
      </div>
    </div>
  );
};

export default OAuthConsent;