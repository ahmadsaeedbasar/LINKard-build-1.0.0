"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck, MapPin, ExternalLink } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface SocialCardProps {
  profile: any; // Flexible to accommodate DB object
  onOpenDetails: (profileId: string) => void;
}

const SocialCard: React.FC<SocialCardProps> = ({ profile, onOpenDetails }) => {
  const { sendEvent } = useAnalytics();

  const getPlatformBadgeColor = (platform: string) => {
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

  const handleSocialClick = (eventType: string) => {
    sendEvent('/api/a/s1/', {
      social_account_id: profile.id,
      event_type: eventType
    });
  };

  return (
    <article
      className="social-card analytics-card bg-white rounded-xl border border-gray-200 flex flex-col h-full overflow-hidden"
      data-social-id={profile.id}
      data-track-impression
      data-platform={profile.platform}
    >
      <div className={`h-1.5 w-full ${profile.platformColorClass || 'bg-black'}`}></div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start gap-4 mb-5">
          <div className="relative flex-shrink-0 inline-block">
            <Link
              to={`/${profile.username || profile.profileLink?.replace('@', '')}`}
              className="block w-16 h-16 rounded-full p-0.5 hover:opacity-90 transition-opacity"
              onClick={() => handleSocialClick('profile_image_link')}
            >
              <img src={profile.profileImage || profile.avatar_url || '/placeholder.svg'} alt="profile" className="w-full h-full object-cover rounded-full" />
            </Link>
            {profile.isVerified && (
              <div className="absolute bottom-1 -right-1 bg-white rounded-full z-10">
                <BadgeCheck className="w-5 h-5 text-blue-500" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-gray-900 truncate mr-2">{profile.display_name || profile.name}</h3>
              <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${getPlatformBadgeColor(profile.platform)}`}>
                {profile.platformLabel || profile.platform_label}
              </span>
            </div>
            <div className="flex gap-2 mt-1.5">
              <div className="flex items-center text-sm text-gray-600">
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
            <span className="text-2xl font-bold text-gray-900 tracking-tight">{profile.followers || profile.followers_count}</span>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Reach
            </span>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold text-gray-900 tracking-tight">{profile.startPrice || profile.start_price}</span>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Base Rate</span>
          </div>
        </div>

        <div className="mb-6 overflow-hidden">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">Available Spaces</h4>
          <div className="flex gap-2 overflow-x-auto no-scrollbar cursor-grab">
            {(profile.availableSpaces || profile.available_spaces || []).map((space: string, index: number) => (
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
            to={`/${profile.username || profile.profileLink?.replace('@', '')}`}
            className="inline-flex justify-center items-center px-3 py-2.5 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={() => handleSocialClick('profile_link')}
          >
            <svg className="w-4 h-4 text-gray-700" viewBox="0 0 31 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M22.3889 20.4C24.6079 20.4001 26.7412 21.2458 28.3439 22.7607C29.9467 24.2756 30.8951 26.3428 30.9914 28.5311L31 28.9V30.6C31.0003 31.4578 30.6721 32.284 30.0812 32.9129C29.4903 33.5419 28.6804 33.9272 27.8139 33.9915L27.5556 34H3.44444C2.57545 34.0003 1.73847 33.6763 1.10128 33.0931C0.464088 32.5098 0.0737857 31.7104 0.00861131 30.855L0 30.6V28.9C0.000128206 26.7096 0.856877 24.6038 2.39158 23.0218C3.92628 21.4397 6.02046 20.5036 8.23739 20.4085L8.61111 20.4H22.3889ZM22.3889 23.8H8.61111C7.29325 23.7999 6.02517 24.297 5.06633 25.1894C4.10749 26.0818 3.53037 27.3022 3.45306 28.6008L3.44444 28.9V30.6H27.5556V28.9C27.5556 27.5991 27.0521 26.3474 26.148 25.401C25.2439 24.4545 24.0076 23.8848 22.692 23.8085L22.3889 23.8ZM15.5 0C17.7838 0 19.9741 0.895533 21.589 2.48959C23.2039 4.08365 24.1111 6.24566 24.1111 8.5C24.1111 10.7543 23.2039 12.9163 21.589 14.5104C19.9741 16.1045 17.7838 17 15.5 17C13.2162 17 11.0259 16.1045 9.41102 14.5104C7.79613 12.9163 6.88889 10.7543 6.88889 8.5C6.88889 6.24566 7.79613 4.08365 9.41102 2.48959C11.0259 0.895533 13.2162 0 15.5 0ZM15.5 3.4C14.8215 3.4 14.1497 3.53192 13.5228 3.78821C12.896 4.04451 12.3264 4.42018 11.8466 4.89376C11.3668 5.36733 10.9863 5.92955 10.7266 6.54831C10.467 7.16708 10.3333 7.83026 10.3333 8.5C10.3333 9.16974 10.467 9.83293 10.7266 10.4517C10.9863 11.0704 11.3668 11.6327 11.8466 12.1062C12.3264 12.5798 12.896 12.9555 13.5228 13.2118C14.1497 13.4681 14.8215 13.6 15.5 13.6C16.8703 13.6 18.1844 13.0627 19.1534 12.1062C20.1223 11.1498 20.6667 9.8526 20.6667 8.5C20.6667 7.1474 20.1223 5.85019 19.1534 4.89376C18.1844 3.93732 16.8703 3.4 15.5 3.4Z" fill="black" /></svg>
          </Link>
          <button
            onClick={() => {
              onOpenDetails(profile.id);
              handleSocialClick('details_modal');
            }}
            className="inline-flex justify-center items-center w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Details
          </button>
          <a
            href={profile.socialLink || profile.social_link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center w-full px-4 py-2.5 bg-gray-100 text-black rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors gap-2 border border-gray-300"
            onClick={() => handleSocialClick('social_account_link')}
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