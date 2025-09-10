import { useState, useMemo } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Search, Plus, Upload, Download } from 'lucide-react';
import { CreateIngredientDrawer } from '../components/ingredient/CreateIngredientDrawer';
import { Toaster } from '@/components/ui/toaster';
import { Badge } from '@/components/ui/badge';
import { exportToXLSX, importFromXLSX } from '@/lib/exportUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Ingredient {
  id: number;
  name: string; // Nama Barang
  kodeBahanBaku: string;
  namaBahanBaku: string;
  supplier: string;
  stockMasuk: number;
  stockKeluar: number;
  status: 'In' | 'Out';
  createdAt: string; // Tanggal
}

const mockIngredients: Ingredient[] = [
  { id: 1, name: 'Kopi', kodeBahanBaku: 'KB001', namaBahanBaku: 'Kopi Arabika', supplier: 'Pemasok A', stockMasuk: 100, stockKeluar: 50, status: 'In', createdAt: '2023-01-15' },
  { id: 2, name: 'Macha', kodeBahanBaku: 'KB002', namaBahanBaku: 'Bubuk Macha', supplier: 'Pemasok B', stockMasuk: 200, stockKeluar: 180, status: 'In', createdAt: '2023-02-20' },
  { id: 3, name: 'Susu SKM', kodeBahanBaku: 'KB003', namaBahanBaku: 'Susu Kental Manis', supplier: 'Pemasok C', stockMasuk: 50, stockKeluar: 60, status: 'Out', createdAt: '2023-03-10' },
  { id: 4, name: 'Susu UHT', kodeBahanBaku: 'KB004', namaBahanBaku: 'Susu UHT Full Cream', supplier: 'Pemasok D', stockMasuk: 150, stockKeluar: 70, status: 'In', createdAt: '2023-04-01' },
];

const IngredientLibrary = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>(mockIngredients);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua'); // Keep for future filtering if categories are added
  const [inStockFilter, setInStockFilter] = useState<string>('Semua'); // Keep for future filtering
  const [searchTerm, setSearchTerm] = useState<string>('');

  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    ingredients.forEach(ingredient => categories.add(ingredient.namaBahanBaku)); // Using namaBahanBaku as category for now
    return ['Semua', ...Array.from(categories)];
  }, [ingredients]);

  const categoryOptions = uniqueCategories.map(category => ({
    value: category,
    label: category,
  }));

  const inStockOptions = [
    { value: 'Semua', label: 'Semua Stok' },
    { value: 'In Stock', label: 'Tersedia' },
    { value: 'Out of Stock', label: 'Habis Stok' },
  ];

  const filteredIngredients = useMemo(() => {
    return ingredients.filter(ingredient => {
      const matchesCategory = selectedCategory === 'Semua' || ingredient.namaBahanBaku === selectedCategory;
      const matchesInStock = inStockFilter === 'Semua' || 
                             (inStockFilter === 'In Stock' && ingredient.status === 'In') ||
                             (inStockFilter === 'Out of Stock' && ingredient.status === 'Out');
      const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ingredient.kodeBahanBaku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ingredient.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesInStock && matchesSearch;
    });
  }, [ingredients, selectedCategory, inStockFilter, searchTerm]);

  const handleCreateIngredient = (newIngredient: Ingredient) => {
    setIngredients((prev) => [...prev, newIngredient]);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importFromXLSX(file, (importedData) => {
        // Assuming the imported data matches the Ingredient interface structure
        setIngredients((prev) => [...prev, ...importedData as Ingredient[]]);
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans text-[#313131]">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-[260px]">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-[#313131]">Halaman Bahan Baku</h1>
            
            <div className="flex items-center gap-3">
              <label htmlFor="import-file" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-black/5 bg-transparent hover:bg-black/5 text-[#313131] h-10 px-4 py-2 cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Impor
                <input id="import-file" type="file" accept=".xlsx, .xls" className="sr-only" onChange={handleImport} />
              </label>
              <Button 
                variant="outline" 
                className="border border-black/5 text-[#313131] hover:bg-black/5"
                onClick={() => exportToXLSX(ingredients, 'bahan_baku.xlsx')}
              >
                <Download className="w-4 h-4 mr-2" />
                Ekspor
              </Button>
              <Button onClick={() => setIsDrawerOpen(true)} className="bg-[#313131] text-white hover:bg-[#313131]/90">
                <Plus className="w-4 h-4 mr-2" />
                Buat Bahan Baku
              </Button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={inStockFilter} onValueChange={setInStockFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih Status Stok" />
              </SelectTrigger>
              <SelectContent>
                {inStockOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari produk"
                className="w-full bg-white/80 backdrop-blur-sm border border-black/5 rounded-lg pl-10 pr-4 py-2 text-sm text-[#313131] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-black/5 p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-[1px]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/5">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Nama</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Kode Bahan Baku</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Nama Bahan Baku</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Pemasok</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Stok Masuk</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Stok Keluar</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIngredients.map((ingredient, index) => (
                    <tr 
                      key={ingredient.id} 
                      className={`border-b border-black/50 transition-colors duration-200 
                                  ${index % 2 === 1 ? 'bg-black/5' : ''} 
                                  hover:bg-black/10`}
                    >
                      <td className="py-3 px-4 text-sm font-medium text-[#313131]">{ingredient.name}</td>
                      <td className="py-3 px-4 text-sm text-[#313131]/70">{ingredient.kodeBahanBaku}</td>
                      <td className="py-3 px-4 text-sm text-[#313131]/70">{ingredient.namaBahanBaku}</td>
                      <td className="py-3 px-4 text-sm text-[#313131]/70">{ingredient.supplier}</td>
                      <td className="py-3 px-4 text-sm text-[#313131]/70">{ingredient.stockMasuk}</td>
                      <td className="py-3 px-4 text-sm text-[#313131]/70">{ingredient.stockKeluar}</td>
                      <td className="py-3 px-4 text-sm text-[#313131]/70">
                        {ingredient.status === 'Out' ? (
                          <Badge variant="destructive" className="bg-red-500 text-white">Keluar</Badge>
                        ) : (
                          <Badge className="bg-green-500 text-white">Masuk</Badge>
                        )}
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
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onCreate={handleCreateIngredient}
      />
      <Toaster />
    </div>
  );
};

export default IngredientLibrary;
