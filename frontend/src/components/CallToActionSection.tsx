"use client";

import { Link } from 'react-router-dom';

const CallToActionSection = () => {
  return (
    <section className="border-t border-gray-100 py-8 md:py-12 mx-auto sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between items-start mb-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Start finding talent today</h2>
        <p className="text-gray-500 text-lg mb-4">
          Join brands and creators connecting daily. No credit card required to browse.
        </p>
        <div className="flex sm:flex-row gap-4 justify-center">
          <Link
            to="/search"
            className="px-5 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all"
          >
            Find Creators
          </Link>
          <Link
            to="/accounts/signup"
            className="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-900 text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Create a Profile
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;