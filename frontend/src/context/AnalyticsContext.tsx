"use client";

import { createContext } from 'react';

export interface AnalyticsContextType {
  sendEvent: (endpoint: string, payload: Record<string, unknown>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export default AnalyticsContext;