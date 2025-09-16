import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useStock, StockItem } from '../../context/StockContext'; // Import useStock and StockItem

// Zod schema for form validation
const formSchema = z.object({
  kodeBahanBaku: z.string().min(1, { message: 'Kode Bahan Baku wajib diisi' }),
  namaBarang: z.string().min(1, { message: 'Nama Barang wajib diisi' }),
  supplier: z.string().min(1, { message: 'Pemasok wajib diisi' }),
  tanggal: z.string().min(1, { message: 'Tanggal wajib diisi' }),
  kodeBahanBakuKedua: z.string().min(1, { message: 'Kode Bahan Baku wajib diisi' }),
});

type IngredientFormValues = z.infer<typeof formSchema>;

interface CreateIngredientDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const CreateIngredientDrawer: React.FC<CreateIngredientDrawerProps> = ({ open, onClose }) => {
  const { toast } = useToast();
  const { addStockItem } = useStock(); // Use addStockItem from context
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kodeBahanBaku: '',
      namaBarang: '',
      supplier: '',
      tanggal: '',
      kodeBahanBakuKedua: '',
    },
  });

  const onSubmit = async (values: IngredientFormValues) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newStockItem: Omit<StockItem, 'id'> = {
        kodeBahanBaku: values.namaBarang, // Using namaBarang as the main kodeBahanBaku for display
        kodeBahanBaku2: values.kodeBahanBakuKedua,
        supplier: values.supplier,
        stokMasuk: '0 Unit', // Default value, can be expanded later
        stokKeluar: '0 Unit', // Default value, can be expanded later
        status: 'Baru', // Default status
        statusColor: 'green', // Default color
      };

      addStockItem(newStockItem); // Add to global stock state
      toast({
        title: 'Berhasil!',
        description: 'Bahan baku berhasil ditambahkan ke stok.',
      });
      form.reset();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menambahkan bahan baku ke stok.',
        variant: 'destructive',
      });
      console.error('Failed to add ingredient to stock:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Bahan Baku</DialogTitle>
          <DialogDescription>
            Isi detail bahan baku baru di sini. Klik simpan saat Anda selesai.
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
                    <Input
                      placeholder="Masukkan kode bahan baku"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="namaBarang"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Barang</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama barang"
                      {...field}
                    />
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
                    <Input
                      placeholder="Masukkan pemasok"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tanggal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder="Masukkan tanggal"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kodeBahanBakuKedua"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Bahan Baku</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan kode bahan baku"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : 'Simpan perubahan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
