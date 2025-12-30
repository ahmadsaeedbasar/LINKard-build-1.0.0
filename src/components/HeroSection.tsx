"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const platforms = [
  { value: '', label: 'All platforms' },
  { value: 'ig', label: 'Instagram' },
  { value: 'tt', label: 'TikTok' },
  { value: 'yt', label: 'YouTube' },
  { value: 'li', label: 'LinkedIn' },
  { value: 'tw', label: 'X / Twitter' },
];

interface HeroSectionProps {
  initialQuery?: string;
  initialPlatformValue?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ initialQuery = '', initialPlatformValue = '' }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(
    platforms.find(p => p.value === initialPlatformValue) || platforms[0]
  );
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedPlatform(platforms.find(p => p.value === initialPlatformValue) || platforms[0]);
  }, [initialPlatformValue]);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleSelectPlatform = (platform: { value: string; label: string }) => {
    setSelectedPlatform(platform);
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (selectedPlatform.value) params.append('pf', selectedPlatform.value);
    navigate(`/search?${params.toString()}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <section className="relative pt-12 pb-10 lg:pt-28 lg:pb-24 z-30">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
        <h1 className="fs-2 text-nowrap md:text-5xl lg:text-7xl font-extrabold tracking-tighter text-gray-900 leading-tight">
          Find Influencers <br />
          To Scale Your Business
        </h1>
        <p className="mx-auto text-sm md:text-lg text-gray-700 mb-2 font-normal leading-relaxed">
          Search by category or username and filter results to find the exact creators you need.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-lg md:max-w-4xl my-5 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-visible relative z-20">
          <div className="flex flex-col md:flex-row">
            <div className="relative flex-grow border-b md:border-b-0 md:border-r border-gray-100 z-10">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-5 py-3 md:py-5 text-gray-900 placeholder-gray-400 focus:outline-none text-base font-medium md:placeholder:text-base placeholder:text-sm placeholder:font-normal bg-transparent"
                placeholder="Search by category (eg. 'tech', 'finance')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative md:w-64 border-b md:border-b-0 z-30" ref={dropdownRef}>
              <button
                type="button"
                onClick={toggleDropdown}
                className="w-full h-full pl-5 pr-5 py-3 md:py-5 flex items-center justify-between text-base font-medium text-gray-900 bg-white hover:bg-gray-50 transition-colors focus:outline-none group"
              >
                <span className="text-gray-500">{selectedPlatform.label}</span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-200 origin-top z-50">
                  <div className="py-2 overflow-y-auto no-scrollbar">
                    {platforms.map((platform) => (
                      <div
                        key={platform.value}
                        onClick={() => handleSelectPlatform(platform)}
                        className="group px-5 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 transition-all"
                      >
                        <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900">
                          {platform.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 md:p-2 md:pl-0 z-10">
              <button
                type="submit"
                className="w-full md:w-auto h-full bg-black text-white px-8 py-2 md:py-3 md:py-0 rounded-xl md:rounded-2xl font-bold text-base hover:bg-gray-800 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default HeroSection;