"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { showSuccess } from '@/utils/toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    username: '',
    password: '',
  });
  const [buttonText, setButtonText] = useState('Create account');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const { email, fullName, username, password } = formData;
    let reason = '';
    if (!email.trim()) reason = 'Enter email';
    else if (!fullName.trim()) reason = 'Enter full name';
    else if (!username.trim()) reason = 'Choose username';
    else if (password.length < 6) reason = 'Password too short (min 6)';
    
    setIsButtonDisabled(!!reason);
    setButtonText(reason || 'Sign Up');
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess("Account creation simulated! Welcome to LINKard.");
  };

  return (
    <div className="min-h-screen flex flex-col antialiased pt-16 md:pt-20 bg-gray-100 text-gray-900">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 my-4 sm:px-6 lg:px-8 z-0 relative flex items-center justify-center">
        <div className="max-w-sm mx-auto w-full">
          <h1 className="text-2xl font-semibold mb-6 text-center">Create your account</h1>
          <form onSubmit={handleSubmit} className="space-y-4 bg-white border rounded-lg p-5">
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-medium">Email</label>
              <input
                name="email"
                type="email"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none transition-all"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
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
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-medium">Username</label>
              <input
                name="username"
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none transition-all"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe123"
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
            Already have an account?{' '}
            <Link to="/accounts/login" className="text-black font-bold underline">Log in</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;