import { ChevronDown } from 'lucide-react';

export const TopBar = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-semibold text-ink">Dashboard</h1>
      
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-ink hover:bg-black/5 rounded-lg transition-colors">
          <span>2024</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};