"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import LogoMarquee from '@/components/LogoMarquee';
import SocialCard from '@/components/SocialCard';
import DetailsModal from '@/components/DetailsModal';
import FeaturesSection from '@/components/FeaturesSection';
import CallToActionSection from '@/components/CallToActionSection';
import Footer from '@/components/Footer';
import { featuredProfiles, Profile } from '@/data/featuredProfiles';
import { showError } from '@/utils/toast';

const Search = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialPlatformValue = searchParams.get('pf') || '';

  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  useEffect(() => {
    let currentFilteredProfiles = featuredProfiles;

    if (initialQuery) {
      const lowerCaseQuery = initialQuery.toLowerCase();
      currentFilteredProfiles = currentFilteredProfiles.filter(
        (profile) =>
          profile.category.toLowerCase().includes(lowerCaseQuery) ||
          profile.name.toLowerCase().includes(lowerCaseQuery)
      );
    }

    if (initialPlatformValue) {
      currentFilteredProfiles = currentFilteredProfiles.filter(
        (profile) => profile.platform === initialPlatformValue
      );
    }

    setFilteredProfiles(currentFilteredProfiles);

    if (initialQuery === '' && initialPlatformValue === '') {
      showError("Please enter a search term to find influencers.");
    }
  }, [initialQuery, initialPlatformValue]);

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
        <HeroSection initialQuery={initialQuery} initialPlatformValue={initialPlatformValue} />
        <LogoMarquee />

        {/* SEARCH RESULTS / FEATURED PROFILES */}
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                {initialQuery || initialPlatformValue ? 'Search Results' : 'Featured Profiles'}
              </h2>
              <p className="text-gray-500 mt-1">Verified creators ready for collaboration.</p>
            </div>

            <div id="creators-scroll" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.length > 0 ? (
                filteredProfiles.map((profile) => (
                  <SocialCard key={profile.id} profile={profile} onOpenDetails={handleOpenDetailsModal} />
                ))
              ) : (
                <p className="text-gray-600 col-span-full text-center">No profiles found matching your criteria.</p>
              )}
            </div>
          </div>
        </section>

        <FeaturesSection />
        <CallToActionSection />
      </main>
      <Footer />

      {/* Details Modals for all profiles (can be optimized to render only active one) */}
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

export default Search;