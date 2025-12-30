"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import LogoMarquee from '@/components/LogoMarquee';
import SocialCard from '@/components/SocialCard';
import DetailsModal from '@/components/DetailsModal';
import Footer from '@/components/Footer';
import { useProfilesData } from '@/hooks/useProfilesData';
import { Loader2 } from 'lucide-react';
import { Profile } from '@/types/profile'; // Import Profile type

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const platform = searchParams.get('pf') || '';

  const { data: profiles, isLoading } = useProfilesData(query, platform);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!query && !platform) {
      setFlashMessage('Please enter a search term to find influencers.');
      const timer = setTimeout(() => {
        setFlashMessage(null);
      }, 4000); // Auto-hide after 4 seconds
      return () => clearTimeout(timer);
    } else {
      setFlashMessage(null);
    }
  }, [query, platform]);

  const selectedProfile = profiles?.find((p): p is Profile => p.id === selectedProfileId); // Explicitly type selectedProfile

  return (
    <div className="min-h-screen flex flex-col antialiased pt-16 md:pt-20 bg-gray-100 text-gray-900">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 my-4 sm:px-6 lg:px-8 z-0 relative">
        {flashMessage && (
          <div className="flex flex-col gap-3 mt-3">
            <div className="message-item flex items-center p-4 rounded-xl bg-yellow-50 text-yellow-800">
              <div className="text-sm font-medium">{flashMessage}</div>
            </div>
          </div>
        )}

        <HeroSection initialQuery={query} initialPlatformValue={platform} />
        <LogoMarquee />

        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                  {query || platform ? 'Search Results' : 'All Influencers'}
                </h2>
                <p className="text-gray-500 mt-1">
                  {isLoading ? 'Searching database...' : `${profiles?.length || 0} creators match your criteria.`}
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles && profiles.length > 0 ? (
                  profiles.map((profile) => (
                    <SocialCard 
                      key={profile.id} 
                      profile={profile} // Pass profile directly
                      onOpenDetails={(id) => setSelectedProfileId(id)} 
                    />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300">
                    <p className="text-gray-500 font-medium">No profiles found matching your criteria.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {selectedProfile && (
        <DetailsModal
          profile={selectedProfile} // Pass profile directly
          isOpen={!!selectedProfileId}
          onClose={() => setSelectedProfileId(null)}
        />
      )}
    </div>
  );
};

export default Search;