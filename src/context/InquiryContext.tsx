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
  sender_id: string;
  sender_name?: string;
}

interface InquiryContextType {
  receivedInquiries: Inquiry[];
  sentInquiries: Inquiry[];
  sendInquiry: (creatorId: string, brandName: string, message: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  fetchInquiries: () => Promise<void>;
}

export const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

export const InquiryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [receivedInquiries, setReceivedInquiries] = useState<Inquiry[]>([]);
  const [sentInquiries, setSentInquiries] = useState<Inquiry[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchInquiries();
  }, [user]);

  const fetchInquiries = async () => {
    if (!user) return;

    // Fetch inquiries received (as an influencer)
    const { data: received, error: receivedError } = await supabase
      .from('interaction_management.inquiries')
      .select('*')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false });
    
    if (!receivedError && received) setReceivedInquiries(received);

    // Fetch inquiries sent (as a brand/client)
    const { data: sent, error: sentError } = await supabase
      .from('interaction_management.inquiries')
      .select('*')
      .eq('sender_id', user.id)
      .order('created_at', { ascending: false });

    if (!sentError && sent) setSentInquiries(sent);
  };

  const sendInquiry = async (creatorId: string, brandName: string, message: string) => {
    if (!user) throw new Error("Must be logged in to send inquiry");
    
    const { error } = await supabase
      .from('interaction_management.inquiries')
      .insert([
        {
          creator_id: creatorId,
          brand_name: brandName,
          message,
          sender_id: user.id,
          sender_name: brandName
        }
      ]);
    
    if (error) throw error;
    fetchInquiries(); // Refresh local state
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('interaction_management.inquiries')
      .update({ status: 'read' })
      .eq('id', id);
    
    if (!error) {
      setReceivedInquiries(prev => prev.map(iq => iq.id === id ? { ...iq, status: 'read' } : iq));
    }
  };

  return (
    <InquiryContext.Provider value={{ 
      receivedInquiries, 
      sentInquiries, 
      sendInquiry, 
      markAsRead, 
      fetchInquiries 
    }}>
      {children}
    </InquiryContext.Provider>
  );
};