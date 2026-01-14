"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/profile';

export const useProfilesData = (searchQuery?: string, platform?: string) => {
  return useQuery<Profile[]>({
    queryKey: ['profiles', searchQuery, platform],
    queryFn: async () => {
      let query = supabase
        .from('user_management.profiles')
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
        .from('user_management.profiles')
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

      // Get profile data
      const { data: profile, error: profileError } = await supabase
        .from('user_management.profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (profileError) throw profileError;

      // Get portfolio items
      const { data: portfolioItems, error: portfolioError } = await supabase
        .from('user_management.portfolio_items')
        .select('title, type, thumbnail_url, content_url')
        .eq('profile_id', profile.id)
        .order('created_at', { ascending: true });

      if (portfolioError) throw portfolioError;

      // Combine profile with portfolio items
      return {
        ...profile,
        portfolio_items: portfolioItems || []
      } as Profile;
    },
    enabled: !!handle
  });
};