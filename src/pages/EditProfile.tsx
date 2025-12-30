"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { showSuccess } from '@/utils/toast';
import { Save, ChevronLeft } from 'lucide-react';

const EditProfile = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    displayName: profile?.display_name || user?.user_metadata?.display_name || '',
    bio: profile?.bio || 'Professional creator specializing in authentic content storytelling.',
    category: profile?.category || 'Lifestyle',
    location: profile?.location || 'United States',
    startPrice: profile?.start_price || '$350',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess("Profile updated successfully!");
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col antialiased pt-16 md:pt-20 bg-gray-50 text-gray-900">
      <Header />
      <main className="flex-grow w-full max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-black mb-6 transition-colors font-semibold"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <p className="text-gray-500">Update your public information and pricing.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Display Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none"
                  value={formData.displayName}
                  onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option>Lifestyle</option>
                  <option>Technology</option>
                  <option>Travel</option>
                  <option>Gaming</option>
                  <option>Finance</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none h-32 resize-none"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Base Price (USD)</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none"
                  value={formData.startPrice}
                  onChange={(e) => setFormData({...formData, startPrice: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditProfile;