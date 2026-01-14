"use client";

import { useContext } from 'react';
import AnalyticsContext, { AnalyticsContextType } from '@/context/AnalyticsContext';

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context as AnalyticsContextType;
};