import React, { useEffect, useMemo, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form@7.55.0';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { StockItem } from '../../context/StockContext';

type AdjustmentType = 'increase' | 'decrease';

interface StockAdjustmentItemForm {
  id: string;
  stockItemId: string;
  name: string;
  oldQty: number;
  newQty: number;
  deltaQty: number;
  unit: string;
}

interface CreateStockAdjustmentDrawerProps {
  open: boolean;
  onClose: () => void;
  onCreate: (newAdjustmentData: { reason: string; items: StockAdjustmentItemForm[] }) => void;
  stockItems: StockItem[];
}

// --------- Zod Schema ----------
const itemSchema = z.object({
  id: z.string().min(1),
  stockItemId: z.string().min(1),
  name: z.string().min(1),
  oldQty: z.number().min(0),
  newQty: z.number().min(0, { message: 'Stok baru tidak boleh < 0.' }),
  deltaQty: z.number(),
  unit: z.string().min(1),
});

const formSchema = z.object({
  reason: z.string().min(1, { message: 'Alasan wajib diisi.' }),
  items: z.array(itemSchema).min(1, { message: 'Tambahkan minimal satu item penyesuaian.' }),
});

type FormValues = z.infer<typeof formSchema>;

export const CreateStockAdjustmentDrawer: React.FC<CreateStockAdjustmentDrawerProps> = ({
  open,
  onClose,
  onCreate,
  stockItems,
}) => {
  const { toast } = useToast();

  // State input baris "Tambah Item"
  const [selectedStockItem, setSelectedStockItem] = useState<string>('');
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<number>(0);
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>('increase');

  const defaults = useMemo<FormValues>(() => ({
    reason: '',
    items: [],
  }), []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaults,
    mode: 'onSubmit',
  });

  const { control, handleSubmit, reset, formState, getValues } = form;

  const { fields, append, remove } = useFieldArray<FormValues, 'items', 'id'>({
    control,
    name: 'items',
    keyName: 'id', // Specify 'id' as the key for the items
  });

  // Reset saat dialog ditutup
  useEffect(() => {
    if (!open) {
      reset(defaults);
      setSelectedStockItem('');
      setAdjustmentQuantity(0);
      setAdjustmentType('increase');
    }
  }, [open, reset, defaults]);

  // Tambah item ke daftar penyesuaian
  const handleAddItemToAdjustment = () => {
    const item = stockItems.find((si) => si.id === selectedStockItem);
    if (!item || !adjustmentQuantity || adjustmentQuantity < 1) {
      toast({
        title: 'Gagal Menambahkan Item',
        description: 'Mohon pilih bahan baku dan jumlah penyesuaian minimal 1.',
        variant: 'destructive',
      });
      return;
    }

    const oldQty = item.currentStock;
    const deltaQty = adjustmentType === 'decrease' ? -Math.abs(adjustmentQuantity) : Math.abs(adjustmentQuantity);
    const newQty = oldQty + deltaQty;

    if (newQty < 0) {
      toast({
        title: 'Gagal Menambahkan Item',
        description: 'Stok baru tidak boleh kurang dari 0.',
        variant: 'destructive',
      });
      return;
    }

    // Jika item sudah ada di list, kita replace supaya konsisten dengan perilaku sebelumnya
    const currentItems = getValues('items');
    const existingIndex = currentItems.findIndex((it) => it.stockItemId === item.id);

    const payload: StockAdjustmentItemForm = {
      id: `${item.id}-${Date.now()}`,
      stockItemId: item.id,
      name: item.kodeBahanBaku,
      oldQty,
      newQty,
      deltaQty,
      unit: item.unit,
    };

    if (existingIndex > -1) {
      // Replace baris lama
      remove(existingIndex);
      append(payload);
    } else {
      append(payload);
    }

    // Reset input baris
    setSelectedStockItem('');
    setAdjustmentQuantity(0);
  };

  const onSubmit = (values: FormValues) => {
    onCreate({
      reason: values.reason.trim(),
      items: values.items,
    });

    toast({
      title: 'Pengajuan Terkirim',
      description: 'Penyesuaian stok berhasil diajukan.',
    });

    reset(defaults);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Buat Penyesuaian Stok Baru</DialogTitle>
          <DialogDescription>Ajukan penyesuaian stok untuk bahan baku.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
            {/* Alasan */}
            <FormField
              control={control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alasan</FormLabel>
                  <FormControl>
                    <Textarea
                      id="reason"
                      placeholder="Contoh: Penyesuaian karena stock opname"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Baris Tambah Item */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div className="sm:col-span-2">
                <FormLabel>Bahan Baku</FormLabel>
                <Select value={selectedStockItem} onValueChange={setSelectedStockItem}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Bahan Baku" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Bahan Baku</SelectLabel>
                      {stockItems.map((si) => (
                        <SelectItem key={si.id} value={si.id}>
                          {si.kodeBahanBaku} (Stok: {si.currentStock} {si.unit})
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <FormLabel>Tipe</FormLabel>
                <Select value={adjustmentType} onValueChange={(v) => setAdjustmentType(v as AdjustmentType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="increase">Tambah Stok</SelectItem>
                    <SelectItem value="decrease">Kurangi Stok</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <FormLabel>Jumlah</FormLabel>
                  <Input
                    id="quantity"
                    type="number"
                    value={Number.isNaN(adjustmentQuantity) ? 0 : adjustmentQuantity}
                    onChange={(e) => setAdjustmentQuantity(e.target.valueAsNumber)}
                    min={1}
                    placeholder="0"
                  />
                </div>
                <Button type="button" onClick={handleAddItemToAdjustment} className="self-end">
                  Tambah Item
                </Button>
              </div>
            </div>

            {/* Tabel Item */}
            <div>
              <h3 className="font-semibold mt-2 mb-2">Item Penyesuaian:</h3>

              {fields.length === 0 ? (
                <p className="text-muted-foreground">Tidak ada item yang ditambahkan.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Bahan Baku</TableHead>
                      <TableHead>Stok Lama</TableHead>
                      <TableHead>Stok Baru</TableHead>
                      <TableHead>Perubahan</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(fields as StockAdjustmentItemForm[]).map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>{field.name}</TableCell>
                        <TableCell>
                          {field.oldQty} {field.unit}
                        </TableCell>
                        <TableCell>
                          {field.newQty} {field.unit}
                        </TableCell>
                        <TableCell>
                          {field.deltaQty > 0 ? `+${field.deltaQty}` : field.deltaQty} {field.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            aria-label="Hapus item"
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {/* Error level array (min 1 item) */}
              {formState.errors.items?.message && (
                <p className="text-sm text-destructive mt-2">
                  {formState.errors.items.message as string}
                </p>
              )}
            </div>
          </form>
        </Form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button type="submit" onClick={handleSubmit(onSubmit)}>
            Ajukan Penyesuaian
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
