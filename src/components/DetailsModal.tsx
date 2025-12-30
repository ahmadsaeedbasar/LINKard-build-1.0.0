"use client";

import React, { useEffect, useRef } from 'react';
import { X, BadgeCheck, Tag } from 'lucide-react'; // Added Tag icon
import { Profile } from '@/types/profile'; // Updated import

interface DetailsModalProps {
  profile: Profile;
  isOpen: boolean;
  onClose: () => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ profile, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getReachLabel = (platform: string) => {
    switch (platform) {
      case 'linkedin': return 'Connections';
      case 'youtube': return 'Subscribers';
      default: return 'Followers';
    }
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price.replace(/[^0-9.-]+/g,""));
    if (isNaN(num)) return price;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm h-full w-full z-50 flex items-center justify-center p-4">
      <div ref={modalRef} className="relative w-11/12 md:w-3/4 lg:max-w-md shadow-lg rounded-md bg-white max-h-[85vh] overflow-y-auto">
        <div className="p-6">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 w-full flex justify-end mb-2">
            <X className="h-6 w-6" />
          </button>

          {/* Header: Profile image, name, verified badge, and followers */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                <img src={profile.avatar_url || '/placeholder.svg'} alt={`${profile.platform} profile`} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center">
                  <h3 className="text-xl font-bold text-gray-900">{profile.display_name}</h3>
                  {profile.is_verified && (
                    <BadgeCheck className="w-5 h-5 text-blue-500 flex-shrink-0 ml-1" />
                  )}
                </div>
                <p className="text-sm text-gray-600">{profile.platform_label}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{profile.followers_count}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                {getReachLabel(profile.platform)}
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="text-center bg-gray-50 rounded-lg px-3 py-3">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Content Type</div>
              <div className="text-sm font-semibold text-gray-900">{profile.category}</div>
            </div>
            <div className="text-center bg-gray-50 rounded-lg px-3 py-3">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Base Price</div>
              <div className="text-sm font-semibold text-gray-900">{formatPrice(profile.start_price)}</div>
            </div>
          </div>

          {/* Audience Information */}
          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-gray-900">Audience</h4>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3 text-sm">
                <span className="text-gray-600 font-medium">Category</span>
                <span className="text-gray-900 font-semibold">{profile.category}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3 text-sm">
                <span className="text-gray-600 font-medium">Location</span>
                <span className="text-gray-900 font-semibold">{profile.location}</span>
              </div>
            </div>
          </div>

          {/* Available Spaces */}
          <div className="space-y-3 mb-5 overflow-hidden mx-1">
            <div className="flex items-center gap-1 text-gray-700">
              <h4 className="font-semibold text-gray-900">Available Spaces</h4>
              <span className="ml-auto bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {profile.available_spaces.length}
              </span>
            </div>
            <div className="overflow-x-auto no-scrollbar cursor-grab pb-3 -mx-2 px-2">
              <div className="flex gap-3 min-w-max">
                {profile.available_spaces.map((space, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 bg-gray-100 rounded-lg px-3 py-1 text-sm transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-gray-600 font-medium text-center">{space.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;