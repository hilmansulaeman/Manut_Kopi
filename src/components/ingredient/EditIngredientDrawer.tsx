import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
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
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="h-[90%] mt-0 rounded-t-[10px] flex flex-col">
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit Bahan Baku</DrawerTitle>
          <DrawerDescription>
            Perbarui detail bahan baku. Klik simpan setelah selesai.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 flex-1 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <Button type="submit" className="w-full bg-[#313131] text-white hover:bg-[#313131]/90">
                Simpan Perubahan
              </Button>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EditIngredientDrawer;
