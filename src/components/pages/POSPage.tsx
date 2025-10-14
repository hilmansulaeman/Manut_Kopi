import React from 'react';
import Dashboard from '../Dashboard';

interface POSPageProps {
  onLogout: () => void;
  onMenuChange: (menu: string) => void;
}

const POSPage: React.FC<POSPageProps> = ({ onLogout, onMenuChange }) => {
  return (
    <Dashboard onLogout={onLogout} onMenuChange={onMenuChange}>
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#313131] mb-4">Point of Sale (POS)</h1>
          <p className="text-gray-600">
            Fitur Point of Sale telah dinonaktifkan.
          </p>
        </div>
      </div>
    </Dashboard>
  );
};

export default POSPage;
