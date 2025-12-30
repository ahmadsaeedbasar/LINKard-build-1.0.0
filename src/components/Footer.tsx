"use client";

import React from 'react';
import { useAnalytics } from '@/hooks/useAnalytics'; // Import useAnalytics

const Footer = () => {
  const { sendEvent } = useAnalytics(); // Use the hook

  const handleLinkClick = (linkId: string, url: string, context: string, text: string) => {
    sendEvent('/api/a/l1/', {
      link_id: linkId,
      link_url: url,
      link_text: text,
      context: context
    });
  };

  return (
    <footer className="border-t border-gray-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center text-white font-bold text-xs">
            L
          </div>
          <span className="font-semibold text-gray-900">LINKard</span>
        </div>
        <div className="text-sm text-gray-500">
          &copy; 2025 LINKard Inc. All rights reserved.{' '}
          <a
            href="https://facebook.com"
            onClick={() => handleLinkClick('footer_facebook_link', 'https://facebook.com', 'external', 'facebook')}
            className="hover:underline"
          >
            facebook
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;