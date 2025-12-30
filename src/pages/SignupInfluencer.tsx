"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { showSuccess } from '@/utils/toast';

const SignupInfluencer = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    displayName: '',
    bio: '',
    email: '',
    contactEmail: '',
    phone: '',
    address: '',
    bookingUrl: '',
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
  const [isDisplayNameDirty, setIsDisplayNameDirty] = useState(false);
  const [isContactEmailDirty, setIsContactEmailDirty] = useState(false);
  const [buttonText, setButtonText] = useState('Create Influencer Account');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Constants
  const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
  const USERNAME_MIN = 5;
  const USERNAME_MAX = 30;

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
      
      if ((name === 'firstName' || name === 'lastName') && !isDisplayNameDirty) {
        newData.displayName = (newData.firstName + ' ' + newData.lastName).trim();
      }

      if (name === 'email' && !isContactEmailDirty) {
        newData.contactEmail = value;
      }
      
      return newData;
    });

    if (name === 'username') {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => checkUsername(value.trim()), 350);
    }

    if (name === 'displayName') setIsDisplayNameDirty(value.trim().length > 0);
    if (name === 'contactEmail') setIsContactEmailDirty(value.trim().length > 0);
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

  useEffect(() => {
    const v = formData.password;
    if (!v) {
      setPasswordStats(prev => ({ ...prev, strength: '8+ characters with letters, numbers, and symbols', strengthClass: 'text-gray-500' }));
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
    setPasswordStats(prev => ({ ...prev, strength: `Strength: ${levels[Math.min(score, 5)]}`, strengthClass: colors[Math.min(score, 5)] }));
  }, [formData.password]);

  useEffect(() => {
    const { password: p1, passwordConfirm: p2 } = formData;
    if (!p2) { setPasswordStats(prev => ({ ...prev, matchMessage: '', matchClass: '' })); return; }
    if (p1 === p2 && p1.length >= 8) {
      setPasswordStats(prev => ({ ...prev, matchMessage: '✓ Passwords match', matchClass: 'text-emerald-600 font-medium' }));
    } else if (p1 === p2) {
      setPasswordStats(prev => ({ ...prev, matchMessage: '✓ Passwords match (too short)', matchClass: 'text-yellow-600 font-medium' }));
    } else {
      setPasswordStats(prev => ({ ...prev, matchMessage: '✗ Passwords don’t match', matchClass: 'text-red-600 font-medium' }));
    }
  }, [formData.password, formData.passwordConfirm]);

  useEffect(() => {
    const validateEmail = (v: string) => v.length >= 5 && v.includes('@') && v.includes('.') && !v.endsWith('.');
    const { username, firstName, displayName, email, contactEmail, password, passwordConfirm } = formData;
    let reason = '';
    if (!username.trim()) reason = 'Enter username';
    else if (usernameStatus.checking) reason = 'Checking username...';
    else if (!usernameStatus.available) reason = 'Choose another username';
    else if (!firstName.trim()) reason = 'Enter first name';
    else if (!displayName.trim()) reason = 'Enter display name';
    else if (!email.trim()) reason = 'Enter email';
    else if (!validateEmail(email)) reason = 'Enter valid email';
    else if (!contactEmail.trim()) reason = 'Enter contact email';
    else if (!validateEmail(contactEmail)) reason = 'Enter valid contact email';
    else if (!password) reason = 'Enter password';
    else if (password.length < 8) reason = 'Password too short';
    else if (!passwordConfirm) reason = 'Confirm password';
    else if (password !== passwordConfirm) reason = 'Passwords don’t match';
    
    setIsButtonDisabled(!!reason);
    setButtonText(reason || 'Create Influencer Account');
  }, [formData, usernameStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isButtonDisabled) return;
    showSuccess("Influencer account created successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col antialiased pt-16 md:pt-20 bg-gray-100 text-gray-900">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 my-8 sm:px-6 lg:px-8 z-0 relative">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center">Join as an Influencer</h1>
          <p className="text-gray-500 text-center mb-10 font-medium">Create your professional profile and start connecting with top brands.</p>
          
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
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                    <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold ${usernameStatus.className}`}>
                      {usernameStatus.message}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="displayName" className="block text-sm font-bold text-gray-700 mb-2">Display Name *</label>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
                    required
                    placeholder="John Doe"
                    value={formData.displayName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div>
                  <label htmlFor="lastName" className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-50">
              <h2 className="text-xl font-bold px-1">Profile Details</h2>
              <div>
                <label htmlFor="bio" className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all resize-none"
                  placeholder="Share what makes your content unique..."
                  value={formData.bio}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Account Email *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-bold text-gray-700 mb-2">Business Contact Email *</label>
                  <input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
                    required
                    placeholder="bookings@john.com"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-50">
              <h2 className="text-xl font-bold px-1">Security</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <p className={`text-[11px] mt-2 ml-1 font-bold uppercase tracking-tight ${passwordStats.matchClass}`}>{passwordStats.matchMessage}</p>
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
            Looking to hire?{' '}
            <Link className="text-black underline hover:no-underline font-bold" to="/accounts/signup/client">
              Sign up as Client
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignupInfluencer;