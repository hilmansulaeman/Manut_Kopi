import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { StatCard } from './StatCard';
import { StockTable } from './StockTable';
import { useIsMobile } from '../../hooks/use-mobile';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import { useStock } from '../../context/StockContext';
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
  const { stockItems, getLowStockItems } = useStock();

  const totalIngredients = stockItems.length;
  const totalStockIn = stockItems.reduce((sum, item) => sum + item.stokMasuk, 0);
  const totalStockOut = stockItems.reduce((sum, item) => sum + item.stokKeluar, 0);
  const currentTotalStock = totalStockIn - totalStockOut;

  const lowStockCount = getLowStockItems().length;
  const outOfStockCount = stockItems.filter(item => (item.stokMasuk - item.stokKeluar) <= 0).length;

  let overallStockStatus = 'Aman';
  let overallStockStatusColor: 'green' | 'orange' | 'red' = 'green';
  if (outOfStockCount > 0) {
    overallStockStatus = 'Habis Stok';
    overallStockStatusColor = 'red';
  } else if (lowStockCount > 0) {
    overallStockStatus = 'Menipis';
    overallStockStatusColor = 'orange';
  }

  const dashboardStatCards = [
    {
      title: 'Jumlah Bahan Baku',
      value: totalIngredients,
      subtitle: `${totalIngredients} Jenis Bahan Baku`,
      iconColor: 'green' as const,
      icon: '📦',
    },
    {
      title: 'Total Stok Masuk',
      value: totalStockIn,
      subtitle: 'Semua Bahan Baku',
      iconColor: 'blue' as const,
      icon: '📈',
    },
    {
      title: 'Total Stok Keluar',
      value: totalStockOut,
      subtitle: 'Semua Bahan Baku',
      iconColor: 'pink' as const,
      icon: '📉',
    },
    {
      title: 'Status Stok Keseluruhan',
      value: overallStockStatus,
      subtitle: `(${lowStockCount} Menipis, ${outOfStockCount} Habis)`,
      iconColor: overallStockStatusColor,
      icon: '📊',
    },
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardStatCards.map((card, index) => (
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
          
          {/* Table Section */}
          <div>
            <StockTable />
          </div>
        </div>
      </div>
    </div>
  );
};
