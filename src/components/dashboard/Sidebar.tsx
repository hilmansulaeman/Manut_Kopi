import { useState } from 'react';
import { Search, ChevronDown, ChevronRight, LogOut, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  className?: string;
  activePage?: string;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/' },
  { 
    id: 'ingredient', 
    label: 'Ingredient', 
    icon: '🧪', 
    hasSubmenu: true,
    submenu: [
      { id: 'ingredient-library', label: 'Ingredient Library', href: '/ingredient/library' },
      { id: 'ingredient-categories', label: 'Ingredient Categories', href: '/ingredient/categories' }
    ]
  },
  { id: 'inventory', label: 'Inventory', icon: '📦', hasSubmenu: true },
  { id: 'reports', label: 'All reports', icon: '📋' },
];

export const Sidebar = ({ className = '', activePage }: SidebarProps) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(activePage?.startsWith('ingredient') ? ['ingredient'] : [])
  );

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
            {item.hasSubmenu ? (
              <>
                <button
                  onClick={() => toggleExpand(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-white/10 ${
                    activePage === item.id ? 'bg-white/10' : ''
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="font-medium text-sm flex-1">{item.label}</span>
                  {expandedItems.has(item.id) ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </button>
                {expandedItems.has(item.id) && item.submenu && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.id}
                        to={subItem.href}
                        className={`flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-white/10 ${
                          activePage === subItem.id ? 'bg-white/10 font-medium' : ''
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.href || '#'}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-white/10 ${
                  activePage === item.id ? 'bg-white/10' : ''
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="font-medium text-sm flex-1">{item.label}</span>
              </Link>
            )}
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