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
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface StockAdjustmentItem {
  id: string;
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

interface StockAdjustmentDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAdjustment: StockAdjustment | null;
  onApproveAdjustment: (id: string) => void;
  onRejectAdjustment: (id: string) => void;
}

export const StockAdjustmentDetailDrawer: React.FC<StockAdjustmentDetailDrawerProps> = ({
  open,
  onOpenChange,
  selectedAdjustment,
  onApproveAdjustment,
  onRejectAdjustment,
}) => {
  const getStatusBadgeColor = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'approved':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Detail Penyesuaian Stok</DialogTitle>
          <DialogDescription>
            Informasi lengkap mengenai penyesuaian stok.
          </DialogDescription>
        </DialogHeader>

        {!selectedAdjustment ? (
          <div className="py-8 text-center text-muted-foreground">
            Tidak ada data penyesuaian stok yang dipilih.
          </div>
        ) : (
          <>
            {/* Konten scrollable */}
            <div className="max-h-[60vh] overflow-auto px-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID Penyesuaian</p>
                  <p className="text-lg font-semibold">{selectedAdjustment.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tanggal</p>
                  <p className="text-lg font-semibold">{selectedAdjustment.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Diajukan Oleh</p>
                  <p className="text-lg font-semibold">{selectedAdjustment.requestedBy}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Disetujui Oleh</p>
                  <p className="text-lg font-semibold">{selectedAdjustment.approvedBy || '-'}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Alasan</p>
                  <p className="text-base">{selectedAdjustment.reason}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge className={`text-white ${getStatusBadgeColor(selectedAdjustment.status)}`}>
                    {selectedAdjustment.status.charAt(0).toUpperCase() + selectedAdjustment.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3">Item yang Disesuaikan</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Bahan Baku</TableHead>
                    <TableHead>Stok Lama</TableHead>
                    <TableHead>Stok Baru</TableHead>
                    <TableHead>Perubahan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedAdjustment.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        {item.oldQty} {item.unit}
                      </TableCell>
                      <TableCell>
                        {item.newQty} {item.unit}
                      </TableCell>
                      <TableCell>
                        {item.deltaQty > 0 ? `+${item.deltaQty}` : item.deltaQty} {item.unit}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <DialogFooter>
              {selectedAdjustment.status === 'pending' ? (
                <div className="flex w-full justify-end gap-2">
                  <Button
                    onClick={() => onApproveAdjustment(selectedAdjustment.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Setujui
                  </Button>
                  <Button
                    onClick={() => onRejectAdjustment(selectedAdjustment.id)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Tolak
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Tutup
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
