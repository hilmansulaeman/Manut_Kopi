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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Zod schema for form validation
const formSchema = z.object({
  kodeBahanBaku: z.string().min(1, { message: 'Kode Bahan Baku wajib diisi' }),
  namaBarang: z.string().min(1, { message: 'Nama Barang wajib diisi' }),
  supplier: z.string().min(1, { message: 'Pemasok wajib diisi' }),
  stokMasuk: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: 'Stok Masuk harus angka positif.' })
  ),
  stokKeluar: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: 'Stok Keluar harus angka positif.' })
  ),
  unit: z.string().min(1, { message: 'Unit wajib diisi' }),
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
      stokMasuk: 0,
      stokKeluar: 0,
      unit: '',
    },
  });

  const onSubmit = async (values: IngredientFormValues) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newStockItem: Omit<StockItem, 'id' | 'status' | 'statusColor'> = {
        kodeBahanBaku: values.namaBarang, // Using namaBarang as the main kodeBahanBaku for display
        kodeBahanBaku2: values.kodeBahanBaku, // Assuming kodeBahanBaku is the second code
        supplier: values.supplier,
        stokMasuk: values.stokMasuk,
        stokKeluar: values.stokKeluar,
        unit: values.unit,
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
              name="stokMasuk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok Masuk</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} />
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
                    <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Kg">Kg</SelectItem>
                      <SelectItem value="Liter">Liter</SelectItem>
                      <SelectItem value="Pcs">Pcs</SelectItem>
                    </SelectContent>
                  </Select>
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
