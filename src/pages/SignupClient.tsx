"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { Loader2 } from 'lucide-react';

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const USERNAME_MIN = 5;
const USERNAME_MAX = 30;

const SignupClient = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
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
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreviewUrl, setProfileImagePreviewUrl] = useState<string | null>(null);

  const [usernameStatus, setUsernameStatus] = useState({
    checking: false,
    available: false,
    message: '',
    className: 'text-gray-600',
  });
  const [displayNameDirty, setDisplayNameDirty] = useState(false);
  const [contactEmailDirty, setContactEmailDirty] = useState(false);
  const [passwordHint, setPasswordHint] = useState('8+ characters with letters, numbers, and symbols');
  const [passwordHintClass, setPasswordHintClass] = useState('text-xs mt-1 text-gray-500');
  const [passwordMatch, setPasswordMatch] = useState('');
  const [passwordMatchClass, setPasswordMatchClass] = useState('text-xs mt-1');

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const checkUsernameAvailability = useCallback(async (u: string) => {
    setUsernameStatus(prev => ({ ...prev, checking: true, message: 'Checking…', className: 'text-gray-600' }));
    
    if (!u) {
      setUsernameStatus({ checking: false, available: false, message: '', className: 'text-gray-600' });
      return false;
    }

    if (u.length < USERNAME_MIN) {
      setUsernameStatus({ checking: false, available: false, message: `✗ Too short (min ${USERNAME_MIN})`, className: 'text-xs font-medium text-red-600' });
      return false;
    }
    if (u.length > USERNAME_MAX) {
      setUsernameStatus({ checking: false, available: false, message: `✗ Too long (max ${USERNAME_MAX})`, className: 'text-xs font-medium text-red-600' });
      return false;
    }
    if (!USERNAME_REGEX.test(u)) {
      setUsernameStatus({ checking: false, available: false, message: '✗ Invalid (letters, numbers, _ only)', className: 'text-xs font-medium text-red-600' });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', u.toLowerCase())
        .maybeSingle();

      if (error) {
        // If error (likely due to RLS permissions), assume available to allow signup
        setUsernameStatus({
          checking: false,
          available: true,
          message: '✓ Assuming available',
          className: 'text-xs font-medium text-emerald-600',
        });
        return true;
      }

      const isAvailable = !data;
      setUsernameStatus({
        checking: false,
        available: isAvailable,
        message: isAvailable ? '✓ Available' : '✗ Taken',
        className: isAvailable ? 'text-xs font-medium text-emerald-600' : 'text-xs font-medium text-red-600',
      });
      return isAvailable;
    } catch (e) {
      setUsernameStatus({ checking: false, available: true, message: '✓ Assuming available', className: 'text-xs font-medium text-emerald-600' });
      return true;
    }
  }, []);

  const validateEmail = (v: string) => {
    return v.length >= 5 && v.includes('@') && v.includes('.') && !v.endsWith('.');
  };

  const updateFormValidation = useCallback(() => {
    const { username, firstName, displayName, email, contactEmail, password, passwordConfirm } = formData;

    let reason = '';
    if (!username) reason = 'Enter username';
    else if (usernameStatus.checking) reason = 'Checking username...';
    else if (!usernameStatus.available) reason = usernameStatus.message || 'Choose another username';
    else if (!firstName) reason = 'Enter first name';
    else if (!displayName) reason = 'Enter display name';
    else if (!email) reason = 'Enter email';
    else if (!validateEmail(email)) reason = 'Enter valid email';
    else if (!contactEmail) reason = 'Enter contact email';
    else if (!validateEmail(contactEmail)) reason = 'Enter valid contact email';
    else if (!password) reason = 'Enter password';
    else if (password.length < 8) reason = 'Password too short';
    else if (!passwordConfirm) reason = 'Confirm password';
    else if (password !== passwordConfirm) reason = 'Passwords don’t match';
    
    return reason;
  }, [formData, usernameStatus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'username') {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => checkUsernameAvailability(value.trim()), 350);
    }
  };

  useEffect(() => {
    // Autofill display name
    if (!displayNameDirty) {
      const combined = (formData.firstName.trim() + ' ' + formData.lastName.trim()).trim();
      setFormData(prev => ({ ...prev, displayName: combined }));
    }
  }, [formData.firstName, formData.lastName, displayNameDirty]);

  useEffect(() => {
    // Autofill contact email
    if (!contactEmailDirty) {
      setFormData(prev => ({ ...prev, contactEmail: formData.email.trim() }));
    }
  }, [formData.email, contactEmailDirty]);

  useEffect(() => {
    // Password strength
    const v = formData.password;
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[a-z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    
    const levels = ['Very weak','Weak','Okay','Good','Strong','Very strong'];
    const colors = ['text-red-600','text-orange-600','text-yellow-600','text-blue-600','text-indigo-600','text-emerald-600'];
    setPasswordHint(v ? `Strength: ${levels[Math.min(score, 5)]}` : '8+ characters with letters, numbers, and symbols');
    setPasswordHintClass(`text-xs mt-1 ${colors[Math.min(score, 5)]}`);
  }, [formData.password]);

  useEffect(() => {
    // Password match
    const p1 = formData.password;
    const p2 = formData.passwordConfirm;
    
    if (!p2) {
      setPasswordMatch('');
      setPasswordMatchClass('text-xs mt-1');
      return;
    }
    
    if (p1 === p2 && p1.length >= 8) {
      setPasswordMatch('✓ Passwords match');
      setPasswordMatchClass('text-xs mt-1 text-emerald-600 font-medium');
    } else if (p1 === p2) {
      setPasswordMatch('✓ Passwords match (too short)');
      setPasswordMatchClass('text-xs mt-1 text-yellow-600 font-medium');
    } else {
      setPasswordMatch('✗ Passwords don’t match');
      setPasswordMatchClass('text-xs mt-1 text-red-600 font-medium');
    }
  }, [formData.password, formData.passwordConfirm]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setProfileImageFile(null);
      setProfileImagePreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationReason = updateFormValidation();
    if (validationReason) {
      showError(validationReason);
      return;
    }

    setIsLoading(true);
    
    // First, sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          username: formData.username.toLowerCase(),
          first_name: formData.firstName,
          last_name: formData.lastName,
          display_name: formData.displayName || `${formData.firstName} ${formData.lastName}`,
          role: 'client', // Explicitly set role to 'client'
          bio: formData.bio,
          contact_email: formData.contactEmail,
          phone: formData.phone,
          address: formData.address,
          booking_url: formData.bookingUrl,
        }
      }
    });

    if (authError) {
      showError(authError.message);
      setIsLoading(false);
      return;
    }

    if (!authData.user) {
      showError("Signup failed: User not created");
      setIsLoading(false);
      return;
    }

    // Insert profile data
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        username: formData.username.toLowerCase(),
        display_name: formData.displayName,
        email: formData.email,
        role: 'client',
        bio: formData.bio,
      });

    if (profileError) {
      showError("Signup failed: " + profileError.message);
      setIsLoading(false);
      return;
    }

    // If signup is successful, handle profile image upload (if any)
    let avatarUrl: string | null = null;
    if (profileImageFile && authData.user) {
      const fileExt = profileImageFile.name.split('.').pop();
      const fileName = `${authData.user.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars') // Assuming you have a 'avatars' bucket in Supabase Storage
        .upload(filePath, profileImageFile, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error("Error uploading avatar:", uploadError);
        showError("Account created, but failed to upload profile image: " + uploadError.message);
      } else {
        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        avatarUrl = publicUrlData.publicUrl;

        // Update the profile with the avatar URL
        const { error: updateProfileError } = await supabase
          .from('profiles')
          .update({ avatar_url: avatarUrl })
          .eq('id', authData.user.id);

        if (updateProfileError) {
          console.error("Error updating profile with avatar URL:", updateProfileError);
          showError("Account created, but failed to update profile with avatar URL: " + updateProfileError.message);
        }
      }
    }

    showSuccess("Account created! Check your email for verification.");
    navigate('/accounts/login');
    setIsLoading(false);
  };

  const formValidationReason = updateFormValidation();
  const isSubmitDisabled = !!formValidationReason || isLoading;

  return (
    <div className="min-h-screen flex flex-col antialiased pt-16 md:pt-20 bg-gray-100 text-gray-900">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 my-8 sm:px-6 lg:px-8 z-0 relative">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6 text-center">Create Your Client Profile</h1>
          
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
                <span className={`absolute right-2 top-1/2 -translate-y-1/2 ${usernameStatus.className}`}>
                  {usernameStatus.message}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First name / Brand Name *</label>
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
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">Display name *</label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
                placeholder="Shown on your public profile"
                value={formData.displayName}
                onChange={(e) => {
                  setDisplayNameDirty(true);
                  handleInputChange(e);
                }}
              />
              <p className="text-xs text-gray-500 mt-1">Auto-generated from first and last name if left empty.</p>
            </div>
            
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                id="bio"
                name="bio"
                rows={1}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                placeholder="Write a short bio about your brand…"
                value={formData.bio}
                onChange={handleInputChange}
              ></textarea>
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
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">Contact email *</label>
                <input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                  placeholder="For business inquiries"
                  value={formData.contactEmail}
                  onChange={(e) => {
                    setContactEmailDirty(true);
                    handleInputChange(e);
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">Auto-filled from email.</p>
              </div>
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Optional"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label htmlFor="bookingUrl" className="block text-sm font-medium text-gray-700 mb-1">Website / Booking URL</label>
              <input
                id="bookingUrl"
                name="bookingUrl"
                type="url"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="https://your-website.com"
                value={formData.bookingUrl}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500 mt-1">Link to your company website or booking page (Optional)</p>
            </div>
            
            <div>
              <label htmlFor="profile_image" className="block text-sm font-medium text-gray-700 mb-1">Profile image</label>
              <input
                id="profile_image"
                name="profile_image"
                type="file"
                accept="image/*"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                onChange={handleImageChange}
              />
            </div>
            {profileImagePreviewUrl && (
              <div className="mt-2">
                <img src={profileImagePreviewUrl} className="w-24 h-24 rounded-full object-cover border" alt="Preview" />
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
                <p className={passwordHintClass}>{passwordHint}</p>
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
                <p className={passwordMatchClass}>{passwordMatch}</p>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full px-4 py-2 rounded-md bg-black text-white font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isSubmitDisabled}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                formValidationReason || 'Create Client Account'
              )}
            </button>
          </form>
          
          <p className="text-sm text-gray-600 mt-4 text-center">
            Prefer an influencer account?
            <Link className="text-black underline font-medium hover:no-underline" to="/accounts/signup/influencer">Sign up as Influencer</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignupClient;