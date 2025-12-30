"use client";

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HireModal from '@/components/HireModal';
import { featuredProfiles } from '@/data/featuredProfiles';
import { BadgeCheck, MapPin, Globe, Mail, Instagram, Youtube, Twitter, ExternalLink } from 'lucide-react';

const CreatorProfile = () => {
  const { handle } = useParams();
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const decodedHandle = handle?.startsWith('@') ? handle : `@${handle}`;
  const profile = featuredProfiles.find(p => p.profileLink === decodedHandle);

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col pt-20 bg-gray-50">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Profile not found</h1>
            <p className="text-gray-500 mb-4">The creator you are looking for doesn't exist.</p>
            <Link to="/" className="px-6 py-2 bg-black text-white rounded-xl font-bold">Return Home</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col antialiased pt-16 md:pt-20 bg-gray-50 text-gray-900">
      <Header />
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm mb-8">
          <div className={`h-32 md:h-48 ${profile.platformColorClass} opacity-80`}></div>
          <div className="px-6 pb-8 relative">
            <div className="flex flex-col md:flex-row md:items-end -mt-12 md:-mt-16 gap-4 mb-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
                <img src={profile.profileImage} alt={profile.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 md:mb-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold">{profile.name}</h1>
                  {profile.isVerified && <BadgeCheck className="w-6 h-6 text-blue-500" />}
                </div>
                <p className="text-gray-500 font-medium">{profile.profileLink}</p>
              </div>
              <div className="flex gap-2 md:mb-2">
                <button 
                  onClick={() => setIsHireModalOpen(true)}
                  className="px-6 py-2.5 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg active:scale-95"
                >
                  Hire Creator
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="font-medium">{profile.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Globe className="w-5 h-5 text-gray-400" />
                <span className="font-medium">{profile.category}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Active & Response Ready</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Professional {profile.category} creator based in {profile.location}. 
                Specializing in {profile.contentType} content with a total reach of over {profile.followers} on {profile.platformLabel}.
                I focus on creating high-quality, authentic content that resonates with my community.
              </p>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Key Performance Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-5 bg-gray-50 rounded-2xl text-center">
                  <div className="text-3xl font-extrabold text-black">{profile.followers}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Total Reach</div>
                </div>
                <div className="p-5 bg-gray-50 rounded-2xl text-center">
                  <div className="text-3xl font-extrabold text-black">{profile.startPrice}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Base Rate</div>
                </div>
                <div className="p-5 bg-gray-50 rounded-2xl text-center">
                  <div className="text-3xl font-extrabold text-black">4.8%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Engagement</div>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Verified Channels</h2>
              <div className="space-y-3">
                <a href={profile.socialLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${profile.platformColorClass} text-white shadow-sm`}>
                       {profile.platform === 'instagram' && <Instagram size={20} />}
                       {profile.platform === 'youtube' && <Youtube size={20} />}
                       {profile.platform === 'twitter' && <Twitter size={20} />}
                       {!['instagram', 'youtube', 'twitter'].includes(profile.platform) && <ExternalLink size={20} />}
                    </div>
                    <div>
                      <div className="font-bold">{profile.platformLabel}</div>
                      <div className="text-xs text-gray-500">Primary Channel</div>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-gray-300 group-hover:text-black transition-colors" />
                </a>
              </div>
            </section>

            <section className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Available Ad Slots</h2>
              <div className="flex flex-wrap gap-2">
                {profile.availableSpaces.map((space, i) => (
                  <span key={i} className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-semibold text-gray-700">
                    {space.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />

      <HireModal 
        isOpen={isHireModalOpen} 
        onClose={() => setIsHireModalOpen(false)} 
        creatorName={profile.name} 
      />
    </div>
  );
};

export default CreatorProfile;