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
import { featuredProfiles } from '@/data/featuredProfiles';

const Index = () => {
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  const handleOpenDetailsModal = (profileId: string) => {
    setOpenModalId(profileId);
  };

  const handleCloseDetailsModal = () => {
    setOpenModalId(null);
  };

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

              <div id="creators-scroll" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProfiles.map((profile) => (
                  <SocialCard key={profile.id} profile={profile} onOpenDetails={handleOpenDetailsModal} />
                ))}
              </div>
            </div>
          </section>

          <FeaturesSection />
          <CallToActionSection />
        </div>
      </main>
      <Footer />

      {featuredProfiles.map((profile) => (
        <DetailsModal
          key={profile.id}
          profile={profile}
          isOpen={openModalId === profile.id}
          onClose={handleCloseDetailsModal}
        />
      ))}
    </div>
  );
};

export default Index;