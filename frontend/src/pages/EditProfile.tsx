"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';
import { Save, ChevronLeft, Loader2 } from 'lucide-react';

const EditProfile = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    category: 'Lifestyle',
    location: '',
    startPrice: '', // Keep as string for input, convert to number for DB
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.display_name || '',
        bio: profile.bio || '',
        category: profile.category || 'Lifestyle',
        location: profile.location || '',
        startPrice: profile.start_price !== null && profile.start_price !== undefined ? profile.start_price.toString() : '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);

    const parsedStartPrice = formData.startPrice ? parseFloat(formData.startPrice) : null;
    if (formData.startPrice && isNaN(parsedStartPrice as number)) {
      showError("Start price must be a valid number.");
      setIsSaving(false);
      return;
    }

    const { error } = await supabase
      .from('profiles') // Changed to public.profiles
      .update({
        display_name: formData.displayName,
        bio: formData.bio,
        category: formData.category,
        location: formData.location,
        start_price: parsedStartPrice,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    setIsSaving(false);
    
    if (error) {
      showError(error.message);
    } else {
      showSuccess("Profile updated successfully!");
      navigate('/dashboard');
    }
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
                  required
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
                placeholder="Tell brands about yourself..."
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
                  placeholder="e.g. London, UK"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Base Price (USD)</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none"
                  placeholder="e.g. 500.00"
                  value={formData.startPrice}
                  onChange={(e) => setFormData({...formData, startPrice: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditProfile;