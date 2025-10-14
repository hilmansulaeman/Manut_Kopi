import React, { useState, useMemo } from 'react';
import Dashboard from '../Dashboard';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Plus, Search, MoreHorizontal, Check, X, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { useToast } from '../ui/use-toast';
import { Badge } from '../ui/badge';
import { useStock, StockItem } from '../../context/StockContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../ui/sheet';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { CreateStockAdjustmentDrawer } from '../stock/CreateStockAdjustmentDrawer';
import { StockAdjustmentDetailDrawer } from '../stock/StockAdjustmentDetailDrawer';

interface StockAdjustmentsProps {
  onLogout: () => void;
  onMenuChange: (menu: string) => void;
}

interface StockAdjustmentItem {
  id: string; // Unique ID for the item in the adjustment list (e.g., stockItemId-timestamp)
  stockItemId: string;
  name: string;
  oldQty: number;
  newQty: number;
  deltaQty: number;
  unit: string;
}

interface StockAdjustment {
  id: string;
  date: string;
  reason: string;
  items: StockAdjustmentItem[];
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  approvedBy?: string;
}

const StockAdjustments: React.FC<StockAdjustmentsProps> = ({ onLogout, onMenuChange }) => {
  const { stockItems, updateStockItemCurrentStock } = useStock();
  const { toast } = useToast();

  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([
    {
      id: 'SA001',
      date: '2025-10-10',
      reason: 'Kerusakan produk saat pengiriman',
      items: [{ id: '1-1', stockItemId: '1', name: 'Biji Kopi Arabika', oldQty: 100, newQty: 95, deltaQty: -5, unit: 'kg' }],
      status: 'pending',
      requestedBy: 'Employee One',
    },
    {
      id: 'SA002',
      date: '2025-10-11',
      reason: 'Penyesuaian stok akhir bulan',
      items: [{ id: '2-1', stockItemId: '2', name: 'Susu Segar', oldQty: 150, newQty: 155, deltaQty: 5, unit: 'liter' }],
      status: 'approved',
      requestedBy: 'Admin User',
      approvedBy: 'Super Admin',
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedAdjustment, setSelectedAdjustment] = useState<StockAdjustment | null>(null);

  const filteredAdjustments = useMemo(() => {
    return adjustments.filter(adj =>
      adj.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adj.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adj.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adj.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [adjustments, searchTerm]);

  const getStatusBadgeColor = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const handleViewDetails = (adjustment: StockAdjustment) => {
    setSelectedAdjustment(adjustment);
    setIsViewDrawerOpen(true);
  };

  const handleApproveAdjustment = (id: string) => {
    setAdjustments(prev =>
      prev.map(adj => {
        if (adj.id === id) {
          // Apply stock changes
          adj.items.forEach(item => {
            updateStockItemCurrentStock(item.stockItemId, item.newQty);
          });
          toast({
            title: "Penyesuaian Stok Disetujui",
            description: `Penyesuaian ${adj.id} telah disetujui dan stok diperbarui.`,
          });
          return { ...adj, status: 'approved', approvedBy: 'Admin User' }; // Placeholder for actual admin
        }
        return adj;
      })
    );
  };

  const handleRejectAdjustment = (id: string) => {
    setAdjustments(prev =>
      prev.map(adj =>
        adj.id === id ? { ...adj, status: 'rejected', approvedBy: 'Admin User' } : adj
      )
    );
    toast({
      title: "Penyesuaian Stok Ditolak",
      description: `Penyesuaian telah ditolak.`,
    });
  };

  const handleCreateAdjustment = (newAdjustmentData: { reason: string; items: StockAdjustmentItem[] }) => {
    const newId = `SA${adjustments.length + 1}`;
    const newAdjustment: StockAdjustment = {
      id: newId,
      date: new Date().toISOString().split('T')[0],
      reason: newAdjustmentData.reason,
      items: newAdjustmentData.items,
      status: 'pending',
      requestedBy: 'Employee One', // Placeholder
    };
    setAdjustments(prev => [...prev, newAdjustment]);
    toast({
      title: "Penyesuaian Stok Diajukan",
      description: `Penyesuaian ${newId} telah diajukan untuk persetujuan.`,
    });
    setIsCreateDrawerOpen(false);
  };

  return (
    <Dashboard onLogout={onLogout} onMenuChange={onMenuChange}>
      <div className="flex-1 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-[#313131]">Penyesuaian Stok</h1>
          <Button onClick={() => setIsCreateDrawerOpen(true)} className="bg-[#313131] text-white hover:bg-[#313131]/90">
            <Plus className="w-4 h-4 mr-2" />
            Buat Penyesuaian Baru
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari alasan atau item"
              className="w-full bg-white border border-black/5 rounded-lg pl-10 pr-4 py-2 text-sm text-[#313131] placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 p-3 sm:p-6 shadow-sm">
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">ID Penyesuaian</TableHead>
                  <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Tanggal</TableHead>
                  <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Alasan</TableHead>
                  <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Diajukan Oleh</TableHead>
                  <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Status</TableHead>
                  <TableHead className="text-right py-3 px-4 text-sm font-medium text-[#313131]/70">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdjustments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                      Tidak ada penyesuaian stok ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAdjustments.map((adjustment, index) => (
                    <TableRow
                      key={adjustment.id}
                      className={`border-b border-black/50 transition-colors duration-200 
                                  ${index % 2 === 1 ? 'bg-black/5' : ''} 
                                  hover:bg-black/10`}
                    >
                      <TableCell className="py-3 px-4 text-sm font-medium text-[#313131]">{adjustment.id}</TableCell>
                      <TableCell className="py-3 px-4 text-sm text-[#313131]/70">{adjustment.date}</TableCell>
                      <TableCell className="py-3 px-4 text-sm text-[#313131]/70">{adjustment.reason}</TableCell>
                      <TableCell className="py-3 px-4 text-sm text-[#313131]/70">{adjustment.requestedBy}</TableCell>
                      <TableCell className="py-3 px-4 text-sm">
                        <Badge
                          variant="secondary"
                          className={`px-2.5 py-1 rounded-full text-xs font-medium min-w-[80px] text-center text-white ${getStatusBadgeColor(adjustment.status)}`}
                        >
                          {adjustment.status.charAt(0).toUpperCase() + adjustment.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(adjustment)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat Detail
                            </DropdownMenuItem>
                            {adjustment.status === 'pending' && (
                              <>
                                <DropdownMenuItem onClick={() => handleApproveAdjustment(adjustment.id)} className="text-green-600 focus:text-green-600">
                                  <Check className="mr-2 h-4 w-4" />
                                  Setujui
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRejectAdjustment(adjustment.id)} className="text-red-600 focus:text-red-600">
                                  <X className="mr-2 h-4 w-4" />
                                  Tolak
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Create Stock Adjustment Drawer */}
      <CreateStockAdjustmentDrawer
        open={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onCreate={handleCreateAdjustment}
        stockItems={stockItems}
      />

      {/* View Stock Adjustment Details Drawer */}
      <StockAdjustmentDetailDrawer
        open={isViewDrawerOpen}
        onOpenChange={setIsViewDrawerOpen}
        selectedAdjustment={selectedAdjustment}
        onApproveAdjustment={handleApproveAdjustment}
        onRejectAdjustment={handleRejectAdjustment}
      />
    </Dashboard>
  );
};

export default StockAdjustments;
