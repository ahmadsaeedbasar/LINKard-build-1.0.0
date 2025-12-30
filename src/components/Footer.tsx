"use client";

import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center text-white font-bold text-xs">
            P
          </div>
          <span className="font-semibold text-gray-900">ProOmo</span>
        </div>
        <div className="text-sm text-gray-500">
          &copy; 2025 ProOmo Inc. All rights reserved.{' '}
          <a href="https://facebook.com" data-link-id="footer_facebook_link" data-context="external" className="hover:underline">
            facebook
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;