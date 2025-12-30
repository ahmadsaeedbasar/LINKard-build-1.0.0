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
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-gray-500 mt-2">Log in to your LINKard account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
            <div>
              <label htmlFor="login_email" className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input
                id="login_email"
                type="email"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
                required
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="login_pass" className="block text-sm font-bold text-gray-700">Password</label>
                <Link to="/forgot-password" usage="sm" className="text-xs font-bold text-gray-400 hover:text-black transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <input
                id="login_pass"
                type="password"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-60"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
          
          <p className="text-sm text-gray-500 mt-8 text-center font-medium">
            Don't have an account?{' '}
            <Link to="/accounts/signup" className="text-black underline hover:no-underline font-bold">Sign up</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;