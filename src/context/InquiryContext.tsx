"use client";

import React, { createContext, useContext, useState } from 'react';

export interface Inquiry {
  id: string;
  creatorId: string;
  brandName: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  timestamp: string;
}

interface InquiryContextType {
  inquiries: Inquiry[];
  sendInquiry: (creatorId: string, brandName: string, message: string) => void;
  markAsRead: (id: string) => void;
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

export const InquiryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const sendInquiry = (creatorId: string, brandName: string, message: string) => {
    const newInquiry: Inquiry = {
      id: Math.random().toString(36).substr(2, 9),
      creatorId,
      brandName,
      message,
      status: 'new',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' today',
    };
    setInquiries((prev) => [newInquiry, ...prev]);
  };

  const markAsRead = (id: string) => {
    setInquiries((prev) => 
      prev.map(iq => iq.id === id ? { ...iq, status: 'read' as const } : iq)
    );
  };

  return (
    <InquiryContext.Provider value={{ inquiries, sendInquiry, markAsRead }}>
      {children}
    </InquiryContext.Provider>
  );
};

export const useInquiries = () => {
  const context = useContext(InquiryContext);
  if (context === undefined) throw new Error('useInquiries must be used within an InquiryProvider');
  return context;
};