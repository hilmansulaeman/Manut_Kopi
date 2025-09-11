import React, { useEffect } from 'react';
import BgSplashScreen from '../assets/Bg_splashScreen.svg';
import LogoSplashScreen from '../assets/Logo_SplashScreen.svg';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000); // Display for 3 seconds

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className="relative flex items-center justify-center min-h-screen"
      style={{ backgroundColor: '#313131' }}
    >
      <img
        src={BgSplashScreen}
        alt="Background Splash"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <img
        src={LogoSplashScreen}
        alt="Logo Splash"
        className="relative z-10 h-40" // Adjust size as needed
      />
    </div>
  );
};

export default SplashScreen;
