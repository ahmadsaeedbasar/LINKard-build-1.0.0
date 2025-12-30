"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { showSuccess } from '@/utils/toast';

const SignupClient = () => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    companyName: '',
    password: '',
  });
  const [buttonText, setButtonText] = useState('Create account');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const { email, fullName, companyName, password } = formData;
    let reason = '';
    if (!email.trim()) reason = 'Enter email';
    else if (!fullName.trim()) reason = 'Enter contact name';
    else if (!companyName.trim()) reason = 'Enter company name';
    else if (password.length < 6) reason = 'Password too short (min 6)';
    
    setIsButtonDisabled(!!reason);
    setButtonText(reason || 'Sign Up');
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess("Client account simulated! Welcome to ProOmo.");
  };

  return (
    <div className="min-h-screen flex flex-col antialiased pt-16 md:pt-20 bg-gray-100 text-gray-900">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 my-4 sm:px-6 lg:px-8 z-0 relative flex items-center justify-center">
        <div className="max-w-sm mx-auto w-full">
          <h1 className="text-2xl font-semibold mb-2 text-center">Join as a Client</h1>
          <p className="text-gray-600 text-center mb-6">Find and hire the perfect talent for your brand.</p>
          <form onSubmit={handleSubmit} className="space-y-4 bg-white border rounded-lg p-5 shadow-sm">
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-medium">Work Email</label>
              <input
                name="email"
                type="email"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none transition-all"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-medium">Full Name</label>
              <input
                name="fullName"
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none transition-all"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-medium">Company Name</label>
              <input
                name="companyName"
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none transition-all"
                required
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Acme Corp"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-medium">Password</label>
              <input
                name="password"
                type="password"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none transition-all"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 mt-2 rounded-md bg-black text-white font-bold disabled:opacity-50 transition-all hover:bg-gray-800"
              disabled={isButtonDisabled}
            >
              {buttonText}
            </button>
          </form>
          <p className="text-sm text-gray-600 mt-4 text-center">
            <Link to="/accounts/signup" className="text-gray-500 hover:text-black transition-colors">← Back to selection</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignupClient;