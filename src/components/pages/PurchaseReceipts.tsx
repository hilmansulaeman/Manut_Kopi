import React, { useState, useMemo } from 'react';
import Dashboard from '../Dashboard';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Plus, Search, MoreHorizontal, Eye, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useToast } from '../ui/use-toast';
import { Badge } from '../ui/badge';
import { useStock, StockItem } from '../../context/StockContext'; // Assuming stock context for items
import { CreatePurchaseReceiptDrawer } from '../purchase/CreatePurchaseReceiptDrawer';
import PurchaseReceiptDetail from '../purchase/PurchaseReceiptDetail'; // Import the detail component

interface PurchaseReceiptsProps {
  onLogout: () => void;
  onMenuChange: (menu: string) => void;
}

// Placeholder for Purchase Receipt type
interface PurchaseReceipt {
  id: string;
  supplier: string;
  invoiceNo: string;
  date: string;
  items: { stockItemId: string; name: string; qty: number; cost: number; discount?: number; tax?: number }[];
  status: 'draft' | 'received';
  totalAmount: number;
}

const PurchaseReceipts: React.FC<PurchaseReceiptsProps> = ({ onLogout, onMenuChange }) => {
  const { stockItems } = useStock(); // To select existing stock items
  const { toast } = useToast();

  const [purchaseReceipts, setPurchaseReceipts] = useState<PurchaseReceipt[]>([
    {
      id: 'PR001',
      supplier: 'Supplier Kopi Jaya',
      invoiceNo: 'INV-SKJ-001',
      date: '2025-10-10',
      items: [
        { stockItemId: '1', name: 'Biji Kopi Arabika', qty: 10, cost: 50000, tax: 5000 },
        { stockItemId: '2', name: 'Susu Segar', qty: 20, cost: 15000 },
      ],
      status: 'received',
      totalAmount: 850000,
    },
    {
      id: 'PR002',
      supplier: 'Supplier Gula Manis',
      invoiceNo: 'INV-SGM-002',
      date: '2025-10-12',
      items: [
        { stockItemId: '3', name: 'Gula Pasir', qty: 50, cost: 10000 },
      ],
      status: 'draft',
      totalAmount: 500000,
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false); // For creating new receipt
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false); // For viewing receipt details
  const [selectedReceipt, setSelectedReceipt] = useState<PurchaseReceipt | null>(null);

  const filteredReceipts = useMemo(() => {
    return purchaseReceipts.filter(receipt =>
      receipt.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.status.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [purchaseReceipts, searchTerm]);

  const getStatusBadgeColor = (status: 'draft' | 'received') => {
    switch (status) {
      case 'received': return 'bg-green-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const handleViewDetails = (receipt: PurchaseReceipt) => {
    setSelectedReceipt(receipt);
    setIsViewDrawerOpen(true);
  };

  // Placeholder for creating a new purchase receipt
  const handleCreateReceipt = (newReceiptData: Omit<PurchaseReceipt, 'id' | 'totalAmount'>) => {
    const newId = `PR${purchaseReceipts.length + 1}`;
    const totalAmount = newReceiptData.items.reduce((sum, item) => sum + (item.qty * item.cost), 0);
    setPurchaseReceipts(prev => [...prev, { ...newReceiptData, id: newId, totalAmount }]);
    toast({
      title: "Penerimaan Pembelian Dibuat",
      description: `Penerimaan ${newReceiptData.invoiceNo} berhasil ditambahkan.`,
    });
    setIsCreateDrawerOpen(false);
  };

  const formatReceiptForDetail = (receipt: PurchaseReceipt) => {
    return {
      id: receipt.id,
      date: receipt.date,
      supplier: receipt.supplier,
      totalAmount: receipt.totalAmount,
      items: receipt.items.map(item => ({
        ingredientName: item.name,
        quantity: item.qty,
        unit: 'unit', // Assuming a default unit or fetching it from stockItems if available
        pricePerUnit: item.cost,
        subtotal: item.qty * item.cost,
      })),
    };
  };

  return (
    <Dashboard onLogout={onLogout} onMenuChange={onMenuChange}>
      <div className="flex-1 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-[#313131]">Penerimaan Pembelian</h1>
          <Button onClick={() => setIsCreateDrawerOpen(true)} className="bg-[#313131] text-white hover:bg-[#313131]/90">
            <Plus className="w-4 h-4 mr-2" />
            Buat Penerimaan Baru
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari nomor invoice atau supplier"
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
                  <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Invoice No.</TableHead>
                  <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Supplier</TableHead>
                  <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Tanggal</TableHead>
                  <TableHead className="text-right py-3 px-4 text-sm font-medium text-[#313131]/70">Total</TableHead>
                  <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Status</TableHead>
                  <TableHead className="text-right py-3 px-4 text-sm font-medium text-[#313131]/70">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceipts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                      Tidak ada penerimaan pembelian ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReceipts.map((receipt, index) => (
                    <TableRow
                      key={receipt.id}
                      className={`border-b border-black/50 transition-colors duration-200 
                                  ${index % 2 === 1 ? 'bg-black/5' : ''} 
                                  hover:bg-black/10`}
                    >
                      <TableCell className="py-3 px-4 text-sm font-medium text-[#313131]">{receipt.invoiceNo}</TableCell>
                      <TableCell className="py-3 px-4 text-sm text-[#313131]/70">{receipt.supplier}</TableCell>
                      <TableCell className="py-3 px-4 text-sm text-[#313131]/70">{receipt.date}</TableCell>
                      <TableCell className="py-3 px-4 text-sm font-bold text-right text-[#313131]">
                        Rp {receipt.totalAmount.toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-sm">
                        <Badge
                          variant="secondary"
                          className={`px-2.5 py-1 rounded-full text-xs font-medium min-w-[80px] text-center text-white ${getStatusBadgeColor(receipt.status)}`}
                        >
                          {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
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
                            <DropdownMenuItem onClick={() => handleViewDetails(receipt)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat Detail
                            </DropdownMenuItem>
                            {/* Add other actions like Edit, Receive (if draft) */}
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

      {/* Create Purchase Receipt Drawer */}
      <CreatePurchaseReceiptDrawer
        open={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onCreate={handleCreateReceipt}
        stockItems={stockItems}
      />

      {/* View Purchase Receipt Details Drawer */}
      <PurchaseReceiptDetail
        isOpen={isViewDrawerOpen}
        onClose={() => setIsViewDrawerOpen(false)}
        receipt={selectedReceipt ? formatReceiptForDetail(selectedReceipt) : null}
      />
    </Dashboard>
  );
};

export default PurchaseReceipts;
