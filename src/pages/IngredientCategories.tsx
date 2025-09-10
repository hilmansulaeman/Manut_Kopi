import { useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Plus, Upload, Edit2, Trash2, Download, Menu } from 'lucide-react';
import { CategoryFormModal } from '../components/ingredient/CategoryFormModal';
import { DeleteConfirmModal } from '../components/ingredient/DeleteConfirmModal';
import { Button } from '@/components/ui/button';
import { exportToXLSX, importFromXLSX } from '@/lib/exportUtils';
import { useIsMobile } from '../hooks/use-mobile';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@/components/ui/drawer';

interface Category {
  id: number;
  name: string;
  items: number;
  unit: string;
  lastUpdated: string;
}

const mockCategories: Category[] = [
  { id: 1, name: 'Biji Kopi', items: 12, unit: 'kg', lastUpdated: 'Hari Ini - 10:30' },
  { id: 2, name: 'Produk Susu', items: 8, unit: 'ltr', lastUpdated: 'Kemarin - 16:45' },
  { id: 3, name: 'Pemanis', items: 5, unit: 'kg', lastUpdated: '2 hari yang lalu' },
  { id: 4, name: 'Sirup', items: 15, unit: 'ml', lastUpdated: '3 hari yang lalu' },
];

const IngredientCategories = () => {
  const isMobile = useIsMobile();
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false); // State for sidebar drawer
  const [categoryToEdit, setCategoryToEdit] = useState<Category | undefined>(undefined);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleCreateClick = () => {
    setCategoryToEdit(undefined);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (category: Category) => {
    setCategoryToEdit(category);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      setCategories(categories.filter(cat => cat.id !== categoryToDelete.id));
      setCategoryToDelete(null);
    }
    setIsDeleteModalOpen(false);
  };

  const handleFormSubmit = (data: { id?: number; name: string; unit: string; description?: string }) => {
    if (data.id) {
      // Edit existing category
      setCategories(categories.map(cat => 
        cat.id === data.id 
          ? { ...cat, name: data.name, unit: data.unit, lastUpdated: 'Baru saja' }
          : cat
      ));
    } else {
      // Create new category
      const newCategory: Category = {
        id: Math.max(...categories.map(c => c.id), 0) + 1,
        name: data.name,
        items: 0,
        unit: data.unit,
        lastUpdated: 'Baru saja'
      };
      setCategories([...categories, newCategory]);
    }
    setIsFormModalOpen(false);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importFromXLSX(file, (importedData) => {
        // Assuming the imported data matches the Category interface structure
        setCategories((prev) => [...prev, ...importedData as Category[]]);
      });
    }
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
          <span className="text-2xl">📂</span>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-ink mb-2">Belum ada kategori</h3>
      <p className="text-ink/60 text-sm mb-6 max-w-sm text-center">
        Buat kategori bahan baku pertama Anda untuk mengatur inventaris Anda dengan lebih baik
      </p>
      <Button
        onClick={handleCreateClick}
        className="flex items-center gap-2 bg-ink text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-ink/90 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Buat Kategori
      </Button>
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-ink">Kategori Bahan Baku</h1>
            
            <div className="flex items-center gap-3">
              <label htmlFor="import-categories-file" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-card-border bg-transparent hover:bg-black/5 text-ink h-10 px-4 py-2 cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Impor
                <input id="import-categories-file" type="file" accept=".xlsx, .xls" className="sr-only" onChange={handleImport} />
              </label>
              <Button 
                variant="outline" 
                className="border border-card-border text-ink hover:bg-black/5"
                onClick={() => exportToXLSX(categories, 'kategori_bahan_baku.xlsx')}
              >
                <Download className="w-4 h-4 mr-2" />
                Ekspor
              </Button>
              <Button
                onClick={handleCreateClick}
                className="bg-ink text-white hover:bg-ink/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Buat Kategori
              </Button>
            </div>
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
                      <th className="text-left py-3 px-4 text-sm font-medium text-ink/70">Satuan</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-ink/70">Terakhir Diperbarui</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-ink/70">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id} className="border-b border-card-border/50 hover:bg-black/2 transition-colors">
                        <td className="py-3 px-4 text-sm font-medium text-ink">{category.name}</td>
                        <td className="py-3 px-4 text-sm text-ink/70">{category.items}</td>
                        <td className="py-3 px-4 text-sm text-ink/70">{category.unit}</td>
                        <td className="py-3 px-4 text-sm text-ink/70">{category.lastUpdated}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="p-1.5 hover:bg-black/5 rounded-lg transition-colors"
                              onClick={() => handleEditClick(category)}
                            >
                              <Edit2 className="w-4 h-4 text-ink/60" />
                            </Button>
                            <Button 
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(category)}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CategoryFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={categoryToEdit}
      />
      
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        categoryName={categoryToDelete?.name || ''}
      />
    </div>
  );
};

export default IngredientCategories;
