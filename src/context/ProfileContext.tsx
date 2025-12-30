"use client";

import React, { createContext, useContext, useState } from 'react';
import { featuredProfiles as initialProfiles, Profile } from '@/data/featuredProfiles';

interface ProfileContextType {
  profiles: Profile[];
  addProfile: (profile: Profile) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);

  const addProfile = (profile: Profile) => {
    setProfiles((prev) => [profile, ...prev]);
  };

  return (
    <ProfileContext.Provider value={{ profiles, addProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfiles = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) throw new Error('useProfiles must be used within a ProfileProvider');
  return context;
};