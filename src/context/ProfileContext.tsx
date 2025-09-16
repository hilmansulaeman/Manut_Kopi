import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ProfileContextType {
  profileName: string;
  setProfileName: (name: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profileName, setProfileName] = useState('Jibut'); // Default name

  return (
    <ProfileContext.Provider value={{ profileName, setProfileName }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
