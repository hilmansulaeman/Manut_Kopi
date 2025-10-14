import React, { useEffect, useMemo, useState } from 'react';
import { useForm, useFieldArray, FieldValues } from 'react-hook-form@7.55.0';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '../ui/form';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../ui/select';
import { useToast } from '../ui/use-toast';

import { StockItem } from '../../context/StockContext';
import { Plus, Trash2 } from 'lucide-react';

// ---------- Schema ----------
const itemSchema = z.object({
  stockItemId: z.string().min(1, { message: 'Pilih bahan baku.' }),
  name: z.string().min(1),
  qty: z.preprocess(
    (v) => Number(v),
    z.number().min(1, { message: 'Kuantitas minimal 1.' }),
  ),
  cost: z.preprocess(
    (v) => Number(v),
    z.number().positive({ message: 'Biaya harus > 0.' }),
  ),
});

const formSchema = z.object({
  supplier: z.string().min(1, { message: 'Pemasok wajib diisi.' }),
  invoiceNo: z.string().min(1, { message: 'Nomor invoice wajib diisi.' }),
  date: z.string().min(1, { message: 'Tanggal wajib diisi.' }),
  items: z.array(itemSchema).min(1, { message: 'Tambahkan minimal satu item.' }),
});

type PurchaseFormValues = z.infer<typeof formSchema>;

interface CreatePurchaseReceiptDrawerProps {
  open: boolean;
  onClose: () => void;
  onCreate: (newReceiptData: {
    supplier: string;
    invoiceNo: string;
    date: string;
    items: { stockItemId: string; name: string; qty: number; cost: number }[];
    status: 'draft' | 'received';
  }) => void;
  stockItems: StockItem[];
}

export const CreatePurchaseReceiptDrawer: React.FC<CreatePurchaseReceiptDrawerProps> = ({
  open,
  onClose,
  onCreate,
  stockItems,
}) => {
  const { toast } = useToast();

  // state sementara untuk baris input "add item"
  const [selectedStockItem, setSelectedStockItem] = useState<string>('');
  const [itemQty, setItemQty] = useState<number>(0);
  const [itemCost, setItemCost] = useState<number>(0);

  const defaults = useMemo<PurchaseFormValues>(() => ({
    supplier: '',
    invoiceNo: '',
    date: new Date().toISOString().split('T')[0],
    items: [],
  }), []);

  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaults,
    mode: 'onSubmit',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  // reset saat dialog ditutup
  useEffect(() => {
    if (!open) {
      form.reset(defaults);
      setSelectedStockItem('');
      setItemQty(0);
      setItemCost(0);
    }
  }, [open, form, defaults]);

  // tambah item ke fieldArray
  const handleAddItem = () => {
    const stockItem = stockItems.find((s) => s.id === selectedStockItem);
    if (!stockItem || itemQty < 1 || itemCost <= 0) {
      toast({
        title: 'Gagal Menambahkan Item',
        description: 'Pilih bahan baku, isi kuantitas minimal 1, dan biaya > 0.',
        variant: 'destructive',
      });
      return;
    }

    append({
      stockItemId: stockItem.id,
      name: stockItem.kodeBahanBaku,
      qty: itemQty,
      cost: itemCost,
    });

    setSelectedStockItem('');
    setItemQty(0);
    setItemCost(0);
  };

  const onSubmit = (values: PurchaseFormValues) => {
    onCreate({
      supplier: values.supplier.trim(),
      invoiceNo: values.invoiceNo.trim(),
      date: values.date,
      items: values.items.map((it) => ({
        stockItemId: it.stockItemId,
        name: it.name,
        qty: it.qty,
        cost: it.cost,
      })),
      status: 'draft',
    });

    toast({
      title: 'Berhasil',
      description: 'Penerimaan pembelian berhasil dibuat.',
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] w-full">
        <DialogHeader>
          <DialogTitle>Buat Penerimaan Pembelian Baru</DialogTitle>
          <DialogDescription>
            Tambahkan detail penerimaan pembelian baru di sini.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-2">
            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pemasok</FormLabel>
                  <FormControl>
                    <Input id="supplier" placeholder="Nama pemasok" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="invoiceNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Invoice</FormLabel>
                  <FormControl>
                    <Input id="invoiceNo" placeholder="INV-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal</FormLabel>
                  <FormControl>
                    <Input id="date" type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Section Tambah Item */}
            <div className="space-y-2">
              <h3 className="font-semibold mt-2">Item Pembelian:</h3>

              <div className="grid grid-cols-1 gap-2">
                <div className="grid grid-cols-1 gap-2">
                  <FormLabel>Bahan Baku</FormLabel>
                  <Select value={selectedStockItem} onValueChange={setSelectedStockItem}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Bahan Baku" />
                    </SelectTrigger>
                    <SelectContent>
                      {stockItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.kodeBahanBaku} ({item.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <FormLabel>Kuantitas</FormLabel>
                    <Input
                      id="itemQty"
                      type="number"
                      value={Number.isNaN(itemQty) ? 0 : itemQty}
                      onChange={(e) => setItemQty(e.target.valueAsNumber)}
                      min={1}
                    />
                  </div>
                  <div>
                    <FormLabel>Biaya per Unit</FormLabel>
                    <Input
                      id="itemCost"
                      type="number"
                      value={Number.isNaN(itemCost) ? 0 : itemCost}
                      onChange={(e) => setItemCost(e.target.valueAsNumber)}
                      min={0}
                      step="0.01"
                    />
                  </div>
                </div>

                <Button type="button" onClick={handleAddItem} className="w-full mt-1">
                  <Plus className="w-4 h-4 mr-2" /> Tambah Item
                </Button>
              </div>

              {/* Daftar item yang sudah ditambahkan */}
              {fields.length > 0 && (
                <div className="mt-3 border rounded-md divide-y">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center justify-between p-2">
                      <div>
                        <p className="font-medium">{form.getValues(`items.${index}.name`)}</p>
                        <p className="text-sm text-muted-foreground">
                          {form.getValues(`items.${index}.qty`)} x Rp{' '}
                          {Number(form.getValues(`items.${index}.cost`) || 0).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        aria-label="Hapus item"
                        title="Hapus item"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Tampilkan pesan error items (min 1) */}
              <FormMessage>
                {form.formState.errors.items?.root?.message ||
                  (Array.isArray(form.formState.errors.items) &&
                    form.formState.errors.items.length === 0 &&
                    (form.formState.errors as any).items?.message)}
              </FormMessage>
            </div>

            <div className="h-2" />
          </form>
        </Form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            Simpan Penerimaan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
