"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col antialiased pt-16 md:pt-20 bg-gray-100 text-gray-900">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 my-4 sm:px-6 lg:px-8 z-0 relative flex items-center justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
            <p className="text-gray-500 mt-2">Choose how you want to join the LINKard community</p>
          </div>
          <div className="grid gap-4">
            <Link 
              className="w-full px-6 py-5 rounded-3xl border border-gray-200 bg-white text-center hover:bg-gray-50 transition-all shadow-sm hover:shadow-md group" 
              to="/accounts/signup/influencer"
            >
              <div className="font-bold text-lg text-gray-900">Sign up as Influencer</div>
              <div className="text-sm text-gray-500 group-hover:text-gray-600">I want to showcase my profile and connect with brands</div>
            </Link>
            <Link 
              className="w-full px-6 py-5 rounded-3xl border border-gray-200 bg-white text-center hover:bg-gray-50 transition-all shadow-sm hover:shadow-md group" 
              to="/accounts/signup/client"
            >
              <div className="font-bold text-lg text-gray-900">Sign up as Client</div>
              <div className="text-sm text-gray-500 group-hover:text-gray-600">I want to discover and hire top influencers</div>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-8 text-center font-medium">
            Already have an account?{' '}
            <Link className="text-black underline hover:no-underline" to="/accounts/login">Log in</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;