"use client";

import React from 'react';

const FeaturesSection = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto md:py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between items-start mb-4">
          <h2 className="text-3xl font-bold text-gray-900">Why brands choose ProOmo</h2>
          <p className="text-gray-600 text-lg">We provide the infrastructure to make data-backed decisions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-start bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Aggregated Analytics</h3>
            <p className="text-gray-500 leading-relaxed">
              View follower counts, engagement rates, and audience demographics across multiple platforms in one
              dashboard.
            </p>
          </div>

          <div className="flex flex-col items-start bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Direct Connections</h3>
            <p className="text-gray-500 leading-relaxed">
              No hidden middleman fees. Find the creator, view their base rates, and connect directly.
            </p>
          </div>

          <div className="flex flex-col items-start bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .883-.393 1.73-1 2.271M15 7a2 2 0 00-2-2M9 7a2 2 0 012-2M9 7a2 2 0 01-2 2m6-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Unified Portfolios</h3>
            <p className="text-gray-500 leading-relaxed">
              Influencers showcase their entire digital footprint. See everything they offer in one professional
              profile.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;