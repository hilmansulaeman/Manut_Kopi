import React, { useState, useMemo } from 'react';
import Dashboard from '../Dashboard';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Search } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { Badge } from '../ui/badge';
import { useStock, StockOutTransaction } from '../../context/StockContext'; // Assuming stock context for stock movements
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface StockMovementHistoryProps {
  onLogout: () => void;
  onMenuChange: (menu: string) => void;
}

// Placeholder for Stock Movement type (can be extended to include stock-in, adjustments etc.)
interface StockMovement {
  id: string;
  type: 'in' | 'out' | 'adjustment';
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  date: string;
  reason?: string;
  referenceId?: string; // e.g., Purchase Receipt ID, Stock Adjustment ID, Transaction ID
  actor?: string; // Who performed the movement
}

const StockMovementHistory: React.FC<StockMovementHistoryProps> = ({ onLogout, onMenuChange }) => {
  const { stockOutTransactions, stockItems } = useStock();
  const { toast } = useToast();

  // Combine stock-out transactions with a placeholder for stock-in/adjustments
  const allStockMovements: StockMovement[] = useMemo(() => {
    const movements: StockMovement[] = stockOutTransactions.map(trans => ({
      id: trans.id,
      type: 'out',
      itemId: trans.stockItemId,
      itemName: trans.kodeBahanBaku,
      quantity: trans.jumlah,
      unit: trans.unit,
      date: `${trans.tanggal} ${trans.waktu}`,
      reason: trans.keterangan,
      referenceId: trans.id,
      actor: trans.dibuatOleh,
    }));

    // Add placeholder for stock-in movements (e.g., from purchase receipts)
    // For now, we'll just use the initial stokMasuk as a "stock-in" event
    stockItems.forEach(item => {
      movements.push({
        id: `IN-${item.id}-${Date.now()}`, // Unique ID
        type: 'in',
        itemId: item.id,
        itemName: item.kodeBahanBaku,
        quantity: item.stokMasuk,
        unit: item.unit,
        date: '2025-01-01 08:00:00', // Placeholder date
        reason: 'Initial Stock / Purchase Receipt',
        referenceId: `PR-${item.id}`,
        actor: 'System',
      });
    });

    // Sort by date descending
    return movements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [stockOutTransactions, stockItems]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'in' | 'out' | 'adjustment'>('all');
  const [filterProduct, setFilterProduct] = useState('all-products-filter'); // Changed initial state

  const filteredMovements = useMemo(() => {
    return allStockMovements.filter(movement => {
      const matchesSearch =
        movement.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.referenceId?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || movement.type === filterType;
      const matchesProduct = filterProduct === 'all-products-filter' || movement.itemId === filterProduct; // Updated logic
      return matchesSearch && matchesType && matchesProduct;
    });
  }, [allStockMovements, searchTerm, filterType, filterProduct]);

  const getMovementTypeBadgeColor = (type: 'in' | 'out' | 'adjustment') => {
    switch (type) {
      case 'in': return 'bg-green-500';
      case 'out': return 'bg-red-500';
      case 'adjustment': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <Dashboard onLogout={onLogout} onMenuChange={onMenuChange}>
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-[#313131]">Riwayat Pergerakan Stok</h1>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari nama item, alasan, atau referensi"
              className="w-full bg-white border border-black/5 rounded-lg pl-10 pr-4 py-2 text-sm text-[#313131] placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={(value: 'all' | 'in' | 'out' | 'adjustment') => setFilterType(value)}>
            <SelectTrigger className="w-full md:w-[180px] bg-white">
              <SelectValue placeholder="Filter Tipe" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <SelectLabel>Tipe Pergerakan</SelectLabel>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="in">Masuk</SelectItem>
                <SelectItem value="out">Keluar</SelectItem>
                <SelectItem value="adjustment">Penyesuaian</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={filterProduct} onValueChange={setFilterProduct}>
            <SelectTrigger className="w-full md:w-[200px] bg-white">
              <SelectValue placeholder="Filter Produk" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <SelectLabel>Produk</SelectLabel>
                <SelectItem value="all-products-filter">Semua Produk</SelectItem> {/* Changed value */}
                {stockItems.map(item => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.kodeBahanBaku}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 p-3 sm:p-6 shadow-sm">
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Tanggal & Waktu</TableHead>
                  <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Item</TableHead>
                  <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Tipe</TableHead>
                  <TableHead className="text-right py-3 px-4 text-sm font-medium text-[#313131]/70">Kuantitas</TableHead>
                  <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Alasan/Referensi</TableHead>
                  <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Oleh</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                      Tidak ada riwayat pergerakan stok ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMovements.map((movement, index) => (
                    <TableRow
                      key={movement.id}
                      className={`border-b border-black/50 transition-colors duration-200 
                                  ${index % 2 === 1 ? 'bg-black/5' : ''} 
                                  hover:bg-black/10`}
                    >
                      <TableCell className="py-3 px-4 text-sm font-medium text-[#313131]">{movement.date}</TableCell>
                      <TableCell className="py-3 px-4 text-sm text-[#313131]/70">{movement.itemName}</TableCell>
                      <TableCell className="py-3 px-4 text-sm">
                        <Badge
                          variant="secondary"
                          className={`px-2.5 py-1 rounded-full text-xs font-medium min-w-[80px] text-center text-white ${getMovementTypeBadgeColor(movement.type)}`}
                        >
                          {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className={`py-3 px-4 text-sm font-bold text-right ${movement.type === 'out' ? 'text-red-600' : 'text-green-600'}`}>
                        {movement.type === 'out' ? '-' : '+'}{movement.quantity} {movement.unit}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-sm text-[#313131]/70">{movement.reason || movement.referenceId || '-'}</TableCell>
                      <TableCell className="py-3 px-4 text-sm text-[#313131]/70">{movement.actor || '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default StockMovementHistory;
