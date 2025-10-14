import { useState } from "react";
import { Menu } from "lucide-react";
import { useDevice } from "../hooks/use-device";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
  DrawerDescription,
} from "./ui/drawer";
import { StatCard } from "./dashboard/StatCard";
import { TopBar } from "./dashboard/TopBar";
import { StockTable } from "./dashboard/StockTable";
import { useStock } from "../context/StockContext";
import { useSidebar } from "../context/SidebarContext";
import Sidebar from "../imports/Sidebar";

interface DashboardProps {
  onLogout: () => void;
  onMenuChange?: (menu: string) => void;
  children?: React.ReactNode; // Add children prop
}

export default function Dashboard({
  onLogout,
  onMenuChange,
  children,
}: DashboardProps) {
  const { isMobileOrTablet, isMobile, isTablet } = useDevice();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { stockItems, getLowStockItems, stockOutTransactions } = useStock();
  const { isCollapsed, setIsCollapsed } = useSidebar();

  const totalIngredients = stockItems.length;
  const totalStockIn = stockItems.reduce(
    (sum, item) => sum + item.stokMasuk,
    0,
  );
  const totalStockOut = stockOutTransactions.reduce(
    (sum, transaction) => sum + transaction.jumlah,
    0,
  );

  const lowStockCount = getLowStockItems().length;
  const outOfStockCount = stockItems.filter(
    (item) => item.currentStock <= 0,
  ).length;

  let overallStockStatus = "Aman";
  let overallStockStatusColor: "green" | "orange" | "red" =
    "green";
  if (outOfStockCount > 0) {
    overallStockStatus = "Habis Stok";
    overallStockStatusColor = "red";
  } else if (lowStockCount > 0) {
    overallStockStatus = "Menipis";
    overallStockStatusColor = "orange";
  }

  const dashboardStatCards = [
    {
      title: "Jumlah Bahan Baku",
      value: totalIngredients,
      subtitle: `${totalIngredients} Jenis Bahan Baku`,
      iconColor: "green" as const,
      icon: "📦",
    },
    {
      title: "Total Stok Masuk",
      value: totalStockIn,
      subtitle: "Semua Bahan Baku",
      iconColor: "blue" as const,
      icon: "📈",
    },
    {
      title: "Total Stok Keluar",
      value: totalStockOut,
      subtitle: "Semua Bahan Baku",
      iconColor: "pink" as const,
      icon: "📉",
    },
    {
      title: "Status Stok Keseluruhan",
      value: overallStockStatus,
      subtitle: `(${lowStockCount} Menipis, ${outOfStockCount} Habis)`,
      iconColor: overallStockStatusColor,
      icon: "📊",
    },
  ];

  return (
    <div className="bg-[rgba(250,250,250,0.98)] h-full flex">
      {isMobileOrTablet ? (
        <Drawer
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          direction="left"
        >
          <DrawerTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50 bg-white shadow-md"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="w-[260px] h-full mt-0 rounded-none">
            <DrawerTitle className="sr-only">Menu Navigasi</DrawerTitle>
            <DrawerDescription className="sr-only">
              Menu navigasi sidebar untuk aplikasi MANUT KOPI
            </DrawerDescription>
            <Sidebar onLogout={onLogout} activeMenu="dashboard" onMenuChange={onMenuChange} />
          </DrawerContent>
        </Drawer>
      ) : (
        <div className={`fixed left-0 top-0 h-screen z-50 transition-all duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[260px]'}`}>
          <Sidebar 
            onLogout={onLogout} 
            activeMenu="dashboard" 
            onMenuChange={onMenuChange}
            isCollapsed={isCollapsed}
            onCollapseChange={setIsCollapsed}
          />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 overflow-auto transition-all duration-300 ${isMobileOrTablet ? "" : isCollapsed ? "ml-[80px]" : "ml-[260px]"}`}
      >
        <div
          className={`max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8`}
        >
          {/* Top Bar */}
          <TopBar />

          {/* Stats Cards */}
          {children ? (
            children
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
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

              {/* Dashboard Content Image */}
              <div className="mb-8"></div>

              {/* Table Section */}
              <div>
                <StockTable />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
