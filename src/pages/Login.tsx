"use client";

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const updateButtonState = () => {
    let reason = '';
    if (!usernameOrEmail.trim()) reason = 'Enter username/email';
    else if (!password) reason = 'Enter password';
    return reason;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationReason = updateButtonState();
    if (validationReason) {
      // This case should ideally be prevented by the disabled button, but good for explicit check
      showError(validationReason);
      return;
    }

    setIsLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: usernameOrEmail, // Supabase signInWithPassword uses email
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

  const formValidationReason = updateButtonState();
  const isSubmitDisabled = !!formValidationReason || isLoading;

  return (
    <div className="min-h-screen flex flex-col antialiased pt-16 md:pt-20 bg-gray-100 text-gray-900">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 my-4 sm:px-6 lg:px-8 z-0 relative flex items-center justify-center">
        <div className="max-w-sm mx-auto">
          <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4 bg-white border rounded-lg p-5">
            <div>
              <label htmlFor="login_user" className="block text-sm text-gray-700 mb-1">Username or Email</label>
              <input
                id="login_user"
                name="username"
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="login_pass" className="block text-sm text-gray-700 mb-1">Password</label>
              <input
                id="login_pass"
                name="password"
                type="password"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              id="loginBtn"
              type="submit"
              className="w-full px-4 py-2 rounded-md bg-black text-white disabled:opacity-60"
              disabled={isSubmitDisabled}
            >
              {isLoading ? 'Logging in...' : (formValidationReason || 'Login')}
            </button>
          </form>
          
          <p className="text-sm text-gray-600 mt-4 text-center">
            Don't have an account?{' '}
            <Link className="text-black underline" to="/accounts/signup">Sign up</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;