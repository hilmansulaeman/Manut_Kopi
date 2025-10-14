import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

interface PurchaseReceiptDetailProps {
  receipt: {
    id: string;
    date: string;
    supplier: string;
    totalAmount: number;
    items: {
      ingredientName: string;
      quantity: number;
      unit: string;
      pricePerUnit: number;
      subtotal: number;
    }[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const PurchaseReceiptDetail: React.FC<PurchaseReceiptDetailProps> = ({ receipt, isOpen, onClose }) => {
  // Fallback bila receipt null
  if (!receipt) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Purchase Receipt Details</DialogTitle>
            <DialogDescription>Tidak ada data penerimaan pembelian yang tersedia.</DialogDescription>
          </DialogHeader>
          <div className="py-6 text-center text-muted-foreground">
            No purchase receipt data available.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Purchase Receipt Details</DialogTitle>
          <DialogDescription>
            View the detailed information for purchase receipt #{receipt.id}
          </DialogDescription>
        </DialogHeader>

        {/* Konten scrollable agar nyaman di layar kecil */}
        <div className="max-h-[60vh] overflow-auto px-1">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Receipt ID</p>
              <p className="text-lg font-semibold">{receipt.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="text-lg font-semibold">{receipt.date}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Supplier</p>
              <p className="text-lg font-semibold">{receipt.supplier}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
              <p className="text-lg font-semibold">
                Rp {Number(receipt.totalAmount || 0).toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          <h3 className="text-xl font-semibold mb-3">Purchased Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ingredient</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Price/Unit</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipt.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.ingredientName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>Rp {Number(item.pricePerUnit).toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-right">
                    Rp {Number(item.subtotal).toLocaleString('id-ID')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseReceiptDetail;
