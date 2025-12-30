"use client";

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      showError(error.message);
      setIsLoading(false);
    } else {
      showSuccess("Welcome back!");
      // Check user role for redirect
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user?.id)
        .single();
      
      if (profile?.role === 'influencer') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col antialiased pt-16 md:pt-20 bg-gray-100 text-gray-900">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 my-4 sm:px-6 lg:px-8 z-0 relative flex items-center justify-center">
        <div className="max-w-sm mx-auto w-full">
          <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4 bg-white border rounded-lg p-5 shadow-sm">
            <div>
              <label htmlFor="login_email" className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                id="login_email"
                type="email"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black outline-none"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="login_pass" className="block text-sm text-gray-700 mb-1">Password</label>
              <input
                id="login_pass"
                type="password"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black outline-none"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-md bg-black text-white font-bold disabled:opacity-60 transition-all hover:bg-gray-800"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Don't have an account?{' '}
            <Link to="/accounts/signup" className="text-black underline">Sign up</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;