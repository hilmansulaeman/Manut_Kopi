import React, { useState, useMemo } from 'react';
import Dashboard from '../Dashboard';
import { useUsers } from '../../context/UserContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Search, MoreHorizontal, Undo2 } from 'lucide-react';
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

interface SalesHistoryProps {
  onLogout: () => void;
  onMenuChange: (menu: string) => void;
}

// Placeholder for Transaction type, since POSContext is removed
interface Transaction {
  id: string;
  invoiceNo: string;
  createdAt: string;
  outlet: string;
  cashierId: string;
  grandTotal: number;
  status: 'completed' | 'held' | 'void' | 'draft';
  items: { productId: string; name: string; quantity: number; price: number }[];
}

const mockTransactions: Transaction[] = [
  {
    id: 'TRX001',
    invoiceNo: 'INV-20251014-001',
    createdAt: '2025-10-14T09:00:00Z',
    outlet: 'Outlet A',
    cashierId: 'cashier1',
    grandTotal: 75000,
    status: 'completed',
    items: [{ productId: 'prod1', name: 'Kopi Susu', quantity: 1, price: 25000 }, { productId: 'prod2', name: 'Roti Bakar', quantity: 2, price: 25000 }],
  },
  {
    id: 'TRX002',
    invoiceNo: 'INV-20251013-002',
    createdAt: '2025-10-13T14:30:00Z',
    outlet: 'Outlet B',
    cashierId: 'cashier2',
    grandTotal: 50000,
    status: 'completed',
    items: [{ productId: 'prod3', name: 'Teh Tarik', quantity: 2, price: 25000 }],
  },
  {
    id: 'TRX003',
    invoiceNo: 'INV-20251012-003',
    createdAt: '2025-10-12T11:00:00Z',
    outlet: 'Outlet A',
    cashierId: 'cashier1',
    grandTotal: 30000,
    status: 'void',
    items: [{ productId: 'prod1', name: 'Kopi Susu', quantity: 1, price: 25000 }],
  },
];

const SalesHistory: React.FC<SalesHistoryProps> = ({ onLogout, onMenuChange }) => {
  const { users } = useUsers();
  const { toast } = useToast();

  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction =>
      transaction.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.cashierId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.outlet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.status.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [transactions, searchTerm]);

  const getStatusBadgeColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'held': return 'bg-yellow-500';
      case 'void': return 'bg-red-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const handleVoidTransaction = (transactionId: string) => {
    setTransactions(prev => prev.map(t => t.id === transactionId ? { ...t, status: 'void' } : t));
    toast({
      title: "Transaksi Dibatalkan",
      description: "Transaksi telah berhasil dibatalkan.",
    });
  };

  const handleInitiateReturn = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsReturnDialogOpen(true);
  };

  const handleProcessReturn = () => {
    if (selectedTransaction) {
      handleVoidTransaction(selectedTransaction.id);
      toast({
        title: "Retur Diproses",
        description: `Retur untuk invoice ${selectedTransaction.invoiceNo} telah diproses.`,
      });
      setSelectedTransaction(null);
      setIsReturnDialogOpen(false);
    }
  };

  return (
    <Dashboard onLogout={onLogout} onMenuChange={onMenuChange}>
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-[#313131]">Riwayat Penjualan</h1>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari invoice, kasir, atau outlet"
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
                  <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Tanggal</TableHead>
                  <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Outlet</TableHead>
                  <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Kasir</TableHead>
                  <TableHead className="text-right py-3 px-4 text-sm font-medium text-[#313131]/70">Total</TableHead>
                  <TableHead className="text-left py-3 px-4 text-sm font-medium text-[#313131]/70">Status</TableHead>
                  <TableHead className="text-right py-3 px-4 text-sm font-medium text-[#313131]/70">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                      Tidak ada transaksi ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction, index) => (
                    <TableRow
                      key={transaction.id}
                      className={`border-b border-black/50 transition-colors duration-200 
                                  ${index % 2 === 1 ? 'bg-black/5' : ''} 
                                  hover:bg-black/10`}
                    >
                      <TableCell className="py-3 px-4 text-sm font-medium text-[#313131]">{transaction.invoiceNo}</TableCell>
                      <TableCell className="py-3 px-4 text-sm text-[#313131]/70">{new Date(transaction.createdAt).toLocaleString('id-ID')}</TableCell>
                      <TableCell className="py-3 px-4 text-sm text-[#313131]/70">{transaction.outlet}</TableCell>
                      <TableCell className="py-3 px-4 text-sm text-[#313131]/70">
                        {users.find(u => u.id === transaction.cashierId)?.name || 'N/A'}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-sm font-bold text-right text-[#313131]">
                        Rp {transaction.grandTotal.toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-sm">
                        <Badge
                          variant="secondary"
                          className={`px-2.5 py-1 rounded-full text-xs font-medium min-w-[80px] text-center text-white ${getStatusBadgeColor(transaction.status)}`}
                        >
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
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
                            {transaction.status === 'completed' && (
                              <DropdownMenuItem
                                onClick={() => handleInitiateReturn(transaction)}
                                className="text-blue-600 focus:text-blue-600"
                              >
                                <Undo2 className="mr-2 h-4 w-4" />
                                Retur Penjualan
                              </DropdownMenuItem>
                            )}
                            {/* Add other actions like View Details, Print Invoice etc. */}
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

      {/* Return Dialog */}
      <AlertDialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Proses Retur Penjualan</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan memproses retur untuk invoice: <span className="font-semibold">{selectedTransaction?.invoiceNo}</span>.
              <br />
              <span className="text-red-500">Catatan: Fungsionalitas retur item spesifik dan otorisasi supervisor belum diimplementasikan sepenuhnya. Saat ini, retur akan membatalkan seluruh transaksi.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            {selectedTransaction && (
              <div>
                <h3 className="font-semibold mb-2">Item Transaksi:</h3>
                <ul className="list-disc pl-5">
                  {selectedTransaction.items.map(item => (
                    <li key={item.productId}>{item.name} (Qty: {item.quantity}) - Rp {item.price.toLocaleString('id-ID')}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleProcessReturn} className="bg-blue-600 hover:bg-blue-700 text-white">
              Proses Retur (Batalkan Transaksi)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dashboard>
  );
};

export default SalesHistory;
