import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { StatCard } from './StatCard';
import { YearlyChart } from './YearlyChart';
import { StockTable } from './StockTable';
import { useIsMobile } from '../../hooks/use-mobile';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '../ui/drawer';

const statCards = [
  {
    title: 'Jumlah Bahan Baku',
    value: 920,
    subtitle: '324 Jumlah Bahan Baku',
    iconColor: 'green' as const,
    icon: '📦',
  },
  {
    title: 'Stok Masuk Semua Bahan Baku',
    value: 200,
    subtitle: 'Stok Masuk Semua Bahan Baku',
    iconColor: 'blue' as const,
    icon: '📈',
  },
  {
    title: 'Stok Keluar Semua Bahan Baku',
    value: 24,
    subtitle: 'Stok Keluar Semua Bahan Baku',
    iconColor: 'pink' as const,
    icon: '📉',
  },
];

export const Dashboard = () => {
  const isMobile = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex">
      {isMobile ? (
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="left">
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="h-6 w-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="w-[260px] h-full mt-0 rounded-none">
            <Sidebar />
          </DrawerContent>
        </Drawer>
      ) : (
        <Sidebar />
      )}
      
      {/* Main Content */}
      <div className={`flex-1 ${!isMobile ? 'ml-[260px]' : ''}`}>
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          {/* Top Bar */}
          <TopBar />
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statCards.map((card, index) => (
              <StatCard
                key={index}
                title={card.title}
                value={card.value}
                subtitle={card.subtitle}
                iconColor={card.iconColor}
                icon={card.icon}
              />
            ))}
          </div>
          
          {/* Chart Section */}
          <div className="mb-8">
            <YearlyChart />
          </div>
          
          {/* Table Section */}
          <div>
            <StockTable />
          </div>
        </div>
      </div>
    </div>
  );
};
