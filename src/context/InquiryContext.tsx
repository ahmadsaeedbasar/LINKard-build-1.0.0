"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export interface Inquiry {
  id: string;
  creator_id: string;
  brand_name: string;
  message: string;
  status: string;
  created_at: string;
}

interface InquiryContextType {
  inquiries: Inquiry[];
  sendInquiry: (creatorId: string, brandName: string, message: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  fetchInquiries: () => Promise<void>;
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

export const InquiryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchInquiries();
  }, [user]);

  const fetchInquiries = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false });
    
    if (!error && data) setInquiries(data);
  };

  const sendInquiry = async (creatorId: string, brandName: string, message: string) => {
    const { error } = await supabase
      .from('inquiries')
      .insert([
        { creator_id: creatorId, brand_name: brandName, message, sender_id: user?.id }
      ]);
    
    if (error) throw error;
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('inquiries')
      .update({ status: 'read' })
      .eq('id', id);
    
    if (!error) {
      setInquiries(prev => prev.map(iq => iq.id === id ? { ...iq, status: 'read' } : iq));
    }
  };

  return (
    <InquiryContext.Provider value={{ inquiries, sendInquiry, markAsRead, fetchInquiries }}>
      {children}
    </InquiryContext.Provider>
  );
};

export const useInquiries = () => {
  const context = useContext(InquiryContext);
  if (context === undefined) throw new Error('useInquiries must be used within an InquiryProvider');
  return context;
};