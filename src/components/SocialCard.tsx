"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck, Users, MapPin, User, ExternalLink } from 'lucide-react';
import { Profile } from '@/data/featuredProfiles';

interface SocialCardProps {
  profile: Profile;
  onOpenDetails: (profileId: string) => void;
}

const SocialCard: React.FC<SocialCardProps> = ({ profile, onOpenDetails }) => {
  const getPlatformColor = (platform: Profile['platform']) => {
    switch (platform) {
      case 'youtube': return 'bg-red-600';
      case 'twitter': return 'bg-black';
      case 'threads': return 'bg-gray-600';
      case 'linkedin': return 'bg-blue-700';
      case 'instagram': return 'bg-pink-600';
      case 'facebook': return 'bg-blue-600';
      case 'tiktok': return 'bg-black';
      default: return 'bg-gray-400';
    }
  };

  const getPlatformBadgeColor = (platform: Profile['platform']) => {
    switch (platform) {
      case 'youtube': return 'bg-red-50 text-red-700 border-red-100';
      case 'twitter': return 'bg-gray-50 text-gray-900 border-gray-200';
      case 'threads': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'linkedin': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'instagram': return 'bg-pink-50 text-pink-700 border-pink-100';
      case 'facebook': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'tiktok': return 'bg-gray-50 text-gray-900 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <article
      className="social-card analytics-card bg-white rounded-xl border border-gray-200 flex flex-col h-full overflow-hidden"
      data-social-id={profile.id}
      data-track-impression
      data-platform={profile.platform}
    >
      <div className={`h-1.5 w-full ${getPlatformColor(profile.platform)}`}></div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start gap-4 mb-5">
          <div className="relative flex-shrink-0 inline-block">
            <Link
              to={profile.profileLink}
              className="block w-16 h-16 rounded-full p-0.5 hover:opacity-90 transition-opacity"
              data-social-click="profile_image_link"
            >
              <img src={profile.profileImage} alt="profile" className="w-full h-full object-cover rounded-full" />
            </Link>
            {profile.isVerified && (
              <div className="absolute bottom-1 -right-1 bg-white rounded-full z-10">
                <BadgeCheck className="w-5 h-5 text-blue-500" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-gray-900 truncate mr-2">{profile.name}</h3>
              <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${getPlatformBadgeColor(profile.platform)}`}>
                {profile.platformLabel}
              </span>
            </div>
            <div className="flex gap-2 mt-1.5">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-1 stroke-gray-400" />
                <span className="truncate font-medium">{profile.category}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-0.5 text-gray-400" />
                <span className="truncate font-medium">{profile.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900 tracking-tight">{profile.followers}</span>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              {profile.platform === 'linkedin' ? 'Connections' : 'Followers'}
            </span>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold text-gray-900 tracking-tight">{profile.startPrice}</span>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Start Price</span>
          </div>
        </div>

        <div className="mb-6 overflow-hidden">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">Available Spaces</h4>
          <div className="flex gap-2 overflow-x-auto no-scrollbar cursor-grab">
            {profile.availableSpaces.map((space, index) => (
              <span
                key={index}
                className="flex-shrink-0 inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                {space.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={profile.profileLink}
            className="inline-flex justify-center items-center px-3 py-2.5 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
            data-social-click="profile_link"
            title="View User Profile"
          >
            <User className="w-4 h-4 text-gray-700" />
          </Link>
          <button
            onClick={() => onOpenDetails(profile.id)}
            className="inline-flex justify-center items-center w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            data-social-click="details_modal"
          >
            Details
          </button>
          <a
            href={profile.socialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center w-full px-4 py-2.5 bg-gray-100 text-black rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors gap-2 border border-gray-300"
            data-social-click="social_account_link"
          >
            Visit
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </article>
  );
};

export default SocialCard;