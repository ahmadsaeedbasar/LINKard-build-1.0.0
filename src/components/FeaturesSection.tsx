"use client";

import React from 'react';
import { BarChart, Zap, Briefcase } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto md:py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between items-start mb-4">
          <h2 className="text-3xl font-bold text-gray-900">Why brands choose LINKard</h2>
          <p className="text-gray-600 text-lg">We provide the infrastructure to make data-backed decisions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-start bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-6">
              <BarChart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Aggregated Analytics</h3>
            <p className="text-gray-500 leading-relaxed">
              View follower counts, engagement rates, and audience demographics across multiple platforms in one
              dashboard.
            </p>
          </div>

          <div className="flex flex-col items-start bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Direct Connections</h3>
            <p className="text-gray-500 leading-relaxed">
              No hidden middleman fees. Find the creator, view their base rates, and connect directly.
            </p>
          </div>

          <div className="flex flex-col items-start bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-6">
              <Briefcase className="w-6 h-6" />
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