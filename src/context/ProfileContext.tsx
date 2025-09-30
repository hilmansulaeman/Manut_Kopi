import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ProfileContextType {
  profileName: string;
  setProfileName: (name: string) => void;
  isLoggedIn: boolean;
  login: (name: string) => void;
  logout: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profileName, setProfileName] = useState(() => localStorage.getItem('profileName') || 'Jibut');
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');

  const login = (name: string) => {
    setProfileName(name);
    setIsLoggedIn(true);
    localStorage.setItem('profileName', name);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const logout = () => {
    setProfileName('Jibut');
    setIsLoggedIn(false);
    localStorage.removeItem('profileName');
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <ProfileContext.Provider value={{ profileName, setProfileName, isLoggedIn, login, logout }}>
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
