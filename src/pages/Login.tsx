"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [buttonText, setButtonText] = useState('Enter credentials');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    let reason = '';
    if (!username.trim()) {
      reason = 'Enter username/email';
    } else if (!password) {
      reason = 'Enter password';
    }
    setIsButtonDisabled(!!reason);
    setButtonText(reason || 'Login');
  }, [username, password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the username and password to your authentication API
    console.log('Attempting to log in with:', { username, password });
    // For now, we'll just simulate a successful login or show an error
    // In a real app, you'd handle API calls, loading states, and error messages here.
    alert('Login functionality is not implemented in this demo.');
  };

  return (
    <div className="min-h-screen flex flex-col antialiased pt-16 md:pt-20 bg-gray-100 text-gray-900">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 my-4 sm:px-6 lg:px-8 z-0 relative flex items-center justify-center">
        <div className="max-w-sm mx-auto w-full">
          <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4 bg-white border rounded-lg p-5">
            <div>
              <label htmlFor="login_user" className="block text-sm text-gray-700 mb-1">Username or Email</label>
              <input
                id="login_user"
                name="username"
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="login_pass" className="block text-sm text-gray-700 mb-1">Password</label>
              <input
                id="login_pass"
                name="password"
                type="password"
                className="w-full px-3 py-2 border rounded-md"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 rounded-md bg-black text-white disabled:opacity-60 transition-opacity"
              disabled={isButtonDisabled}
            >
              {buttonText}
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