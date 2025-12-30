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
        message: `✗ Too short (min ${USERNAME_MIN})`,
        className: 'text-red-600 font-medium',
      });
      return;
    }

    if (u.length > USERNAME_MAX) {
      setUsernameStatus({
        checking: false,
        available: false,
        message: `✗ Too long (max ${USERNAME_MAX})`,
        className: 'text-red-600 font-medium',
      });
      return;
    }

    if (!USERNAME_REGEX.test(u)) {
      setUsernameStatus({
        checking: false,
        available: false,
        message: '✗ Invalid (letters, numbers, _ only)',
        className: 'text-red-600 font-medium',
      });
      return;
    }

    setUsernameStatus(prev => ({ ...prev, checking: true, message: 'Checking…' }));

    // Simulating API call
    setTimeout(() => {
      const isAvailable = u.toLowerCase() !== 'admin' && u.toLowerCase() !== 'test';
      setUsernameStatus({
        checking: false,
        available: isAvailable,
        message: isAvailable ? '✓ Available' : '✗ Taken',
        className: isAvailable ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium',
      });
    }, 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-fill contact email
      if (name === 'email' && !isContactEmailDirty) {
        newData.contactEmail = value;
      }
      
      return newData;
    });

    if (name === 'username') {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => checkUsername(value.trim()), 350);
    }

    if (name === 'contactEmail') {
      setIsContactEmailDirty(value.trim().length > 0);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
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
    if (/[a-z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    
    const levels = ['Very weak', 'Weak', 'Okay', 'Good', 'Strong', 'Very strong'];
    const colors = ['text-red-600', 'text-orange-600', 'text-yellow-600', 'text-blue-600', 'text-indigo-600', 'text-emerald-600'];
    
    setPasswordStats(prev => ({
      ...prev,
      strength: `Strength: ${levels[Math.min(score, 5)]}`,
      strengthClass: colors[Math.min(score, 5)]
    }));
  }, [formData.password]);

  // Password match logic
  useEffect(() => {
    const p1 = formData.password;
    const p2 = formData.passwordConfirm;
    
    if (!p2) {
      setPasswordStats(prev => ({ ...prev, matchMessage: '', matchClass: '' }));
      return;
    }
    
    if (p1 === p2 && p1.length >= 8) {
      setPasswordStats(prev => ({
        ...prev,
        matchMessage: '✓ Passwords match',
        matchClass: 'text-emerald-600 font-medium'
      }));
    } else if (p1 === p2) {
      setPasswordStats(prev => ({
        ...prev,
        matchMessage: '✓ Passwords match (too short)',
        matchClass: 'text-yellow-600 font-medium'
      }));
    } else {
      setPasswordStats(prev => ({
        ...prev,
        matchMessage: '✗ Passwords don’t match',
        matchClass: 'text-red-600 font-medium'
      }));
    }
  }, [formData.password, formData.passwordConfirm]);

  // Form validation for button state
  useEffect(() => {
    const validateEmail = (v: string) => v.length >= 5 && v.includes('@') && v.includes('.') && !v.endsWith('.');
    
    const { username, firstName, email, password, passwordConfirm } = formData;
    let reason = '';
    
    if (!username.trim()) reason = 'Enter username';
    else if (usernameStatus.checking) reason = 'Checking username...';
    else if (!usernameStatus.available) reason = 'Choose another username';
    else if (!firstName.trim()) reason = 'Enter first name';
    else if (!email.trim()) reason = 'Enter email';
    else if (!validateEmail(email)) reason = 'Enter valid email';
    else if (!password) reason = 'Enter password';
    else if (password.length < 8) reason = 'Password too short';
    else if (!passwordConfirm) reason = 'Confirm password';
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
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 my-4 sm:px-6 lg:px-8 z-0 relative">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6 text-center">Create Your Client Account</h1>
          <form onSubmit={handleSubmit} className="space-y-5 bg-white border rounded-lg p-6 shadow-sm">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent pr-24"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                />
                <span className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs ${usernameStatus.className}`}>
                  {usernameStatus.message}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First name *</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                id="bio"
                name="bio"
                rows={1}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                placeholder="Write a short bio about yourself…"
                value={formData.bio}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500 mt-1">Keep it short and catchy. This will appear on your public profile.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="example@email.com"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">Contact email</label>
                <input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-gray-500 mt-1">Your contact email is public.</p>
              </div>
            </div>
            
            <div>
              <label htmlFor="profile_image" className="block text-sm font-medium text-gray-700 mb-1">Profile image (optional)</label>
              <input
                id="profile_image"
                name="profile_image"
                type="file"
                accept="image/*"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                onChange={handleImageChange}
              />
            </div>
            
            {imagePreview && (
              <div id="imagePreview" className="mt-2">
                <img src={imagePreview} className="w-24 h-24 rounded-full object-cover border" alt="Preview" />
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <p className={`text-xs mt-1 ${passwordStats.strengthClass}`}>{passwordStats.strength}</p>
              </div>
              <div>
                <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1">Confirm password *</label>
                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                />
                <p className={`text-xs mt-1 ${passwordStats.matchClass}`}>{passwordStats.matchMessage}</p>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full px-4 py-2 rounded-md bg-black text-white font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isButtonDisabled}
            >
              {buttonText}
            </button>
          </form>
          
          <p className="text-sm text-gray-600 mt-4 text-center">
            Prefer an influencer account?{' '}
            <Link className="text-black underline font-medium hover:no-underline" to="/accounts/signup/influencer">
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