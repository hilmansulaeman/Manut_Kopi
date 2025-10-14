import React, { useMemo } from 'react';
import Dashboard from '../Dashboard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useStock } from '../../context/StockContext';
import { Badge } from '../ui/badge';

interface MinimumStockIndicatorProps {
  onLogout: () => void;
  onMenuChange: (menu: string) => void;
}

const MinimumStockIndicator: React.FC<MinimumStockIndicatorProps> = ({ onLogout, onMenuChange }) => {
  const { stockItems, getLowStockItems } = useStock();

  const lowStockItems = useMemo(() => getLowStockItems(), [stockItems, getLowStockItems]);

  return (
    <Dashboard onLogout={onLogout} onMenuChange={onMenuChange}>
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-[#313131]">Indikator Stok Minimum</h1>

        {lowStockItems.length === 0 ? (
          <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded-lg">
            <p className="font-semibold">Semua stok bahan baku dalam kondisi aman.</p>
            <p className="text-sm">Tidak ada bahan baku yang mendekati atau di bawah batas stok minimum.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-black/5 p-3 sm:p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Bahan Baku dengan Stok Menipis atau Habis</h2>
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Nama Bahan Baku</TableHead>
                    <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Kode Bahan Baku</TableHead>
                    <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Supplier</TableHead>
                    <TableHead className="text-right py-3 px-4 text-sm font-medium text-[#313131]/70">Stok Saat Ini</TableHead>
                    <TableHead className="text-right py-3 px-4 text-sm font-medium text-[#313131]/70">Batas Stok</TableHead>
                    <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Unit</TableHead>
                    <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockItems.map((item, index) => (
                    <TableRow
                      key={item.id}
                      className={`border-b border-black/50 transition-colors duration-200 
                                  ${index % 2 === 1 ? 'bg-black/5' : ''} 
                                  hover:bg-black/10`}
                    >
                      <TableCell className="py-3 px-4 text-sm font-medium text-[#313131]">{item.kodeBahanBaku}</TableCell>
                      <TableCell className="py-3 px-4 text-sm text-[#313131]/70">{item.kodeBahanBaku2}</TableCell>
                      <TableCell className="py-3 px-4 text-sm text-[#313131]/70">{item.supplier}</TableCell>
                      <TableCell className="py-3 px-4 text-sm font-bold text-right text-[#313131]">{item.currentStock}</TableCell>
                      <TableCell className="py-3 px-4 text-sm text-right text-[#313131]/70">{item.stockLimit}</TableCell>
                      <TableCell className="py-3 px-4 text-sm text-[#313131]/70">{item.unit}</TableCell>
                      <TableCell className="py-3 px-4 text-sm">
                        <Badge
                          variant="secondary"
                          className={`px-2.5 py-1 rounded-full text-xs font-medium min-w-[80px] text-center text-white ${
                            item.statusColor === 'orange'
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                          }`}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </Dashboard>
  );
};

export default MinimumStockIndicator;
