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
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold">Create your account</h1>
            <p className="text-gray-600">Choose how you want to join</p>
          </div>
          <div className="grid gap-3">
            <Link 
              className="w-full px-4 py-3 rounded-md border bg-white text-center font-medium hover:bg-gray-50 transition-colors" 
              to="/accounts/signup/influencer"
            >
              Sign up as Influencer
            </Link>
            <Link 
              className="w-full px-4 py-3 rounded-md border bg-white text-center font-medium hover:bg-gray-50 transition-colors" 
              to="/accounts/signup/client"
            >
              Sign up as Client
            </Link>
          </div>
          <p className="text-sm text-gray-600 mt-6 text-center">
            Already have an account?{' '}
            <Link className="text-black font-bold underline" to="/accounts/login">Log in</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;