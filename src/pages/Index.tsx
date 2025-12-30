"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import LogoMarquee from '@/components/LogoMarquee';
import SocialCard from '@/components/SocialCard';
import DetailsModal from '@/components/DetailsModal';
import FeaturesSection from '@/components/FeaturesSection';
import CallToActionSection from '@/components/CallToActionSection';
import Footer from '@/components/Footer';
import { useFeaturedProfiles } from '@/hooks/useProfilesData';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { data: profiles, isLoading } = useFeaturedProfiles();
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  const handleOpenDetailsModal = (profileId: string) => {
    setSelectedProfileId(profileId);
  };

  const handleCloseDetailsModal = () => {
    setSelectedProfileId(null);
  };

  const selectedProfile = profiles?.find(p => p.id === selectedProfileId);

  return (
    <div className="min-h-screen flex flex-col antialiased pt-16 md:pt-20 bg-gray-100 text-gray-900">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 my-4 sm:px-6 lg:px-8 z-0 relative">
        <div className="text-gray-900 antialiased -mt-6">
          <HeroSection />
          <LogoMarquee />

          {/* FEATURED PROFILES */}
          <section className="py-8 md:py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Featured Profiles</h2>
                <p className="text-gray-500 mt-1">Verified creators ready for collaboration.</p>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <div id="creators-scroll" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profiles && profiles.length > 0 ? (
                    profiles.map((profile) => (
                      <SocialCard 
                        key={profile.id} 
                        profile={{
                          ...profile,
                          platformLabel: profile.platform_label,
                          platformColorClass: profile.platform_color_class,
                          profileImage: profile.avatar_url || '/placeholder.svg',
                          isVerified: profile.is_verified,
                          followers: profile.followers_count,
                          startPrice: profile.start_price,
                          availableSpaces: profile.available_spaces || [],
                          profileLink: `@${profile.username}`,
                          socialLink: profile.social_link || '#'
                        }} 
                        onOpenDetails={handleOpenDetailsModal} 
                      />
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-gray-300">
                      <p className="text-gray-500">No featured profiles found.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          <FeaturesSection />
          <CallToActionSection />
        </div>
      </main>
      <Footer />

      {selectedProfile && (
        <DetailsModal
          profile={{
            ...selectedProfile,
            platformLabel: selectedProfile.platform_label,
            platformColorClass: selectedProfile.platform_color_class,
            profileImage: selectedProfile.avatar_url || '/placeholder.svg',
            isVerified: selectedProfile.is_verified,
            followers: selectedProfile.followers_count,
            startPrice: selectedProfile.start_price,
            availableSpaces: selectedProfile.available_spaces || [],
            profileLink: `@${selectedProfile.username}`,
            socialLink: selectedProfile.social_link || '#'
          }}
          isOpen={!!selectedProfileId}
          onClose={handleCloseDetailsModal}
        />
      )}
    </div>
  );
};

export default Index;