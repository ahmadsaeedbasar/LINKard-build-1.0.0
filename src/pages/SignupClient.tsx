"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { showSuccess } from '@/utils/toast';

const SignupClient = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    bio: '',
    email: '',
    contactEmail: '',
    password: '',
    passwordConfirm: '',
  });

  const [usernameStatus, setUsernameStatus] = useState({
    checking: false,
    available: false,
    message: '',
    className: 'text-gray-600',
  });

  const [passwordStats, setPasswordStats] = useState({
    strength: '8+ characters with letters, numbers, and symbols',
    strengthClass: 'text-gray-500',
    matchMessage: '',
    matchClass: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isContactEmailDirty, setIsContactEmailDirty] = useState(false);
  const [buttonText, setButtonText] = useState('Create Client Account');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Username validation constants
  const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
  const USERNAME_MIN = 3;
  const USERNAME_MAX = 30;

  // Mock username check
  const checkUsername = async (u: string) => {
    if (!u) {
      setUsernameStatus({ checking: false, available: false, message: '', className: 'text-gray-600' });
      return;
    }

    if (u.length < USERNAME_MIN) {
      setUsernameStatus({
        checking: false,
        available: false,
        message: `Too short`,
        className: 'text-red-600 font-bold',
      });
      return;
    }

    setUsernameStatus(prev => ({ ...prev, checking: true, message: 'Checking…' }));

    setTimeout(() => {
      const isAvailable = u.toLowerCase() !== 'admin' && u.toLowerCase() !== 'test';
      setUsernameStatus({
        checking: false,
        available: isAvailable,
        message: isAvailable ? '✓ Available' : '✗ Taken',
        className: isAvailable ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold',
      });
    }, 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'email' && !isContactEmailDirty) {
        newData.contactEmail = value;
      }
      return newData;
    });

    if (name === 'username') {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => checkUsername(value.trim()), 350);
    }
  };

  // Password strength logic
  useEffect(() => {
    const v = formData.password;
    if (!v) {
      setPasswordStats(prev => ({ 
        ...prev, 
        strength: '8+ characters with letters, numbers, and symbols', 
        strengthClass: 'text-gray-500' 
      }));
      return;
    }

    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    
    const levels = ['Very weak', 'Weak', 'Okay', 'Good', 'Strong', 'Very strong'];
    const colors = ['text-red-600', 'text-orange-600', 'text-yellow-600', 'text-blue-600', 'text-indigo-600', 'text-emerald-600'];
    
    setPasswordStats(prev => ({
      ...prev,
      strength: `Strength: ${levels[Math.min(score, 5)]}`,
      strengthClass: colors[Math.min(score, 5)]
    }));
  }, [formData.password]);

  useEffect(() => {
    const validateEmail = (v: string) => v.length >= 5 && v.includes('@') && v.includes('.') && !v.endsWith('.');
    const { username, firstName, email, password, passwordConfirm } = formData;
    let reason = '';
    
    if (!username.trim()) reason = 'Enter username';
    else if (usernameStatus.checking) reason = 'Checking username...';
    else if (!usernameStatus.available) reason = 'Choose another username';
    else if (!firstName.trim()) reason = 'Enter first name';
    else if (!email.trim() || !validateEmail(email)) reason = 'Enter valid email';
    else if (password.length < 8) reason = 'Password too short';
    else if (password !== passwordConfirm) reason = 'Passwords don’t match';
    
    setIsButtonDisabled(!!reason);
    setButtonText(reason || 'Create Client Account');
  }, [formData, usernameStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isButtonDisabled) return;
    showSuccess("Client account created successfully!");
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
                  <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-2">Username *</label>
                  <div className="relative">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all pr-24"
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                    <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold ${usernameStatus.className}`}>
                      {usernameStatus.message}
                    </span>
                  </div>
                </div>
                <div>
                  <label htmlFor="firstName" className="block text-sm font-bold text-gray-700 mb-2">First Name *</label>
                  <input
                    id="firstName"
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
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
                    required
                    placeholder="company@brand.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">Password *</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <p className={`text-[11px] mt-2 ml-1 font-bold uppercase tracking-tight ${passwordStats.strengthClass}`}>{passwordStats.strength}</p>
                </div>
                <div>
                  <label htmlFor="passwordConfirm" className="block text-sm font-bold text-gray-700 mb-2">Confirm Password *</label>
                  <input
                    id="passwordConfirm"
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
              className="w-full mt-4 bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isButtonDisabled}
            >
              {buttonText}
            </button>
          </form>
          
          <p className="text-sm text-gray-500 mt-8 text-center font-medium">
            Influencer instead?{' '}
            <Link className="text-black underline hover:no-underline font-bold" to="/accounts/signup/influencer">
              Sign up as Influencer
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignupClient;