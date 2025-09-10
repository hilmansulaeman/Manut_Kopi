import { useState } from 'react';
import { Search, ChevronDown, ChevronRight, LogOut, Settings } from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', active: true },
  { id: 'ingredient', label: 'Ingredient', icon: '🧪', hasSubmenu: true },
  { id: 'inventory', label: 'Inventory', icon: '📦', hasSubmenu: true },
  { id: 'reports', label: 'All reports', icon: '📋' },
];

export const Sidebar = ({ className = '' }: SidebarProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className={`fixed left-0 top-0 h-screen w-[260px] bg-ink text-white flex flex-col ${className}`}>
      {/* Brand */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-ink font-bold text-sm">
            MK
          </div>
          <span className="font-bold text-lg">MANUT KOPI</span>
        </div>
      </div>

      {/* Search */}
      <div className="p-6 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-white rounded-full pl-10 pr-4 py-2 text-ink placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4">
        {menuItems.map((item) => (
          <div key={item.id} className="mb-1">
            <button
              onClick={() => item.hasSubmenu && toggleExpand(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-white/10 ${
                item.active ? 'bg-white/10' : ''
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="font-medium text-sm flex-1">{item.label}</span>
              {item.hasSubmenu && (
                expandedItems.has(item.id) ? 
                  <ChevronDown className="w-4 h-4" /> : 
                  <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        ))}
      </nav>

      {/* User Card */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
            JI
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm">Jibut</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-status-green rounded-full"></div>
              <span className="text-xs text-gray-300">Admin</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 hover:bg-white/10">
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 hover:bg-white/10">
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Log out</span>
            <div className="w-2 h-2 bg-red-500 rounded-full ml-auto"></div>
          </button>
        </div>
      </div>
    </div>
  );
};