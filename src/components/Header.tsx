"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

const Header = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const disableNavbarHide = false;
  const { sendEvent } = useAnalytics();

  useEffect(() => {
    const handleScroll = () => {
      if (disableNavbarHide) return;

      const currentScroll = window.pageYOffset;
      if (currentScroll > lastScrollY && currentScroll > 50) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(currentScroll <= 0 ? 0 : currentScroll);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, disableNavbarHide]);

  const handleLinkClick = (linkId: string, url: string, context: string, text: string) => {
    sendEvent('/api/a/l1/', {
      link_id: linkId,
      link_url: url,
      link_text: text,
      context: context
    });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 transition-transform duration-300 ease-in-out ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      } ${disableNavbarHide ? 'translate-y-0' : ''}`}
      data-navbar-fixed={disableNavbarHide}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center z-40">
            <Link
              to="/search"
              className="flex items-center gap-2 group"
              onClick={() => handleLinkClick('header_logo_link', '/search', 'navigation', 'LINKard Logo')}
            >
              <svg className="w-9 h-9 md:w-10 md:h-10" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="220" height="220" rx="50" fill="black" />
                <path d="M110.088 46.2382L161.079 156.475L123.389 156.237L109.7 173.5L95.8899 155.999L58.08 155.999L110.088 46.2382Z" fill="white" />
                <path d="M109.7 173.5L110.089 46.2386L95.8899 155.999L109.7 173.5Z" fill="url(#paint0_linear_431_67)" />
                <path d="M123.389 156.237L110.088 46.2383L109.7 173.5L123.389 156.237Z" fill="url(#paint1_linear_431_67)" />
                <defs>
                  <linearGradient id="paint0_linear_431_67" x1="109.994" y1="109.899" x2="98.9399" y2="108.463" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ADADAD" />
                    <stop offset="1" stopColor="#D9D9D9" />
                  </linearGradient>
                  <linearGradient id="paint1_linear_431_67" x1="123.603" y1="109.961" x2="109.814" y2="110.421" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#D9D9D9" />
                    <stop offset="1" stopColor="#D2D2D2" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-xl font-bold tracking-tight text-gray-900">LINKard</span>
            </Link>
          </div>

          {/* DESKTOP MENU (MD+) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/search"
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
              onClick={() => handleLinkClick('find_talent_link', '/search', 'navigation', 'Find Talent')}
            >
              Find Talent
            </Link>
            <div className="flex items-center gap-4">
              <Link
                to="/accounts/login"
                className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors"
                onClick={() => handleLinkClick('login_link', '/accounts/login', 'authentication', 'Log in')}
              >
                Log in
              </Link>
              <Link
                to="/accounts/signup"
                className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-bold rounded-xl text-white bg-black hover:bg-gray-800 transition-all shadow-sm hover:shadow hover:-translate-y-0.5"
                onClick={() => handleLinkClick('join_now_desktop_link', '/accounts/signup', 'authentication', 'Join Now')}
              >
                Join Now
              </Link>
            </div>
          </nav>

          {/* MOBILE MENU (Hidden on Desktop) */}
          <div className="flex items-center gap-3 md:hidden">
            <Link
              to="/search"
              className="p-2 text-gray-500 hover:text-black transition-colors"
              onClick={() => handleLinkClick('search_icon_mobile', '/search', 'navigation', 'Search Icon')}
            >
              <SearchIcon className="w-6 h-6" />
            </Link>
            <Link
              to="/accounts/signup"
              className="bg-black text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm"
              onClick={() => handleLinkClick('join_now_mobile_link', '/accounts/signup', 'authentication', 'Join Now')}
            >
              Join Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;