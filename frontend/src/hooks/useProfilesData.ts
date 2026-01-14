"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/profile';

export const useProfilesData = (searchQuery?: string, platform?: string) => {
  return useQuery<Profile[]>({
    queryKey: ['profiles', searchQuery, platform],
    queryFn: async () => {
      let query = supabase
        .from('profiles') // Changed to public.profiles
        .select('*')
        .eq('role', 'influencer');

      if (searchQuery) {
        query = query.or(`display_name.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%`);
      }

      if (platform) {
        query = query.eq('platform', platform);
      }

      const { data, error } = await query.order('followers_count', { ascending: false });
      if (error) throw error;
      return data as Profile[];
    }
  });
};

export const useFeaturedProfiles = () => {
  return useQuery<Profile[]>({
    queryKey: ['featured-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles') // Changed to public.profiles
        .select('*')
        .eq('role', 'influencer')
        .eq('is_featured', true)
        .limit(6);
      
      if (error) throw error;
      return data as Profile[];
    }
  });
};

export const useProfileByHandle = (handle: string) => {
  return useQuery<Profile>({
    queryKey: ['profile', handle],
    queryFn: async () => {
      // Handle can be @username or username
      const username = handle.startsWith('@') ? handle.slice(1) : handle;
      const { data, error } = await supabase
        .from('profiles') // Changed to public.profiles
        .select('*')
        .eq('username', username)
        .single();
      
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!handle
  });
};