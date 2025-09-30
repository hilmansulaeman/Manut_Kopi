import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStock, StockItem } from '@/context/StockContext';
import { useToast } from '@/components/ui/use-toast';

interface EditIngredientDrawerProps {
  open: boolean;
  onClose: () => void;
  ingredient: StockItem | null;
}

const formSchema = z.object({
  kodeBahanBaku: z.string().min(1, { message: 'Kode Bahan Baku harus diisi.' }),
  kodeBahanBaku2: z.string().min(1, { message: 'Kode Bahan Baku 2 harus diisi.' }),
  supplier: z.string().min(1, { message: 'Pemasok harus diisi.' }),
  stokMasuk: z.number().min(0, { message: 'Stok Masuk harus angka positif.' }),
  stokKeluar: z.number().min(0, { message: 'Stok Keluar harus angka positif.' }),
});

const EditIngredientDrawer: React.FC<EditIngredientDrawerProps> = ({ open, onClose, ingredient }) => {
  const { updateStockItem } = useStock();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kodeBahanBaku: '',
      kodeBahanBaku2: '',
      supplier: '',
      stokMasuk: 0,
      stokKeluar: 0,
    },
  });

  useEffect(() => {
    if (ingredient) {
      form.reset({
        kodeBahanBaku: ingredient.kodeBahanBaku,
        kodeBahanBaku2: ingredient.kodeBahanBaku2,
        supplier: ingredient.supplier,
        stokMasuk: ingredient.stokMasuk,
        stokKeluar: ingredient.stokKeluar,
      });
    }
  }, [ingredient, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!ingredient) return;

    const updatedItem: StockItem = {
      ...ingredient,
      ...values,
      status: (values.stokMasuk - values.stokKeluar) > 0 ? 'Tersedia' : 'Habis Stok',
      statusColor: (values.stokMasuk - values.stokKeluar) > 0 ? 'green' : 'orange',
    };

    updateStockItem(updatedItem);
    toast({
      title: 'Stok berhasil diedit!',
      description: `Stok untuk ${updatedItem.kodeBahanBaku} telah diperbarui.`,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Bahan Baku</DialogTitle>
          <DialogDescription>
            Perbarui detail bahan baku. Klik simpan setelah selesai.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="kodeBahanBaku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Bahan Baku</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Kopi Arabika" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kodeBahanBaku2"
              render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode Bahan Baku 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: ARB001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pemasok</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: PT Kopi Jaya" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stokMasuk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stok Masuk</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stokKeluar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stok Keluar</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </DialogContent>
       
    </Dialog>
  );
};

export default EditIngredientDrawer;
