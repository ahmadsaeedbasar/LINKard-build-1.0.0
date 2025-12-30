"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  ArrowUpRight, 
  Settings, 
  Eye 
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Reach', value: '45.2k', icon: Users, change: '+12%', color: 'text-blue-600' },
    { label: 'Avg. Engagement', value: '5.8%', icon: TrendingUp, change: '+0.4%', color: 'text-emerald-600' },
    { label: 'Profile Views', value: '1,284', icon: Eye, change: '+18%', color: 'text-purple-600' },
    { label: 'New Inquiries', value: '7', icon: MessageSquare, change: '3 new', color: 'text-orange-600' },
  ];

  const recentInquiries = [
    { brand: 'EcoStyles', budget: '$500 - $800', date: '2 hours ago', status: 'New' },
    { brand: 'TechGear Pro', budget: '$1,200', date: 'Yesterday', status: 'Pending' },
    { brand: 'Nomad Travels', budget: '$350', date: '3 days ago', status: 'Read' },
  ];

  return (
    <div className="min-h-screen flex flex-col antialiased pt-16 md:pt-20 bg-gray-50 text-gray-900">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-gray-500">Here's what's happening with your profile today.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/analytics" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
              <BarChart3 className="w-4 h-4" />
              View Analytics
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors">
              <Settings className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl bg-gray-50 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Inquiries */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold">Recent Inquiries</h2>
              <button className="text-sm font-bold text-gray-500 hover:text-black transition-colors">View All</button>
            </div>
            <div className="divide-y divide-gray-50">
              {recentInquiries.map((inquiry, i) => (
                <div key={i} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                      {inquiry.brand[0]}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{inquiry.brand}</div>
                      <div className="text-sm text-gray-500">{inquiry.date} • {inquiry.budget}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      inquiry.status === 'New' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {inquiry.status}
                    </span>
                    <ArrowUpRight className="w-5 h-5 text-gray-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions / Tips */}
          <div className="space-y-6">
            <div className="bg-black text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Grow your reach</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Updating your pricing and ad slots can increase your visibility to brands by up to 40%.
                </p>
                <button className="w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition-colors">
                  Update Slots
                </button>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gray-800 rounded-full opacity-50"></div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
              <h3 className="font-bold mb-4">Profile Strength</h3>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-emerald-500 w-[85%]"></div>
              </div>
              <p className="text-xs text-gray-500">85% - Great! Add a case study to hit 100%.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;