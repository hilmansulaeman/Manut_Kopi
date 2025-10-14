import { useState, useMemo } from 'react';
import { Search, Plus, Upload, Download, Menu, MoreHorizontal, Edit, BellRing } from 'lucide-react';
import { CreateIngredientDrawer } from '../ingredient/CreateIngredientDrawer';
import { EditIngredientDrawer } from '../ingredient/EditIngredientDrawer';
import { Badge } from '../ui/badge';
import { exportToXLSX, importFromXLSX } from '../../lib/exportUtils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '../ui/sheet';
import { useDevice } from '../../hooks/use-device';
import { useStock, StockItem } from '../../context/StockContext';
import { useSidebar } from '../../context/SidebarContext';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useToast } from '../ui/use-toast';
import { Sidebar } from '../dashboard/Sidebar';

const IngredientLibrary = ({
  onLogout,
  onMenuChange,
  onViewDetail
}: {
  onLogout?: () => void;
  onMenuChange?: (menu: string) => void;
  onViewDetail?: (ingredientId: string) => void; // Changed to string
}) => {
  const { isMobileOrTablet } = useDevice();
  const { stockItems, getLowStockItems, addStockItem } = useStock();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<StockItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [inStockFilter, setInStockFilter] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { toast } = useToast();

  const lowStockItems = useMemo(() => getLowStockItems(), [stockItems, getLowStockItems]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    stockItems.forEach(item => categories.add(item.kodeBahanBaku));
    return ['Semua', ...Array.from(categories)];
  }, [stockItems]);

  const categoryOptions = uniqueCategories.map(category => ({
    value: category,
    label: category,
  }));

  const inStockOptions = [
    { value: 'Semua', label: 'Semua Stok' },
    { value: 'Tersedia', label: 'Tersedia' },
    { value: 'Stok Menipis', label: 'Stok Menipis' },
    { value: 'Habis Stok', label: 'Habis Stok' },
  ];

  const filteredIngredients = useMemo(() => {
    return stockItems.filter(item => {
      const matchesCategory = selectedCategory === 'Semua' || item.kodeBahanBaku === selectedCategory;
      const matchesInStock = inStockFilter === 'Semua' ||
        (inStockFilter === 'Tersedia' && item.statusColor === 'green') ||
        (inStockFilter === 'Stok Menipis' && item.statusColor === 'orange') ||
        (inStockFilter === 'Habis Stok' && item.statusColor === 'red');
      const matchesSearch =
        item.kodeBahanBaku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kodeBahanBaku2.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesInStock && matchesSearch;
    });
  }, [stockItems, selectedCategory, inStockFilter, searchTerm]);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importFromXLSX(file, (importedData) => {
        if (Array.isArray(importedData)) {
          let importedCount = 0;
          importedData.forEach((item: any) => {
            if (item.kodeBahanBaku && item.kodeBahanBaku2 && item.supplier && item.stokMasuk !== undefined && item.unit && item.stockLimit !== undefined) {
              addStockItem({
                kodeBahanBaku: item.kodeBahanBaku,
                kodeBahanBaku2: item.kodeBahanBaku2,
                supplier: item.supplier,
                stokMasuk: item.stokMasuk,
                stockLimit: item.stockLimit,
                unit: item.unit,
              });
              importedCount++;
            } else {
              console.warn('Skipping malformed imported item:', item);
            }
          });
          toast({
            title: "Import Berhasil",
            description: `${importedCount} bahan baku berhasil diimpor.`,
          });
        } else {
          console.error('Imported data is not an array:', importedData);
          toast({
            title: "Import Gagal",
            description: "Format file tidak sesuai.",
            variant: "destructive",
          });
        }
      });
    }
  };

  // Helper untuk hitung sisa stok dengan aman (hindari NaN)
  const getRemaining = (item: StockItem) => {
    const byCurrent = item.currentStock;
    if (typeof byCurrent === 'number' && !Number.isNaN(byCurrent)) return byCurrent;
    const masuk = typeof (item as any).stokMasuk === 'number' ? (item as any).stokMasuk : 0;
    const keluar = typeof (item as any).stokKeluar === 'number' ? (item as any).stokKeluar : 0;
    return masuk - keluar;
  };

  return (
    <div className="min-h-screen bg-white flex font-sans text-[#313131]">
      {isMobileOrTablet ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[260px]">
            <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
            <SheetDescription className="sr-only">
              Menu navigasi sidebar untuk aplikasi MANUT KOPI
            </SheetDescription>
            <Sidebar onLogout={onLogout} activeMenu="ingredient-library" onMenuChange={onMenuChange} />
          </SheetContent>
        </Sheet>
      ) : (
        <div className={`fixed left-0 top-0 h-screen z-50 transition-all duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[260px]'}`}>
          <Sidebar
            onLogout={onLogout}
            activeMenu="ingredient-library"
            onMenuChange={onMenuChange}
            isCollapsed={isCollapsed}
            onCollapseChange={setIsCollapsed}
          />
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${!isMobileOrTablet ? (isCollapsed ? 'ml-[80px]' : 'ml-[260px]') : ''}`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h1 className="text-2xl font-semibold text-[#313131]">Halaman Bahan Baku</h1>

            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="import-file" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-black/5 bg-transparent hover:bg-black/5 text-[#313131] h-10 px-4 py-2 cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Impor
                <input id="import-file" type="file" accept=".xlsx, .xls" className="sr-only" onChange={handleImport} />
              </label>
              <Button
                variant="outline"
                className="border border-black/5 text-[#313131] hover:bg-black/5"
                onClick={() => exportToXLSX(stockItems, 'bahan_baku.xlsx')}
              >
                <Download className="w-4 h-4 mr-2" />
                Ekspor
              </Button>
              <Button onClick={() => setIsCreateDrawerOpen(true)} className="bg-[#313131] text-white hover:bg-[#313131]/90">
                <Plus className="w-4 h-4 mr-2" />
                Buat Bahan Baku
              </Button>
            </div>
          </div>

          {/* Alert: stok menipis */}
          {lowStockItems.length > 0 && (
<Alert className="mb-6 bg-[#FFEDD4] border border-[#FF8904] text-[#4B2E05] rounded-xl p-4 shadow-sm">
  <BellRing />
  <div>
    <AlertTitle className="font-semibold">Peringatan Stok Menipis!</AlertTitle>
    <AlertDescription className="text-sm">
      Bahan baku berikut memiliki stok menipis atau habis:
      <ul className="list-disc pl-5 mt-2 space-y-1">
        {lowStockItems.map(item => (
          <li key={item.id}>
            {item.kodeBahanBaku} (Sisa: {getRemaining(item)} {item.unit})
          </li>
        ))}
      </ul>
    </AlertDescription>
  </div>
</Alert>
  

          )}

          {/* Filters */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px] bg-white">
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup>
                  <SelectLabel>Kategori</SelectLabel>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={inStockFilter} onValueChange={setInStockFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Pilih Status Stok" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status Stok</SelectLabel>
                  {inStockOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari produk"
                className="w-full bg-white border border-black/5 rounded-lg pl-10 pr-4 py-2 text-sm text-[#313131] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-black/5 p-3 sm:p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-[1px]">
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-black/5">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Nama</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Kode Bahan Baku</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Pemasok</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Stok Saat Ini</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Batas Stok</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Unit</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-[#313131]/70">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIngredients.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b border-black/50 transition-colors duration-200 
                                  ${index % 2 === 1 ? 'bg-black/5' : ''} 
                                  hover:bg-black/10`}
                    >
                      <td className="py-3 px-4 text-sm font-medium text-[#313131]">
                        <button
                          onClick={() => onViewDetail?.(item.id)}
                          className="text-blue-600 hover:underline cursor-pointer bg-transparent border-none p-0 font-medium"
                        >
                          {item.kodeBahanBaku}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-sm text-[#313131]/70">{item.kodeBahanBaku2}</td>
                      <td className="py-3 px-4 text-sm text-[#313131]/70">{item.supplier}</td>
                      <td className="py-3 px-4 text-sm text-[#313131]/70">{typeof item.currentStock === 'number' ? item.currentStock : getRemaining(item)}</td>
                      <td className="py-3 px-4 text-sm text-[#313131]/70">{item.stockLimit}</td>
                      <td className="py-3 px-4 text-sm text-[#313131]/70">{item.unit}</td>
                      <td className="py-3 px-4 text-sm">
                        <Badge
                          variant="secondary"
                          className={`px-2.5 py-1 rounded-full text-xs font-medium min-w-[80px] text-center ${
                            item.statusColor === 'green'
                              ? 'bg-green-500 text-white'
                              : item.statusColor === 'orange'
                                ? 'bg-orange-500 text-white'
                                : 'bg-red-500 text-white'
                          }`}
                        >
                          {item.status || ''}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingIngredient(item);
                                setIsEditDrawerOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <CreateIngredientDrawer
        open={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
      />
      <EditIngredientDrawer
        open={isEditDrawerOpen}
        onClose={() => {
          setIsEditDrawerOpen(false);
          setEditingIngredient(null);
        }}
        ingredient={editingIngredient}
      />
    </div>
  );
};

export default IngredientLibrary;
