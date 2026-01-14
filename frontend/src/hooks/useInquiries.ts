"use client";

import { useContext } from 'react';
import { InquiryContext } from '../context/InquiryContext';

export const useInquiries = () => {
  const context = useContext(InquiryContext);
  if (context === undefined) throw new Error('useInquiries must be used within an InquiryProvider');
  return context;
};