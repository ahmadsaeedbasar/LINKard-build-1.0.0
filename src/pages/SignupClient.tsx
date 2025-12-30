"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

const SignupClient = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) {
      showError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          username: formData.username.toLowerCase(),
          first_name: formData.firstName,
          display_name: formData.firstName,
          role: 'client'
        }
      }
    });

    if (error) {
      showError(error.message);
      setIsLoading(false);
    } else {
      showSuccess("Account created! Check your email for verification.");
      navigate('/accounts/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col antialiased pt-16 md:pt-20 bg-gray-100 text-gray-900">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 my-8 sm:px-6 lg:px-8 z-0 relative">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center">Join as a Client</h1>
          <p className="text-gray-500 text-center mb-10 font-medium">Find and hire the perfect influencers for your next campaign.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
            <div className="space-y-4">
              <h2 className="text-xl font-bold px-1">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Username *</label>
                  <input
                    name="username"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">First Name / Brand Name *</label>
                  <input
                    name="firstName"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-50">
              <h2 className="text-xl font-bold px-1">Contact & Security</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                  <input
                    name="email"
                    type="email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Password *</label>
                  <input
                    name="password"
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password *</label>
                  <input
                    name="passwordConfirm"
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
                    required
                    value={formData.passwordConfirm}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Client Account"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignupClient;