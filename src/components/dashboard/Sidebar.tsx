import { Search, LogOut, Settings, FileBarChart } from 'lucide-react';
import { Squares2X2Icon, ArchiveBoxIcon } from '@heroicons/react/24/outline'; // Import Squares2X2Icon and ArchiveBoxIcon
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogoManut from '../../assets/Logo_manut.svg';
import { Input } from '../ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

interface SidebarProps {
  className?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ElementType; // Change icon type to React.ElementType
  href?: string;
  hasSubmenu?: boolean;
  submenu?: { id: string; label: string; href: string; }[];
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Squares2X2Icon, href: '/' },
  { 
    id: 'ingredient', 
    label: 'Bahan Baku',  
    icon: ArchiveBoxIcon, // Use ArchiveBoxIcon for Bahan Baku
    hasSubmenu: true,
    submenu: [
      { id: 'ingredient-library', label: 'Halaman Bahan Baku', href: '/ingredient/library' },
      { id: 'ingredient-categories', label: 'Kategori Bahan Baku', href: '/ingredient/categories' }
    ]
  },
  { id: 'reports', label: 'Semua Laporan', icon: FileBarChart, href: '/reports' },
];

export const Sidebar = ({ className = '' }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform any cleanup here, e.g., clearing local storage, auth tokens
    console.log('Logging out...');
    navigate('/login');
  };

  return (
    <div className={`fixed left-0 top-0 h-screen w-[260px] bg-ink text-white flex flex-col ${className}`}>
      {/* Brand */}
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="flex items-center gap-3">
          <img src={LogoManut} alt="Manut Kopi Logo" className="h-10" />
        </Link>
      </div>

      {/* Search */}
      <div className="p-6 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari"
            className="w-full rounded-full pl-10 pr-4 py-2 text-ink placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 bg-white border-none"
          />
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4">
        <Accordion 
          type="multiple" 
          className="w-full" 
          defaultValue={
            location.pathname.startsWith('/ingredient') 
              ? ['ingredient'] 
              : location.pathname.startsWith('/reports') 
                ? ['reports'] 
                : []
          }
        >
          {menuItems.map((item) => (
            <div key={item.id} className="mb-1">
              {item.hasSubmenu ? (
                <AccordionItem value={item.id} className="border-b-0">
                  <AccordionTrigger 
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-white/10 ${
                      location.pathname.startsWith(item.href || '') ? 'bg-white/10' : ''
                    }`}
                  >
                    {item.icon && <item.icon className="w-5 h-5" />} {/* Render icon as component */}
                    <span className="font-medium text-sm flex-1">{item.label}</span>
                  </AccordionTrigger>
                  <AccordionContent className="ml-8 mt-1 space-y-1">
                    {item.submenu && item.submenu.map((subItem) => (
                      <Link
                        key={subItem.id}
                        to={subItem.href}
                        className={`flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-white/10 ${
                          location.pathname === subItem.href ? 'bg-white/10 font-medium' : ''
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <Link
                  to={item.href || '#'}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-white/10 ${
                    location.pathname === item.href ? 'bg-white/10' : ''
                  }`}
                >
                  {item.icon && <item.icon className="w-5 h-5" />} {/* Render icon as component */}
                  <span className="font-medium text-sm flex-1">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </Accordion>
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
          <Link to="/settings" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 hover:bg-white/10">
            <Settings className="w-4 h-4" />
            <span className="text-sm">Pengaturan</span>
          </Link>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 hover:bg-white/10"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Keluar</span>
            <div className="w-2 h-2 bg-red-500 rounded-full ml-auto"></div>
          </button>
        </div>
      </div>
    </div>
  );
};
