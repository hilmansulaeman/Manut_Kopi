import { useState, useMemo } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '../hooks/use-mobile';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useStock } from '../context/StockContext'; // Import useStock

interface Category {
  id: number;
  name: string;
  items: number;
  lastUpdated: string; // Simplified, can be derived or omitted
}

const IngredientCategories = () => {
  const isMobile = useIsMobile();
  const { stockItems } = useStock(); // Use stockItems from context
  const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false); // State for sidebar drawer

  const categories: Category[] = useMemo(() => {
    const categoryMap = new Map<string, { count: number; lastUpdated: string }>();

    stockItems.forEach(item => {
      const categoryName = item.kodeBahanBaku; // Use kodeBahanBaku as category name
      if (categoryMap.has(categoryName)) {
        categoryMap.get(categoryName)!.count++;
        // Update lastUpdated if needed, for now, just keep it simple
      } else {
        categoryMap.set(categoryName, { count: 1, lastUpdated: 'Baru saja' }); // Placeholder
      }
    });

    return Array.from(categoryMap.entries()).map(([name, data], index) => ({
      id: index + 1, // Simple ID for display
      name: name,
      items: data.count,
      lastUpdated: data.lastUpdated,
    }));
  }, [stockItems]);

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
          <span className="text-2xl">📂</span>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-ink mb-2">Belum ada kategori</h3>
      <p className="text-ink/60 text-sm mb-6 max-w-sm text-center">
        Buat bahan baku di "Halaman Bahan Baku" untuk melihat kategori di sini.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex">
      {isMobile ? (
        <Drawer open={isSidebarDrawerOpen} onOpenChange={setIsSidebarDrawerOpen} direction="left">
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
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h1 className="text-2xl font-semibold text-ink">Kategori Bahan Baku</h1>
          </div>
          
          {/* Table or Empty State */}
          {categories.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-card-border p-6">
              <EmptyState />
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-card-border p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-card-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-ink/70">Nama Kategori</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-ink/70">Item</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-ink/70">Terakhir Diperbarui</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id} className="border-b border-card-border/50 hover:bg-black/2 transition-colors">
                        <td className="py-3 px-4 text-sm font-medium text-ink">{category.name}</td>
                        <td className="py-3 px-4 text-sm text-ink/70">{category.items}</td>
                        <td className="py-3 px-4 text-sm text-ink/70">{category.lastUpdated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientCategories;
