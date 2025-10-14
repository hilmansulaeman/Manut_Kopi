import { useEffect, useState } from 'react';
import { useStock, StockItem } from '../../context/StockContext';
import { useSidebar } from '../../context/SidebarContext';
import { useDevice } from '../../hooks/use-device'; // Keep useDevice
import { Button } from '../ui/button';
import { ArrowLeft, Menu } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import Sidebar from '../../imports/Sidebar';

interface IngredientDetailProps {
  ingredientId: string; // Changed to string
  onBack: () => void;
  onLogout?: () => void;
  onMenuChange?: (menu: string) => void;
}

const IngredientDetail = ({ ingredientId, onBack, onLogout, onMenuChange }: IngredientDetailProps) => {
  const { stockItems } = useStock();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const { isMobileOrTablet } = useDevice(); // Use isMobileOrTablet from useDevice
  const [ingredient, setIngredient] = useState<StockItem | null>(null);

  useEffect(() => {
    console.log('IngredientDetail - ingredientId:', ingredientId);
    console.log('IngredientDetail - stockItems:', stockItems);
    const foundIngredient = stockItems.find(item => item.id === ingredientId);
    console.log('IngredientDetail - foundIngredient:', foundIngredient);
    setIngredient(foundIngredient || null);
  }, [ingredientId, stockItems]);

  if (!ingredient) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans text-[#313131]">
        <h1 className="mb-4">Bahan Baku tidak ditemukan</h1>
        <Button onClick={onBack} className="bg-[#313131] text-white hover:bg-[#313131]/90">
          Kembali ke Perpustakaan Bahan Baku
        </Button>
      </div>
    );
  }

  // Simulate stock history for demonstration purposes
  const simulatedHistory = [
    { date: '2025-09-28', type: 'Masuk', quantity: 50, unit: ingredient.unit, notes: 'Pembelian dari supplier' },
    { date: '2025-09-29', type: 'Keluar', quantity: 20, unit: ingredient.unit, notes: 'Digunakan untuk produksi' },
    { date: '2025-09-29', type: 'Masuk', quantity: 10, unit: ingredient.unit, notes: 'Pengembalian stok' },
    { date: '2025-09-30', type: 'Keluar', quantity: 15, unit: ingredient.unit, notes: 'Digunakan untuk produksi' },
  ];

  const totalStokKeluar = simulatedHistory
    .filter(entry => entry.type === 'Keluar')
    .reduce((sum, entry) => sum + entry.quantity, 0);

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

      <div className={`flex-1 transition-all duration-300 ${!isMobileOrTablet ? (isCollapsed ? 'ml-[80px]' : 'ml-[260px]') : ''}`}>
        <div className="max-w-[1200px] mx-auto px-6 py-8 w-full">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="mb-6 text-[#313131] hover:bg-black/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>

          <h1 className="mb-6 text-[#313131]">
            Detail Bahan Baku: {ingredient.kodeBahanBaku}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border border-black/5 transition-all duration-200 hover:shadow-md hover:-translate-y-[1px]">
              <CardHeader>
                <CardTitle>Informasi Umum</CardTitle>
                <CardDescription>Detail dasar bahan baku.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Kode Bahan Baku:</strong> {ingredient.kodeBahanBaku}</p>
                <p><strong>Kode Bahan Baku 2:</strong> {ingredient.kodeBahanBaku2}</p>
                <p><strong>Pemasok:</strong> {ingredient.supplier}</p>
                <p><strong>Unit:</strong> {ingredient.unit}</p>
                <p><strong>Status:</strong> {ingredient.status}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border border-black/5 transition-all duration-200 hover:shadow-md hover:-translate-y-[1px]">
              <CardHeader>
                <CardTitle>Ringkasan Stok</CardTitle>
                <CardDescription>Jumlah stok masuk dan keluar.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Stok Masuk:</strong> {ingredient.stokMasuk} {ingredient.unit}</p>
                <p><strong>Stok Keluar:</strong> {totalStokKeluar} {ingredient.unit}</p>
                <p><strong>Stok Saat Ini:</strong> {ingredient.currentStock} {ingredient.unit}</p>
                <p><strong>Batas Stok:</strong> {ingredient.stockLimit} {ingredient.unit}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border border-black/5 transition-all duration-200 hover:shadow-md hover:-translate-y-[1px]">
            <CardHeader>
              <CardTitle>Riwayat Stok</CardTitle>
              <CardDescription>Catatan transaksi stok.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead>Kuantitas</TableHead>
                      <TableHead>Catatan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {simulatedHistory.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-md ${
                            entry.type === 'Masuk' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {entry.type}
                          </span>
                        </TableCell>
                        <TableCell>{entry.quantity} {entry.unit}</TableCell>
                        <TableCell>{entry.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IngredientDetail;
